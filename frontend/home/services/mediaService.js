import { getToken } from "../../shared/auth.js";
import { API_BASE_URL } from "../../shared/config.js";

export async function fetchMedia() {
  const res = await fetch(`${API_BASE_URL}/media/`, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
    return [];
  }

  return await res.json();
}

export async function createMedia(data) {
  const res = await fetch(`${API_BASE_URL}/media/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Errore ${res.status}`);
  }

  return await res.json();
}

export async function updateMedia(id, data) {
  const res = await fetch(`${API_BASE_URL}/media/${id}`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
    return null;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Errore ${res.status}`);
  }

  return await res.json();
}

export async function deleteMedia(id) {
  const res = await fetch(`${API_BASE_URL}/media/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
    return;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Errore ${res.status}`);
  }
}
