const KEY = "gospelwood-saved-films";
const SUBMISSIONS_KEY = "gospelwood-film-submissions";
const COVER_KEY = "gospelwood-pending-cover";

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getSaved() {
  const saved = read(KEY, []);
  return Array.isArray(saved) ? saved : [];
}

export function toggleSaved(id) {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
  write(KEY, next);
  return next;
}

export function isSaved(id) {
  return getSaved().includes(id);
}

export function getSubmissions() {
  const list = read(SUBMISSIONS_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function saveSubmission(submission) {
  const current = getSubmissions();
  const fingerprint = [submission.title, submission.email, submission.country, submission.director, submission.source].join("|").toLowerCase();
  if (current.some(item => item.fingerprint === fingerprint)) return current;
  const next = [{ ...submission, fingerprint }, ...current];
  write(SUBMISSIONS_KEY, next);
  return next;
}

export function clearSubmissions() {
  try { localStorage.removeItem(SUBMISSIONS_KEY); } catch { /* storage unavailable */ }
}

export function setPendingCover(dataUrl) {
  return write(COVER_KEY, dataUrl);
}

export function takePendingCover() {
  const cover = read(COVER_KEY, "");
  try { localStorage.removeItem(COVER_KEY); } catch { /* storage unavailable */ }
  return typeof cover === "string" && cover.startsWith("data:image/") ? cover : "";
}

export function clearPendingCover() {
  try { localStorage.removeItem(COVER_KEY); } catch { /* storage unavailable */ }
}
