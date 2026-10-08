const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#navigation");
const themeButton = document.querySelector("#theme-button");
const themeKey = "chamber-theme";

function markCurrentPage() {
    let page = window.location.pathname.split("/").pop() || "index.html";

    if (!page.includes(".")) {
        page += ".html";
    }

    // the thank you page belongs to the Join tab
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
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeButton.setAttribute("aria-pressed", isDark);
    themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");

    try {
        localStorage.setItem(themeKey, isDark ? "dark" : "light");
    } catch (error) {
        // storage is blocked, the theme only lasts for this page
    }
}

function savedThemeIsDark() {
    try {
        return localStorage.getItem(themeKey) === "dark";
    } catch (error) {
        return false;
    }
}

if (navigation) {
    markCurrentPage();

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navigation.classList.contains("open")) {
            setMenu(false);
            menuButton.focus();
        }
    });

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
    setTheme(savedThemeIsDark());

    themeButton.addEventListener("click", () => {
        setTheme(!document.body.classList.contains("dark-mode"));
    });
}