import { fetchMedia } from "../services/mediaService.js";
import { fetchTmdbInfo } from "../../shared/infoService.js";

class VdTmdbCheckButton extends HTMLElement {
  connectedCallback() {
    const style = document.createElement("style");
    style.textContent = `
      .vd-tmdb-wrap {
        position: relative;
        width: 100%;
        margin-bottom: 0.75rem;
        border-radius: 4px;
      }

      /* Bordo statico default */
      .vd-tmdb-wrap::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 4px;
        border: 1px dashed #2e2e2e;
        pointer-events: none;
        transition: border-color 0.3s, box-shadow 0.3s;
        z-index: 2;
      }

      /* Durante loading: bordo sottile dorato statico */
      .vd-tmdb-wrap.loading::before {
        border: 1px solid #8c7a5b;
      }

      .vd-tmdb-inner {
        position: relative;
        z-index: 1;
        background: #111;
        border-radius: 3px;
        overflow: hidden;
        display: flex;
        align-items: stretch;
      }

      .vd-tmdb-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex: 1;
        padding: 0.45rem 1rem;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 0.75rem;
        font-family: 'JetBrains Mono', 'Fira Mono', 'Courier New', monospace;
        letter-spacing: 0.04em;
        color: #5c5c5c;
        transition: color 0.3s ease;
        outline: none;
        z-index: 1;
      }

      /* Hover */
      .vd-tmdb-wrap:not(.loading):not(.success):not(.error):hover::before {
        border-color: #8c7a5b;
        box-shadow: 0 0 10px rgba(140, 122, 91, 0.2);
      }
      .vd-tmdb-wrap:not(.loading):hover .vd-tmdb-btn { color: #a89060; }
      .vd-tmdb-wrap:not(.loading):hover .vd-icon { transform: scale(1.2); }

      .vd-tmdb-btn .vd-icon {
        font-size: 0.82rem;
        flex-shrink: 0;
        transition: transform 0.3s ease;
      }

      /* Loading */
      .vd-tmdb-wrap.loading .vd-tmdb-btn {
        color: #8c7a5b;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Success */
      .vd-tmdb-wrap.success::before {
        border: 1px solid #8c7a5b;
        box-shadow: 0 0 8px rgba(140, 122, 91, 0.25);
      }
      .vd-tmdb-wrap.success .vd-tmdb-btn { color: #8c7a5b; }

      /* Error / Aborted */
      .vd-tmdb-wrap.error::before {
        border: 1px solid #c0392b;
        box-shadow: 0 0 8px rgba(192, 57, 43, 0.2);
      }
      .vd-tmdb-wrap.error .vd-tmdb-btn { color: #c0392b; }

      .vd-tmdb-btn:disabled {
        cursor: not-allowed;
        pointer-events: none;
        opacity: 0.5;
      }

      /* ── Progress Bar ── */
      .vd-progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 8px;
        width: 0%;
        background: linear-gradient(90deg, #8c7a5b, #e8c87a, #8c7a5b);
        background-size: 200% 100%;
        border-radius: 0 2px 2px 0;
        transition: width 0.25s ease;
        animation: vd-shimmer 1.8s linear infinite;
        opacity: 0;
        z-index: 2;
      }

      .vd-tmdb-wrap.loading .vd-progress-bar {
        opacity: 1;
      }

      @keyframes vd-shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Percentuale piccola accanto al testo */
      .vd-percent {
        font-size: 0.65rem;
        color: #e8c87a;
        opacity: 0;
        transition: opacity 0.2s;
        min-width: 2.8rem;
        text-align: right;
      }

      .vd-tmdb-wrap.loading .vd-percent {
        opacity: 1;
      }

      /* ── Abort Button ── */
      .vd-abort-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0;
        overflow: hidden;
        padding: 0;
        background: transparent;
        border: none;
        border-left: 1px solid transparent;
        cursor: pointer;
        color: #5c3030;
        font-size: 0.75rem;
        transition:
          width 0.25s ease,
          color 0.2s ease,
          border-color 0.25s ease,
          background 0.2s ease;
        outline: none;
        flex-shrink: 0;
        z-index: 1;
      }

      .vd-tmdb-wrap.loading .vd-abort-btn {
        width: 2rem;
        border-left-color: #2e2e2e;
        color: #7a3a3a;
      }

      .vd-abort-btn:hover {
        background: rgba(192, 57, 43, 0.08);
        color: #c0392b !important;
      }

      .vd-abort-btn .vd-abort-icon {
        font-size: 0.8rem;
        pointer-events: none;
      }
    `;
    this.appendChild(style);

    this.innerHTML += `
      <div class="vd-tmdb-wrap">
        <div class="vd-tmdb-inner">
          <button id="tmdbCheckBtn" class="vd-tmdb-btn">
            <i class="bi bi-search vd-icon"></i>
            <span class="vd-label">TMDB Check</span>
            <span class="vd-percent"></span>
          </button>
          <button id="tmdbAbortBtn" class="vd-abort-btn" title="Interrompi">
            <i class="bi bi-x vd-abort-icon"></i>
          </button>
          <div class="vd-progress-bar" id="vdProgressBar"></div>
        </div>
      </div>
      <vd-tmdb-report-modal></vd-tmdb-report-modal>
    `;

    let aborted = false;

    this.querySelector("#tmdbAbortBtn").addEventListener("click", () => {
      aborted = true;
    });

    this.querySelector("#tmdbCheckBtn").addEventListener("click", async () => {
      const wrap = this.querySelector(".vd-tmdb-wrap");
      const btn = this.querySelector("#tmdbCheckBtn");
      const span = btn.querySelector(".vd-label");
      const icon = btn.querySelector(".vd-icon");
      const percent = btn.querySelector(".vd-percent");
      const progressBar = this.querySelector("#vdProgressBar");

      aborted = false;

      const setProgress = (current, total) => {
        const pct = Math.round((current / total) * 100);
        progressBar.style.width = `${pct}%`;
        percent.textContent = `${pct}%`;
      };

      btn.disabled = true;
      wrap.className = "vd-tmdb-wrap loading";
      icon.className = "bi bi-search vd-icon";
      span.textContent = "Caricamento media...";
      percent.textContent = "";
      progressBar.style.width = "0%";

      try {
        const media = await fetchMedia();

        if (!media.length) {
          wrap.className = "vd-tmdb-wrap error";
          icon.className = "bi bi-x vd-icon";
          span.textContent = "Nessun media trovato";
          percent.textContent = "";
          progressBar.style.width = "0%";
          setTimeout(() => reset(), 3000);
          return;
        }

        const found = [];
        const notFound = [];

        for (let i = 0; i < media.length; i++) {
          if (aborted) {
            wrap.className = "vd-tmdb-wrap error";
            icon.className = "bi bi-slash-circle vd-icon";
            span.textContent = `Interrotto — ${i} / ${media.length}`;
            percent.textContent = "";
            progressBar.style.width = "0%";
            setTimeout(() => reset(), 3000);
            return;
          }

          setProgress(i + 1, media.length);
          span.textContent = `Controllo ${i + 1} / ${media.length}...`;

          const item = media[i];
          const info = await fetchTmdbInfo({
            title: item.title,
            type: item.type,
          });
          if (info) {
            found.push(item);
          } else {
            notFound.push({ title: item.title, type: item.type });
          }
        }

        const reportModal = this.querySelector("vd-tmdb-report-modal");
        reportModal.show({ found: found.length, notFound });

        wrap.className = "vd-tmdb-wrap success";
        icon.className = "bi bi-check2 vd-icon";
        span.textContent = `Check OK — ${found.length} / ${media.length}`;
        percent.textContent = "";
        progressBar.style.width = "100%";

        setTimeout(() => reset(), 4000);
      } catch (err) {
        wrap.className = "vd-tmdb-wrap error";
        icon.className = "bi bi-x vd-icon";
        span.textContent = "Errore: " + err.message;
        percent.textContent = "";
        progressBar.style.width = "0%";
        setTimeout(() => reset(), 3000);
      }

      function reset() {
        aborted = false;
        wrap.className = "vd-tmdb-wrap";
        icon.className = "bi bi-search vd-icon";
        span.textContent = "TMDB Check";
        btn.disabled = false;
        percent.textContent = "";
        progressBar.style.width = "0%";
      }
    });
  }
}

customElements.define("vd-tmdb-check-button", VdTmdbCheckButton);
