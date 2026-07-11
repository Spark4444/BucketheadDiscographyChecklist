import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const wikiUrl = "https://en.wikipedia.org/wiki/Buckethead_discography";
const outputFilePath = path.join(process.cwd(), "bucketheadDiscographyChecklist/js/bucketheadDiscography.js");

function templateDiscographyData(data) {
  return `const bucketheadDiscography = ${JSON.stringify(data, null, 2)};`;
}

async function fetchDiscography() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(wikiUrl, { waitUntil: "networkidle2" });
  await page.waitForSelector(".wikitable");

  const data = await page.evaluate(() => {
    const finalData = {
      Albums: [],
      Pikes: [],
      LiveAlbums: [],
      SpecialReleases: [],
      Eps: [],
      Collaborations: [],
      GuestAppearances: [],
    };

    let currentYear = null;
    let currentYearRowSpan = 0;

    function parseTable(table, fieldNames) {
      if (!table) {
        return [];
      }

      const rows = table.querySelectorAll("tr");

      return Array.from(rows).flatMap((tr, index) => {
        if (index === 0) {
          return [];
        }

        const tds = tr.querySelectorAll("td");
        if (tds.length === 0) {
          return [];
        }

        const yearCell = tds[0];
        const rowSpan = parseInt(yearCell.getAttribute("rowspan"), 10);
        let hasYearCell = false;

        if (rowSpan > 0) {
          hasYearCell = true;
          currentYear = yearCell.textContent.trim();
          currentYearRowSpan = rowSpan + 1;
        }

        if (currentYearRowSpan > 0) {
          currentYearRowSpan--;
        }

        if (currentYearRowSpan < 1) {
          hasYearCell = true;
          currentYear = yearCell.textContent.trim();
        }

        const shift = hasYearCell ? 0 : 1;

        const rowData = {
          year: currentYear,
        };

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

    function parseSectionList(rootSelector, parseProject) {
      const root = document.querySelector(rootSelector);
      if (!root) {
        return [];
      }

      const sections = root.querySelectorAll("section");
      return Array.from(sections).map((section) => {
        const titleElement = section.querySelector("h3");
        const projects = section.querySelectorAll("li");
        return {
          title: titleElement ? titleElement.textContent.trim() : "",
          projects: Array.from(projects).map((project) => parseProject(project.textContent.trim())),
        };
      });
    }

    const tables = document.querySelectorAll(".wikitable");
    const albums = tables[0];
    const pikes = tables[1];
    const specialReleases = tables[2];
    const eps = tables[3];
    const liveAlbums = tables[4];

    finalData.Albums = parseTable(albums, ["overallIndex", "title", "length"]);
    finalData.Pikes = parseTable(pikes, ["overallIndex", "title", "length"]);
    finalData.LiveAlbums = parseTable(liveAlbums, ["overallIndex", "title", "length"]);
    finalData.SpecialReleases = parseTable(specialReleases, ["albumDetails"]).map(({ year, albumDetails }) => ({
      year,
      ...parseAlbumDetails(albumDetails),
    }));
    finalData.Eps = parseTable(eps, ["albumDetails"]).map(({ year, albumDetails }) => ({
      year,
      ...parseAlbumDetails(albumDetails),
    }));

    finalData.Collaborations = parseSectionList('[aria-labelledby="Bands_and_projects"]', (text) => {
      const [year, title] = text.split(":").map((part) => part.trim());
      return { year, title };
    });

    finalData.GuestAppearances = parseSectionList('[aria-labelledby="Guest_appearances"]', (text) => {
      const parts = text.split(/[-–—]/).map((part) => part.trim());
      return { year: parts[0], title: parts[parts.length - 1] };
    });

    return finalData;
  });

  await browser.close();
  return data;
}

async function main() {
  try {
    const discographyData = await fetchDiscography();
    const fileContent = templateDiscographyData(discographyData);
    fs.writeFileSync(outputFilePath, fileContent, { encoding: "utf-8", flag: "w" });
    console.log(`Saved discography data to ${outputFilePath}`);
  } catch (error) {
    console.error("Failed to fetch and save discography data:", error);
    process.exit(1);
  }
}

main();