const finalData = {
  Albums: [],
  Pikes: [],
  LiveAlbums: [],
  SpecialReleases: [],
  Eps: [],
  CollaborationsAndProjects: [],
  GuestAppearances: [],
};

// General function to parse a table and return an array of objects
let currentYear = null;
let currentYearRowSpan = 0;
function parseTable(table, fieldNames) {
  if (!table) {
    return [];
  }

  const rows = table.querySelectorAll("tr");

  return Array.from(rows).flatMap((tr, index) => {
    if (index === 0) {
      return []; // Skip the header row
    }

    const tds = tr.querySelectorAll("td");
    if (tds.length === 0) {
      return []; // Skip rows without data cells
    }

    const yearCell = tds[0];
    // for example rowspan = 3 is 3 rows of same year
    const rowSpan = parseInt(yearCell.getAttribute("rowspan"), 10);
    let hasYearCell = false;
    

    // if rowspan attribute exists and is greater than 0, then year is present
    if (rowSpan > 0) {
        hasYearCell = true;
      currentYear = yearCell.textContent.trim();
      currentYearRowSpan = rowSpan + 1;
    }
    
    if (currentYearRowSpan > 0) {
      currentYearRowSpan--;
    }

    // if currentYearRowSpan is less than 1, then the year cell is present in this row, so we should update the currentYear
    if (currentYearRowSpan < 1) {
      hasYearCell = true;
      currentYear = yearCell.textContent.trim();
    }

    const shift = hasYearCell ? 0 : 1;

    let rowData = {
        year: currentYear,
    };

    // Populate the rowData object with the values from the table cells
    fieldNames.forEach((fieldName, fieldIndex) => {
      const cell = tds[fieldIndex + 1 - shift];
      rowData[fieldName] = cell ? cell.textContent.trim() : "";
    });

    return [rowData];
  });
}

function parseAlbumDetails(details) {
  const lines = String(details).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const title = lines[0] || "";
  const lengthLine = lines.find(line => /^Length:\s*/i.test(line));
  const length = lengthLine ? lengthLine.replace(/^Length:\s*/i, "").trim() : "";
  return { title, length };
}

const tables = document.querySelectorAll(".wikitable");
const albums = tables[0];
const pikes = tables[1];
const specialReleases = tables[2];
const eps = tables[3];
const liveAlbums = tables[4];

finalData.Albums = parseTable(albums, ["overallIndex", "title", "length"]);
finalData.Pikes = parseTable(pikes, ["overallIndex", "pikeIndex", "title", "length"]);
finalData.LiveAlbums = parseTable(liveAlbums, ["pikeIndex", "title", "length"]);
finalData.SpecialReleases = parseTable(specialReleases, ["albumDetails"]).map(({ year, albumDetails }) => ({
  year,
  ...parseAlbumDetails(albumDetails)
}));
finalData.Eps = parseTable(eps, ["albumDetails"]).map(({ year, albumDetails }) => ({
  year,
  ...parseAlbumDetails(albumDetails)
}));


const collaborations = document.querySelector('[aria-labelledby="Bands_and_projects"]');
const collabs = collaborations.querySelectorAll("section");

finalData.CollaborationsAndProjects = Array.from(collabs).map((collab) => {
    const titleElement = collab.querySelector("h3");
    const projects = collab.querySelectorAll("li");
    const projectYearAndTitle = Array.from(projects).map((project) => {
        const [year, title] = project.textContent.split(":").map((part) => part.trim());
        return { year, title };
    });

    return {
        title: titleElement ? titleElement.textContent.trim() : "",
        projects: projectYearAndTitle
    };
});

const guestAppearances = document.querySelector('[aria-labelledby="Guest_appearances"]');
const guestAppearancesSections = guestAppearances.querySelectorAll("section");

finalData.GuestAppearances = Array.from(guestAppearancesSections).map(
  (section) => {
    const titleElement = section.querySelector("h3");
    const projects = section.querySelectorAll("li");
    const projectYearAndTitle = Array.from(projects).map((project) => {
      const split = project.textContent
        .split(/[-–—]/)
        .map((part) => part.trim());
      return { year: split[0], title: split[split.length - 1] };
    });

    return {
      title: titleElement ? titleElement.textContent.trim() : "",
      projects: projectYearAndTitle,
    };
  },
);

console.log(finalData);