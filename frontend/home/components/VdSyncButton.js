class VdSyncButton extends HTMLElement {
  connectedCallback() {
    if (
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1")
    ) {
      this.style.display = "none";
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      .vd-sync-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        margin-bottom: 0.75rem;
        padding: 0.45rem 1rem;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 0.75rem;
        font-family: 'JetBrains Mono', 'Fira Mono', 'Courier New', monospace;
        letter-spacing: 0.04em;
        color: #4a4a4a;
        transition: color 0.3s ease;
        outline: none;
      }

      /* Bordo animato a 4 lati */
      .vd-sync-btn::before,
      .vd-sync-btn::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 3px;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      /* Bordo base tratteggiato */
      .vd-sync-btn::before {
        border: 1px dashed #2e2e2e;
        opacity: 1;
      }

      /* Bordo glow hover */
      .vd-sync-btn::after {
        border: 1px solid #8c7a5b;
        box-shadow: 0 0 8px rgba(140, 122, 91, 0.2), inset 0 0 8px rgba(140, 122, 91, 0.05);
        opacity: 0;
      }

      .vd-sync-btn:hover {
        color: #a89060;
      }

      .vd-sync-btn:hover::before { opacity: 0; }
      .vd-sync-btn:hover::after  { opacity: 1; }

      /* Icona */
      .vd-sync-btn .vd-icon {
        font-size: 0.8rem;
        transition: transform 0.4s ease;
        flex-shrink: 0;
      }

      .vd-sync-btn:hover .vd-icon {
        transform: rotate(180deg);
      }

      /* Stato loading */
      .vd-sync-btn.loading .vd-icon {
        animation: vd-spin 1s linear infinite;
      }

      @keyframes vd-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      /* Stato success */
      .vd-sync-btn.success {
        color: #8c7a5b;
      }
      .vd-sync-btn.success::before { opacity: 0; }
      .vd-sync-btn.success::after  {
        opacity: 1;
        border-style: solid;
      }

      /* Stato error */
      .vd-sync-btn.error {
        color: #c0392b;
      }
      .vd-sync-btn.error::after {
        opacity: 1;
        border-color: #c0392b;
        box-shadow: 0 0 8px rgba(192, 57, 43, 0.2);
      }
      .vd-sync-btn.error::before { opacity: 0; }

      /* Disabled */
      .vd-sync-btn:disabled {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.7;
      }

      /* Label badge DEV */
      .vd-dev-badge {
        position: absolute;
        top: -7px;
        left: 10px;
        font-size: 0.58rem;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: 0.08em;
        color: #3a3a3a;
        background: #111;
        padding: 0 5px;
        pointer-events: none;
        text-transform: uppercase;
      }
    `;
    this.appendChild(style);

    this.innerHTML += `
      <button id="syncBtn" class="vd-sync-btn">
        <span class="vd-dev-badge">dev</span>
        <i class="bi bi-arrow-down-up vd-icon"></i>
        <span class="vd-label">Sincronizza DB → Locale</span>
      </button>
    `;

    this.querySelector("#syncBtn").addEventListener("click", async () => {
      const btn = this.querySelector("#syncBtn");
      const span = btn.querySelector(".vd-label");
      const icon = btn.querySelector(".vd-icon");

      btn.disabled = true;
      btn.className = "vd-sync-btn loading";
      icon.className = "bi bi-arrow-repeat vd-icon";
      span.textContent = "Sincronizzazione...";

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

        btn.className = "vd-sync-btn success";
        icon.className = "bi bi-check2 vd-icon";
        span.textContent = "Sincronizzato!";

        setTimeout(() => reset(), 2000);
      } catch (err) {
        btn.className = "vd-sync-btn error";
        icon.className = "bi bi-x vd-icon";
        span.textContent = "Errore: " + err.message;

        setTimeout(() => reset(), 3000);
      }

      function reset() {
        btn.className = "vd-sync-btn";
        icon.className = "bi bi-arrow-down-up vd-icon";
        span.textContent = "Sincronizza DB → Locale";
        btn.disabled = false;
      }
    });
  }
}

customElements.define("vd-sync-button", VdSyncButton);
