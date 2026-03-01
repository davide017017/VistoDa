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
      const disabledDelete = currentUser?.is_demo ? "disabled" : "";

      container.innerHTML += `
        <div class="list-group-item d-flex justify-content-between align-items-center"
             style="background:#141414; color:#eaeaea; border:1px solid #2a2a2a; cursor:pointer;"
             data-id="${item.id}">

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

          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-danger delete-btn"
                    ${disabledDelete}
                    data-id="${item.id}">
              Delete
            </button>

            <button class="btn btn-sm btn-outline-secondary"
                    disabled>
              Info
            </button>
          </div>

        </div>
      `;
    });

    this.attachEvents(currentUser);
  }

  attachEvents(currentUser) {
    const container = this.querySelector("#mediaContainer");

    // CLICK RIGA → MODALE
    container.querySelectorAll(".list-group-item").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) return;

        const modal = new bootstrap.Modal(this.querySelector("#editModal"));
        modal.show();
      });
    });

    // DELETE
    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();

        const id = btn.dataset.id;

        if (!confirm("Confermi eliminazione?")) return;

        this.dispatchEvent(
          new CustomEvent("delete-media", {
            detail: id,
            bubbles: true,
          }),
        );
      });
    });
  }
}

customElements.define("vd-media-list", VdMediaList);
