import { getToken } from "./auth.js";
import { API_BASE_URL } from "./config.js";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w342";

const TYPE_TO_ENDPOINT = {
  film: "movie",
  serie: "tv",
  anime: "tv",
  standup: "multi",
};

let _tmdbToken = null;

async function getTmdbToken() {
  if (_tmdbToken) return _tmdbToken;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/config`, {
      headers: { Authorization: "Bearer " + getToken() },
    });
    if (!res.ok) return null;
    const data = await res.json();
    _tmdbToken = data.tmdb_token || null;
    return _tmdbToken;
  } catch {
    return null;
  }
}

function cleanTitle(title) {
  return title
    .replace(/\s*[-–—:]\s*stagion[ei]\s*\d+/i, "")
    .replace(/\s*[-–—:]\s*season\s*\d+/i, "")
    .replace(/\s*[-–—:]\s*s\d{1,2}\b/i, "")
    .replace(/\s*[-–—:]\s*part[e]?\s*\d+/i, "")
    .replace(/\s*[-–—:]\s*ch(?:apter|ap\.?)\s*\d+/i, "")
    .replace(/\s*[-–—:]\s*capitolo\s*\d+/i, "")
    .replace(/\s*\(\s*\d{4}\s*\)$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function fetchTmdbInfo({ title, type }) {
  try {
    const token = await getTmdbToken();
    if (!token) return null;

    const endpoint = TYPE_TO_ENDPOINT[type] ?? "multi";
    const query = cleanTitle(title);
    const url = `${TMDB_BASE}/search/${endpoint}?query=${encodeURIComponent(query)}&language=it-IT`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;

    const titleField = result.title ?? result.name ?? title;
    const dateField = result.release_date ?? result.first_air_date ?? "";
    const year = dateField ? parseInt(dateField.split("-")[0], 10) : null;
    const posterUrl = result.poster_path
      ? `${TMDB_IMG}${result.poster_path}`
      : null;
    const rating =
      result.vote_average != null && result.vote_average > 0
        ? Math.round(result.vote_average * 10) / 10
        : null;

    return {
      title: titleField,
      overview: result.overview || null,
      year,
      rating,
      posterUrl,
      tmdbId: result.id,
    };
  } catch {
    return null;
  }
}
