let sections = Object.keys(bucketheadDiscography);
let titleCaseSections = sections.map((section) => {
    return camelCaseToTitleCase(section);
});

const main = document.querySelector(".main");

// Function to generate the layout of the page
function generateLayout() {
    // Create the pages container
    const pages = document.createElement("div");
    pages.classList.add("pages");
    main.appendChild(pages);
    sections.forEach((section, index) => {
        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("page");
        sectionDiv.dataset.section = section;
        sectionDiv.innerHTML = titleCaseSections[index];
        pages.appendChild(sectionDiv);
    });

    // Create the main content container for the page content
    const mainContentDiv = document.createElement("div");
    mainContentDiv.classList.add("mainContent");
    main.appendChild(mainContentDiv);

    createSearchInput();
}

// Function to generate the details of an item from Object
function generateItemDetails(item) {
    const itemDetailsDiv = document.createElement("div");
    itemDetailsDiv.classList.add("itemDetails");
    itemDetailsDiv.innerHTML = `
        <div class="itemText">${item.overallIndex ? `${item.overallIndex}. ` : ""}"${item.title}"${item.length ? ` (${item.length})` : ""} - ${item.year}</div>
        <input type="checkbox" class="itemCheckbox" />
    `;

    const checkbox = itemDetailsDiv.querySelector(".itemCheckbox");
    if (checkbox) {
        checkbox.dataset.title = item.title;
        attachCheckboxPersistence(checkbox, item.title);
    }

    return itemDetailsDiv;
}

// Function to load the content of a specific section into the main content container
function loadPageContent(section) {
    const sectionData = bucketheadDiscography[section];
    const mainContentDiv = document.querySelector(".mainContent");
    mainContentDiv.innerHTML = ""; // Clear previous content

    if (
      section === "GuestAppearances" ||
      section === "Collaborations"
    ) {
        sectionData.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("section");
            mainContentDiv.appendChild(itemDiv);
            itemDiv.innerHTML = `<div class="itemTitle">${item.title}</div>`;

            item.projects.forEach((project) => {
                const projectDiv = generateItemDetails(project);
                itemDiv.appendChild(projectDiv);
            });
        });
    }
    else {
        sectionData.forEach((item) => {
            const itemDiv = generateItemDetails(item);
            mainContentDiv.appendChild(itemDiv);
        });
    }

    const noResultsDiv = document.createElement("div");
    noResultsDiv.classList.add("noResultsMessage");
    noResultsDiv.textContent = "No matching items found.";
    noResultsDiv.style.display = "none";
    mainContentDiv.appendChild(noResultsDiv);

    if (typeof applySearchToContent === "function") {
        applySearchToContent();
    }
}


generateLayout();