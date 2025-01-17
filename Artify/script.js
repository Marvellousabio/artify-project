// Select elements
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('dropdown-menu');

// Add event listener for toggle
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  menuToggle.classList.toggle('open');
});
