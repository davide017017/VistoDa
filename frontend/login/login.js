import { saveToken } from "../shared/auth.js";
import { API_BASE_URL } from "../shared/config.js";

function showToast(msg) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    pointer-events: none;
    left: 50%;
    background: #1a1a1a;
    color: #fff;
    border: 1px solid #dc3545;
    border-radius: 0.75rem;
    padding: 0.75rem 1.5rem;
    box-shadow: 0 0 12px rgba(184,145,68,0.3);
    opacity: 0;
    transition: opacity 0.25s ease;
    z-index: 9999;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => (toast.style.opacity = "1"));
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3000);
}

// Gestione login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      showToast("Email o password errati");
      return;
    }

    const data = await res.json();
    saveToken(data.access_token);
    window.location.href = "../home/home.html";
  } catch {
    showToast("Errore di connessione");
  }
});

// Demo login
document.getElementById("demoBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/demo`, {
      method: "POST",
    });

    if (!res.ok) {
      showToast("Demo momentaneamente non disponibile");
      return;
    }

    const data = await res.json();
    saveToken(data.access_token);
    window.location.href = "../home/home.html";
  } catch {
    showToast("Errore di connessione");
  }
});
