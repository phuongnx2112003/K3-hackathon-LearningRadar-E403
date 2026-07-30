// This is a device-local pseudonymous identifier, not a user account.
// It is never stored in the server database as profile data; it is only
// attached to learning events so different devices remain independent.
const STORAGE_KEY = 'lr_anonymous_student_id';

function createId() {
  if (globalThis.crypto?.randomUUID) return `student-${globalThis.crypto.randomUUID()}`;
  return `student-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getAnonymousStudentId() {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const id = createId();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    // Private browsing can deny localStorage. Keep it isolated for this tab.
    return createId();
  }
}
