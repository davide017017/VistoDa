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

// Stato filtri corrente
let currentFilters = {
  type: "all",
  status: "all",
  search: "",
  sort: "default",
};

function refreshStats() {
  document.querySelector("#vnm-stats")?.computeFromMedia(allMedia);
}

function applyFilters() {
  const { type, status, search, sort } = currentFilters;

  const filtered = allMedia.filter((item) => {
    const matchType = type === "all" || item.type === type;
    const matchStatus = status === "all" || item.status === status;
    const matchSearch = !search || item.title.toLowerCase().includes(search);
    return matchType && matchStatus && matchSearch;
  });

  const mediaList = document.querySelector("vd-media-list");
  mediaList.render(filtered, currentUser, sort);
}

async function init() {
  const header = document.querySelector("vd-header");

  // 👤 Carica utente
  currentUser = await fetchCurrentUser();
  header.setUser(currentUser);

  // 🎬 Carica media
  allMedia = await fetchMedia();
  applyFilters();
  refreshStats();

  // 🎛 Filtri
  document.addEventListener("filters-change", (e) => {
    currentFilters = { ...currentFilters, ...e.detail };
    applyFilters();
  });

  // ➕ Create media
  document.addEventListener("create-media", async (e) => {
    try {
      await createMedia(e.detail);
      allMedia = await fetchMedia();
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
        applyFilters();
        refreshStats();
        showToast("Eliminato con successo");
      } catch (err) {
        showToast(err.message);
      }
    });
}

init();
