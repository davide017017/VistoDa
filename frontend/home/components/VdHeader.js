class VdHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="vd-header d-flex align-items-center justify-content-between mb-3"
           style="
             padding:1.5rem;
             border-radius:12px;
             border:1px solid #2a2a2a;
             background:repeating-linear-gradient(
               90deg,
               #141414,
               #141414 20px,
               #181818 20px,
               #181818 40px
             );
           ">

        <!-- LEFT: Logo -->
        <div>
          <h2 style="color:#e6d5b8" class="mb-0">
            Visto<span style="color:#8c7a5b">Da</span>
          </h2>
        </div>

        <!-- CENTER: Nickname -->
        <div class="text-center">
          <h4 id="nickname"
              style="color:#8c7a5b; margin:0;"></h4>
        </div>

        <!-- RIGHT: Logout -->
        <div>
          <button class="btn btn-sm"
            id="logoutBtn"
            style="border:1px solid #8c7a5b; color:#8c7a5b">
            Logout
          </button>
        </div>

      </div>
    `;

    this.querySelector("#logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "../login/login.html";
    });
  }

  setUser(user) {
    if (!user) return;

    const nicknameEl = this.querySelector("#nickname");

    let badge = "";

    if (user.is_demo) {
      badge = `
    <span style="
      display:inline-block;
      width:8px;
      height:8px;
      margin-left:8px;
      border-radius:50%;
      background-color:#8c7a5b;
      vertical-align:middle;
    "></span>
  `;
    }

    nicknameEl.innerHTML = `
      ${user.nickname ?? ""}
      ${badge}
    `;
  }
}

customElements.define("vd-header", VdHeader);
