import { saveToken } from "../shared/auth.js";
import { API_BASE_URL } from "../shared/config.js";

// Gestione login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    alert("Login fallito");
    return;
  }

  const data = await res.json();

  saveToken(data.access_token);

  window.location.href = "../home/home.html";
});

// Demo login
document.getElementById("demoBtn").addEventListener("click", async () => {
  const res = await fetch(`${API_BASE_URL}/auth/demo`, {
    method: "POST",
  });

  if (!res.ok) {
    alert("Demo non disponibile");
    return;
  }

  const data = await res.json();
  saveToken(data.access_token);
  window.location.href = "../home/home.html";
});
