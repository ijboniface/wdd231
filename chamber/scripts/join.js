const timestampField = document.querySelector("#timestamp");
const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");


if (timestampField) {
    timestampField.value = new Date().toISOString();
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