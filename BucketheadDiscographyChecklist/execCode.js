const finalData = {
  Albums: [],
  Pikes: [],
  LiveAlbums: [],
  SpecialReleases: [],
  Eps: []
};

// General function to parse a table and return an array of objects
let currentYear = null;
let currentYearRowSpan = 0;
function parseTable(tableSelector, fieldNames) {
  const table = document.querySelector(tableSelector);
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

finalData.Albums = parseTable("#mwHw", ["overallIndex", "title", "length"]);
finalData.Pikes = parseTable("#mwAa8", ["overallIndex", "pikeIndex", "title", "length"]);
finalData.LiveAlbums = parseTable("#mwEmY", ["pikeIndex", "title", "length"]);
finalData.SpecialReleases = parseTable("#mwEhE", ["albumDetails"]);
finalData.Eps = parseTable("#mwEkk", ["albumDetails"]);
console.log(finalData);