class VdFilters extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="mb-1 d-flex flex-column gap-2">

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

        <!-- SORT BUTTONS -->
       <div class="d-flex align-items-center justify-content-center" style="gap:0.3rem;">

        <button type="button" class="sort-btn" data-sort="default"
          style="display:flex; align-items:center; justify-content:center; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; width:52px; height:22px; font-size:0.7rem; cursor:pointer; transition:all 0.2s ease;">
          <i class="bi bi-clock" style="font-size:0.7rem;"></i>
        </button>

        <span style="width:1px; height:14px; background:#2a2a2a; margin:0 0.3rem;"></span>

        <button type="button" class="sort-btn" data-sort="rating_desc"
          style="display:flex; align-items:center; justify-content:center; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:0 1.3rem; height:22px; font-size:0.7rem; cursor:pointer; transition:all 0.2s ease;">
          <i class="bi bi-star" style="font-size:0.65rem;"></i>
          <i class="bi bi-arrow-down" style="font-size:0.6rem;"></i>
        </button>

        <button type="button" class="sort-btn" data-sort="rating_asc"
          style="display:flex; align-items:center; justify-content:center; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:0 1.3rem; height:22px; font-size:0.7rem; cursor:pointer; transition:all 0.2s ease;">
          <i class="bi bi-star" style="font-size:0.65rem;"></i>
          <i class="bi bi-arrow-up" style="font-size:0.6rem;"></i>
        </button>

        <span style="width:1px; height:14px; background:#2a2a2a; margin:0 0.3rem;"></span>

        <button type="button" class="sort-btn" data-sort="year_desc"
          style="display:flex; align-items:center; justify-content:center; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:0 1.3rem; height:22px; font-size:0.7rem; cursor:pointer; transition:all 0.2s ease;">
          <i class="bi bi-calendar" style="font-size:0.65rem;"></i>
          <i class="bi bi-arrow-down" style="font-size:0.6rem;"></i>
        </button>

        <button type="button" class="sort-btn" data-sort="year_asc"
          style="display:flex; align-items:center; justify-content:center; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:0 1.3rem; height:22px; font-size:0.7rem; cursor:pointer; transition:all 0.2s ease;">
          <i class="bi bi-calendar" style="font-size:0.65rem;"></i>
          <i class="bi bi-arrow-up" style="font-size:0.6rem;"></i>
        </button>

      </div>

      </div>
    `;

    let selectedType = "all";
    let selectedStatus = "all";
    let selectedSort = "default";
    let searchQuery = "";

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

    // SORT BUTTONS
    this.querySelectorAll(".sort-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.querySelectorAll(".sort-btn").forEach((b) => this.resetSortBtn(b));
        this.activateSortBtn(btn);
        selectedSort = btn.dataset.sort;
        emit();
      });
    });

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
            sort: selectedSort,
          },
          bubbles: true,
        }),
      );
    };

    // Attiva default
    this.activatePill(this.querySelector(`#typeFilters [data-value="all"]`));
    this.activatePill(this.querySelector(`#statusFilters [data-value="all"]`));
    this.activateSortBtn(this.querySelector(`.sort-btn[data-sort="default"]`));
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

  activateSortBtn(btn) {
    btn.style.background = "#1e1a14";
    btn.style.color = "#e8c87a";
    btn.style.border = "1px solid #8c7a5b";
    btn.style.boxShadow = "0 0 6px rgba(140,122,91,0.3)";
  }

  resetSortBtn(btn) {
    btn.style.background = "#141414";
    btn.style.color = "#aaa";
    btn.style.border = "1px solid #2a2a2a";
    btn.style.boxShadow = "none";
  }
}

customElements.define("vd-filters", VdFilters);
