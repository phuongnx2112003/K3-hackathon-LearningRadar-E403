const { getSlideManifest } = require("../data/mock-lessons");

function clamp01(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(1, number));
}

function normalizeBox(box = {}) {
  const x = clamp01(box.x);
  const y = clamp01(box.y);
  const width = clamp01(box.width);
  const height = clamp01(box.height);

  return {
    x,
    y,
    width,
    height,
    right: clamp01(x + width),
    bottom: clamp01(y + height)
  };
}

function getIntersectionRatio(a, b) {
  const left = Math.max(a.x, b.x);
  const top = Math.max(a.y, b.y);
  const right = Math.min(a.right, b.x + b.width);
  const bottom = Math.min(a.bottom, b.y + b.height);
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  const intersection = width * height;
  const blockArea = Math.max(0.0001, b.width * b.height);

  return intersection / blockArea;
}

function isBlockCenterInside(region, blockBox) {
  const centerX = blockBox.x + blockBox.width / 2;
  const centerY = blockBox.y + blockBox.height / 2;

  return centerX >= region.x && centerX <= region.right && centerY >= region.y && centerY <= region.bottom;
}

function getSlideSlug(slideFileOrSlug = "") {
  return String(slideFileOrSlug).replace(/\.pdf$/i, "");
}

function isIgnoredBlock(text = "") {
  const normalized = String(text).toLowerCase();
  return (
    normalized.includes("ai in action - hackathon") ||
    normalized.includes("hành trình khóa học") ||
    normalized.includes("hanh trinh khoa hoc")
  );
}

function recognizeSlideRegion({ slideFile, page, bbox }) {
  const manifest = getSlideManifest();
  const slug = getSlideSlug(slideFile);
  const slide = manifest.slides?.[slug];

  if (!slide) {
    return null;
  }

  const pageNumber = Math.max(1, Number(page) || 1);
  const slidePage = slide.pages.find((item) => item.page === pageNumber);

  if (!slidePage) {
    return null;
  }

  const region = normalizeBox(bbox);
  const matchedBlocks = (slidePage.blocks || [])
    .filter((block) => !isIgnoredBlock(block.text))
    .map((block) => {
      const blockBox = normalizeBox(block.bbox);
      const intersectionRatio = getIntersectionRatio(region, blockBox);
      const centerInside = isBlockCenterInside(region, blockBox);

      return {
        ...block,
        blockBox,
        score: intersectionRatio + (centerInside ? 1 : 0)
      };
    })
    .filter((block) => block.score > 0.08)
    .sort((a, b) => {
      if (Math.abs(a.blockBox.y - b.blockBox.y) > 0.02) {
        return a.blockBox.y - b.blockBox.y;
      }
      return a.blockBox.x - b.blockBox.x;
    });

  const selectedText = matchedBlocks.map((block) => block.text).join(" ").trim();

  return {
    slideFile: slide.file,
    slideSlug: slug,
    page: pageNumber,
    bbox: region,
    selectedText: selectedText || slidePage.text || "",
    matchedBlocks: matchedBlocks.map((block) => ({
      text: block.text,
      bbox: block.bbox,
      score: Number(block.score.toFixed(4))
    })),
    fallbackToPage: !selectedText
  };
}

module.exports = {
  recognizeSlideRegion
};
