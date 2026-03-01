export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function requireAuth() {
  if (!getToken()) {
    window.location.href = "/frontend/login/login.html";
  }
}
