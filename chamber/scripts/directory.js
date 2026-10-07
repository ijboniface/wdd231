const membersContainer = document.querySelector("#members");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");


/* Load the members with fetch and async/await */

async function getMembers() {

    try {

        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        // accepts [ ... ] or { "members": [ ... ] }
        const members = Array.isArray(data) ? data : data.members;

        if (!Array.isArray(members)) {
            throw new Error("Member data is not in the expected format.");
        }

        displayMembers(members);

    } catch (error) {

        console.error("Error loading members:", error);

        membersContainer.innerHTML = `
            <p class="error">
                The chamber member directory could not be loaded.
                Please try again later.
            </p>
        `;
    }
}


function displayMembers(members) {

    membersContainer.innerHTML = "";

    members.forEach((member, index) => {

        const card = document.createElement("article");

        card.classList.add("member-card");

        // --i staggers the load animation (capped so long lists stay quick)
        card.style.setProperty("--i", Math.min(index, 9));

        card.innerHTML = `
            <div class="member-heading">
                <h2>${member.name}</h2>
                <p>${member.tagline ?? ""}</p>
            </div>

            <div class="member-content">

                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    width="105"
                    height="85"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='images/favicon.svg';"
                >

                <div class="member-details">

                    <p>
                        <strong>EMAIL:</strong>
                        <a href="mailto:${member.email}">
                            ${member.email}
                        </a>
                    </p>

                    <p>
                        <strong>PHONE:</strong>
                        <a href="tel:${String(member.phone).replace(/[^\d+]/g, "")}">
                            ${member.phone}
                        </a>
                    </p>

                    <p>
                        <strong>ADDRESS:</strong>
                        ${member.address}
                    </p>

                    <p>
                        <strong>URL:</strong>
                        <a
                            href="${member.website}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Website
                        </a>
                    </p>

                    <p class="membership">
                        ${getMembershipLevel(member.membership)}
                    </p>

                </div>

            </div>

            <p class="member-description">
                ${member.description ?? ""}
            </p>
        `;

        membersContainer.appendChild(card);
    });
}


/* 1 = member, 2 = silver, 3 = gold (words are accepted too) */

function getMembershipLevel(level) {

    switch (String(level).toLowerCase()) {

        case "3":
        case "gold":
            return "Gold Member";

        case "2":
        case "silver":
            return "Silver Member";

        default:
            return "Member";
    }
}

function setView(view) {

    const isGrid = view === "grid";

    membersContainer.classList.toggle("member-grid", isGrid);
    membersContainer.classList.toggle("member-list", !isGrid);

    gridButton.classList.toggle("active-view", isGrid);
    listButton.classList.toggle("active-view", !isGrid);

    // lets screen readers announce which view is selected
    gridButton.setAttribute("aria-pressed", isGrid);
    listButton.setAttribute("aria-pressed", !isGrid);
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));


if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}


setView("grid");
getMembers();