const changeNavbar = function (mql) {
  let navbar = document.querySelector(".guess-the-food-navbar"),
    name = document.querySelector(".guess-the-food-name"),
    logo = document.querySelector(".guess-the-food-logo"),
    logoImage = document.querySelector(".guess-the-food-logo-image"),
    menu = document.querySelector(".guess-the-food-menu-button"),
    close = document.querySelector(".guess-the-food-close-button"),
    btns = document.querySelector(".guess-the-food-nav-btns");
  if (mql.matches) {
    logoImage.src = "assets/name.png";
    navbar.classList.remove("guess-the-food-navbar-web");
    navbar.classList.add("guess-the-food-navbar-phone");
    name.classList.add("guess-the-food-hidden");
    logo.classList.add("guess-the-food-name");
    btns.classList.remove("guess-the-food-nav-btns-web");
    btns.classList.add("guess-the-food-nav-btns-phone");
    btns.classList.add("guess-the-food-hidden");
    menu.classList.remove("guess-the-food-hidden");
    close.classList.remove("guess-the-food-hidden");
  } else {
    logo.classList.remove("guess-the-food-hidden");
    logoImage.src = "assets/logo.png";
    navbar.classList.add("guess-the-food-navbar-web");
    navbar.classList.remove("guess-the-food-navbar-phone");
    logo.classList.remove("guess-the-food-name");
    document
      .querySelector(".guess-the-food-name")
      .classList.remove("guess-the-food-hidden");
    btns.classList.add("guess-the-food-nav-btns-web");
    btns.classList.remove("guess-the-food-nav-btns-phone");
    btns.classList.remove("guess-the-food-hidden");
    menu.classList.add("guess-the-food-hidden");
    close.classList.add("guess-the-food-hidden");
  }
};

// MediaQueryList object
let mql = window.matchMedia("(max-width: 800px)");
changeNavbar(mql);

// Attach listener function on state changes
mql.addEventListener("change", function () {
  changeNavbar(mql);
});
