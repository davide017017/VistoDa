class VdMediaModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal fade" id="mediaModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content"
               style="background:#1a1a1a; color:#eaeaea; border:1px solid #2a2a2a;">

            <!-- HEADER -->
            <div class="modal-header border-0 justify-content-center position-relative">
              <h5 id="mediaModalTitle" class="modal-title text-center w-100"
                  style="color:#e6d5b8;">
              </h5>
              <button type="button"
                      class="btn-close btn-close-white position-absolute end-0 me-3"
                      data-bs-dismiss="modal">
              </button>
            </div>

            <div class="modal-body">

              <!-- TITOLO -->
              <div class="mb-3">
                <label class="form-label">
                  Titolo <small class="text-secondary">(obbligatorio)</small>
                </label>
                <input id="mediaTitle"
                       class="form-control"
                       style="background:#141414; border:1px solid #2a2a2a; color:#eaeaea;"
                       placeholder="Es. Inception" />
              </div>

              <!-- TIPO -->
              <div class="mb-3">
                <label class="form-label">
                  Tipo <small class="text-secondary">(obbligatorio)</small>
                </label>
                <div id="mediaTypePills" class="d-flex w-100 gap-2">
                  ${this.renderPill("film", "Film", "bi-film")}
                  ${this.renderPill("serie", "Serie", "bi-tv")}
                  ${this.renderPill("anime", "Anime", "bi-play-circle")}
                  ${this.renderPill("standup", "Stand-up", "bi-mic")}
                </div>
              </div>

              <!-- STATUS -->
              <div class="mb-3">
                <label class="form-label">
                  Stato <small class="text-secondary">(obbligatorio)</small>
                </label>
                <div id="mediaStatusPills" class="d-flex w-100 gap-2">
                  ${this.renderPill("completed", "Visto", "bi-check")}
                  ${this.renderPill("watching", "In corso", "bi-eye")}
                  ${this.renderPill("recommended", "Consigliati", "bi-star")}
                </div>
              </div>

              <!-- RATING -->
              <div class="mb-3">
                <label class="form-label">
                  Rating (1–10) <small class="text-secondary">(facoltativo)</small>
                </label>
                <div class="row g-2 text-center">
                  <div class="col">
                    <button id="mediaRatingMinus"
                            class="btn btn-outline-secondary w-100">−</button>
                  </div>
                  <div class="col">
                    <input id="mediaRating"
                           type="number"
                           step="0.1"
                           min="1"
                           max="10"
                           class="form-control text-center"
                           style="background:#141414; border:1px solid #2a2a2a; color:#eaeaea;"
                           placeholder="-" />
                  </div>
                  <div class="col">
                    <button id="mediaRatingPlus"
                            class="btn btn-outline-secondary w-100">+</button>
                  </div>
                </div>
              </div>

              <!-- ANNO -->
              <div class="mb-3">
                <label class="form-label">
                  Anno <small class="text-secondary">(facoltativo)</small>
                </label>
                <div class="row g-2 text-center">
                  <div class="col">
                    <button id="mediaYearMinus"
                            class="btn btn-outline-secondary w-100">−</button>
                  </div>
                  <div class="col">
                    <input id="mediaYear"
                           type="number"
                           min="1900"
                           max="2100"
                           class="form-control text-center"
                           style="background:#141414; border:1px solid #2a2a2a; color:#eaeaea;"
                           placeholder="-" />
                  </div>
                  <div class="col">
                    <button id="mediaYearPlus"
                            class="btn btn-outline-secondary w-100">+</button>
                  </div>
                </div>
              </div>

              <!-- NOTE -->
              <div class="mb-3">
                <label class="form-label">
                  Note <small class="text-secondary">(facoltativo)</small>
                </label>
                <textarea id="mediaNotes"
                          class="form-control"
                          rows="3"
                          style="background:#141414; border:1px solid #2a2a2a; color:#eaeaea;"
                          placeholder="Scrivi qualcosa..."></textarea>
              </div>

            </div>

            <!-- FOOTER -->
            <div class="modal-footer border-0 justify-content-center">
              <button type="button"
                      class="btn btn-outline-secondary px-4"
                      data-bs-dismiss="modal">
                Annulla
              </button>
              <button type="button"
                      id="mediaSave"
                      class="btn px-4"
                      style="background-color:#8c7a5b; color:#0f0f0f; font-weight:600;">
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    this.initLogic();
  }

  renderPill(value, label, icon) {
    return `
      <button type="button"
              class="pill-btn btn flex-fill d-flex align-items-center justify-content-center gap-2 rounded-pill"
              data-value="${value}"
              style="
                border:1px solid #2a2a2a;
                color:#aaa;
                background:#141414;
                white-space:nowrap;
                transition: all 0.25s ease;
              ">
        <i class="bi ${icon}" style="font-size:0.9rem;"></i>
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
        let value = parseFloat(input.value || min || 0);
        value = Math.max(min, value - step);
        input.value = value;
      });

      plus.addEventListener("click", () => {
        let value = parseFloat(input.value || min || 0);
        value = Math.min(max, value + step);
        input.value = value;
      });
    };

    setupCounter("#mediaRating", "#mediaRatingMinus", "#mediaRatingPlus", 1, 10, 0.5);
    setupCounter("#mediaYear", "#mediaYearMinus", "#mediaYearPlus", 1900, 2100, 1);

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
        document.dispatchEvent(new CustomEvent("edit-media", { detail, bubbles: true }));
      } else {
        document.dispatchEvent(new CustomEvent("create-media", { detail, bubbles: true }));
      }

      this._modal.hide();
    });
  }

  _selectPill(containerId, activeBtn) {
    this.querySelectorAll(`#${containerId} .pill-btn`).forEach((b) => {
      b.style.background = "#141414";
      b.style.color = "#aaa";
      b.style.border = "1px solid #2a2a2a";
      b.style.boxShadow = "none";
      b.style.transform = "scale(1)";
    });
    activeBtn.style.background = "#8c7a5b";
    activeBtn.style.color = "#0f0f0f";
    activeBtn.style.border = "1px solid #8c7a5b";
    activeBtn.style.boxShadow = "0 0 8px rgba(140,122,91,0.5)";
    activeBtn.style.transform = "scale(1.03)";
  }

  _resetFields() {
    this.querySelector("#mediaTitle").value = "";
    this.querySelector("#mediaRating").value = "";
    this.querySelector("#mediaYear").value = "";
    this.querySelector("#mediaNotes").value = "";
    this._selectedType = null;
    this._selectedStatus = null;
    ["mediaTypePills", "mediaStatusPills"].forEach((id) => {
      this.querySelectorAll(`#${id} .pill-btn`).forEach((b) => {
        b.style.background = "#141414";
        b.style.color = "#aaa";
        b.style.border = "1px solid #2a2a2a";
        b.style.boxShadow = "none";
        b.style.transform = "scale(1)";
      });
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

    const typeBtn = this.querySelector(`#mediaTypePills [data-value="${item.type}"]`);
    if (typeBtn) this._selectPill("mediaTypePills", typeBtn);

    const statusBtn = this.querySelector(`#mediaStatusPills [data-value="${item.status}"]`);
    if (statusBtn) this._selectPill("mediaStatusPills", statusBtn);

    this._modal.show();
  }
}

customElements.define("vd-media-modal", VdMediaModal);
