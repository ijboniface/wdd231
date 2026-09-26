const params = new URLSearchParams(window.location.search);

const firstName = params.get("firstName") || "";
const lastName = params.get("lastName") || "";
const email = params.get("email") || "";
const phone = params.get("phone") || "";
const organization = params.get("organization") || "";
const timestamp = params.get("timestamp") || "";

const submittedInformation =
    document.querySelector("#submitted-information");


const details = document.createElement("dl");

details.className = "application-details";


function addDetail(label, value) {

    const container = document.createElement("div");

    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = value;

    container.appendChild(term);
    container.appendChild(description);

    details.appendChild(container);
}


addDetail("First Name", firstName);

addDetail("Last Name", lastName);

addDetail("Email", email);

addDetail("Mobile Phone", phone);

addDetail("Business/Organization", organization);


// Format timestamp
let formattedTimestamp = timestamp;

if (timestamp) {

    const date = new Date(timestamp);

    if (!Number.isNaN(date.getTime())) {
        formattedTimestamp = date.toLocaleString();
    }

}

addDetail("Application Submitted", formattedTimestamp);


submittedInformation.replaceChildren(details);


// Footer year
const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// Last modified date
const lastModified = document.querySelector("#last-modified");

if (lastModified) {
    lastModified.textContent = document.lastModified;
}