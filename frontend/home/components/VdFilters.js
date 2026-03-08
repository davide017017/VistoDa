class VdFilters extends HTMLElement {
  // ─── VARIABILI DIMENSIONI PILL ────────────────────────────
  static PILL = {
    height: "18px",
    heightLarge: "26px", // pill tipo/stato più grandi
    paddingX: "0.3rem",
    paddingSort: "0 0.4rem",
    widthDefault: "34px",
    fontSize: "0.6rem",
    fontSizeLarge: "0.72rem", // font pill tipo/stato
    iconSize: "0.9rem",
    iconSizeLarge: "1rem", // icone pill tipo/stato
    sortIconSize: "0.65rem",
    gap: "0.22rem",
  };
  // ─────────

  // ─── COLORI PER GRUPPO ────────────────────────────────────
  static COLOR = {
    default: "#e8c87a",
    rating: "#e8943a",
    tmdb: "#01b4e4",
    year: "#8c6a3f",
    mismatch: "#e85a3a",
    visto: "#5a8a5a",
  };
  // ─────────────────────────────────────────────────────────

  connectedCallback() {
    const P = VdFilters.PILL;
    const C = VdFilters.COLOR;

    this.innerHTML = `
      <div class="mb-1 d-flex flex-column gap-2">

        <!-- FILTRO TIPO — full width, pill uguali -->
        <div id="typeFilters" class="d-flex w-100" style="gap:6px;">
          ${this.renderPillLarge("all", "", "bi-grid")}
          ${this.renderPillLarge("film", "Film", "bi-film")}
          ${this.renderPillLarge("serie", "Serie", "bi-tv")}
          ${this.renderPillLarge("anime", "Anime", "bi-play-circle")}
          ${this.renderPillLarge("standup", "Stand-up", "bi-mic")}
        </div>

        <!-- FILTRO STATO — full width, pill uguali -->
        <div id="statusFilters" class="d-flex w-100" style="gap:6px;">
          ${this.renderPillLarge("all", "", "bi-grid")}
          ${this.renderPillLarge("completed", "Visti", "bi-check")}
          ${this.renderPillLarge("watching", "In corso", "bi-eye")}
          ${this.renderPillLarge("recommended", "Consigliati", "bi-star")}
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
            style="background:#141414; border:1px solid #2a2a2a; color:#ccc; border-radius:999px; padding-left:2.2rem; padding-right:2.2rem; font-size:0.85rem;"
          />
          <i class="bi bi-x position-absolute" id="searchClear"
            style="right:0.75rem; top:50%; transform:translateY(-50%); color:#555; font-size:2rem; cursor:pointer; display:none; transition:color 0.2s;"
            onmouseover="this.style.color='#ccc'"
            onmouseout="this.style.color='#555'"
          ></i>
        </div>

        <!-- SORT BUTTONS -->
        <div class="d-flex align-items-center" style="gap:${P.gap}; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; padding-bottom:2px;">

          <!-- Default -->
          <button type="button" class="sort-btn" data-sort="default" data-color="${C.default}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; width:${P.widthDefault}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-clock" style="font-size:${P.sortIconSize};"></i>
          </button>

          <span style="width:1px; height:14px; background:#2a2a2a; margin:0 0.2rem; flex-shrink:0;"></span>

          <!-- Rating nostro -->
          <button type="button" class="sort-btn" data-sort="rating_desc" data-color="${C.rating}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-star" style="font-size:${P.sortIconSize}; color:${C.rating};"></i>
            <i class="bi bi-arrow-down" style="font-size:${P.sortIconSize};"></i>
          </button>

          <button type="button" class="sort-btn" data-sort="rating_asc" data-color="${C.rating}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-star" style="font-size:${P.sortIconSize}; color:${C.rating};"></i>
            <i class="bi bi-arrow-up" style="font-size:${P.sortIconSize};"></i>
          </button>

          <!-- Rating TMDB -->
          <button type="button" class="sort-btn" data-sort="tmdb_rating_desc" data-color="${C.tmdb}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.15rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <span class="sort-btn-label" style="display:inline-flex; align-items:center; gap:0.15rem;">
              <i class="bi bi-camera-video" style="font-size:${P.sortIconSize}; color:${C.tmdb}; flex-shrink:0;"></i>
              <i class="bi bi-arrow-down" style="font-size:${P.sortIconSize};"></i>
            </span>
          </button>

          <button type="button" class="sort-btn" data-sort="tmdb_rating_asc" data-color="${C.tmdb}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.15rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <span class="sort-btn-label" style="display:inline-flex; align-items:center; gap:0.15rem;">
              <i class="bi bi-camera-video" style="font-size:${P.sortIconSize}; color:${C.tmdb}; flex-shrink:0;"></i>
              <i class="bi bi-arrow-up" style="font-size:${P.sortIconSize};"></i>
            </span>
          </button>

          <span style="width:1px; height:14px; background:#2a2a2a; margin:0 0.2rem; flex-shrink:0;"></span>

          <!-- Visto il -->
          <button type="button" class="sort-btn" data-sort="visto_il_desc" data-color="${C.visto}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-eye-fill" style="font-size:${P.sortIconSize}; color:${C.visto};"></i>
            <i class="bi bi-arrow-down" style="font-size:${P.sortIconSize};"></i>
          </button>

          <button type="button" class="sort-btn" data-sort="visto_il_asc" data-color="${C.visto}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-eye-fill" style="font-size:${P.sortIconSize}; color:${C.visto};"></i>
            <i class="bi bi-arrow-up" style="font-size:${P.sortIconSize};"></i>
          </button>

          <span style="width:1px; height:14px; background:#2a2a2a; margin:0 0.2rem; flex-shrink:0;"></span>

          <!-- Anno -->
          <button type="button" class="sort-btn" data-sort="year_desc" data-color="${C.year}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-calendar" style="font-size:${P.sortIconSize}; color:${C.year};"></i>
            <i class="bi bi-arrow-down" style="font-size:${P.sortIconSize};"></i>
          </button>

          <button type="button" class="sort-btn" data-sort="year_asc" data-color="${C.year}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-calendar" style="font-size:${P.sortIconSize}; color:${C.year};"></i>
            <i class="bi bi-arrow-up" style="font-size:${P.sortIconSize};"></i>
          </button>

          <span style="width:1px; height:14px; background:#2a2a2a; margin:0 0.2rem; flex-shrink:0;"></span>

          <!-- Mismatch -->
          <button type="button" class="sort-btn" data-sort="year_mismatch" data-color="${C.mismatch}"
            style="display:flex; align-items:center; justify-content:center; flex-shrink:0; gap:0.1rem; background:#141414; border:1px solid #2a2a2a; color:#aaa; border-radius:999px; padding:${P.paddingSort}; height:${P.height}; font-size:${P.sortIconSize}; cursor:pointer; transition:all 0.2s ease;">
            <i class="bi bi-exclamation-triangle" style="font-size:${P.sortIconSize}; color:${C.mismatch};"></i>
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
          this.querySelectorAll(`#${containerId} .pill-btn`).forEach((b) =>
            this.resetPill(b),
          );
          this.activatePill(btn);
          setter(btn.dataset.value);
          emit();
        });
      });
    };

    handlePills("typeFilters", (val) => (selectedType = val));
    handlePills("statusFilters", (val) => (selectedStatus = val));

    this.querySelectorAll(".sort-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.querySelectorAll(".sort-btn").forEach((b) => this.resetSortBtn(b));
        this.activateSortBtn(btn);
        selectedSort = btn.dataset.sort;
        emit();
      });
    });

    const searchInput = this.querySelector("#searchInput");
    const clearBtn = this.querySelector("#searchClear");

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      clearBtn.style.display = searchQuery ? "block" : "none";
      emit();
    });

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearBtn.style.display = "none";
      searchInput.focus();
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

    this.activatePill(this.querySelector(`#typeFilters [data-value="all"]`));
    this.activatePill(this.querySelector(`#statusFilters [data-value="all"]`));
    this.activateSortBtn(this.querySelector(`.sort-btn[data-sort="default"]`));
  }

  setTmdbSortLoading(loading) {
    const P = VdFilters.PILL;
    const C = VdFilters.COLOR;
    ["tmdb_rating_desc", "tmdb_rating_asc"].forEach((sort) => {
      const btn = this.querySelector(`.sort-btn[data-sort="${sort}"]`);
      if (!btn) return;
      const label = btn.querySelector(".sort-btn-label");
      if (loading) {
        btn.style.pointerEvents = "none";
        if (label)
          label.innerHTML = `<i class="bi bi-hourglass-split" style="font-size:${P.sortIconSize}; color:${C.tmdb};"></i>`;
      } else {
        btn.style.pointerEvents = "auto";
        const arrow =
          sort === "tmdb_rating_desc" ? "bi-arrow-down" : "bi-arrow-up";
        if (label)
          label.innerHTML = `
          <i class="bi bi-camera-video" style="font-size:${P.sortIconSize}; color:${C.tmdb}; flex-shrink:0;"></i>
          <i class="bi ${arrow}" style="font-size:${P.sortIconSize};"></i>
        `;
      }
    });
  }

  // Pill grande per tipo/stato — flex:1 per occupare tutta la larghezza
  renderPillLarge(value, label, icon) {
    const P = VdFilters.PILL;
    const isIconOnly = !label;
    return `
      <button type="button"
              class="pill-btn btn d-flex align-items-center justify-content-center rounded-pill"
              data-value="${value}"
              style="${isIconOnly ? `flex:0 0 ${P.heightLarge}; width:${P.heightLarge};` : "flex:1; min-width:0;"}
                     border:1px solid #2a2a2a; background:#141414; color:#aaa;
                     white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
                     transition:all 0.25s ease; font-size:${P.fontSizeLarge};
                     padding:0.3rem 0.4rem; height:${P.heightLarge};">
        <i class="bi ${icon}" style="font-size:${P.iconSizeLarge}; flex-shrink:0;"></i>
        ${label ? `<span style="margin-left:0.4rem; overflow:hidden; text-overflow:ellipsis;">${label}</span>` : ""}
      </button>
    `;
  }

  // Pill piccola (mantenuta per compatibilità)
  renderPill(value, label, icon) {
    const P = VdFilters.PILL;
    return `
      <button type="button"
              class="pill-btn btn d-flex align-items-center justify-content-center rounded-pill"
              data-value="${value}"
              style="flex:0 0 auto; border:1px solid #2a2a2a; background:#141414; color:#aaa;
                     white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
                     transition:all 0.25s ease; font-size:${P.fontSize};
                     padding:${P.paddingX}; height:${P.height};">
        <i class="bi ${icon}" style="font-size:${P.iconSize}; flex-shrink:0;"></i>
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
    const color = btn.dataset.color || VdFilters.COLOR.default;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    btn.style.background = "#1a1410";
    btn.style.color = color;
    btn.style.border = `1px solid ${color}`;
    btn.style.boxShadow = `0 0 6px rgba(${r},${g},${b},0.4)`;
  }

  resetSortBtn(btn) {
    btn.style.background = "#141414";
    btn.style.color = "#aaa";
    btn.style.border = "1px solid #2a2a2a";
    btn.style.boxShadow = "none";
  }
}

customElements.define("vd-filters", VdFilters);
