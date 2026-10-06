
const KEY = "gospelwood-saved-films";

export function getSaved() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function toggleSaved(id) {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function isSaved(id) {
  return getSaved().includes(id);
}
