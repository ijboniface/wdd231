const params = new URLSearchParams(window.location.search);
const submittedInformation = document.querySelector("#submitted-information");
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

const fields = ["firstName", "lastName", "email", "phone", "organization", "timestamp"];

// the answers normally arrive in the address, with a saved copy as a backup
let answers = Object.fromEntries(fields.map((name) => [name, params.get(name) || ""]));

if (!answers.firstName && !answers.lastName && !answers.email) {
    try {
        answers = { ...answers, ...JSON.parse(sessionStorage.getItem("chamber-application") || "{}") };
    } catch (error) {
        // no saved copy, the message below explains what to do
    }
}

function addDetail(list, label, value) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value;

    row.append(term, description);
    list.appendChild(row);
}

if (!answers.firstName && !answers.lastName && !answers.email) {
    submittedInformation.innerHTML = `
        <p>
            We could not find your application details.
            Please <a href="join.html">return to the Join page</a> and submit the form again.
        </p>`;
} else {
    let submitted = answers.timestamp;
    const date = new Date(submitted);

    if (submitted && !Number.isNaN(date.getTime())) {
        submitted = date.toLocaleString();
    }

    const details = document.createElement("dl");
    details.className = "application-details";

    addDetail(details, "First Name", answers.firstName);
    addDetail(details, "Last Name", answers.lastName);
    addDetail(details, "Email", answers.email);
    addDetail(details, "Mobile Phone", answers.phone);
    addDetail(details, "Business/Organization", answers.organization);
    addDetail(details, "Application Submitted", submitted);

    submittedInformation.replaceChildren(details);
}

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}