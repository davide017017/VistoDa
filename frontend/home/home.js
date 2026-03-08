import { requireAuth } from "../shared/auth.js";
import {
  fetchMedia,
  createMedia,
  updateMedia,
  deleteMedia,
} from "./services/mediaService.js";
import { fetchCurrentUser, updateNickname } from "./services/userService.js";

requireAuth();

function showToast(msg) {
  document.getElementById("appToastMsg").textContent = msg;
  const toastEl = document.getElementById("appToast");
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

let allMedia = [];
let currentUser = null;

let currentFilters = {
  type: "all",
  status: "all",
  search: "",
  sort: "default",
};

// IDs con discrepanza anno DB vs TMDB
let mismatchIds = new Set();

// Map id → tmdbRating (popolata lazy o via batch fetch)
let tmdbRatings = new Map();

function refreshStats() {
  document.querySelector("#vnm-stats")?.computeFromMedia(allMedia);
}

function applyFilters() {
  const { type, status, search, sort } = currentFilters;

  let filtered = allMedia.filter((item) => {
    const matchType = type === "all" || item.type === type;
    const matchStatus = status === "all" || item.status === status;
    const matchSearch = !search || item.title.toLowerCase().includes(search);
    return matchType && matchStatus && matchSearch;
  });

  if (sort === "year_mismatch") {
    filtered = filtered.filter((item) => mismatchIds.has(String(item.id)));
  }

  const mediaList = document.querySelector("vd-media-list");
  mediaList.render(filtered, currentUser, sort, tmdbRatings);
}

// ── PWA: prevent back-button returning to splash ──────────
history.pushState(null, "", window.location.href);
let _backGuard = false;
window.addEventListener("popstate", () => {
  if (_backGuard) return;
  _backGuard = true;
  history.pushState(null, "", location.href);
  setTimeout(() => (_backGuard = false), 100);
});

// ── Loading overlay helpers ────────────────────────────────
const _overlay = document.getElementById("vd-loading-overlay");
function hideOverlay() {
  if (!_overlay) return;
  _overlay.classList.add("hidden");
  setTimeout(() => {
    _overlay.style.display = "none";
  }, 500);
}

async function init() {
  const header = document.querySelector("vd-header");
  const mediaList = document.querySelector("vd-media-list");
  const filters = document.querySelector("vd-filters");

  try {
    // 👤 Carica utente
    currentUser = await fetchCurrentUser();
    header.setUser(currentUser);

    // 🎬 Carica media
    allMedia = await fetchMedia();
    applyFilters();
    refreshStats();
  } finally {
    hideOverlay();
  }

  // 🎛 Filtri
  document.addEventListener("filters-change", async (e) => {
    const newSort = e.detail.sort;
    currentFilters = { ...currentFilters, ...e.detail };

    // Sort TMDB: batch fetch tutti i rating non in cache
    if (newSort === "tmdb_rating_desc" || newSort === "tmdb_rating_asc") {
      filters?.setTmdbSortLoading(true);
      await mediaList.fetchAllTmdbInfo(allMedia);
      filters?.setTmdbSortLoading(false);
    }

    applyFilters();
  });

  // 🔴 Rating TMDB caricato lazy (scroll normale)
  document.addEventListener("tmdb-rating-loaded", (e) => {
    tmdbRatings.set(String(e.detail.id), e.detail.tmdbRating);
  });

  // 🔴 Discrepanze anno
  document.addEventListener("year-mismatch-found", (e) => {
    mismatchIds.add(String(e.detail.id));
  });

  document.addEventListener("year-mismatch-resolved", (e) => {
    mismatchIds.delete(String(e.detail.id));
    if (currentFilters.sort === "year_mismatch") applyFilters();
  });

  // ➕ Create media
  document.addEventListener("create-media", async (e) => {
    try {
      await createMedia(e.detail);
      allMedia = await fetchMedia();
      mismatchIds = new Set();
      tmdbRatings = new Map();
      applyFilters();
      refreshStats();
    } catch (err) {
      showToast(err.message);
    }
  });

  // ✏️ Edit
  const mediaModal = document.querySelector("vd-media-modal");

  document.addEventListener("open-create-modal", () => {
    mediaModal.openCreate();
  });

  document.addEventListener("open-edit-modal", (e) => {
    mediaModal.openEdit(e.detail);
  });

  document.addEventListener("edit-media", async (e) => {
    try {
      await updateMedia(e.detail.id, e.detail);
      allMedia = await fetchMedia();
      mismatchIds = new Set();
      tmdbRatings = new Map();
      applyFilters();
      refreshStats();
      showToast("Modificato con successo");
    } catch (err) {
      showToast(err.message);
    }
  });

  // ✏️ Nickname
  const nickModal = document.querySelector("vd-nick-name-modal");

  document.addEventListener("update-nickname", async (e) => {
    try {
      const updated = await updateNickname(e.detail.nickname);
      currentUser = { ...currentUser, nickname: updated.nickname };
      header.setUser(currentUser);
      nickModal.confirmSuccess(updated.nickname);
      showToast("Nickname aggiornato");
    } catch (err) {
      nickModal.confirmError();
      showToast(err.message);
    }
  });

  // 🗑 Delete
  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteModal"),
  );
  let pendingDeleteId = null;

  document.addEventListener("delete-media-request", (e) => {
    pendingDeleteId = e.detail.id;
    const { title, type, year, status } = e.detail;
    const parts = [title, type, year, status].filter(Boolean);
    document.getElementById("deleteModalTitle").textContent = parts.join(" · ");
    deleteModal.show();
  });

  document
    .getElementById("deleteConfirmBtn")
    .addEventListener("click", async () => {
      deleteModal.hide();
      try {
        await deleteMedia(pendingDeleteId);
        allMedia = await fetchMedia();
        mismatchIds = new Set();
        tmdbRatings = new Map();
        applyFilters();
        refreshStats();
        showToast("Eliminato con successo");
      } catch (err) {
        showToast(err.message);
      }
    });
}

init();
