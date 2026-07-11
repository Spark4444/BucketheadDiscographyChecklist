let sections = Object.keys(bucketheadDiscography);
let titleCaseSections = sections.map(section => {
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
        sectionDiv.innerHTML = titleCaseSections[index];
        sectionDiv.setAttribute("href", `${section}`);
        pages.appendChild(sectionDiv);
    });

    // Create the main content container for the page content
    const mainContentDiv = document.createElement("div");
    mainContentDiv.classList.add("mainContent");
    main.appendChild(mainContentDiv);
}

// Function to generate the details of an item from Object
function generateItemDetails(item) {
    const itemDetailsDiv = document.createElement("div");
    itemDetailsDiv.classList.add("itemDetails");
    itemDetailsDiv.innerHTML = `
        <input type="checkbox" class="itemCheckbox" />
        <div class="itemTitle">${item.title}</div>
        <div class="itemYear">${item.year}</div>
        <div class="itemLength">${item.length}</div>
        ${item.overallIndex ? `<div class="itemOverallIndex">${item.overallIndex}</div>` : ""}
        ${item.pikeIndex ? `<div class="itemPikeIndex">${item.pikeIndex}</div>` : ""}
    `;
    return itemDetailsDiv;
}

// Function to load the content of a specific section into the main content container
function loadPageContent(section) {
    const sectionData = bucketheadDiscography[section];
    const mainContentDiv = document.querySelector(".mainContent");
    mainContentDiv.innerHTML = ""; // Clear previous content

    if (
      section === "GuestAppearances" ||
      section === "CollaborationsAndProjects"
    ) {
        sectionData.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("section");
            mainContentDiv.appendChild(itemDiv);

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
}


generateLayout();