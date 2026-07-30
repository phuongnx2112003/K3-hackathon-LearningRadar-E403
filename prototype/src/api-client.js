const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

export function getQuiz(conceptId) {
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

export function getDashboardTickets() {
  return request("/api/dashboard/tickets");
}
