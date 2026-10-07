let lastTrigger = null;

function isYouTubeUrl(url = "") {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname === "youtube.com" || hostname === "youtu.be" || hostname.endsWith(".youtube.com");
  } catch {
    return false;
  }
}

function sourceInfo(film) {
  if (!film.source) return null;
  if (isYouTubeUrl(film.source)) {
    return { label: "Watch on YouTube", platform: "YouTube", className: "source-youtube" };
  }
  if (film.sourceType === "official-youtube-channel") {
    return { label: "Open official YouTube channel", platform: "YouTube", className: "source-youtube" };
  }
  return { label: "Open verified source", platform: "Verified source", className: "source-verified" };
}

function renderFilmStory(film) {
  const source = sourceInfo(film);
  return `
    <span class="eyebrow">${film.country} · ${film.year || "TBA"}</span>
    <h2 id="modal-title">${film.title}</h2>
    <p>${film.description}</p>
    <p><strong>Director:</strong> ${(film.director || []).join(", ") || "Not established"}</p>
    <p><strong>Production:</strong> ${film.production || "Not established"}</p>
    <p><strong>Format:</strong> ${film.format || "Film"}${film.runtime ? ` · ${film.runtime}` : ""}</p>
    <p><strong>Language:</strong> ${film.language || "Not established"}</p>
    <div class="film-meta">${(film.themes || []).map(theme => `<span class="tag">${theme}</span>`).join("")}</div>
    <div class="modal-actions">
      ${source ? `<a class="btn btn-primary source-link ${source.className}" href="${film.source}" target="_blank" rel="noopener noreferrer"><span>${source.label} ↗</span><small>${source.platform}</small></a>` : `<p class="note">A specific source link is not currently established for this record.</p>`}
      ${film.channelUrl && film.channelUrl !== film.source ? `<a class="btn btn-secondary source-link source-youtube" href="${film.channelUrl}" target="_blank" rel="noopener noreferrer"><span>Production channel ↗</span><small>YouTube</small></a>` : ""}
    </div>
  `;
}

export function openFilmModal(film, trigger = null) {
  const dialog = document.querySelector("#film-modal");
  const content = document.querySelector("#modal-content");
  if (!dialog || !content || !film) return;

  lastTrigger = trigger;
  content.innerHTML = renderFilmStory(film);
  if (!dialog.open) dialog.showModal();
  dialog.querySelector(".modal-close")?.focus();
}

export function setupModal(films) {
  const dialog = document.querySelector("#film-modal");
  if (!dialog) return;

  document.addEventListener("click", event => {
    const button = event.target.closest(".details-btn");
    if (!button) return;
    const film = films.find(item => item.id === button.dataset.film);
    if (film) openFilmModal(film, button);
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close("backdrop");
    }
  });

  dialog.querySelector(".modal-close")?.addEventListener("click", () => {
    dialog.close("button");
  });

  dialog.addEventListener("cancel", event => {
    // Keep the browser's native Esc/back close behavior.
    if (!event.defaultPrevented) dialog.close("escape");
  });

  dialog.addEventListener("close", () => {
    lastTrigger?.focus();
    lastTrigger = null;
  });
}
