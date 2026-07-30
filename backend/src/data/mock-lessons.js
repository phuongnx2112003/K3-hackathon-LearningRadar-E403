const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../../..");
const transcriptDir = path.join(projectRoot, "data", "vlearn-pack", "transcript");
const slidesDir = path.join(projectRoot, "data", "vlearn-pack", "slides");
const slidePagesDir = path.join(projectRoot, "data", "vlearn-pack", "slide-pages");
const slideManifestPath = path.join(slidePagesDir, "manifest.json");

const lessonConfigs = [
  {
    lessonId: "lesson-01",
    title: "Xac dinh bai toan kinh doanh cho AI",
    source: "transcript-01-clean.md",
    slideFile: "d1-slide-hackathon.pdf",
    defaultQuestion: "Vi sao phai xac dinh dung bai toan truoc khi dua AI vao san pham?"
  },
  {
    lessonId: "lesson-02",
    title: "Automation vs Augmentation",
    source: "transcript-02-clean.md",
    slideFile: "d2-slide-hackathon.pdf",
    defaultQuestion: "Khi nao nen automation va khi nao nen augmentation?"
  }
];

function readTextFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return "";
  }
}

function cleanMarkdownText(text) {
  return String(text || "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractParagraphs(markdown) {
  const matches = Array.from(markdown.matchAll(/\*\*\[(T\d+-\d+)\]\*\*\s+([\s\S]*?)(?=\n\n\*\*\[T\d+-\d+\]\*\*|\n## |\n# |$)/g));

  if (matches.length) {
    return matches.slice(0, 8).map((match, index) => ({
      id: `p${index + 1}`,
      page: index + 1,
      code: match[1],
      text: cleanMarkdownText(match[2])
    }));
  }

  return markdown
    .split(/\n{2,}/)
    .map(cleanMarkdownText)
    .filter(Boolean)
    .slice(0, 8)
    .map((text, index) => ({
      id: `p${index + 1}`,
      page: index + 1,
      code: `P${String(index + 1).padStart(2, "0")}`,
      text
    }));
}

function buildLesson(config) {
  const transcriptPath = path.join(transcriptDir, config.source);
  const transcript = readTextFileSafe(transcriptPath);
  const paragraphs = extractParagraphs(transcript);
  const firstParagraph = paragraphs[0]?.text || "";

  return {
    ...config,
    content: firstParagraph,
    paragraphs,
    slideExists: fs.existsSync(path.join(slidesDir, config.slideFile))
  };
}

function getLessons() {
  return lessonConfigs.map(buildLesson);
}

function findLessonById(lessonId) {
  return getLessons().find((lesson) => lesson.lessonId === lessonId) || getLessons()[0];
}

function getSlidePath(slideFile) {
  const allowedSlides = new Set(lessonConfigs.map((lesson) => lesson.slideFile));

  if (!allowedSlides.has(slideFile)) {
    return null;
  }

  const slidePath = path.join(slidesDir, slideFile);
  return fs.existsSync(slidePath) ? slidePath : null;
}

function getSlidePageImagePath(slug, imageName) {
  const safeSlug = path.basename(slug || "");
  const safeImageName = path.basename(imageName || "");
  const imagePath = path.join(slidePagesDir, safeSlug, safeImageName);

  if (!imagePath.startsWith(slidePagesDir) || !fs.existsSync(imagePath)) {
    return null;
  }

  return imagePath;
}

function getSlideManifest() {
  if (!fs.existsSync(slideManifestPath)) {
    return { slides: {} };
  }

  try {
    return JSON.parse(fs.readFileSync(slideManifestPath, "utf8"));
  } catch (error) {
    return { slides: {} };
  }
}

module.exports = {
  findLessonById,
  getLessons,
  getSlideManifest,
  getSlidePageImagePath,
  getSlidePath,
  lessonConfigs
};
