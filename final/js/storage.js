const KEY = "gospelwood-saved-films";
const SUBMISSIONS_KEY = "gospelwood-film-submissions";

export function getSaved() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function toggleSaved(id) {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function saveFilm(id) {
  const saved = getSaved();
  if (!saved.includes(id)) localStorage.setItem(KEY, JSON.stringify([...saved, id]));
  return getSaved();
}

export function isSaved(id) {
  return getSaved().includes(id);
}

export function getSubmissions() {
  return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
}

export function saveSubmission(submission) {
  const current = getSubmissions();
  const fingerprint = [submission.title, submission.email, submission.country, submission.director, submission.source].join("|").toLowerCase();
  const duplicate = current.some(item => item.fingerprint === fingerprint);
  if (duplicate) return current;
  const next = [{ ...submission, fingerprint }, ...current];
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(next));
  return next;
}

export function clearSubmissions() {
  localStorage.removeItem(SUBMISSIONS_KEY);
}
