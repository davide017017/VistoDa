class VdMediaModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        #mediaModal .modal-dialog {
          max-width: 420px;
        }

        #mediaModal .modal-content {
          background: #111;
          color: #eaeaea;
          border: 1px solid #222;
          border-radius: 10px;
          overflow: hidden;
        }

        #mediaModal .modal-header {
          padding: 0.65rem 1rem 0.5rem;
          border-bottom: 1px solid #1e1e1e;
        }

        #mediaModal .modal-body {
          padding: 0.65rem 1rem;
        }

        #mediaModal .modal-footer {
          padding: 0.5rem 1rem 0.65rem;
          border-top: 1px solid #1e1e1e;
        }

        #mediaModal .modal-title {
          font-size: 0.78rem;
          font-family: 'JetBrains Mono', 'Fira Mono', monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8c7a5b;
        }

        #mediaModal .vd-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 0.3rem;
        }

        #mediaModal .vd-label span {
          color: #383838;
          font-size: 0.6rem;
          text-transform: none;
          letter-spacing: 0;
        }

        #mediaModal .vd-field {
          margin-bottom: 0.55rem;
        }

        #mediaModal .form-control {
          background: #0d0d0d;
          border: 1px solid #222;
          color: #eaeaea;
          font-size: 0.8rem;
          padding: 0.3rem 0.6rem;
          border-radius: 5px;
          transition: border-color 0.2s;
        }

        #mediaModal .form-control:focus {
          background: #0d0d0d;
          border-color: #8c7a5b;
          color: #eaeaea;
          box-shadow: 0 0 0 2px rgba(140,122,91,0.12);
        }

        #mediaModal textarea.form-control {
          resize: none;
          rows: 2;
        }

        /* Pills */
        #mediaModal .pill-btn {
          border: 1px solid #222;
          color: #666;
          background: #0d0d0d;
          border-radius: 20px;
          font-size: 0.62rem;
          padding: 0.22rem 0.5rem;
          white-space: nowrap;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          flex: 1;
          justify-content: center;
        }

        #mediaModal .pill-btn i {
          font-size: 0.75rem;
        }

        #mediaModal .pill-btn:hover {
          border-color: #444;
          color: #aaa;
        }

        #mediaModal .pill-btn.active {
          background: #8c7a5b;
          color: #0f0f0f;
          border-color: #8c7a5b;
          box-shadow: 0 0 8px rgba(140,122,91,0.35);
          transform: scale(1.03);
          font-weight: 600;
        }

        /* Counter row */
        #mediaModal .vd-counter {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        #mediaModal .vd-counter .form-control {
          text-align: center;
          flex: 1;
        }

        #mediaModal .vd-counter .btn-counter {
          width: 30px;
          height: 30px;
          padding: 0;
          border: 1px solid #222;
          background: #0d0d0d;
          color: #666;
          border-radius: 5px;
          font-size: 1rem;
          line-height: 1;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        #mediaModal .vd-counter .btn-counter:hover {
          border-color: #8c7a5b;
          color: #8c7a5b;
        }

        /* Footer buttons */
        #mediaModal .btn-cancel {
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #555;
          font-size: 0.75rem;
          padding: 0.3rem 1.2rem;
          border-radius: 5px;
          transition: all 0.2s;
        }

        #mediaModal .btn-cancel:hover {
          border-color: #555;
          color: #aaa;
        }

        #mediaModal .btn-save {
          background: #8c7a5b;
          border: none;
          color: #0f0f0f;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.3rem 1.4rem;
          border-radius: 5px;
          letter-spacing: 0.04em;
          transition: all 0.2s;
        }

        #mediaModal .btn-save:hover {
          background: #a08e6e;
          box-shadow: 0 0 10px rgba(140,122,91,0.3);
        }

        #mediaModal .btn-close {
          filter: invert(0.4);
          width: 0.7em;
          height: 0.7em;
        }

        #mediaModal .pill-row {
          display: flex;
          gap: 6px;
          width: 100%;
        }
      </style>

      <div class="modal fade" id="mediaModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">

            <!-- HEADER -->
            <div class="modal-header border-0 justify-content-center position-relative">
              <h5 id="mediaModalTitle" class="modal-title text-center w-100"></h5>
              <button type="button"
                      class="btn-close position-absolute end-0 me-3"
                      data-bs-dismiss="modal">
              </button>
            </div>

            <div class="modal-body">

              <!-- TITOLO -->
              <div class="vd-field">
                <label class="vd-label">Titolo <span>(obbligatorio)</span></label>
                <input id="mediaTitle" class="form-control" placeholder="Es. Inception" />
              </div>

              <!-- TIPO -->
              <div class="vd-field">
                <label class="vd-label">Tipo <span>(obbligatorio)</span></label>
                <div id="mediaTypePills" class="pill-row">
                  ${this.renderPill("film", "Film", "bi-film")}
                  ${this.renderPill("serie", "Serie", "bi-tv")}
                  ${this.renderPill("anime", "Anime", "bi-play-circle")}
                  ${this.renderPill("standup", "Stand-up", "bi-mic")}
                </div>
              </div>

              <!-- STATUS -->
              <div class="vd-field">
                <label class="vd-label">Stato <span>(obbligatorio)</span></label>
                <div id="mediaStatusPills" class="pill-row">
                  ${this.renderPill("completed", "Visto", "bi-check")}
                  ${this.renderPill("watching", "In corso", "bi-eye")}
                  ${this.renderPill("recommended", "Consigliati", "bi-star")}
                </div>
              </div>

              <!-- RATING + ANNO inline -->
              <div class="vd-field d-flex gap-3">
                <div style="flex:1">
                  <label class="vd-label">Rating <span>(1–10)</span></label>
                  <div class="vd-counter">
                    <button id="mediaRatingMinus" class="btn-counter">−</button>
                    <input id="mediaRating" type="number" step="0.1" min="1" max="10"
                           class="form-control" placeholder="–" />
                    <button id="mediaRatingPlus"  class="btn-counter">+</button>
                  </div>
                </div>
                <div style="flex:1">
                  <label class="vd-label">Anno</label>
                  <div class="vd-counter">
                    <button id="mediaYearMinus" class="btn-counter">−</button>
                    <input id="mediaYear" type="number" min="1900" max="2100"
                           class="form-control" placeholder="–" />
                    <button id="mediaYearPlus"  class="btn-counter">+</button>
                  </div>
                </div>
              </div>

              <!-- NOTE -->
              <div class="vd-field mb-0">
                <label class="vd-label">Note <span>(facoltativo)</span></label>
                <textarea id="mediaNotes" class="form-control" rows="2"
                          placeholder="Scrivi qualcosa..."></textarea>
              </div>

            </div>

            <!-- FOOTER -->
            <div class="modal-footer border-0 justify-content-center gap-2">
              <button type="button" class="btn-cancel" data-bs-dismiss="modal">Annulla</button>
              <button type="button" id="mediaSave" class="btn-save"></button>
            </div>

          </div>
        </div>
      </div>
    `;

    this.initLogic();
  }

  renderPill(value, label, icon) {
    return `
      <button type="button" class="pill-btn" data-value="${value}">
        <i class="bi ${icon}"></i>
        <span>${label}</span>
      </button>
    `;
  }

  initLogic() {
    this._modal = new bootstrap.Modal(this.querySelector("#mediaModal"));
    this._currentId = null;
    this._selectedType = null;
    this._selectedStatus = null;

    const handlePills = (containerId, setter) => {
      this.querySelectorAll(`#${containerId} .pill-btn`).forEach((btn) => {
        btn.addEventListener("click", () => {
          this._selectPill(containerId, btn);
          setter(btn.dataset.value);
        });
      });
    };

    handlePills("mediaTypePills", (val) => (this._selectedType = val));
    handlePills("mediaStatusPills", (val) => (this._selectedStatus = val));

    const setupCounter = (inputId, minusId, plusId, min, max, step) => {
      const input = this.querySelector(inputId);
      const minus = this.querySelector(minusId);
      const plus = this.querySelector(plusId);

      minus.addEventListener("click", () => {
        let v = parseFloat(input.value || min);
        input.value = Math.max(min, v - step);
      });
      plus.addEventListener("click", () => {
        let v = parseFloat(input.value || min);
        input.value = Math.min(max, v + step);
      });
    };

    setupCounter(
      "#mediaRating",
      "#mediaRatingMinus",
      "#mediaRatingPlus",
      1,
      10,
      0.5,
    );
    setupCounter(
      "#mediaYear",
      "#mediaYearMinus",
      "#mediaYearPlus",
      1900,
      2100,
      1,
    );

    this.querySelector("#mediaSave").addEventListener("click", () => {
      const title = this.querySelector("#mediaTitle").value.trim();
      const rating = this.querySelector("#mediaRating").value || null;
      const year = this.querySelector("#mediaYear").value || null;
      const notes = this.querySelector("#mediaNotes").value || null;

      if (!title || !this._selectedType || !this._selectedStatus) {
        alert("Compila tutti i campi obbligatori");
        return;
      }

      const detail = {
        title,
        type: this._selectedType,
        status: this._selectedStatus,
        year: year ? parseInt(year) : null,
        rating: rating ? parseFloat(rating) : null,
        notes,
      };

      if (this._currentId) {
        detail.id = this._currentId;
        document.dispatchEvent(
          new CustomEvent("edit-media", { detail, bubbles: true }),
        );
      } else {
        document.dispatchEvent(
          new CustomEvent("create-media", { detail, bubbles: true }),
        );
      }

      this._modal.hide();
    });
  }

  _selectPill(containerId, activeBtn) {
    this.querySelectorAll(`#${containerId} .pill-btn`).forEach((b) =>
      b.classList.remove("active"),
    );
    activeBtn.classList.add("active");
  }

  _resetFields() {
    this.querySelector("#mediaTitle").value = "";
    this.querySelector("#mediaRating").value = "";
    this.querySelector("#mediaYear").value = "";
    this.querySelector("#mediaNotes").value = "";
    this._selectedType = null;
    this._selectedStatus = null;
    ["mediaTypePills", "mediaStatusPills"].forEach((id) => {
      this.querySelectorAll(`#${id} .pill-btn`).forEach((b) =>
        b.classList.remove("active"),
      );
    });
  }

  openCreate() {
    this._currentId = null;
    this._resetFields();
    this.querySelector("#mediaModalTitle").textContent = "Nuovo";
    this.querySelector("#mediaSave").textContent = "Crea";
    this._modal.show();
  }

  openEdit(item) {
    this._currentId = item.id;
    this._resetFields();
    this.querySelector("#mediaModalTitle").textContent = "Modifica";
    this.querySelector("#mediaSave").textContent = "Salva modifiche";

    this.querySelector("#mediaTitle").value = item.title || "";
    this.querySelector("#mediaRating").value = item.rating || "";
    this.querySelector("#mediaYear").value = item.year || "";
    this.querySelector("#mediaNotes").value = item.notes || "";

    this._selectedType = item.type || null;
    this._selectedStatus = item.status || null;

    const typeBtn = this.querySelector(
      `#mediaTypePills   [data-value="${item.type}"]`,
    );
    const statusBtn = this.querySelector(
      `#mediaStatusPills [data-value="${item.status}"]`,
    );
    if (typeBtn) this._selectPill("mediaTypePills", typeBtn);
    if (statusBtn) this._selectPill("mediaStatusPills", statusBtn);

    this._modal.show();
  }
}

customElements.define("vd-media-modal", VdMediaModal);
