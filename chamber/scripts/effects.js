const cardSelector = ".member-card, .membership-card, .discover-card, .forecast-day, .home-card, .spotlights-section";
const isTouchScreen = window.matchMedia("(hover: none)").matches;

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            .forEach((entry, order) => {
                entry.target.style.setProperty("--i", order);
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            });
    }, { threshold: 0.15 });

    const focusObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("in-focus", entry.isIntersecting);
        });
    }, { rootMargin: "-42% 0px -42% 0px" });

    function watch(card) {
        if (card.dataset.watched) {
            return;
        }

        card.dataset.watched = "true";
        card.classList.add("reveal");
        revealObserver.observe(card);

        if (isTouchScreen) {
            focusObserver.observe(card);
        }
    }

    document.querySelectorAll(cardSelector).forEach(watch);

    // cards that scripts add later (directory, home, discover)
    new MutationObserver((changes) => {
        changes.forEach((change) => {
            change.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) {
                    return;
                }

                if (node.matches(cardSelector)) {
                    watch(node);
                }

                node.querySelectorAll(cardSelector).forEach(watch);
            });
        });
    }).observe(document.body, { childList: true, subtree: true });
}