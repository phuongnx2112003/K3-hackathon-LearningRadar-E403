const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3300";

async function request(path, options = {}) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const json = await response.json();

  if (!json.ok) {
    throw new Error(json.error?.message || "API request failed");
  }

  return json.data;
}

export function askTutor(payload) {
  return request("/api/tutor/ask", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getLessons() {
  return request("/api/lessons");
}

export function getBackendAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getSlidePageImageUrl(slideFile, page) {
  if (!slideFile || !page) return "";
  const slug = slideFile.replace(/\.pdf$/i, "");
  return `${BACKEND_URL}/api/slide-pages/${encodeURIComponent(slug)}/page-${String(page).padStart(3, "0")}.png`;
}

export function recognizeSlideRegion(payload) {
  return request("/api/slide-region/recognize", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getQuiz(conceptId) {
  if (typeof conceptId === "object" && conceptId !== null) {
    return request("/api/quiz", {
      method: "POST",
      body: JSON.stringify(conceptId)
    });
  }

  const params = new URLSearchParams({ conceptId });
  return request(`/api/quiz?${params.toString()}`);
}

export function submitQuiz(payload) {
  return request("/api/quiz/submit", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createTicket(payload) {
  return request("/api/tickets", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTicketStatus(id, status, updates = {}) {
  return request("/api/tickets", {
    method: "PATCH",
    body: JSON.stringify({ id, status, ...updates })
  });
}

export function sendTicketFeedback(id, teacherFeedback, status = "reviewed") {
  return request("/api/tickets", {
    method: "PATCH",
    body: JSON.stringify({
      id,
      status,
      teacherFeedback,
      teacherName: "Giảng viên/TA"
    })
  });
}

export function getDashboardTickets(status) {
  const query = status && status !== "All" ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/api/dashboard/tickets${query}`);
}
