import { getToken } from "../../shared/auth.js";
import { API_BASE_URL } from "../../shared/config.js";

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
    return null;
  }

  return await res.json();
}
