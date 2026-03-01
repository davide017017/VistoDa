export function initHeader() {
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
  });
}

export function setWelcomeUser(user) {
  const welcome = document.getElementById("welcomeUser");

  if (!user) return;

  let badge = "";

  if (user.is_demo) {
    badge = `
      <span class="badge ms-2"
            style="background-color:#8c7a5b; color:#0f0f0f;">
        Demo Mode
      </span>
    `;
  }

  welcome.innerHTML = `
    Bentornato, ${user.email}
    ${badge}
  `;
}
