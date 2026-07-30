function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function firstValidPage(value) {
  const pages = Array.isArray(value) ? value : [value];
  const page = pages.map(Number).find((candidate) => Number.isInteger(candidate) && candidate > 0);
  return page || 1;
}

function findCitation(payload = {}) {
  if (!nonEmptyString(payload.selectedText)) {
    throw new Error("selectedText is required to create a citation");
  }

  return {
    source: nonEmptyString(payload.source) ? payload.source.trim() : "student-selected-text",
    section: nonEmptyString(payload.section) ? payload.section.trim() : "Selected text",
    lessonId: payload.lessonId || null,
    // A selected-text fallback is not retrieved from the vector store, but it
    // still needs a stable target for the PDF reader.
    page: firstValidPage(payload.selectedPages || payload.page),
    chunkIndex: Number.isInteger(Number(payload.chunkIndex)) ? Number(payload.chunkIndex) : 0,
    quote: payload.selectedText.trim()
  };
}

module.exports = {
  findCitation
};
