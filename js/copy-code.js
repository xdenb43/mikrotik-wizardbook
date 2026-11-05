function addCopyButtons() {
    document.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".copy-code-button")) return;

        const code = pre.querySelector("code");
        if (!code) return;

        const button = document.createElement("button");
        button.className = "copy-code-button";
        button.type = "button";
        button.title = "Copy code";
        button.setAttribute("aria-label", "Copy code");

        const copyIcon = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="8" y="8" width="12" height="12" rx="2"></rect>
                <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path>
            </svg>
        `;

        const checkIcon = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12l5 5L20 7"></path>
            </svg>
        `;

        button.innerHTML = copyIcon;

        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(code.innerText);

                button.classList.add("copied");
                button.title = "Copied!";
                button.innerHTML = checkIcon;

                setTimeout(() => {
                    button.classList.remove("copied");
                    button.title = "Copy code";
                    button.innerHTML = copyIcon;
                }, 1500);

            } catch (error) {
                button.title = "Copy failed";
            }
        });

        pre.appendChild(button);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addCopyButtons);
} else {
    addCopyButtons();
}