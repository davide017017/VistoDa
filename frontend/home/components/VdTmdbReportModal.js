class VdTmdbReportModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        #vdTmdbReport .modal-content {
          background: #111;
          color: #eaeaea;
          border: 1px solid #222;
          border-radius: 10px;
          overflow: hidden;
        }

        #vdTmdbReport .modal-header {
          padding: 0.65rem 1rem 0.5rem;
          border-bottom: 1px solid #1a1a1a;
        }

        #vdTmdbReport .modal-body {
          padding: 0.85rem 1rem;
        }

        #vdTmdbReport .modal-footer {
          padding: 0.5rem 1rem 0.65rem;
          border-top: 1px solid #1a1a1a;
        }

        #vdTmdbReport .vd-tr-section-label {
  font-size:0.6rem;
  text-align:center;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #333;
          margin-bottom: 6px;
        }

       #vdTmdbReport .vd-tr-found-row {
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  gap:4px;
}

#vdTmdbReport .vd-tr-count {
  font-size:0.9rem;
  color:#555;
  font-family:'JetBrains Mono', monospace;
}

#vdTmdbReport .vd-tr-pct {
  font-size:1.6rem;
  font-weight:700;
  color:#8c7a5b;
  font-family:'JetBrains Mono', monospace;
  letter-spacing:0.04em;
}

        #vdTmdbReport .vd-divider {
          border: none;
          border-top: 1px solid #1a1a1a;
          margin: 0.7rem 0;
        }

        #vdTmdbReport .vd-tr-nf-list {
          max-height: 220px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 6px;
          padding-right: 2px;
        }

        #vdTmdbReport .vd-tr-nf-list::-webkit-scrollbar {
          width: 3px;
        }

        #vdTmdbReport .vd-tr-nf-list::-webkit-scrollbar-track {
          background: #0d0d0d;
        }

        #vdTmdbReport .vd-tr-nf-list::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 2px;
        }

        #vdTmdbReport .vd-tr-nf-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.28rem 0.6rem;
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          border-radius: 5px;
          gap: 8px;
        }

        #vdTmdbReport .vd-tr-nf-title {
          font-size: 0.78rem;
          color: #666;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #vdTmdbReport .vd-tr-type-badge {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #444;
          background: #161616;
          border: 1px solid #222;
          border-radius: 20px;
          padding: 1px 7px;
          flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
        }

        #vdTmdbReport .vd-tr-empty {
          font-size: 0.72rem;
          color: #333;
          font-style: italic;
          text-align: center;
          padding: 0.5rem 0;
        }

        #vdTmdbReport .vd-close-btn {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #555;
          font-size: 0.72rem;
          padding: 0.28rem 1.2rem;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        #vdTmdbReport .vd-close-btn:hover {
          border-color: #555;
          color: #aaa;
        }
      </style>

      <div class="modal fade" id="vdTmdbReport" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" style="max-width:400px;">
          <div class="modal-content">

            <div class="modal-header border-0 d-flex justify-content-between align-items-center">
              <span id="vd-tr-header"
                    style="font-size:0.65rem; text-transform:uppercase; letter-spacing:0.12em;
                           color:#444; font-family:'JetBrains Mono',monospace;">
                TMDB Check
              </span>
              <button type="button"
                      class="btn-close btn-close-white"
                      style="filter:invert(0.35); width:0.65em; height:0.65em;"
                      data-bs-dismiss="modal">
              </button>
            </div>

            <div class="modal-body" id="vd-tr-body"></div>

            <div class="modal-footer border-0 justify-content-center">
              <button class="vd-close-btn" data-bs-dismiss="modal">Chiudi</button>
            </div>

          </div>
        </div>
      </div>
    `;

    this._modal = new bootstrap.Modal(this.querySelector("#vdTmdbReport"));
  }

  show({ found, notFound }) {
    const total = found + notFound.length;
    const pct = total > 0 ? Math.round((found / total) * 100) : 0;

    this.querySelector("#vd-tr-header").textContent =
      `TMDB Check — ${total} media`;

    const notFoundHtml =
      notFound.length === 0
        ? `<div class="vd-tr-empty">Tutti i media sono stati trovati</div>`
        : notFound
            .map(
              (item) => `
              <div class="vd-tr-nf-item">
                <span class="vd-tr-nf-title">${item.title}</span>
                <span class="vd-tr-type-badge">${item.type}</span>
              </div>`,
            )
            .join("");

    this.querySelector("#vd-tr-body").innerHTML = `
      <!-- Trovati -->
      <div class="vd-tr-section-label">
        <i class="bi bi-check2" style="color:#4a7a5b;"></i> Trovati
      </div>
      <div class="vd-tr-found-row">
        <span class="vd-tr-count">${found} / ${total}</span>
        <span class="vd-tr-pct">${pct}%</span>
      </div>

      <hr class="vd-divider" />

      <!-- Non trovati -->
      <div class="vd-tr-section-label">
        <i class="bi bi-x" style="color:#7a3a3a;"></i>
        Non trovati${notFound.length ? ` (${notFound.length})` : ""}
      </div>
      <div class="vd-tr-nf-list">
        ${notFoundHtml}
      </div>
    `;

    this._modal.show();
  }
}

customElements.define("vd-tmdb-report-modal", VdTmdbReportModal);
