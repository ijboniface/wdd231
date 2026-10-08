const params = new URLSearchParams(window.location.search);
const submittedInformation = document.querySelector("#submitted-information");
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

const details = document.createElement("dl");
details.className = "application-details";

function addDetail(label, value) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value;

    row.append(term, description);
    details.appendChild(row);
}

let submitted = params.get("timestamp") || "";
const date = new Date(submitted);

if (submitted && !Number.isNaN(date.getTime())) {
    submitted = date.toLocaleString();
}

addDetail("First Name", params.get("firstName") || "");
addDetail("Last Name", params.get("lastName") || "");
addDetail("Email", params.get("email") || "");
addDetail("Mobile Phone", params.get("phone") || "");
addDetail("Business/Organization", params.get("organization") || "");
addDetail("Application Submitted", submitted);

submittedInformation.replaceChildren(details);

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}