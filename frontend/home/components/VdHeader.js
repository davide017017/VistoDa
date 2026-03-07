class VdHeader extends HTMLElement {
  connectedCallback() {
    this._user = null;
    this._stats = null;

    this.innerHTML = `
      <style>
        vd-header .vd-nick-clickable {
          cursor: pointer;
          transition: color 0.2s, opacity 0.2s;
          user-select: none;
        }

        vd-header .vd-nick-clickable:hover {
          opacity: 0.75;
        }

        vd-header .vd-nick-clickable::after {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          border-right: 1px solid #8c7a5b;
          border-bottom: 1px solid #8c7a5b;
          transform: rotate(45deg) translateY(-2px);
          margin-left: 7px;
          opacity: 0.5;
          vertical-align: middle;
        }
      </style>

      <div class="vd-header d-flex align-items-center justify-content-between mb-3"
           style="
             padding:0.5rem;
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
        <img 
          src="../assets/images/Header-image.png"
          alt="VistoDa"
          style="
            height:45px;
            width:auto;
            object-fit:contain;
            display:block;
          "
        >

        <!-- CENTER: Nickname cliccabile -->
        <div class="text-center">
          <h4 id="nickname"
              class="vd-nick-clickable"
              style="color:#8c7a5b; margin:0;">
          </h4>
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

      <!-- Modale profilo -->
      <vd-nick-name-modal id="nickNameModalComponent"></vd-nick-name-modal>
    `;

    this.querySelector("#logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "../login/login.html";
    });

    this.querySelector("#nickname").addEventListener("click", () => {
      const modal = this.querySelector("#nickNameModalComponent");
      if (modal && this._user) {
        modal.open(this._user, this._stats);
      }
    });
  }

  setUser(user) {
    if (!user) return;
    this._user = user;

    const nicknameEl = this.querySelector("#nickname");
    let badge = "";

    if (user.is_demo) {
      badge = `
        <span style="
          display:inline-block;
          width:8px; height:8px;
          margin-left:8px;
          border-radius:50%;
          background-color:#8c7a5b;
          vertical-align:middle;
        "></span>
      `;
    }

    nicknameEl.innerHTML = `${user.nickname ?? ""}${badge}`;
  }

  // Chiamare quando si hanno i dati delle statistiche
  setStats(stats) {
    this._stats = stats;
  }
}

customElements.define("vd-header", VdHeader);
