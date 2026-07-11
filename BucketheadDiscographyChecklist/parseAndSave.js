import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const wikiUrl = "https://en.wikipedia.org/wiki/Buckethead_discography";
const outputFilePath = path.join(process.cwd(), "bucketheadDiscography.js");

function templateDiscographyData(data) {
  return `export const bucketheadDiscography = ${JSON.stringify(data, null, 2)};`;
}