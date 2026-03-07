import { requireAuth } from "../shared/auth.js";
import {
  fetchMedia,
  createMedia,
  updateMedia,
  deleteMedia,
} from "./services/mediaService.js";
import { fetchCurrentUser } from "./services/userService.js";

requireAuth();

function showToast(msg) {
  document.getElementById("appToastMsg").textContent = msg;
  const toastEl = document.getElementById("appToast");
  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

let allMedia = [];
let currentUser = null;

async function init() {
  const header = document.querySelector("vd-header");
  const mediaList = document.querySelector("vd-media-list");

  // 👤 Carica utente
  currentUser = await fetchCurrentUser();
  header.setUser(currentUser);

  // 🎬 Carica media
  allMedia = await fetchMedia();
  mediaList.render(allMedia, currentUser);

  // 🎛 Filtri
  document.addEventListener("filters-change", (e) => {
    const { type, status, search } = e.detail;

    const filtered = allMedia.filter((item) => {
      const matchType = type === "all" || item.type === type;
      const matchStatus = status === "all" || item.status === status;
      const matchSearch = !search || item.title.toLowerCase().includes(search);
      return matchType && matchStatus && matchSearch;
    });

    mediaList.render(filtered, currentUser);
  });

  // ➕ Create media
  document.addEventListener("create-media", async (e) => {
    try {
      await createMedia(e.detail);
      allMedia = await fetchMedia();
      mediaList.render(allMedia, currentUser);
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
      mediaList.render(allMedia, currentUser);
      showToast("Modificato con successo");
    } catch (err) {
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
        mediaList.render(allMedia, currentUser);
        showToast("Eliminato con successo");
      } catch (err) {
        showToast(err.message);
      }
    });
}

init();
