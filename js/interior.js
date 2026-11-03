/* Scroll-spy del índice lateral ("En esta página" / "Cómo reclamar")
   Marca como activo el enlace de la sección visible. Accesible: aria-current="location". */
(function () {
  'use strict';
  var toc = document.querySelector('.side-nav--toc');
  if (!toc || !('IntersectionObserver' in window)) return;
  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var map = {};
  links.forEach(function (a) {
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var el = document.getElementById(id);
    if (el) map[id] = { link: a, el: el };
  });
  var ids = Object.keys(map);
  if (!ids.length) return;
  function setActive(id) {
    links.forEach(function (a) {
      a.classList.remove('side-nav__link--active');
      a.removeAttribute('aria-current');
    });
    if (id && map[id]) {
      map[id].link.classList.add('side-nav__link--active');
      map[id].link.setAttribute('aria-current', 'location');
    }
  }
  var visible = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    for (var i = 0; i < ids.length; i++) { if (visible[ids[i]]) { setActive(ids[i]); return; } }
  }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 });
  ids.forEach(function (id) { io.observe(map[id].el); });
  links.forEach(function (a) {
    a.addEventListener('click', function () { setActive(a.getAttribute('href').slice(1)); });
  });
})();
