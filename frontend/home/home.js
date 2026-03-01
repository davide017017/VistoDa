import { requireAuth } from "../shared/auth.js";
import { fetchMedia } from "./services/mediaService.js";
import { fetchCurrentUser } from "./services/userService.js";

requireAuth();

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
    const { type, status } = e.detail;

    const filtered = allMedia.filter((item) => {
      const matchType = type === "all" || item.type === type;
      const matchStatus = status === "all" || item.status === status;
      return matchType && matchStatus;
    });

    mediaList.render(filtered, currentUser);
  });

  // ➕ Create placeholder
  document.addEventListener("create-media", async (e) => {
    console.log("CREATE:", e.detail);

    // TODO: qui poi chiameremo la vera API POST /media
    allMedia = await fetchMedia();
    mediaList.render(allMedia, currentUser);
  });

  // 🗑 Delete placeholder
  document.addEventListener("delete-media", (e) => {
    console.log("Delete ID:", e.detail);
    // qui poi metteremo vera API delete
  });
}

init();
