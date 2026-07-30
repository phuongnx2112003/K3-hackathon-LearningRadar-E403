function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function findCitation(payload = {}) {
  if (!nonEmptyString(payload.selectedText)) {
    throw new Error("selectedText is required to create a citation");
  }

  return {
    source: nonEmptyString(payload.source) ? payload.source.trim() : "student-selected-text",
    section: nonEmptyString(payload.section) ? payload.section.trim() : "Selected text",
    quote: payload.selectedText.trim()
  };
}

module.exports = {
  findCitation
};
