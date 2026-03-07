class VdFilters extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="mb-4 d-flex flex-column gap-2">

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

        <!-- SEARCH BAR -->
          <div class="position-relative mb-1">
            <i class="bi bi-search position-absolute"
              style="left:0.75rem; top:50%; transform:translateY(-50%); color:#555; font-size:0.85rem;"></i>
            <input
              id="searchInput"
              type="text"
              placeholder="Cerca..."
              class="form-control"
              style="
                background:#141414;
                border:1px solid #2a2a2a;
                color:#ccc;
                border-radius:999px;
                padding-left:2.2rem;
                font-size:0.85rem;
              "
            />
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

    let searchQuery = "";

    this.querySelector("#searchInput").addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      emit();
    });

    const emit = () => {
      this.dispatchEvent(
        new CustomEvent("filters-change", {
          detail: {
            type: selectedType,
            status: selectedStatus,
            search: searchQuery,
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
              font-size:0.65rem;
              padding:0.25rem 0.5rem;
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
