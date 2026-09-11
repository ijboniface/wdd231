const membersContainer = document.querySelector("#members")
const gridButton = document.querySelector("#grid-button")
const listButton = document.querySelector("#list-button")
const currentYear = document.querySelector("#current-year")
const lastModified = document.querySelector("#last-modified")


async function getMembers() {

    try {

        const response = await fetch("data/members.json")

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const members = await response.json()

        displayMembers(members)

    } catch (error) {

        console.error("Error loading members:", error)

        membersContainer.innerHTML = `
            <p class="error">
                The chamber member directory could not be loaded.
                Please try again later.
            </p>
        `
    }
}


function displayMembers(members) {

    membersContainer.innerHTML = ""

    members.forEach(member => {

        const card = document.createElement("article")

        card.classList.add("member-card")

        card.innerHTML = `
            <div class="member-heading">
                <h2>${member.name}</h2>
                <p>${member.tagline}</p>
            </div>

            <div class="member-content">

                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    width="150"
                    height="100"
                    loading="lazy"
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
                        <a href="tel:${member.phone}">
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
                ${member.description}
            </p>
        `

        membersContainer.appendChild(card)
    })
}


function getMembershipLevel(level) {

    switch (level) {

        case 3:
            return "Gold Member"

        case 2:
            return "Silver Member"

        default:
            return "Member"
    }
}


gridButton.addEventListener("click", () => {

    membersContainer.classList.remove("member-list")
    membersContainer.classList.add("member-grid")

    gridButton.classList.add("active-view")
    listButton.classList.remove("active-view")
})


listButton.addEventListener("click", () => {

    membersContainer.classList.remove("member-grid")
    membersContainer.classList.add("member-list")

    listButton.classList.add("active-view")
    gridButton.classList.remove("active-view")
})


currentYear.textContent = new Date().getFullYear()

lastModified.textContent = document.lastModified


getMembers()