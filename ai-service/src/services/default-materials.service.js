const fs = require("fs");
const path = require("path");
const { indexPdf } = require("./document-index.service");
const { hasDocumentChunks } = require("./vector-store.service");

const projectRoot = path.resolve(__dirname, "../../..");
const slidesDir = path.join(projectRoot, "data", "vlearn-pack", "slides");

const defaultMaterials = [
  { documentId: "builtin-lesson-01", lessonId: "lesson-01", title: "Xác định bài toán kinh doanh cho AI", filename: "d1-slide-hackathon.pdf" },
  { documentId: "builtin-lesson-02", lessonId: "lesson-02", title: "Automation vs Augmentation", filename: "d2-slide-hackathon.pdf" }
];

async function bootstrapDefaultMaterials() {
  const results = [];
  for (const material of defaultMaterials) {
    if (hasDocumentChunks(material.documentId)) {
      results.push({ documentId: material.documentId, status: "already_indexed" });
      continue;
    }
    const filePath = path.join(slidesDir, material.filename);
    if (!fs.existsSync(filePath)) {
      results.push({ documentId: material.documentId, status: "missing_file" });
      continue;
    }
    const indexed = await indexPdf({ ...material, fileBase64: fs.readFileSync(filePath).toString("base64") });
    results.push({ documentId: material.documentId, status: "indexed", ...indexed });
  }
  return results;
}

module.exports = { bootstrapDefaultMaterials, defaultMaterials };
