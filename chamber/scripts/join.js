const membershipForm = document.querySelector("#membership-form");
const timestampField = document.querySelector("#timestamp");
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

// the date and time the form was opened
if (timestampField) {
    timestampField.value = new Date().toISOString();
}

// keep a copy of the answers in case the thank you page opens without them in its address
if (membershipForm) {
    membershipForm.addEventListener("submit", () => {
        const answers = Object.fromEntries(new FormData(membershipForm));

        try {
            sessionStorage.setItem("chamber-application", JSON.stringify(answers));
        } catch (error) {
            // storage is blocked, the address still carries the answers
        }
    });
}

document.querySelectorAll(".modal-link").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(`#${link.dataset.modal}`)?.showModal();
    });
});

document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
});

// clicking the dark area around a dialog closes it
document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
        const box = dialog.getBoundingClientRect();

        const inside =
            event.clientX >= box.left &&
            event.clientX <= box.right &&
            event.clientY >= box.top &&
            event.clientY <= box.bottom;

        if (!inside) {
            dialog.close();
        }
    });
});

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}