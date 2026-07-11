const finalData = {
  Albums: [],
  Pikes: [],
  LiveAlbums: [],
  SpecialReleases: [],
  Eps: [],
  UnrealesedAlbums: [],
};

let Albums = document.querySelector("#mwHw");
let trs = Albums.querySelectorAll("tr");

let currentYear = null;
finalData.Albums = Array.from(trs).flatMap((tr, index) => {
  if (index === 0) {
    return [];
  }

  const tds = tr.querySelectorAll("td");

  const year = tds[0];
  let hasTextAlignCenter = year.style.textAlign === "center";

  if (hasTextAlignCenter) {
    currentYear = year.textContent;
  }

  let shift = 0;
  if (!hasTextAlignCenter) {
    shift = 1;
  }

  const number = tds[1 - shift];
  const title = tds[2 - shift];
  const length = tds[3 - shift];

  const albumData = {
    year: currentYear,
    number: number.textContent,
    title: title.textContent,
    length: length.textContent,
  };

  return [albumData];
});

let Pikes = document.querySelector("#mwAa8");
trs = Pikes.querySelectorAll("tr");

currentYear = null;
finalData.Pikes = Array.from(trs).flatMap((tr, index) => {
  if (index === 0) {
    return [];
  }

  const tds = tr.querySelectorAll("td");

  const year = tds[0];
  let hasTextAlignCenter = year.style.textAlign === "center";

  if (hasTextAlignCenter) {
    currentYear = year.textContent;
  }

  let shift = 0;
  if (!hasTextAlignCenter) {
    shift = 1;
  }

  const number = tds[1 - shift];
  const pikeNumber = tds[2 - shift];
  const title = tds[3 - shift];
  const length = tds[4 - shift];

  const albumData = {
    year: currentYear,
    number: number.textContent,
    pikeNumber: pikeNumber.textContent,
    title: title.textContent,
    length: length.textContent,
  };

  return [albumData];
});


let LiveAlbums = document.querySelector("#mwEmY");
trs = LiveAlbums.querySelectorAll("tr");

currentYear = null;
finalData.LiveAlbums = Array.from(trs).flatMap((tr, index) => {
  if (index === 0) {
    return [];
  }

  const tds = tr.querySelectorAll("td");

  const year = tds[0];
  let hasTextAlignCenter = year.style.textAlign === "center";
  
  if (hasTextAlignCenter) {
    currentYear = year.textContent;
  }

  let shift = 0;
  if (!hasTextAlignCenter) {
    shift = 1;
  }

  const pikeNumber = tds[1 - shift];
  const title = tds[2 - shift];
  const length = tds[3 - shift];

  const albumData = {
    year: currentYear,
    pikeNumber: pikeNumber.textContent,
    title: title.textContent,
    length: length.textContent,
  };

  return [albumData];
});
