class VdNickNameModal extends HTMLElement {
  connectedCallback() {
    this._user = null;

    this.innerHTML = `
      <style>
        #nickNameModal .modal-dialog {
          max-width: 400px;
          margin: 0 auto;
        }
        #nickNameModal .modal-body {
          padding: 0.85rem 1rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        #nickNameModal .modal-content {
          background: #141414;
          color: #e8e8e8;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          overflow: hidden;
        }

        #nickNameModal .modal-header {
          padding: 0.75rem 1rem 0.55rem;
          border-bottom: 1px solid #1e1e1e;
        }

        #nickNameModal .modal-title {
          font-size: 0.92rem;
          font-family: 'JetBrains Mono', 'Fira Mono', monospace;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8c7a5b;
          text-align: center;
          width: 100%;
        }

        #nickNameModal .modal-body {
          padding: 0.85rem 1rem;
        }

        #nickNameModal .modal-footer {
          padding: 0.55rem 1rem 0.7rem;
          border-top: 1px solid #1e1e1e;
        }

        /* Nickname row */
        #nickNameModal .vd-nick-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.5rem 0.75rem;
          background: #0d0d0d;
          border: 1px solid #2a2118;
          border-radius: 8px;
        }

        #nickNameModal .vd-nick-text {
          flex: 1;
          font-size: 1rem;
          font-weight: 600;
          color: #c8b898;
          letter-spacing: 0.02em;
        }

        #nickNameModal .vd-nick-input {
          flex: 1;
          font-size: 1rem;
          font-weight: 600;
          color: #c8b898;
          letter-spacing: 0.02em;
          background: transparent;
          border: none;
          border-bottom: 1px solid #8c7a5b;
          outline: none;
          padding: 0;
          width: 0;
        }

        #nickNameModal .vd-nick-badge {
          font-size: 0.58rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #555;
          background: #161616;
          border: 1px solid #222;
          border-radius: 20px;
          padding: 2px 8px;
        }

        #nickNameModal .vd-nick-actions {
          display: flex;
          gap: 6px;
        }

        #nickNameModal .vd-icon-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #252525;
          border-radius: 6px;
          color: #555;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        }

        #nickNameModal .vd-icon-btn:hover:not(:disabled) {
          border-color: #8c7a5b;
          color: #8c7a5b;
        }

        #nickNameModal .vd-icon-btn.danger:hover:not(:disabled) {
          border-color: #c0392b;
          color: #c0392b;
        }

        #nickNameModal .vd-icon-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Divider */
        #nickNameModal .vd-divider {
          border: none;
          border-top: 1px solid #1e1e1e;
          margin: 0.75rem 0 0.6rem;
        }

        /* Section label — più grande, più chiaro, centrato */
        #nickNameModal .vd-section-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #888;
          margin-bottom: 8px;
          text-align: center;
        }

        /* Close button */
        #nickNameModal .vd-close-btn {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #666;
          font-size: 0.75rem;
          padding: 0.32rem 1.2rem;
          border-radius: 6px;
          transition: all 0.2s;
          cursor: pointer;
        }

        #nickNameModal .vd-close-btn:hover {
          border-color: #555;
          color: #aaa;
        }
      </style>

      <div class="modal fade" id="nickNameModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">

            <!-- HEADER -->
            <div class="modal-header border-0 justify-content-center position-relative">
              <h5 class="modal-title">Profilo</h5>
              <button type="button"
                      class="btn-close position-absolute end-0 me-3"
                      style="filter:invert(0.5); width:0.7em; height:0.7em;"
                      data-bs-dismiss="modal">
              </button>
            </div>

            <!-- BODY -->
            <div class="modal-body">

              <!-- Nickname -->
              <div class="vd-nick-row">
                <span id="vnm-nickname" class="vd-nick-text"></span>
                <span id="vnm-badge" class="vd-nick-badge" style="display:none">demo</span>
                <div class="vd-nick-actions" id="vnm-actions">
                  <button class="vd-icon-btn" id="vnm-edit-btn" title="Modifica nickname">
                    <i class="bi bi-pencil"></i>
                  </button>
                </div>
              </div>

              <hr class="vd-divider" />

              <!-- Statistiche -->
              <div class="vd-section-label">Statistiche</div>
              <box-statistiche id="vnm-stats"></box-statistiche>

            </div>

            <!-- FOOTER -->
            <div class="modal-footer border-0 justify-content-center">
              <button class="vd-close-btn" data-bs-dismiss="modal">Chiudi</button>
            </div>

          </div>
        </div>
      </div>
    `;

    this._modal = new bootstrap.Modal(this.querySelector("#nickNameModal"));
    this._attachActionHandlers();
  }

