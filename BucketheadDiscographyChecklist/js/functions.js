// Converts a camelCase string to Title Case
function camelCaseToTitleCase(camelCaseString) {
  return (
    camelCaseString
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim()
  );
}
