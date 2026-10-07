import { getSubmissions, saveSubmission, clearSubmissions } from "./storage.js";

const content = document.querySelector("#submission-content");
const params = new URLSearchParams(location.search);

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[char]));
}

function renderInbox() {
  const submissions = getSubmissions();
  content.innerHTML = `
    <div class="section-head"><div><span class="eyebrow">Local submission inbox</span><h2>${submissions.length} saved submission${submissions.length === 1 ? "" : "s"}</h2></div><a class="btn btn-secondary light-btn" href="form.html">Submit another</a></div>
    <div class="submission-list">
      ${submissions.length ? submissions.map((item, index) => `
        <article class="story-card submission-item">
          <div><span class="eyebrow">${escapeHTML(item.country || "Country not supplied")} · ${escapeHTML(item.year || "Year TBA")}</span><h3>${escapeHTML(item.title)}</h3></div>
          <p><strong>Director:</strong> ${escapeHTML(item.director || "Not supplied")}<br><strong>Submitted by:</strong> ${escapeHTML(item.name || "Not supplied")} (${escapeHTML(item.email || "No email")})</p>
          <p><strong>Source:</strong> ${item.source ? `<a href="${escapeHTML(item.source)}" target="_blank" rel="noopener">${escapeHTML(item.source)}</a>` : "Not supplied"}</p>
          <p>${escapeHTML(item.reason || "No reason supplied")}</p>
          <p class="note">Saved ${escapeHTML(item.submittedAt || "")}</p>
        </article>`).join("") : `<div class="empty"><p>No submissions have been saved in this browser yet.</p><a class="btn btn-primary" href="form.html">Open the submission form</a></div>`}
    </div>
    ${submissions.length ? `<button id="clear-submissions" class="btn btn-danger" type="button">Clear browser submissions</button>` : ""}
    <p class="note submission-note">Important: this inbox uses <code>localStorage</code>. It is useful for your course demonstration and for testing on your own browser, but it is not a shared online database. Visitors using another browser/device cannot see these records.</p>`;

  document.querySelector("#clear-submissions")?.addEventListener("click", () => {
    if (confirm("Clear all submissions saved in this browser?")) {
      clearSubmissions();
      renderInbox();
    }
  });
}

if (params.get("view") === "submissions") {
  renderInbox();
} else if (params.has("title")) {
  const submission = {
    name: params.get("name") || "",
    email: params.get("email") || "",
    title: params.get("title") || "",
    country: params.get("country") || "",
    director: params.get("director") || "",
    year: params.get("year") || "",
    source: params.get("source") || "",
    reason: params.get("reason") || "",
    submittedAt: new Date().toLocaleString()
  };
  saveSubmission(submission);
  content.innerHTML = `<div class="submit-card submission-success"><span class="eyebrow">Submission received</span><h2>${escapeHTML(submission.title)}</h2><p>Thanks, ${escapeHTML(submission.name || "there")}. Your submission has been recorded in this browser for review.</p><p><strong>Country:</strong> ${escapeHTML(submission.country || "Not supplied")}<br><strong>Director:</strong> ${escapeHTML(submission.director || "Not supplied")}<br><strong>Year:</strong> ${escapeHTML(submission.year || "Not supplied")}<br><strong>Source:</strong> ${submission.source ? `<a href="${escapeHTML(submission.source)}" target="_blank" rel="noopener">${escapeHTML(submission.source)}</a>` : "Not supplied"}</p><p><strong>Reason:</strong> ${escapeHTML(submission.reason || "Not supplied")}</p><div class="btns"><a class="btn btn-primary" href="form-action.html?view=submissions">View saved submissions</a><a class="btn btn-secondary light-btn" href="films.html">Browse films</a></div></div>`;
} else {
  renderInbox();
}
