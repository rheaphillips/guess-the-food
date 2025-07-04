const changeNavbar = function (mql) {
    let navbar = document.querySelector('.navbar'), name = document.querySelector('.name'), logo = document.querySelector('.logo'), logoImage = document.querySelector('.logo-image'), menu = document.querySelector('.menu-button'), close = document.querySelector('.close-button'), btns = document.querySelector('.nav-btns');
    if (mql.matches) {  
        logoImage.src = 'assets/name.png';
        navbar.classList.remove('navbar-web');
        navbar.classList.add('navbar-phone');
        name.classList.add('hidden');
        logo.classList.add('name');
        btns.classList.remove('nav-btns-web');
        btns.classList.add('nav-btns-phone');
        btns.classList.add('hidden');
        menu.classList.remove('hidden');
        close.classList.remove('hidden');
    } 
    else {
        logo.classList.remove('hidden');
        logoImage.src = 'assets/logo.png';
        navbar.classList.add('navbar-web');
        navbar.classList.remove('navbar-phone');
        logo.classList.remove('name');
        document.querySelector('.name').classList.remove('hidden');
        btns.classList.add('nav-btns-web');
        btns.classList.remove('nav-btns-phone');
        btns.classList.remove('hidden');
        menu.classList.add('hidden');
        close.classList.add('hidden');
    } 
}

// MediaQueryList object
let mql = window.matchMedia("(max-width: 800px)")
changeNavbar(mql);

// Attach listener function on state changes
mql.addEventListener("change", function() {
  changeNavbar(mql);
});