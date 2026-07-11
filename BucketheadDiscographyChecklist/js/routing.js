const defaultSection = sections[0] || "";

function setActivePage(section) {
  const pageElements = document.querySelectorAll(".page");
  pageElements.forEach((pageElement) => {
    if (pageElement.dataset.section === section) {
      pageElement.classList.add("active");
    } else {
      pageElement.classList.remove("active");
    }
  });
}

function loadRoute(section) {
  const normalizedSection = section || defaultSection;
  if (!bucketheadDiscography[normalizedSection]) {
    location.hash = `#${defaultSection}`;
    return;
  }

  loadPageContent(normalizedSection);
  setActivePage(normalizedSection);
}

function handleRouteChange() {
  const section = location.hash.slice(1);
  loadRoute(section);
}

function handlePageClick(event) {
  const pageElement = event.target.closest(".page");
  if (!pageElement) return;

  const section = pageElement.dataset.section;
  if (!section) return;

  if (location.hash.slice(1) !== section) {
    location.hash = `#${section}`;
  } else {
    loadRoute(section);
  }
}

const pagesContainer = document.querySelector(".pages");
if (pagesContainer) {
  pagesContainer.addEventListener("click", handlePageClick);
}

window.addEventListener("hashchange", handleRouteChange);
handleRouteChange();
