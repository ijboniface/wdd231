
const params = new URLSearchParams(location.search);
const main = document.querySelector("#main");
if (params.has("title")) {
  main.innerHTML = `<section class="section"><div class="container submit-card">
  <span class="eyebrow">Submission received</span><h1>${params.get("title")}</h1>
  <p>Thanks, ${params.get("name") || "there"}. Your submission has been formatted for review.</p>
  <p><strong>Country:</strong> ${params.get("country") || "Not supplied"}<br>
  <strong>Director:</strong> ${params.get("director") || "Not supplied"}<br>
  <strong>Year:</strong> ${params.get("year") || "Not supplied"}<br>
  <strong>Source:</strong> ${params.get("source") || "Not supplied"}</p>
  <p><strong>Reason:</strong> ${params.get("reason") || "Not supplied"}</p>
  <a class="btn btn-primary" href="index.html">Return home</a></div></section>`;
}
