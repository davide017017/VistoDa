class VdCreateButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="mb-2">
        <button id="openCreateModal"
                class="btn w-100"
                style="
                  background-color:#8c7a5b;
                  color:#0f0f0f;
                  font-weight:600;
                  padding:0.4rem;
                ">
          + Crea
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
