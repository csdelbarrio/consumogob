/**
 * main.js — Interacciones globales
 * Secretaría General de Consumo y Juego — DSCA
 *
 * Sin dependencias externas. JS mínimo; preferir CSS puro siempre que sea posible.
 */

(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     Menú hamburguesa + mega-menús
     ------------------------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.site-header__menu-toggle');
    var nav    = document.querySelector('.site-nav');
    var labelOpen  = toggle && toggle.querySelector('.site-header__menu-label--open');
    var labelClose = toggle && toggle.querySelector('.site-header__menu-label--close');

    if (!toggle || !nav) return;

    // Hamburguesa: abrir/cerrar todo el nav
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('site-nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (labelOpen)  labelOpen.hidden  = isOpen;
      if (labelClose) labelClose.hidden = !isOpen;
    });

    // Mega-menús: clic en los ítems con dropdown (desktop teclado + móvil)
    var dropdownItems = nav.querySelectorAll('.site-nav__item--has-dropdown');
    dropdownItems.forEach(function (item) {
      var link = item.querySelector('.site-nav__link');

      // En móvil, clic en el enlace padre abre/cierra el sub-menú
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          var isOpen = item.classList.toggle('is-open');
          link.setAttribute('aria-expanded', String(isOpen));
        }
      });

      // En desktop, hover con teclado (Enter/Space)
      link.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var isOpen = item.classList.toggle('is-open');
          link.setAttribute('aria-expanded', String(isOpen));
        }
        if (e.key === 'Escape') {
          item.classList.remove('is-open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        if (labelOpen)  labelOpen.hidden  = false;
        if (labelClose) labelClose.hidden = true;
        dropdownItems.forEach(function (item) {
          item.classList.remove('is-open');
          item.querySelector('.site-nav__link').setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        if (labelOpen)  labelOpen.hidden  = false;
        if (labelClose) labelClose.hidden = true;
        toggle.focus();
      }
    });
  }

  /* -------------------------------------------------------------------------
     Acordeones
     ------------------------------------------------------------------------- */
  function initAccordions() {
    const triggers = document.querySelectorAll('.accordion__trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);

        // Cerrar todos los demás del mismo accordion
        const parentAccordion = trigger.closest('.accordion');
        if (parentAccordion) {
          parentAccordion.querySelectorAll('.accordion__trigger').forEach(function (t) {
            if (t !== trigger) {
              t.setAttribute('aria-expanded', 'false');
              const p = document.getElementById(t.getAttribute('aria-controls'));
              if (p) p.setAttribute('aria-hidden', 'true');
            }
          });
        }

        // Alternar el actual
        trigger.setAttribute('aria-expanded', String(!isExpanded));
        if (panel) {
          panel.setAttribute('aria-hidden', String(isExpanded));
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
     Animaciones de entrada (IntersectionObserver)
     Añade clase .is-visible cuando el elemento entra en viewport
     ------------------------------------------------------------------------- */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------------------------
     Contador animado para estadísticas
     ------------------------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('es-ES') + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('es-ES') + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* -------------------------------------------------------------------------
     Carrusel de noticias
     - Avance automático cada 5 s
     - Dots de navegación
     - Pausa al hacer hover
     - Accesibilidad: aria-live, teclado
     ------------------------------------------------------------------------- */
  function initCarousel() {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;

    var track   = carousel.querySelector('.carousel__track');
    var dots    = carousel.querySelectorAll('.carousel__dot');
    var total   = dots.length;
    var current = 0;
    var timer   = null;
    var DELAY   = 5000;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        var active = i === current;
        d.classList.toggle('carousel__dot--active', active);
        d.setAttribute('aria-selected', String(active));
      });
    }

    function next() { goTo(current + 1); }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(next, DELAY);
    }

    function stopTimer() { clearInterval(timer); }

    // Dots
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-carousel-dot'), 10));
        startTimer();
      });
    });

    // Pausa en hover
    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);

    // Pausa en foco (accesibilidad teclado)
    carousel.addEventListener('focusin', stopTimer);
    carousel.addEventListener('focusout', startTimer);

    // Teclado: flechas cuando el carrusel tiene foco
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { goTo(current + 1); startTimer(); }
      if (e.key === 'ArrowLeft')  { goTo(current - 1); startTimer(); }
    });

    // Swipe táctil
    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        startTimer();
      }
    }, { passive: true });

    // Arrancar
    goTo(0);
    startTimer();
  }

  /* -------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initAccordions();
    initScrollReveal();
    initCounters();
    initCarousel();
  });

})();
