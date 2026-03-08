class VdMediaModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        /* CENTERING — orizzontale e verticale */
        #mediaModal .modal-dialog {
          max-width: 440px;
          width: 100%;
          margin: 0 auto;
        }
        #mediaModal .modal-content {
          background: #141414;
          color: #e8e8e8;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          overflow: hidden;
        }
        #mediaModal .modal-header {
          padding: 0.75rem 1rem 0.55rem;
          border-bottom: 1px solid #1e1e1e;
        }
        #mediaModal .modal-body { padding: 0.75rem 1rem; }
        #mediaModal .modal-footer {
          padding: 0.55rem 1rem 0.7rem;
          border-top: 1px solid #1e1e1e;
        }
        #mediaModal .modal-title {
          font-size: 0.92rem;
          font-family: 'JetBrains Mono', 'Fira Mono', monospace;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8c7a5b;
          text-align: center;
          width: 100%;
        }

        /* SEZIONI */
        #mediaModal .section-required {
          background: #0f0f0f;
          border: 1px solid #2a2118;
          border-radius: 8px;
          padding: 0.65rem 0.8rem 0.5rem;
          margin-bottom: 0.6rem;
        }
        #mediaModal .section-label {
          font-size: 0.54rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 0.55rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        #mediaModal .section-label-req { color: #8c7a5b; }
        #mediaModal .section-label-req::before {
          content: ''; display: inline-block; width: 5px; height: 5px;
          background: #8c7a5b; border-radius: 50%; flex-shrink: 0;
        }
        #mediaModal .section-label-opt {
          color: #555;
          border-top: 1px solid #1c1c1c;
          padding-top: 0.5rem;
          margin-top: 0.1rem;
        }
        #mediaModal .section-label-opt::before {
          content: ''; display: inline-block; width: 5px; height: 5px;
          background: #555; border-radius: 50%; flex-shrink: 0;
        }

        /* LABELS */
        #mediaModal .vd-label {
          display: block; font-size: 0.72rem; letter-spacing: 0.09em;
          text-transform: uppercase; color: #ccc; margin-bottom: 0.3rem;
          text-align: center;
        }
        #mediaModal .vd-label-muted {
          display: block; font-size: 0.68rem; letter-spacing: 0.07em;
          text-transform: uppercase; color: #888; margin-bottom: 0.3rem;
          text-align: center;
        }
        #mediaModal .vd-field { margin-bottom: 0.55rem; }
        #mediaModal .vd-field-muted { margin-bottom: 0.5rem; }

        /* INPUTS */
        #mediaModal .form-control {
          background: #0d0d0d; border: 1px solid #2a2a2a; color: #e8e8e8;
          font-size: 0.8rem; padding: 0.32rem 0.65rem; border-radius: 6px;
          transition: border-color 0.2s; width: 100%;
        }
        #mediaModal .form-control::placeholder { color: #333; }
        #mediaModal .form-control:focus {
          background: #0d0d0d; border-color: #8c7a5b; color: #e8e8e8;
          box-shadow: 0 0 0 2px rgba(140,122,91,0.12); outline: none;
        }
        #mediaModal .form-control-muted {
          background: #0a0a0a; border: 1px solid #1e1e1e; color: #bbb;
          font-size: 0.8rem; padding: 0.32rem 0.65rem; border-radius: 6px;
          transition: border-color 0.2s; width: 100%;
        }
        #mediaModal .form-control-muted::placeholder { color: #3a3a3a; }
        #mediaModal .form-control-muted:focus {
          background: #0a0a0a; border-color: #444; color: #ccc;
          box-shadow: none; outline: none;
        }
        #mediaModal textarea.form-control-muted { resize: none; }

        /* Nascondi frecce default degli input number */
        #mediaModal input[type=number]::-webkit-inner-spin-button,
        #mediaModal input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        #mediaModal input[type=number] { -moz-appearance: textfield; }

        /* PILLS */
        #mediaModal .pill-btn {
          border: 1px solid #252525; color: #777; background: #0d0d0d;
          border-radius: 20px; font-size: 0.62rem; padding: 0.24rem 0.55rem;
          white-space: nowrap; transition: all 0.2s ease;
          display: flex; align-items: center; gap: 5px; flex: 1; justify-content: center;
        }
        #mediaModal .pill-btn i { font-size: 0.75rem; }
        #mediaModal .pill-btn:hover { border-color: #444; color: #bbb; }
        #mediaModal .pill-btn.active {
          background: #8c7a5b; color: #0f0f0f; border-color: #8c7a5b;
          box-shadow: 0 0 8px rgba(140,122,91,0.35); transform: scale(1.03); font-weight: 600;
        }
        #mediaModal .pill-row { display: flex; gap: 6px; width: 100%; }

        /* COUNTER */
        #mediaModal .vd-counter { display: flex; align-items: center; gap: 5px; }
        #mediaModal .vd-counter input { text-align: center; flex: 1; }
        #mediaModal .btn-counter {
          width: 28px; height: 28px; padding: 0; border: 1px solid #252525;
          background: #0d0d0d; color: #777; border-radius: 5px; font-size: 1rem;
          line-height: 1; flex-shrink: 0; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        #mediaModal .btn-counter:hover { border-color: #8c7a5b; color: #8c7a5b; }
        #mediaModal .btn-counter.at-max {
          opacity: 0.18;
          cursor: default;
          pointer-events: none;
        }
        #mediaModal .btn-counter.at-min {
          opacity: 0.18;
          cursor: default;
          pointer-events: none;
        }

        /* VISTO IL — griglia 3 colonne con label centrate */
        #mediaModal .visto-grid {
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;
        }
        #mediaModal .visto-col { display: flex; flex-direction: column; gap: 4px; }
        #mediaModal .visto-col-label {
          font-size: 0.54rem; letter-spacing: 0.08em; text-transform: uppercase;
          color: #555; text-align: center;
        }

        /* TOGGLE DATI MANUALI */
        #mediaModal .section-advanced-toggle {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: #333; cursor: pointer; padding: 0.45rem 0;
          border-top: 1px dashed #1e1e1e; margin-top: 0.25rem;
          user-select: none; transition: color 0.2s;
          background: none; border-left: none; border-right: none; border-bottom: none;
          width: 100%;
        }
        #mediaModal .section-advanced-toggle:hover { color: #666; }
        #mediaModal .section-advanced-toggle:hover .toggle-icon { border-color: #8c7a5b; color: #8c7a5b; }
        #mediaModal .toggle-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 16px; height: 16px; border: 1px solid #2a2a2a; border-radius: 4px;
          font-size: 0.65rem; color: #333; transition: all 0.25s ease; flex-shrink: 0;
          line-height: 1;
        }
        #mediaModal .section-advanced-toggle.open .toggle-icon {
          border-color: #8c7a5b; color: #8c7a5b;
          background: rgba(140,122,91,0.08); transform: rotate(180deg);
        }
        #mediaModal .section-advanced-body {
          overflow: hidden; max-height: 0;
          transition: max-height 0.3s ease, opacity 0.3s ease; opacity: 0;
        }
        #mediaModal .section-advanced-body.open { max-height: 120px; opacity: 1; }
        #mediaModal .advanced-note {
          font-size: 0.58rem; color: #333; margin-bottom: 0.45rem;
          font-style: italic; text-align: center;
        }

        /* FOOTER */
        #mediaModal .btn-cancel {
          background: transparent; border: 1px solid #2a2a2a; color: #666;
          font-size: 0.75rem; padding: 0.32rem 1.2rem; border-radius: 6px; transition: all 0.2s;
        }
        #mediaModal .btn-cancel:hover { border-color: #555; color: #aaa; }
        #mediaModal .btn-save {
          background: #8c7a5b; border: none; color: #0f0f0f; font-weight: 700;
          font-size: 0.75rem; padding: 0.32rem 1.4rem; border-radius: 6px;
          letter-spacing: 0.04em; transition: all 0.2s;
        }
        #mediaModal .btn-save:hover { background: #a08e6e; box-shadow: 0 0 10px rgba(140,122,91,0.3); }
        #mediaModal .btn-close { filter: invert(0.5); width: 0.7em; height: 0.7em; }
      </style>

      <div class="modal fade" id="mediaModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">

            <div class="modal-header border-0 justify-content-center position-relative">
              <h5 id="mediaModalTitle" class="modal-title"></h5>
              <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

              <!-- ● OBBLIGATORI -->
              <div class="section-required">
                <div class="section-label section-label-req">Obbligatori</div>

                <div class="vd-field">
                  <label class="vd-label">Titolo</label>
                  <input id="mediaTitle" class="form-control" placeholder="Es. Inception" />
                </div>

                <div class="vd-field">
                  <label class="vd-label">Tipo</label>
                  <div id="mediaTypePills" class="pill-row">
                    ${this.renderPill("film", "Film", "bi-film")}
                    ${this.renderPill("serie", "Serie", "bi-tv")}
                    ${this.renderPill("anime", "Anime", "bi-play-circle")}
                    ${this.renderPill("standup", "Stand-up", "bi-mic")}
                  </div>
                </div>

                <div class="vd-field mb-0">
                  <label class="vd-label">Stato</label>
                  <div id="mediaStatusPills" class="pill-row">
                    ${this.renderPill("completed", "Visto", "bi-check")}
                    ${this.renderPill("watching", "In corso", "bi-eye")}
                    ${this.renderPill("recommended", "Consigliati", "bi-star")}
                  </div>
                </div>
              </div>

              <!-- ● FACOLTATIVI -->
              <div class="section-optional">
                <div class="section-label section-label-opt">Facoltativi</div>

                <div class="vd-field-muted">
                  <label class="vd-label-muted"><i class="bi bi-star-fill" style="color:#e8943a; margin-right:5px; font-size:0.6rem;"></i>Rating <span style="color:#2a2a2a;font-size:0.57rem;text-transform:none;letter-spacing:0;">(1–10)</span></label>
                  <div class="vd-counter">
                    <button id="mediaRatingMinus" class="btn-counter">−</button>
                    <input id="mediaRating" type="number" step="0.1" min="1" max="10" class="form-control-muted" placeholder="–" />
                    <button id="mediaRatingPlus" class="btn-counter">+</button>
                  </div>
                </div>

                <!-- Visto il — 3 colonne con +/- per ognuna -->
                <div class="vd-field-muted">
                  <label class="vd-label-muted"><i class="bi bi-eye-fill" style="color:#5a8a5a; margin-right:5px; font-size:0.6rem;"></i>Visto il</label>
                  <div class="visto-grid">
                    <div class="visto-col">
                      <div class="visto-col-label">Giorno</div>
                      <div class="vd-counter">
                        <button id="vistoGiornoMinus" class="btn-counter">−</button>
                        <input id="vistoGiorno" type="number" min="1" max="31" class="form-control-muted" placeholder="–" />
                        <button id="vistoGiornoPlus" class="btn-counter">+</button>
                      </div>
                    </div>
                    <div class="visto-col">
                      <div class="visto-col-label">Mese</div>
                      <div class="vd-counter">
                        <button id="vistoMeseMinus" class="btn-counter">−</button>
                        <input id="vistoMese" type="number" min="1" max="12" class="form-control-muted" placeholder="–" />
                        <button id="vistoMesePlus" class="btn-counter">+</button>
                      </div>
                    </div>
                    <div class="visto-col">
                      <div class="visto-col-label">Anno</div>
                      <div class="vd-counter">
                        <button id="vistoAnnoMinus" class="btn-counter">−</button>
                        <input id="vistoAnno" type="number" min="1900" max="2100" class="form-control-muted" placeholder="–" />
                        <button id="vistoAnnoPlus" class="btn-counter">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Note — larghezza piena -->
                <div class="vd-field-muted mb-0">
                  <label class="vd-label-muted">Note</label>
                  <textarea id="mediaNotes" class="form-control-muted" rows="2"
                            placeholder="Scrivi qualcosa..." style="width:100%;"></textarea>
                </div>
              </div>

              <!-- ▾ DATI MANUALI collassabile -->
              <button type="button" class="section-advanced-toggle" id="advancedToggle">
                <span class="toggle-icon">▾</span>
                Dati manuali
              </button>
              <div class="section-advanced-body" id="advancedBody">
                <div style="padding-top:0.4rem;">
                  <p class="advanced-note">Compila solo se il titolo non è presente su TMDB</p>
                  <div class="vd-field-muted mb-0">
                    <label class="vd-label-muted">Anno uscita</label>
                    <div class="vd-counter">
                      <button id="mediaYearMinus" class="btn-counter">−</button>
                      <input id="mediaYear" type="number" min="1900" max="2100" class="form-control-muted" placeholder="–" />
                      <button id="mediaYearPlus" class="btn-counter">+</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

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
    return `<button type="button" class="pill-btn" data-value="${value}"><i class="bi ${icon}"></i><span>${label}</span></button>`;
  }

  initLogic() {
    this._modal = new bootstrap.Modal(this.querySelector("#mediaModal"));
    this._currentId = null;
    this._selectedType = null;
    this._selectedStatus = null;

    const toggle = this.querySelector("#advancedToggle");
    const body = this.querySelector("#advancedBody");
    toggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
    });

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

    const setupCounter = (
      inputId,
      minusId,
      plusId,
      min,
      max,
      step,
      defaultVal,
    ) => {
      const input = this.querySelector(inputId);
      const minus = this.querySelector(minusId);
      const plus = this.querySelector(plusId);
      const startVal = defaultVal !== undefined ? defaultVal : min;

      const updatePlusState = () => {
        const val = parseFloat(input.value);
        plus.classList.toggle("at-max", !isNaN(val) && val >= max);
        minus.classList.toggle("at-min", !isNaN(val) && val <= min);
      };

      minus.addEventListener("click", () => {
        let v = parseFloat(input.value || startVal);
        input.value = Math.max(min, parseFloat((v - step).toFixed(2)));
        updatePlusState();
      });
      plus.addEventListener("click", () => {
        let v = parseFloat(input.value || startVal);
        input.value = Math.min(max, parseFloat((v + step).toFixed(2)));
        updatePlusState();
      });
      input.addEventListener("input", updatePlusState);
    };

    const currentYear = new Date().getFullYear();
    setupCounter(
      "#mediaRating",
      "#mediaRatingMinus",
      "#mediaRatingPlus",
      1,
      10,
      0.1,
    );
    setupCounter(
      "#mediaYear",
      "#mediaYearMinus",
      "#mediaYearPlus",
      1900,
      currentYear,
      1,
    );
    setupCounter(
      "#vistoAnno",
      "#vistoAnnoMinus",
      "#vistoAnnoPlus",
      1900,
      currentYear,
      1,
      currentYear,
    );
    setupCounter("#vistoMese", "#vistoMeseMinus", "#vistoMesePlus", 1, 12, 1);
    setupCounter(
      "#vistoGiorno",
      "#vistoGiornoMinus",
      "#vistoGiornoPlus",
      1,
      31,
      1,
    );

    this.querySelector("#mediaSave").addEventListener("click", () => {
      const title = this.querySelector("#mediaTitle").value.trim();
      const rating = this.querySelector("#mediaRating").value || null;
      const year = this.querySelector("#mediaYear").value || null;
      const notes = this.querySelector("#mediaNotes").value || null;

      const vistoAnno = this.querySelector("#vistoAnno").value.trim();
      const vistoMese = this.querySelector("#vistoMese").value.trim();
      const vistoGiorno = this.querySelector("#vistoGiorno").value.trim();
      let visto_il = null;
      if (vistoAnno) {
        visto_il = vistoAnno;
        if (vistoMese) {
          visto_il += "-" + vistoMese.padStart(2, "0");
          if (vistoGiorno) visto_il += "-" + vistoGiorno.padStart(2, "0");
        }
      }

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
        visto_il,
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
    [
      "#mediaTitle",
      "#mediaRating",
      "#mediaYear",
      "#mediaNotes",
      "#vistoAnno",
      "#vistoMese",
      "#vistoGiorno",
    ].forEach((id) => {
      this.querySelector(id).value = "";
    });
    this._selectedType = null;
    this._selectedStatus = null;
    ["mediaTypePills", "mediaStatusPills"].forEach((id) => {
      this.querySelectorAll(`#${id} .pill-btn`).forEach((b) =>
        b.classList.remove("active"),
      );
    });
    this.querySelector("#advancedBody").classList.remove("open");
    this.querySelector("#advancedToggle").classList.remove("open");
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

    const vistoParts = (item.visto_il || "").split("-");
    this.querySelector("#vistoAnno").value = vistoParts[0] || "";
    this.querySelector("#vistoMese").value = vistoParts[1]
      ? parseInt(vistoParts[1])
      : "";
    this.querySelector("#vistoGiorno").value = vistoParts[2]
      ? parseInt(vistoParts[2])
      : "";
    // Aggiorna stato at-max sul + anno dopo il caricamento
    this.querySelector("#vistoAnno").dispatchEvent(new Event("input"));

    if (item.year) {
      this.querySelector("#advancedBody").classList.add("open");
      this.querySelector("#advancedToggle").classList.add("open");
    }

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
