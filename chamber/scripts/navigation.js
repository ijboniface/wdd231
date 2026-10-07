const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const themeButton = document.querySelector("#theme-button");

const THEME_KEY = "chamber-theme";


function markCurrentPage() {

    let page = window.location.pathname.split("/").pop() || "index.html";

    if (!page.includes(".")) {
        page += ".html";
    }

    if (page === "thankyou.html") {
        page = "join.html";
    }

    navigation.querySelectorAll("a").forEach((link) => {

        const isCurrent = link.getAttribute("href") === page;

        link.classList.toggle("active", isCurrent);

        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}


function setMenu(isOpen) {

    navigation.classList.toggle("open", isOpen);

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
}


function setTheme(isDark) {

    document.body.classList.toggle("dark-mode", isDark);

    themeButton.setAttribute("aria-pressed", isDark);

    themeButton.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
    );

    try {
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch (error) {
        // storage can be blocked; the theme still changes for this page
    }
}


function getSavedTheme() {

    try {
        return localStorage.getItem(THEME_KEY) === "dark";
    } catch (error) {
        return false;
    }
}


if (navigation) {

    markCurrentPage();

    // Escape closes the menu and returns focus to its button
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && navigation.classList.contains("open")) {
            setMenu(false);
            menuButton.focus();
        }
    });

    // the menu resets when the screen becomes wide
    window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {

        if (event.matches) {
            setMenu(false);
        }
    });
}

if (menuButton && navigation) {

    menuButton.addEventListener("click", () => {
        setMenu(!navigation.classList.contains("open"));
    });
}

if (themeButton) {

    setTheme(getSavedTheme());

    themeButton.addEventListener("click", () => {
        setTheme(!document.body.classList.contains("dark-mode"));
    });
}