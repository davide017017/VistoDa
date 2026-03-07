class VdFilters extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="mb-4 d-flex flex-column gap-3">

        <!-- FILTRO TIPO -->
        <div id="typeFilters"
            class="d-flex w-100 gap-2 overflow-auto"
            style="
              flex-wrap:nowrap;
              scrollbar-width:none;
              -ms-overflow-style:none;
            ">
          ${this.renderPill("all", "", "bi-grid")}
          ${this.renderPill("film", "Film", "bi-film")}
          ${this.renderPill("serie", "Serie", "bi-tv")}
          ${this.renderPill("anime", "Anime", "bi-play-circle")}
          ${this.renderPill("standup", "Stand-up", "bi-mic")}
        </div>

        <!-- FILTRO STATO -->
        <div id="statusFilters" class="d-flex w-100 gap-2">
          ${this.renderPill("all", "", "bi-grid")}
          ${this.renderPill("completed", "Visti", "bi-check")}
          ${this.renderPill("watching", "In corso", "bi-eye")}
          ${this.renderPill("recommended", "Consigliati", "bi-star")}
        </div>

      </div>
    `;

    let selectedType = "all";
    let selectedStatus = "all";

    const handlePills = (containerId, setter) => {
      this.querySelectorAll(`#${containerId} .pill-btn`).forEach((btn) => {
        btn.addEventListener("click", () => {
          this.querySelectorAll(`#${containerId} .pill-btn`).forEach((b) => {
            this.resetPill(b);
          });

          this.activatePill(btn);
          setter(btn.dataset.value);
          emit();
        });
      });
    };

    handlePills("typeFilters", (val) => (selectedType = val));
    handlePills("statusFilters", (val) => (selectedStatus = val));

    const emit = () => {
      this.dispatchEvent(
        new CustomEvent("filters-change", {
          detail: {
            type: selectedType,
            status: selectedStatus,
          },
          bubbles: true,
        }),
      );
    };

    // Attiva default
    this.activatePill(this.querySelector(`#typeFilters [data-value="all"]`));
    this.activatePill(this.querySelector(`#statusFilters [data-value="all"]`));
  }

  renderPill(value, label, icon) {
    return `
    <button type="button"
            class="pill-btn btn d-flex align-items-center justify-content-center rounded-pill"
            data-value="${value}"
            style="
              flex: 0 0 auto;
              border:1px solid #2a2a2a;
              background:#141414;
              color:#aaa;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
              transition: all 0.25s ease;
              font-size:0.85rem;
              padding:0.4rem 0.6rem;
            ">
          <i class="bi ${icon}" style="font-size:0.85rem; flex-shrink:0;"></i>
          ${label ? `<span style="margin-left:0.4rem; overflow:hidden; text-overflow:ellipsis;">${label}</span>` : ""}
      </button>
    `;
  }

  activatePill(btn) {
    btn.style.background = "#8c7a5b";
    btn.style.color = "#0f0f0f";
    btn.style.border = "1px solid #8c7a5b";
    btn.style.boxShadow = "0 0 8px rgba(140,122,91,0.5)";
    btn.style.transform = "scale(1.03)";
  }

  resetPill(btn) {
    btn.style.background = "#141414";
    btn.style.color = "#aaa";
    btn.style.border = "1px solid #2a2a2a";
    btn.style.boxShadow = "none";
    btn.style.transform = "scale(1)";
  }
}

customElements.define("vd-filters", VdFilters);
