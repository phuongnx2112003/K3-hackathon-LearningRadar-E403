const fs = require("fs");
const path = require("path");
const { getLessons, getSlidePageImagePath, getSlidePath } = require("../data/mock-lessons");
const { analyzeSlideRegion } = require("../services/ai-client.service");
const { recognizeSlideRegion } = require("../services/slide-region.service");
const { readJson, sendError, sendOk } = require("../utils/response");

function sendPdf(res, slidePath) {
  const body = fs.readFileSync(slidePath);

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Length": body.length,
    "Content-Disposition": `inline; filename="${path.basename(slidePath)}"`,
    "Access-Control-Allow-Origin": "*",
    "Accept-Ranges": "bytes"
  });
  res.end(body);
}

function sendPng(res, imagePath) {
  const body = fs.readFileSync(imagePath);

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": body.length,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=3600"
  });
  res.end(body);
}

function buildRegionFallback(payload = {}, result = null) {
  const textHint = String(payload.textHint || result?.selectedText || "").replace(/\s+/g, " ").trim();

  if (!textHint && !payload.imageDataUrl) {
    return null;
  }

  return {
    ...(result || {}),
    slideFile: result?.slideFile || payload.slideFile || "",
    slideSlug: result?.slideSlug || String(payload.slideFile || "").replace(/\.pdf$/i, ""),
    page: result?.page || Math.max(1, Number(payload.page) || 1),
    bbox: result?.bbox || payload.bbox || null,
    selectedText:
      textHint ||
      "Vùng khoanh là ảnh hoặc sơ đồ trong slide. AI vision/OCR chưa trả về mô tả chi tiết, hãy kiểm tra AI service và OpenAI API key.",
    description: textHint
      ? "Fallback: lấy được chữ từ text layer của PDF nên chưa cần gọi OCR."
      : "Fallback: có ảnh vùng khoanh nhưng chưa nhận được mô tả từ AI vision/OCR.",
    matchedBlocks: result?.matchedBlocks || [],
    regionType: textHint ? "text" : "unclear",
    confidence: textHint ? 0.7 : 0.25,
    mode: textHint ? "text-hint-fallback" : "vision-fallback",
    fallback: true
  };
}

async function handleLessonRoutes(req, res, url) {
  if (url.pathname === "/api/slide-region/recognize") {
    if (req.method !== "POST") {
      sendError(res, 405, "METHOD_NOT_ALLOWED", "Only POST is allowed");
      return;
    }

    const payload = await readJson(req);
    let result = recognizeSlideRegion(payload);
    if (payload.imageDataUrl) {
      const visionResult = await analyzeSlideRegion(payload);
      result = {
        ...(result || {}),
        ...visionResult,
        selectedText: visionResult.selectedText || result?.selectedText || "",
        description: visionResult.description || "",
        mode: visionResult.mode || "vision"
      };
    }

    result = result || buildRegionFallback(payload, result);

    if (!result) {
      sendError(res, 404, "REGION_NOT_FOUND", "Cannot recognize this slide region");
      return;
    }

    sendOk(res, result);
    return;
  }

  if (req.method !== "GET") {
    sendError(res, 405, "METHOD_NOT_ALLOWED", "Only GET is allowed");
    return;
  }

  if (url.pathname === "/api/lessons") {
    sendOk(res, {
      lessons: getLessons().map((lesson) => ({
        ...lesson,
        slideUrl: `/api/slides/${lesson.slideFile}`
      }))
    });
    return;
  }

  if (url.pathname.startsWith("/api/slides/")) {
    const slideFile = decodeURIComponent(url.pathname.replace("/api/slides/", ""));
    const slidePath = getSlidePath(slideFile);

    if (!slidePath) {
      sendError(res, 404, "SLIDE_NOT_FOUND", "Slide not found");
      return;
    }

    sendPdf(res, slidePath);
    return;
  }

  if (url.pathname.startsWith("/api/slide-pages/")) {
    const parts = url.pathname.replace("/api/slide-pages/", "").split("/");
    const slug = decodeURIComponent(parts[0] || "");
    const imageName = decodeURIComponent(parts[1] || "");
    const imagePath = getSlidePageImagePath(slug, imageName);

    if (!imagePath) {
      sendError(res, 404, "SLIDE_PAGE_NOT_FOUND", "Slide page image not found");
      return;
    }

    sendPng(res, imagePath);
    return;
  }

  sendError(res, 404, "NOT_FOUND", "Lesson route not found");
}

module.exports = {
  handleLessonRoutes
};
