const storageKey = "bucketheadChecklistCheckedSongs";

// Retrieves the saved checked songs from localStorage
function getSavedCheckedSongs() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("Unable to read saved checklist state:", error);
    return {};
  }
}

// Saves the checked songs to localStorage
function saveCheckedSongs(checkedSongs) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(checkedSongs));
  } catch (error) {
    console.warn("Unable to save checklist state:", error);
  }
}

// Sets the checked state of a song in localStorage
function setSongChecked(section, title, isChecked) {
  const normalizedSection = (section || "").trim();
  const normalizedTitle = (title || "").trim();
  if (!normalizedSection || !normalizedTitle) return;

  const checkedSongs = getSavedCheckedSongs();
  if (!checkedSongs[normalizedSection] || typeof checkedSongs[normalizedSection] !== "object") {
    checkedSongs[normalizedSection] = {};
  }
  checkedSongs[normalizedSection][normalizedTitle] = Boolean(isChecked);
  saveCheckedSongs(checkedSongs);
}

// Checks if a song is marked as checked in localStorage
function isSongChecked(section, title) {
  const normalizedSection = (section || "").trim();
  const normalizedTitle = (title || "").trim();
  if (!normalizedSection || !normalizedTitle) return false;

  const checkedSongs = getSavedCheckedSongs();
  if (checkedSongs[normalizedSection] && checkedSongs[normalizedSection][normalizedTitle] === true) {
    return true;
  }

  // Legacy support for old storage format keyed by title only.
  return checkedSongs[normalizedTitle] === true;
}

// Attaches an event listener to a checkbox to persist its state in localStorage
function attachCheckboxPersistence(checkbox, section, title) {
  if (!checkbox || !section || !title) return;

  checkbox.checked = isSongChecked(section, title);
  checkbox.addEventListener("change", () => {
    setSongChecked(section, title, checkbox.checked);
  });
}
