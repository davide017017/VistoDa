import { fetchTmdbInfo } from "../../shared/infoService.js";
import { updateMedia } from "../services/mediaService.js";

// Cache in memoria: "title::type" → { posterUrl, year, rating } | null
const posterCache = new Map();

class VdMediaList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="list-group" id="mediaContainer"></div>

      <!-- Modal placeholder -->
      <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content" style="background:#1a1a1a; color:#eaeaea;">
            <div class="modal-header border-0">
              <h5 class="modal-title">Edit Media (Placeholder)</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              Qui andrà la modale di modifica.
            </div>
          </div>
        </div>
      </div>
    `;

    this._posterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          this._posterObserver.unobserve(img);
          this._loadPosterAndYear(img);
        });
      },
      { rootMargin: "100px" },
    );
  }

  async _loadPosterAndYear(img) {
    const { title, type } = img.dataset;
    const cacheKey = `${title}::${type}`;

    let info;
    if (posterCache.has(cacheKey)) {
      info = posterCache.get(cacheKey);
    } else {
      const result = await fetchTmdbInfo({ title, type });
      info = result
        ? {
            posterUrl: result.posterUrl || null,
            year: result.year || null,
            rating: result.rating || null,
          }
        : null;
      posterCache.set(cacheKey, info);
    }

    if (!info) return;

    if (info.posterUrl) this._showPoster(img, info.posterUrl);

    const row = img.closest(".list-group-item");
    if (!row) return;

    if (info.year) {
      const dbYear = parseInt(row.dataset.year) || null;
      this._renderYearDiff(row, dbYear, info.year);
    }

    if (info.rating) {
      this._renderTmdbRating(row, info.rating);
      this.dispatchEvent(
        new CustomEvent("tmdb-rating-loaded", {
          detail: { id: row.dataset.id, tmdbRating: info.rating },
          bubbles: true,
        }),
      );
    }
  }

  async fetchAllTmdbInfo(items) {
    await Promise.all(
      items.map(async (item) => {
        const cacheKey = `${item.title}::${item.type}`;
        if (posterCache.has(cacheKey)) return;
        const result = await fetchTmdbInfo({
          title: item.title,
          type: item.type,
        });
        const info = result
          ? {
              posterUrl: result.posterUrl || null,
              year: result.year || null,
              rating: result.rating || null,
            }
          : null;
        posterCache.set(cacheKey, info);
        if (info?.rating) {
          this.dispatchEvent(
            new CustomEvent("tmdb-rating-loaded", {
              detail: { id: item.id, tmdbRating: info.rating },
              bubbles: true,
            }),
          );
        }
      }),
    );
  }

  _showPoster(img, url) {
    const thumb = img.closest(".vd-poster-wrap");
    if (!thumb) return;
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = url;
      img.style.opacity = "1";
      thumb.querySelector(".vd-poster-placeholder")?.remove();
    };
    tempImg.src = url;
  }

  _renderTmdbRating(row, tmdbRating) {
    const ratingWrap = row.querySelector(".vd-rating-wrap");
    if (!ratingWrap) return;

    const dbRating = row.dataset.rating ? parseFloat(row.dataset.rating) : null;

    const ourPart = dbRating
      ? `<span>⭐ ${dbRating}</span><span style="color:#444; margin:0 0.1rem;">·</span>`
      : "";

    const tmdbPart = `
      <i class="bi bi-camera-video" style="font-size:0.6rem; color:#01b4e4; flex-shrink:0;"></i>
      <span style="color:#7ab8d4; font-size:0.72rem;">${tmdbRating}</span>
    `;

    ratingWrap.innerHTML =
      ourPart + tmdbPart + `<span style="color:#333;">|</span>`;
  }

  _renderYearDiff(row, dbYear, tmdbYear) {
    const yearWrap = row.querySelector(".vd-year-wrap");
    if (!yearWrap) return;

    if (!dbYear || dbYear === tmdbYear) {
      // Se DB è vuoto ma TMDB ha l'anno → aggiorna automaticamente
      if (!dbYear && tmdbYear) {
        updateMedia(row.dataset.id, { year: tmdbYear })
          .then(() => {
            row.dataset.year = tmdbYear;
            // Aggiorna anche la span statica dell'anno accanto al tipo
            const staticYear = row.querySelector(".vd-static-year");
            if (staticYear) staticYear.textContent = tmdbYear;
          })
          .catch((err) => console.error("Auto-update anno fallito:", err));
      }
      yearWrap.innerHTML = "";
      return;
    }

    this.dispatchEvent(
      new CustomEvent("year-mismatch-found", {
        detail: { id: row.dataset.id },
        bubbles: true,
      }),
    );

    const mediaId = row.dataset.id;
    yearWrap.innerHTML = `
      <span style="color:#333;">|</span>
      <span style="display:inline-flex; align-items:center; gap:0.3rem;">
        <span style="color:#444; text-decoration:line-through; font-size:0.7rem;">${dbYear}</span>
        <span style="color:#e8c87a; font-size:0.75rem;">${tmdbYear}</span>
        <button
          class="vd-year-update-btn"
          data-id="${mediaId}"
          data-year="${tmdbYear}"
          title="Aggiorna anno a ${tmdbYear}"
          style="
            display:inline-flex; align-items:center; justify-content:center;
            background:transparent; border:1px solid #8c7a5b;
            color:#8c7a5b; border-radius:4px;
            width:16px; height:16px; font-size:0.55rem;
            cursor:pointer; padding:0;
            transition: background 0.2s, color 0.2s;
            flex-shrink:0;
          "
          onmouseover="this.style.background='#8c7a5b'; this.style.color='#111';"
          onmouseout="this.style.background='transparent'; this.style.color='#8c7a5b';"
        >
          <i class="bi bi-arrow-repeat"></i>
        </button>
      </span>
    `;

    yearWrap
      .querySelector(".vd-year-update-btn")
      .addEventListener("click", async (e) => {
        e.stopPropagation();
        const btn = e.currentTarget;
        btn.style.pointerEvents = "none";
        btn.innerHTML = `<i class="bi bi-hourglass-split" style="font-size:0.5rem;"></i>`;

        try {
          await updateMedia(mediaId, { year: tmdbYear });
          row.dataset.year = tmdbYear;
          yearWrap.innerHTML = `<span style="color:#333;">|</span><span>${tmdbYear}</span>`;
          const cacheKey = `${row.dataset.title}::${row.dataset.type}`;
          if (posterCache.has(cacheKey))
            posterCache.get(cacheKey).year = tmdbYear;
          this.dispatchEvent(
            new CustomEvent("year-mismatch-resolved", {
              detail: { id: mediaId },
              bubbles: true,
            }),
          );
        } catch (err) {
          btn.style.pointerEvents = "auto";
          btn.innerHTML = `<i class="bi bi-arrow-repeat"></i>`;
          console.error("Errore aggiornamento anno:", err);
        }
      });
  }

  // Formatta visto_il da YYYY-MM-DD → DD/MM/YYYY
  // oppure YYYY-MM → MM/YYYY, oppure YYYY → YYYY
  _formatVistoIl(visto_il) {
    if (!visto_il) return "";
    const parts = visto_il.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    if (parts.length === 2) return `${parts[1]}/${parts[0]}`;
    return parts[0];
  }

  render(items, currentUser, sort = "default", tmdbRatings = new Map()) {
    // ── SORT ──────────────────────────────────────────────
    const sorted = [...items];

    if (sort === "rating_desc") {
      sorted.sort((a, b) => {
        if (b.rating == null && a.rating == null) return 0;
        if (b.rating == null) return -1;
        if (a.rating == null) return 1;
        return b.rating - a.rating;
      });
    } else if (sort === "rating_asc") {
      sorted.sort((a, b) => {
        if (a.rating == null && b.rating == null) return 0;
        if (a.rating == null) return 1;
        if (b.rating == null) return -1;
        return a.rating - b.rating;
      });
    } else if (sort === "year_desc") {
      sorted.sort((a, b) => {
        if (b.year == null && a.year == null) return 0;
        if (b.year == null) return -1;
        if (a.year == null) return 1;
        return b.year - a.year;
      });
    } else if (sort === "year_asc") {
      sorted.sort((a, b) => {
        if (a.year == null && b.year == null) return 0;
        if (a.year == null) return 1;
        if (b.year == null) return -1;
        return a.year - b.year;
      });
    } else if (sort === "tmdb_rating_desc") {
      sorted.sort((a, b) => {
        const ra = tmdbRatings.get(String(a.id)) ?? null;
        const rb = tmdbRatings.get(String(b.id)) ?? null;
        if (rb == null && ra == null) return 0;
        if (rb == null) return -1;
        if (ra == null) return 1;
        return rb - ra;
      });
    } else if (sort === "tmdb_rating_asc") {
      sorted.sort((a, b) => {
        const ra = tmdbRatings.get(String(a.id)) ?? null;
        const rb = tmdbRatings.get(String(b.id)) ?? null;
        if (ra == null && rb == null) return 0;
        if (ra == null) return 1;
        if (rb == null) return -1;
        return ra - rb;
      });
    } else if (sort === "visto_il_desc") {
      sorted.sort((a, b) => {
        const va = a.visto_il || null;
        const vb = b.visto_il || null;
        if (!vb && !va) return 0;
        if (!vb) return -1;
        if (!va) return 1;
        return vb < va ? -1 : vb > va ? 1 : 0;
      });
    } else if (sort === "visto_il_asc") {
      sorted.sort((a, b) => {
        const va = a.visto_il || null;
        const vb = b.visto_il || null;
        if (!va && !vb) return 0;
        if (!va) return 1;
        if (!vb) return -1;
        return va < vb ? -1 : va > vb ? 1 : 0;
      });
    }

    // ── RENDER ────────────────────────────────────────────
    const container = this.querySelector("#mediaContainer");
    container.innerHTML = "";

    const typeIcon = {
      film: "bi-film",
      serie: "bi-tv",
      anime: "bi-play-circle",
      standup: "bi-mic",
    };

    const statusIcon = {
      completed: "bi-check",
      watching: "bi-eye",
      recommended: "bi-star",
    };

    if (!sorted.length) {
      container.innerHTML = `
        <div class="text-center text-secondary py-4">
          Nessun contenuto trovato
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    sorted.forEach((item) => {
      const row = document.createElement("div");
      row.className =
        "list-group-item d-flex justify-content-between align-items-stretch";
      row.style.cssText =
        "background:#141414; color:#eaeaea; border:1px solid #2a2a2a; cursor:pointer; padding:0; gap:0; overflow:hidden;";
      row.dataset.id = item.id;
      row.dataset.title = item.title || "";
      row.dataset.type = item.type || "";
      row.dataset.status = item.status || "";
      row.dataset.year = item.year || "";
      row.dataset.rating = item.rating || "";
      row.dataset.notes = item.notes || "";
      row.dataset.visto_il = item.visto_il || "";

      row.innerHTML = `
        <!-- POSTER -->
        <div class="vd-poster-wrap" style="
          flex-shrink:0; width:44px; align-self:stretch;
          overflow:hidden; background:#1e1e1e; position:relative;
        ">
          <div class="vd-poster-placeholder" style="
            width:100%; height:100%;
            display:flex; align-items:center; justify-content:center;
            color:#333; font-size:0.75rem;
          ">
            <i class="bi ${typeIcon[item.type] || "bi-grid"}"></i>
          </div>
          <img
            class="vd-poster-img"
            data-title="${(item.title || "").replace(/"/g, "&quot;")}"
            data-type="${item.type || ""}"
            src="" alt=""
            style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0; transition:opacity 0.3s ease;"
          />
        </div>

        <!-- INFO -->
        <div style="flex:1; min-width:0; padding:0.4rem 0.5rem; display:flex; flex-direction:column; justify-content:center;">
          <div style="font-weight:600; color:#e6d5b8; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${item.title}
          </div>
          <small style="display:flex; flex-direction:column; gap:0.15rem;">
            <!-- RIGA 1: rating nostro + tmdb + tipo + anno -->
            <span style="color:#888; font-size:0.75rem; display:flex; align-items:center; gap:0.35rem; overflow:hidden;">
              <span class="vd-rating-wrap" style="display:inline-flex; align-items:center; gap:0.3rem;">
                ${item.rating ? `<span>⭐ ${item.rating}</span><span style="color:#333;">·</span>` : ""}
              </span>
              <span><i class="bi ${typeIcon[item.type] || "bi-grid"}"></i> ${item.type}</span>
              ${item.year ? `<span style="color:#333;">|</span><span class="vd-static-year">${item.year}</span>` : ""}
              <span class="vd-year-wrap" style="display:inline-flex; align-items:center; gap:0.3rem;"></span>
            </span>
            <!-- RIGA 2: status + visto il -->
            <span style="color:#888; font-size:0.72rem; display:flex; align-items:center; gap:0.35rem;">
              <span><i class="bi ${statusIcon[item.status] || "bi-circle"}"></i> <span style="${item.status === "completed" ? "color:#5a8a5a;" : ""}">${item.status}</span></span>
              ${item.visto_il ? `<span style="color:#333;">|</span><i class="bi bi-eye-fill" style="color:#5a8a5a; font-size:0.6rem;"></i><span style="color:#5a8a5a; font-size:0.7rem;">${this._formatVistoIl(item.visto_il)}</span>` : ""}
            </span>
          </small>
        </div>

        <!-- ACTIONS -->
        <div class="d-flex align-items-center gap-2" style="flex-shrink:0; padding:0 0.5rem;">
          <div class="info-btn" data-id="${item.id}" data-title="${item.title}"
            style="cursor:pointer; font-size:1.1rem; color:#6c757d; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:0.2s;"
            onmouseover="this.style.background='#6c757d'; this.style.color='#fff';"
            onmouseout="this.style.background='transparent'; this.style.color='#6c757d';">
            <i class="bi bi-info-circle"></i>
          </div>
          <div class="delete-btn"
            data-id="${item.id}" data-title="${item.title}"
            data-type="${item.type || ""}" data-year="${item.year || ""}" data-status="${item.status || ""}"
            style="cursor:pointer; font-size:1.1rem; color:#dc3545; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:0.2s;"
            onmouseover="this.style.background='#dc3545'; this.style.color='#fff';"
            onmouseout="this.style.background='transparent'; this.style.color='#dc3545';">
            <i class="bi bi-trash"></i>
          </div>
        </div>
      `;

      fragment.appendChild(row);
    });

    container.appendChild(fragment);

    container.querySelectorAll(".vd-poster-img").forEach((img) => {
      this._posterObserver.observe(img);
    });

    this.attachEvents(currentUser);
  }

  attachEvents(currentUser) {
    const container = this.querySelector("#mediaContainer");

    container.querySelectorAll(".list-group-item").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".delete-btn")) return;
        if (e.target.closest(".info-btn")) return;
        if (e.target.closest(".vd-year-update-btn")) return;

        this.dispatchEvent(
          new CustomEvent("open-edit-modal", {
            detail: {
              id: row.dataset.id,
              title: row.dataset.title,
              type: row.dataset.type,
              status: row.dataset.status,
              year: row.dataset.year || null,
              rating: row.dataset.rating || null,
              notes: row.dataset.notes || null,
              visto_il: row.dataset.visto_il || null,
            },
            bubbles: true,
          }),
        );
      });
    });

    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent("delete-media-request", {
            detail: {
              id: btn.dataset.id,
              title: btn.dataset.title,
              type: btn.dataset.type,
              year: btn.dataset.year,
              status: btn.dataset.status,
            },
            bubbles: true,
          }),
        );
      });
    });

    container.querySelectorAll(".info-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const row = btn.closest(".list-group-item");
        this.dispatchEvent(
          new CustomEvent("open-info-modal", {
            detail: {
              id: btn.dataset.id,
              title: btn.dataset.title,
              type: row?.dataset.type,
            },
            bubbles: true,
          }),
        );
      });
    });
  }
}

customElements.define("vd-media-list", VdMediaList);
