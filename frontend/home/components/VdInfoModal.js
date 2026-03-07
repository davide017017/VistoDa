class VdInfoModal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal fade" id="infoModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="background:#1a1a1a; color:#eaeaea; border:1px solid #2a2a2a;">
            <div class="modal-header border-0 justify-content-center position-relative">
              <h5 class="modal-title" style="color:#e6d5b8;">Info</h5>
              <button type="button" class="btn-close btn-close-white position-absolute end-0 me-3" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center py-4">
              <i class="bi bi-clock" style="font-size:2rem; color:#8c7a5b;"></i>
              <p class="mt-3" style="color:#888;">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    `;

    this._modal = new bootstrap.Modal(this.querySelector("#infoModal"));

    document.addEventListener("open-info-modal", () => {
      this._modal.show();
    });
  }
}

customElements.define("vd-info-modal", VdInfoModal);
