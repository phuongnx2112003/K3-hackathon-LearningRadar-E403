const fs = require("fs");
const path = require("path");
const { getLessons, getSlidePath } = require("../data/mock-lessons");
const { sendError, sendOk } = require("../utils/response");

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

function handleLessonRoutes(req, res, url) {
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

  sendError(res, 404, "NOT_FOUND", "Lesson route not found");
}

module.exports = {
  handleLessonRoutes
};
