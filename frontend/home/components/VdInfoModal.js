import { fetchTmdbInfo } from "../../shared/infoService.js";

class VdInfoModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        #infoModal .modal-content {
          background: #111;
          color: #eaeaea;
          border: 1px solid #222;
          border-radius: 10px;
          overflow: hidden;
        }

        #infoModal .modal-header {
          padding: 0.65rem 1rem 0.5rem;
          border-bottom: 1px solid #1a1a1a;
        }

        #infoModal .modal-body {
          padding: 0.85rem 1rem;
          min-height: 120px;
        }

        #infoModal .modal-footer {
          padding: 0.5rem 1rem 0.65rem;
          border-top: 1px solid #1a1a1a;
        }

        #infoModal .vd-info-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #e6d5b8;
          line-height: 1.3;
          margin-bottom: 4px;
        }

        #infoModal .vd-info-meta {
          font-size: 0.68rem;
          color: #8c7a5b;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }

        #infoModal .vd-info-overview {
          font-size: 0.78rem;
          color: #888;
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        #infoModal .vd-info-overview.expanded {
          display: block;
        }

        #infoModal .vd-expand-btn {
          background: none;
          border: none;
          color: #8c7a5b;
          font-size: 0.65rem;
          padding: 4px 0 0;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: none;
        }

        #infoModal .vd-expand-btn:hover {
          color: #c8b898;
        }

        #infoModal .vd-poster {
          width: 88px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid #2a2a2a;
          align-self: flex-start;
        }

        #infoModal .vd-poster-placeholder {
          width: 88px;
          height: 132px;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #2a2a2a;
          align-self: flex-start;
        }

        #infoModal .vd-close-btn {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #555;
          font-size: 0.72rem;
          padding: 0.28rem 1.2rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        #infoModal .vd-close-btn:hover {
          border-color: #555;
          color: #aaa;
        }
      </style>

      <div class="modal fade" id="infoModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" style="max-width:440px;">
          <div class="modal-content">

            <div class="modal-header border-0 d-flex justify-content-between align-items-center">
              <span id="vd-info-header-title"
                    style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.12em; color:#444;
                           font-family:'JetBrains Mono',monospace; max-width:320px;
                           overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              </span>
              <button type="button"
                      class="btn-close btn-close-white"
                      style="filter:invert(0.35); width:0.65em; height:0.65em;"
                      data-bs-dismiss="modal">
              </button>
            </div>

            <div class="modal-body" id="vd-info-body"></div>

            <div class="modal-footer border-0 justify-content-center">
              <button class="vd-close-btn" data-bs-dismiss="modal">Chiudi</button>
            </div>

          </div>
        </div>
      </div>
    `;

    this._modal = new bootstrap.Modal(this.querySelector("#infoModal"));

    document.addEventListener("open-info-modal", async (e) => {
      const { title, type } = e.detail;
      this.querySelector("#vd-info-header-title").textContent = title;
      this._showLoading();
      this._modal.show();

      const info = await fetchTmdbInfo({ title, type });
      this._showResult(info);
    });
  }

  _showLoading() {
    this.querySelector("#vd-info-body").innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center py-4"
           style="min-height:100px;">
        <div class="spinner-border"
             style="color:#8c7a5b; width:1.35rem; height:1.35rem; border-width:0.15em;">
        </div>
        <p style="color:#333; font-size:0.68rem; margin-top:0.75rem; margin-bottom:0;
                  text-transform:uppercase; letter-spacing:0.08em;">
          Ricerca...
        </p>
      </div>
    `;
  }

  _showResult(info) {
    const body = this.querySelector("#vd-info-body");

    if (!info) {
      body.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center py-4"
             style="min-height:100px;">
          <i class="bi bi-search" style="font-size:1.4rem; color:#252525;"></i>
          <p style="color:#444; font-size:0.68rem; margin-top:0.65rem; margin-bottom:0;
                    text-transform:uppercase; letter-spacing:0.08em;">
            Nessuna info disponibile
          </p>
        </div>
      `;
      return;
    }

    const metaParts = [
      info.year ? String(info.year) : null,
      info.rating != null ? `⭐ ${info.rating}` : null,
    ].filter(Boolean);

    const posterHtml = info.posterUrl
      ? `<img src="${info.posterUrl}" class="vd-poster" alt="${info.title}">`
      : `<div class="vd-poster-placeholder">
           <i class="bi bi-film" style="font-size:1.1rem;"></i>
         </div>`;

    const overviewHtml = info.overview
      ? `<p class="vd-info-overview" id="vd-overview">${info.overview}</p>
         <button class="vd-expand-btn" id="vd-expand">Leggi di più ›</button>`
      : `<p style="color:#2a2a2a; font-size:0.75rem; font-style:italic; margin:0;">
           Nessuna descrizione
         </p>`;

    body.innerHTML = `
      <div class="d-flex gap-3">
        ${posterHtml}
        <div style="flex:1; min-width:0;">
          <div class="vd-info-title">${info.title}</div>
          ${metaParts.length ? `<div class="vd-info-meta">${metaParts.join(" · ")}</div>` : ""}
          ${overviewHtml}
        </div>
      </div>
    `;

    if (info.overview) {
      const overviewEl = body.querySelector("#vd-overview");
      const expandBtn = body.querySelector("#vd-expand");
      if (overviewEl.scrollHeight > overviewEl.clientHeight) {
        expandBtn.style.display = "block";
      }
      expandBtn.addEventListener("click", () => {
        overviewEl.classList.add("expanded");
        expandBtn.style.display = "none";
      });
    }
  }
}

customElements.define("vd-info-modal", VdInfoModal);
