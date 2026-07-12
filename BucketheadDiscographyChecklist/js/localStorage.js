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
function setSongChecked(title, isChecked) {
  const normalizedTitle = (title || "").trim();
  if (!normalizedTitle) return;

  const checkedSongs = getSavedCheckedSongs();
  checkedSongs[normalizedTitle] = Boolean(isChecked);
  saveCheckedSongs(checkedSongs);
}

// Checks if a song is marked as checked in localStorage
function isSongChecked(title) {
  const normalizedTitle = (title || "").trim();
  if (!normalizedTitle) return false;

  const checkedSongs = getSavedCheckedSongs();
  return checkedSongs[normalizedTitle] === true;
}

// Attaches an event listener to a checkbox to persist its state in localStorage
function attachCheckboxPersistence(checkbox, title) {
  if (!checkbox || !title) return;

  checkbox.checked = isSongChecked(title);
  checkbox.addEventListener("change", () => {
    setSongChecked(title, checkbox.checked);
  });
}
