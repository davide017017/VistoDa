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
