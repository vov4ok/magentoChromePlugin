document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    // Tab click event to switch between tabs
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            tabContents.forEach(content => {
                content.classList.remove("active");
            });

            const target = tab.getAttribute("data-target");
            document.getElementById(target).classList.add("active");
        });
    });
});