const membershipForm = document.querySelector("#membership-form");
const timestampField = document.querySelector("#timestamp");


// Set the current date and time when the form loads
if (timestampField) {
    timestampField.value = new Date().toISOString();
}


// Membership modal functionality
const modalLinks = document.querySelectorAll(".modal-link");

modalLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        const modalId = link.getAttribute("data-modal");
        const modal = document.querySelector(`#${modalId}`);

        if (modal) {
            modal.showModal();
        }

    });

});


// Close modal buttons
const closeButtons = document.querySelectorAll(".close-modal");

closeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const dialog = button.closest("dialog");

        if (dialog) {
            dialog.close();
        }

    });

});


// Close a dialog when clicking outside its content
document.querySelectorAll("dialog").forEach((dialog) => {

    dialog.addEventListener("click", (event) => {

        const dialogDimensions = dialog.getBoundingClientRect();

        const clickedInside =
            event.clientX >= dialogDimensions.left &&
            event.clientX <= dialogDimensions.right &&
            event.clientY >= dialogDimensions.top &&
            event.clientY <= dialogDimensions.bottom;

        if (!clickedInside) {
            dialog.close();
        }

    });

});


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