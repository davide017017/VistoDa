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
  }

  render(items, currentUser) {
    const container = this.querySelector("#mediaContainer");
    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML = `
        <div class="text-center text-secondary py-4">
          Nessun contenuto trovato
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      container.innerHTML += `
        <div class="list-group-item d-flex justify-content-between align-items-center"
             style="background:#141414; color:#eaeaea; border:1px solid #2a2a2a; cursor:pointer;"
             data-id="${item.id}"
             data-title="${item.title || ""}"
             data-type="${item.type || ""}"
             data-status="${item.status || ""}"
             data-year="${item.year || ""}"
             data-rating="${item.rating || ""}"
             data-notes="${item.notes || ""}">

          <div>
            <div style="font-weight:600; color:#e6d5b8;">
              ${item.title}
            </div>

            <small style="color:#888;">
            ${item.rating ? " ⭐ " + item.rating : ""}
              •  ${item.type} • ${item.status}
              ${item.year ? " • " + item.year : ""}
            </small>
          </div>

          <div class="d-flex align-items-center gap-2">

            <div
              style="cursor:pointer; font-size:1.3rem; color:#6c757d; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:0.2s;"
              onmouseover="this.style.background='#6c757d'; this.style.color='#fff';"
              onmouseout="this.style.background='transparent'; this.style.color='#6c757d';"
            >
              <i class="bi bi-info-circle"></i>
            </div>

            <div
              style="cursor:pointer; font-size:1.3rem; color:#dc3545; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:0.2s;"
              onmouseover="this.style.background='#dc3545'; this.style.color='#fff';"
              onmouseout="this.style.background='transparent'; this.style.color='#dc3545';"
              class="delete-btn"
              data-id="${item.id}"
              data-title="${item.title}"
              data-type="${item.type || ""}"
              data-year="${item.year || ""}"
              data-status="${item.status || ""}"
            >
              <i class="bi bi-trash"></i>
            </div>

          </div>

        </div>
      `;
    });

    this.attachEvents(currentUser);
  }

  attachEvents(currentUser) {
    const container = this.querySelector("#mediaContainer");

    // CLICK RIGA → MODALE EDIT
    container.querySelectorAll(".list-group-item").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".delete-btn")) return;
        if (e.target.closest(".info-btn")) return;

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
            },
            bubbles: true,
          }),
        );
      });
    });

    // DELETE
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
  }
}

customElements.define("vd-media-list", VdMediaList);
