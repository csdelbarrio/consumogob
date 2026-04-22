/**
 * main.js — Interacciones globales
 * Secretaría General de Consumo y Juego — DSCA
 *
 * Sin dependencias externas. JS mínimo; preferir CSS puro siempre que sea posible.
 */

(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     Menú hamburguesa (móvil)
     ------------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.site-header__menu-toggle');
    const nav = document.querySelector('.site-nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('site-nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      // Actualizar icono
      toggle.innerHTML = isOpen ? iconClose() : iconHamburger();
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = iconHamburger();
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('site-nav--open')) {
        nav.classList.remove('site-nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = iconHamburger();
        toggle.focus();
      }
    });
  }

  function iconHamburger() {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>`;
  }

  function iconClose() {
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>`;
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
     Init
     ------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initAccordions();
    initScrollReveal();
    initCounters();
  });

})();
