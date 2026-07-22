// Creates bulk action buttons that affect only visible page item checkboxes.
function createVisibilityControlButtons(container) {
  const controlContainer = document.createElement("div");
  controlContainer.classList.add("controlButtons");

  const clearVisibleButton = document.createElement("div");
  clearVisibleButton.type = "button";
  clearVisibleButton.textContent = "Clear checkboxes";
  clearVisibleButton.addEventListener("click", () => {
    updateVisibleCheckboxes(false);
  });

  const enableVisibleButton = document.createElement("div");
  enableVisibleButton.type = "button";
  enableVisibleButton.textContent = "Enable checkboxes";
  enableVisibleButton.addEventListener("click", () => {
    updateVisibleCheckboxes(true);
  });

  controlContainer.appendChild(clearVisibleButton);
  controlContainer.appendChild(enableVisibleButton);
  container.appendChild(controlContainer);
}

// Update all visible checkbox states and persist them in localStorage.
function updateVisibleCheckboxes(checkedState) {
  const visibleCheckboxes = Array.from(document.querySelectorAll(".mainContent .itemDetails:not([style*='display: none']) .itemCheckbox"));
  visibleCheckboxes.forEach((checkbox) => {
    checkbox.checked = checkedState;
    const title = checkbox.dataset.title;
    const section = checkbox.dataset.section;
    if (section && title) {
      setSongChecked(section, title, checkedState);
    }
  });
}
