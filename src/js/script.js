// Ativa e desativa a barra de pesquisa.
let search = document.querySelector('.search-box');

document.querySelector('#search-icon').onclick = () => {
  search.classList.toggle('active');
  navbar.classList.remove('active');
}

// Mostra o menu quando estiver responsivo
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-icon').onclick = () => {
  navbar.classList.toggle('active');
  search.classList.remove('active');
}

// Ocultar o menu quando estiver responsivo
window.onscroll = () => {
  navbar.classList.remove('active');
  search.classList.remove('active');
}

// Oculta o menu quando rolar a pagina
let header = document.querySelector('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('shadow', window.scrollY > 0);
});