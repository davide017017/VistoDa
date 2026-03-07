class VdSyncButton extends HTMLElement {
  connectedCallback() {
    // Mostra solo in locale
    if (
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1")
    ) {
      this.style.display = "none";
      return;
    }

    this.innerHTML = `
      <button id="syncBtn"
        class="btn w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
        style="
          background:#1a1a1a;
          border:1px dashed #2a2a2a;
          color:#555;
          font-size:0.8rem;
          padding:0.35rem;
          transition: all 0.25s ease;
        "
        onmouseover="this.style.borderColor='#8c7a5b'; this.style.color='#8c7a5b';"
        onmouseout="this.style.borderColor='#2a2a2a'; this.style.color='#555';"
      >
        <i class="bi bi-arrow-down-up"></i>
        <span>Sincronizza DB → Locale</span>
      </button>
    `;

    this.querySelector("#syncBtn").addEventListener("click", async () => {
      const btn = this.querySelector("#syncBtn");
      const span = btn.querySelector("span");
      const icon = btn.querySelector("i");

      btn.disabled = true;
      icon.className = "bi bi-hourglass-split";
      span.textContent = "Sincronizzazione in corso...";

      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/admin/sync", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Errore sync");
        }

        icon.className = "bi bi-check-circle";
        span.textContent = "Sincronizzato!";
        btn.style.borderColor = "#8c7a5b";
        btn.style.color = "#8c7a5b";

        setTimeout(() => {
          icon.className = "bi bi-arrow-down-up";
          span.textContent = "Sincronizza DB → Locale";
          btn.style.borderColor = "#2a2a2a";
          btn.style.color = "#555";
          btn.disabled = false;
        }, 2000);
      } catch (err) {
        icon.className = "bi bi-x-circle";
        span.textContent = "Errore: " + err.message;
        btn.style.borderColor = "#dc3545";
        btn.style.color = "#dc3545";

        setTimeout(() => {
          icon.className = "bi bi-arrow-down-up";
          span.textContent = "Sincronizza DB → Locale";
          btn.style.borderColor = "#2a2a2a";
          btn.style.color = "#555";
          btn.disabled = false;
        }, 3000);
      }
    });
  }
}

customElements.define("vd-sync-button", VdSyncButton);
