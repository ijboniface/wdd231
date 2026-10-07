
let lastTrigger = null;

export function setupModal(films) {
  const dialog = document.querySelector("#film-modal");
  const content = document.querySelector("#modal-content");
  if (!dialog || !content) return;

  document.addEventListener("click", event => {
    const button = event.target.closest(".details-btn");
    if (!button) return;
    const film = films.find(item => item.id === button.dataset.film);
    if (!film) return;
    lastTrigger = button;
    content.innerHTML = `
      <span class="eyebrow">${film.country} · ${film.year}</span>
      <h2 id="modal-title">${film.title}</h2>
      <p>${film.description}</p>
      <p><strong>Director:</strong> ${film.director.join(", ")}</p>
      <p><strong>Production:</strong> ${film.production}</p>
      <p><strong>Format:</strong> ${film.format}${film.runtime ? ` · ${film.runtime}` : ""}</p>
      <p><strong>Language:</strong> ${film.language}</p>
      <div class="film-meta">${film.themes.map(theme => `<span class="tag">${theme}</span>`).join("")}</div>
      <p class="note">Source: ${film.source ? `<a href="${film.source}" target="_blank" rel="noopener">verified film/source page</a>` : "Source link not established"}</p>`;
    dialog.showModal();
    dialog.querySelector(".modal-close").focus();
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog || event.target.closest(".modal-close")) dialog.close();
  });
  dialog.addEventListener("close", () => lastTrigger?.focus());
}
