document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeBtn = document.querySelector("#side-menu .close");

    menuToggle.addEventListener("click", function (e) {
        e.preventDefault();
        sideMenu.classList.toggle("open");
    });

    closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        sideMenu.classList.remove("open");
    });
});
