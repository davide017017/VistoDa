export function renderMedia(container, items) {
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = `
      <div class="text-center text-secondary">
        Nessun contenuto trovato
      </div>
    `;
    return;
  }

  items.forEach((item) => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card border-0 shadow-sm"
             style="background-color:#1a1a1a; color:#eaeaea;">
          <div class="card-body">
            <h5 style="color:#e6d5b8;">${item.title}</h5>
            <div class="mb-2">
              <span class="badge"
                    style="background-color:#8c7a5b; color:#0f0f0f;">
                ${item.type}
              </span>
              <span class="badge bg-secondary">
                ${item.status}
              </span>
            </div>
            <small style="color:#888;">
              ${item.year ?? ""} • ⭐ ${item.rating ?? "-"}
            </small>
            ${
              item.notes
                ? `<p class="mt-2 small" style="color:#aaa;">${item.notes}</p>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  });
}
