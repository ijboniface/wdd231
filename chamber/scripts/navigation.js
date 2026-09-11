const menuButton = document.querySelector("#menu-button")
const navigation = document.querySelector("#navigation")
const themeButton = document.querySelector("#theme-button")


menuButton.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("open")

    menuButton.setAttribute("aria-expanded", isOpen)

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    )
})


themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode")

    const darkModeEnabled =
        document.body.classList.contains("dark-mode")

    themeButton.setAttribute(
        "aria-label",
        darkModeEnabled
            ? "Switch to light theme"
            : "Switch to dark theme"
    )
})