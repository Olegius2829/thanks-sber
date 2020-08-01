const menuToggle = document.querySelector('.header__menu-toggle');
const menuHeader = document.querySelector('.header__menu-wrapper');

menuToggle.addEventListener('click', (evt) => {
  evt.preventDefault();
  menuHeader.classList.toggle('header__menu-wrapper-opened');
  menuToggle.classList.toggle('header__menu-toggle--opened');
});
