import { requireAuth } from "../shared/auth.js";
import { fetchMedia } from "./services/mediaService.js";
import { fetchCurrentUser } from "./services/userService.js";
import { renderMedia } from "./components/mediaList.js";
import { initHeader, setWelcomeUser } from "./components/header.js";
import { initFilters } from "./components/filters.js";

requireAuth();

const mediaList = document.getElementById("mediaList");

let allMedia = [];

async function init() {
  initHeader();

  // 👤 Carica utente
  const user = await fetchCurrentUser();
  setWelcomeUser(user);

  // 🎬 Carica media
  allMedia = await fetchMedia();
  renderMedia(mediaList, allMedia);

  initFilters(handleFilter);
}

function handleFilter(filter) {
  if (filter === "all") {
    renderMedia(mediaList, allMedia);
    return;
  }

  const filtered = allMedia.filter((item) => item.type === filter);
  renderMedia(mediaList, filtered);
}

init();
