class VdCreateModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal fade" id="createModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content"
               style="background:#1a1a1a; color:#eaeaea; border:1px solid #2a2a2a;">

            <!-- HEADER -->
            <div class="modal-header border-0 justify-content-center position-relative">
              <h5 class="modal-title text-center w-100"
                  style="color:#e6d5b8;">
                Crea Media
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
                <input id="createTitle"
                       class="form-control"
                       style="background:#141414; border:1px solid #2a2a2a; color:#eaeaea;"
                       placeholder="Es. Inception" />
              </div>

              <!-- TIPO -->
              <div class="mb-3">
                <label class="form-label">
                  Tipo <small class="text-secondary">(obbligatorio)</small>
                </label>
                <div id="typePills" class="d-flex w-100 gap-2">
                  ${this.renderPill("film", "Film", "bi-film")}
                  ${this.renderPill("serie", "Serie", "bi-tv")}
                  ${this.renderPill("anime", "Anime", "bi-play-circle")}
                </div>
              </div>

              <!-- STATUS -->
              <div class="mb-3">
                <label class="form-label">
                  Stato <small class="text-secondary">(obbligatorio)</small>
                </label>
                <div id="statusPills" class="d-flex w-100 gap-2">
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
                    <button id="ratingMinus"
                            class="btn btn-outline-secondary w-100">−</button>
                  </div>

                  <div class="col">
                    <input id="createRating"
                           type="number"
                           step="0.1"
                           min="1"
                           max="10"
                           class="form-control text-center"
                           style="background:#141414; border:1px solid #2a2a2a; color:#eaeaea;"
                           placeholder="-" />
                  </div>

                  <div class="col">
                    <button id="ratingPlus"
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
                    <button id="yearMinus"
                            class="btn btn-outline-secondary w-100">−</button>
                  </div>

                  <div class="col">
                    <input id="createYear"
                           type="number"
                           min="1900"
                           max="2100"
                           class="form-control text-center"
                           style="background:#141414; border:1px solid #2a2a2a; color:#eaeaea;"
                           placeholder="-" />
                  </div>

                  <div class="col">
                    <button id="yearPlus"
                            class="btn btn-outline-secondary w-100">+</button>
                  </div>
                </div>
              </div>

              <!-- NOTE -->
              <div class="mb-3">
                <label class="form-label">
                  Note <small class="text-secondary">(facoltativo)</small>
                </label>
                <textarea id="createNotes"
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
                      id="createSave"
                      class="btn px-4"
                      style="background-color:#8c7a5b; color:#0f0f0f; font-weight:600;">
                Salva
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
    const modalEl = this.querySelector("#createModal");
    const modal = new bootstrap.Modal(modalEl);

    document.addEventListener("open-create-modal", () => modal.show());

    let selectedType = null;
    let selectedStatus = null;

    const handlePills = (containerId, setter) => {
      this.querySelectorAll(`#${containerId} .pill-btn`).forEach((btn) => {
        btn.addEventListener("click", () => {
          this.querySelectorAll(`#${containerId} .pill-btn`).forEach((b) => {
            b.style.background = "#141414";
            b.style.color = "#aaa";
            b.style.border = "1px solid #2a2a2a";
            b.style.boxShadow = "none";
            b.style.transform = "scale(1)";
          });

          btn.style.background = "#8c7a5b";
          btn.style.color = "#0f0f0f";
          btn.style.border = "1px solid #8c7a5b";
          btn.style.boxShadow = "0 0 8px rgba(140,122,91,0.5)";
          btn.style.transform = "scale(1.03)";

          setter(btn.dataset.value);
        });
      });
    };

    handlePills("typePills", (val) => (selectedType = val));
    handlePills("statusPills", (val) => (selectedStatus = val));

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

    setupCounter("#createRating", "#ratingMinus", "#ratingPlus", 1, 10, 0.5);
    setupCounter("#createYear", "#yearMinus", "#yearPlus", 1900, 2100, 1);

    this.querySelector("#createSave").addEventListener("click", () => {
      const title = this.querySelector("#createTitle").value.trim();
      const rating = this.querySelector("#createRating").value || null;
      const year = this.querySelector("#createYear").value || null;
      const notes = this.querySelector("#createNotes").value || null;

      if (!title || !selectedType || !selectedStatus) {
        alert("Compila tutti i campi obbligatori");
        return;
      }

      document.dispatchEvent(
        new CustomEvent("create-media", {
          detail: {
            title,
            type: selectedType,
            status: selectedStatus,
            year: year ? parseInt(year) : null,
            rating: rating ? parseFloat(rating) : null,
            notes,
          },
          bubbles: true,
        }),
      );

      modal.hide();
    });
  }
}

customElements.define("vd-create-modal", VdCreateModal);
