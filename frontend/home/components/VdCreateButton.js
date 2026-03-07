class VdCreateButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<div class="mb-2">
  <button id="openCreateModal"
    class="btn w-100 d-flex align-items-center justify-content-center gap-2"
    style="
      background-color:#8c7a5b;
      color:#0f0f0f;
      font-weight:600;
      padding:0.55rem;
      border-radius:10px;
    ">
    <i class="bi bi-plus-circle"></i>
    Aggiungi
    <i class="bi bi-ticket-perforated"></i>
  </button>
</div>
    `;

    this.querySelector("#openCreateModal").addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("open-create-modal", { bubbles: true }),
      );
    });
  }
}

customElements.define("vd-create-button", VdCreateButton);
