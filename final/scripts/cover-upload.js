import { setPendingCover, clearPendingCover } from "./storage.js";

const input = document.querySelector("#cover");
const zone = document.querySelector("#dropzone");
const preview = document.querySelector("#cover-preview");
const status = document.querySelector("#cover-status");
const removeBtn = document.querySelector("#cover-remove");
const allowed = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 5 * 1024 * 1024;
const maxWidth = 640;

function say(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("is-error", isError);
}

function reset() {
  clearPendingCover();
  input.value = "";
  preview.hidden = true;
  preview.removeAttribute("src");
  removeBtn.hidden = true;
  zone.classList.remove("has-image");
}

function resize(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.naturalWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("unreadable")); };
    img.src = url;
  });
}

async function handle(file) {
  if (!file) return reset();
  if (!allowed.includes(file.type)) { reset(); return say("Please choose a JPG, PNG or WebP image.", true); }
  if (file.size > maxBytes) { reset(); return say("That image is over 5 MB. Please choose a smaller file.", true); }
  try {
    const dataUrl = await resize(file);
    if (!setPendingCover(dataUrl)) { reset(); return say("This browser could not store the image. You can still submit without it.", true); }
    preview.src = dataUrl;
    preview.alt = `Preview of ${file.name}`;
    preview.hidden = false;
    removeBtn.hidden = false;
    zone.classList.add("has-image");
    say(`${file.name} is ready and will be attached to your submission.`);
  } catch {
    reset();
    say("That file could not be read as an image.", true);
  }
}

if (input && zone && preview && status && removeBtn) {
  clearPendingCover();
  input.addEventListener("change", () => handle(input.files[0]));
  removeBtn.addEventListener("click", () => { reset(); say("Cover image removed."); });
  ["dragenter", "dragover"].forEach(type => zone.addEventListener(type, event => { event.preventDefault(); zone.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach(type => zone.addEventListener(type, () => zone.classList.remove("is-over")));
  zone.addEventListener("drop", event => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) { input.files = event.dataTransfer.files; handle(file); }
  });
}
