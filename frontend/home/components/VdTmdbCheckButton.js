import { fetchMedia } from "../services/mediaService.js";
import { fetchTmdbInfo } from "../../shared/infoService.js";

class VdTmdbCheckButton extends HTMLElement {
  connectedCallback() {
    const style = document.createElement("style");
    style.textContent = `
      .vd-tmdb-btn {
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
        color: #5c5c5c;
        transition: color 0.3s ease, transform 0.2s ease;
        outline: none;
      }

      .vd-tmdb-btn::before,
      .vd-tmdb-btn::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 3px;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .vd-tmdb-btn::before {
        border: 1px dashed #2e2e2e;
        opacity: 1;
      }

      .vd-tmdb-btn::after {
        border: 1px solid #8c7a5b;
        box-shadow: 0 0 10px rgba(140, 122, 91, 0.25), inset 0 0 8px rgba(140, 122, 91, 0.06);
        opacity: 0;
      }

      .vd-tmdb-btn:hover {
        color: #a89060;
        transform: translateY(-1px);
      }

      .vd-tmdb-btn:hover::before { opacity: 0; }
      .vd-tmdb-btn:hover::after  { opacity: 1; }

      .vd-tmdb-btn .vd-icon {
        font-size: 0.82rem;
        flex-shrink: 0;
        transition: transform 0.3s ease;
      }

      .vd-tmdb-btn:hover .vd-icon {
        transform: scale(1.25);
      }

      .vd-tmdb-btn.loading .vd-icon {
        animation: vd-tmdb-spin 0.9s linear infinite;
        transform: none;
      }

      @keyframes vd-tmdb-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      .vd-tmdb-btn.success {
        color: #8c7a5b;
      }
      .vd-tmdb-btn.success::before { opacity: 0; }
      .vd-tmdb-btn.success::after  { opacity: 1; border-style: solid; }

      .vd-tmdb-btn.error {
        color: #c0392b;
      }
      .vd-tmdb-btn.error::after {
        opacity: 1;
        border-color: #c0392b;
        box-shadow: 0 0 8px rgba(192, 57, 43, 0.2);
      }
      .vd-tmdb-btn.error::before { opacity: 0; }

      .vd-tmdb-btn:disabled {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.5;
        transform: none;
      }
    `;
    this.appendChild(style);

    this.innerHTML += `
      <button id="tmdbCheckBtn" class="vd-tmdb-btn">
        <i class="bi bi-search vd-icon"></i>
        <span class="vd-label">TMDB Check</span>
      </button>
      <vd-tmdb-report-modal></vd-tmdb-report-modal>
    `;

    this.querySelector("#tmdbCheckBtn").addEventListener("click", async () => {
      const btn = this.querySelector("#tmdbCheckBtn");
      const span = btn.querySelector(".vd-label");
      const icon = btn.querySelector(".vd-icon");

      btn.disabled = true;
      btn.className = "vd-tmdb-btn loading";
      icon.className = "bi bi-arrow-repeat vd-icon";
      span.textContent = "Caricamento media...";

      try {
        const media = await fetchMedia();

        if (!media.length) {
          btn.className = "vd-tmdb-btn error";
          icon.className = "bi bi-x vd-icon";
          span.textContent = "Nessun media trovato";
          setTimeout(() => reset(), 3000);
          return;
        }

        const found = [];
        const notFound = [];

        for (let i = 0; i < media.length; i++) {
          span.textContent = `Controllo ${i + 1} / ${media.length}...`;
          const item = media[i];
          const info = await fetchTmdbInfo({ title: item.title, type: item.type });
          if (info) {
            found.push(item);
          } else {
            notFound.push({ title: item.title, type: item.type });
          }
        }

        const reportModal = this.querySelector("vd-tmdb-report-modal");
        reportModal.show({ found: found.length, notFound });

        btn.className = "vd-tmdb-btn success";
        icon.className = "bi bi-check2 vd-icon";
        span.textContent = `Check OK — ${found.length} / ${media.length}`;

        setTimeout(() => reset(), 4000);
      } catch (err) {
        btn.className = "vd-tmdb-btn error";
        icon.className = "bi bi-x vd-icon";
        span.textContent = "Errore: " + err.message;
        setTimeout(() => reset(), 3000);
      }

      function reset() {
        btn.className = "vd-tmdb-btn";
        icon.className = "bi bi-search vd-icon";
        span.textContent = "TMDB Check";
        btn.disabled = false;
      }
    });
  }
}

customElements.define("vd-tmdb-check-button", VdTmdbCheckButton);