  // ── Handlers sui bottoni view-mode ──────────────────────────────
  _attachActionHandlers() {
    const editBtn = this.querySelector("#vnm-edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => this._enterEditMode());
    }

    this.querySelector("#vnm-delete-btn")?.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("delete-account", {
          bubbles: true,
          detail: { user: this._user },
        }),
      );
    });
  }

  // ── Entra in modalità modifica ──────────────────────────────────
  _enterEditMode() {
    const nickEl = this.querySelector("#vnm-nickname");
    const badgeEl = this.querySelector("#vnm-badge");
    const actionsEl = this.querySelector("#vnm-actions");

    nickEl.style.display = "none";
    badgeEl.style.display = "none";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "vd-nick-input";
    input.id = "vnm-edit-input";
    input.value = this._user?.nickname ?? "";
    input.maxLength = 30;
    nickEl.parentNode.insertBefore(input, nickEl);
    input.focus();
    input.select();

    actionsEl.innerHTML = `
      <button class="vd-icon-btn" id="vnm-confirm-btn" title="Conferma">
        <i class="bi bi-check2"></i>
      </button>
      <button class="vd-icon-btn danger" id="vnm-cancel-btn" title="Annulla">
        <i class="bi bi-x-lg"></i>
      </button>
    `;

    this.querySelector("#vnm-confirm-btn").addEventListener("click", () =>
      this._submitEdit(),
    );
    this.querySelector("#vnm-cancel-btn").addEventListener("click", () =>
      this._exitEditMode(),
    );
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this._submitEdit();
      if (e.key === "Escape") this._exitEditMode();
    });
  }

  // ── Esce dalla modalità modifica, ripristina view ───────────────
  _exitEditMode() {
    const input = this.querySelector("#vnm-edit-input");
    if (input) input.remove();

    const nickEl = this.querySelector("#vnm-nickname");
    nickEl.textContent = this._user?.nickname ?? "";
    nickEl.style.display = "";

    this.querySelector("#vnm-badge").style.display = this._user?.is_demo
      ? "inline-block"
      : "none";

    const actionsEl = this.querySelector("#vnm-actions");
    actionsEl.innerHTML = `
      <button class="vd-icon-btn" id="vnm-edit-btn" title="Modifica nickname">
        <i class="bi bi-pencil"></i>
      </button>
    `;

    this._attachActionHandlers();

    if (this._user?.is_demo) {
      this.querySelector("#vnm-edit-btn").style.display = "none";
    }
  }

  // ── Valida e dispatcha l'evento ─────────────────────────────────
  _submitEdit() {
    const input = this.querySelector("#vnm-edit-input");
    const nickname = (input?.value ?? "").trim();
    if (nickname.length < 2) return;

    const confirmBtn = this.querySelector("#vnm-confirm-btn");
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" style="width:0.75rem;height:0.75rem;border-width:0.12em;"></span>';
    }

    this.dispatchEvent(
      new CustomEvent("update-nickname", {
        bubbles: true,
        detail: { nickname },
      }),
    );
  }

  // ── API pubblica: apertura modale ───────────────────────────────
  open(user, stats) {
    this._user = user;

    if (this.querySelector("#vnm-edit-input")) {
      this._exitEditMode();
    }

    const nickEl = this.querySelector("#vnm-nickname");
    const badgeEl = this.querySelector("#vnm-badge");
    const editBtn = this.querySelector("#vnm-edit-btn");

    nickEl.textContent = user?.nickname ?? "";
    badgeEl.style.display = user?.is_demo ? "inline-block" : "none";
    if (editBtn) editBtn.style.display = user?.is_demo ? "none" : "";

    const statsBox = this.querySelector("#vnm-stats");
    if (statsBox && stats) statsBox.update(stats);

    this._modal.show();
  }

  // ── API pubblica: risposta dal controller ───────────────────────
  confirmSuccess(nickname) {
    this._user = { ...this._user, nickname };
    this._exitEditMode();
  }

  confirmError() {
    const confirmBtn = this.querySelector("#vnm-confirm-btn");
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = '<i class="bi bi-check2"></i>';
    }
  }

  close() {
    this._modal.hide();
  }
}

customElements.define("vd-nick-name-modal", VdNickNameModal);
