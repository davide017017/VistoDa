export function initFilters(onFilterChange) {
  const buttons = document.querySelectorAll("[data-filter]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.style.backgroundColor = "";
        b.style.color = "#aaa";
      });

      btn.classList.add("active");
      btn.style.backgroundColor = "#8c7a5b";
      btn.style.color = "#0f0f0f";

      onFilterChange(btn.dataset.filter);
    });
  });
}
