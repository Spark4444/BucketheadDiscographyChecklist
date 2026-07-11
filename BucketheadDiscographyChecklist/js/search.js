const specialSymbolsRemovalRegex = /[^\w\s]/g;

let currentSearchQuery = "";
let searchInput;

// Function to create the search input field and set up the event listener
function createSearchInput() {
  const main = document.querySelector(".main");
  if (!main) return;

  const searchBar = document.createElement("div");
  searchBar.classList.add("searchBar");

  const searchLabel = document.createElement("label");
  searchLabel.setAttribute("for", "pageSearch");
  searchLabel.textContent = "Search current page:";
  searchBar.appendChild(searchLabel);

  searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "pageSearch";
  searchInput.classList.add("pageSearch");
  searchInput.placeholder = "Find song or item on this page";

  // Listener
  searchInput.addEventListener("input", () => {
    currentSearchQuery = searchInput.value
      .trim()
      .toLowerCase()
      .replace(specialSymbolsRemovalRegex, "");
    applySearchToContent();
  });

  searchBar.appendChild(searchInput);

  main.insertBefore(searchBar, main.firstChild);
}

// Function to search inside the actual page content and hide/show items based on the search query
function applySearchToContent() {
  const mainContentDiv = document.querySelector(".mainContent");
  if (!mainContentDiv) return;

  const query = currentSearchQuery || "";
  const itemDetails = mainContentDiv.querySelectorAll(".itemDetails");
  const sections = mainContentDiv.querySelectorAll(".section");
  let visibleItemCount = 0;

  // Filter items based on the search query
  itemDetails.forEach((itemDetail) => {
    const itemText = itemDetail.querySelector(".itemText")?.textContent.toLowerCase().replace(specialSymbolsRemovalRegex, "") || "";
    const isVisible = query.length === 0 || itemText.includes(query);
    itemDetail.style.display = isVisible ? "" : "none";
    if (isVisible) visibleItemCount += 1;
  });

  // Filter sections based on the visibility of their child items
  sections.forEach((section) => {
    const visibleChild = Array.from(
      section.querySelectorAll(".itemDetails"),
    ).some((itemDetail) => itemDetail.style.display !== "none");
    section.style.display = visibleChild ? "" : "none";
  });

  // If no items are visible, show the "No matching items found." message
  const noResults = mainContentDiv.querySelector(".noResultsMessage");
  if (noResults) {
    noResults.style.display = visibleItemCount === 0 ? "" : "none";
  }
}
