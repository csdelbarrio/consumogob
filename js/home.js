/* ==========================================================================
   HOME.JS — Carrusel hero + scroller de noticias + chatbot demo
   Accesible: teclado, aria, pausa, respeta prefers-reduced-motion
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. HERO CAROUSEL
     ------------------------------------------------------------------ */
  var carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    var track = carousel.querySelector('.hero-carousel__track');
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var prevBtn = carousel.querySelector('[data-hero-prev]');
    var nextBtn = carousel.querySelector('[data-hero-next]');
    var toggleBtn = carousel.querySelector('[data-hero-toggle]');
    var live = carousel.querySelector('[data-hero-live]');
    var iconPause = toggleBtn ? toggleBtn.querySelector('.hero-icon-pause') : null;
    var iconPlay = toggleBtn ? toggleBtn.querySelector('.hero-icon-play') : null;
    var current = 0;
    var timer = null;
    var paused = false;
    var INTERVAL = 5000;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, idx) {
        d.setAttribute('aria-current', idx === current ? 'true' : 'false');
      });
      slides.forEach(function (s, idx) {
        s.setAttribute('aria-hidden', idx === current ? 'false' : 'true');
        var links = s.querySelectorAll('a, button');
        links.forEach(function (l) { l.tabIndex = idx === current ? 0 : -1; });
      });
      // Anunciar el cambio a lectores de pantalla
      if (live) {
        var title = slides[current].querySelector('.hero-slide__title');
        live.textContent = 'Diapositiva ' + (current + 1) + ' de ' + slides.length + (title ? ': ' + title.textContent : '');
      }
    }

    function startAuto() {
      if (timer || reducedMotion || paused) return;
      timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
    }
    function stopAuto() {
      clearInterval(timer);
      timer = null;
    }

    // Botón pausar / reproducir (WCAG 2.2.2)
    function setPaused(state) {
      paused = state;
      stopAuto();
      if (!paused) startAuto();
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', paused ? 'Reproducir el carrusel' : 'Pausar el carrusel');
        if (iconPause) iconPause.style.display = paused ? 'none' : '';
        if (iconPlay) iconPlay.style.display = paused ? '' : 'none';
      }
    }
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () { setPaused(!paused); });
    }
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { goTo(idx); });
    });

    // Avance automático: se detiene con el ratón encima o al enfocar con teclado
    // (salvo que el usuario haya pausado explícitamente, en cuyo caso sigue pausado)
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);

    // Teclado: flechas izquierda/derecha cuando el carrusel tiene foco
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    goTo(0);
    startAuto();
  }

  /* ------------------------------------------------------------------
     2. NEWS SCROLLER
     ------------------------------------------------------------------ */
  var scroller = document.querySelector('.news-scroller');
  if (scroller) {
    var strack = scroller.querySelector('.news-scroller__track');
    var sPrev = scroller.parentElement.querySelector('[data-news-prev]');
    var sNext = scroller.parentElement.querySelector('[data-news-next]');
    var CARD = 316; // ancho tarjeta + gap

    function updateArrows() {
      if (!sPrev || !sNext) return;
      sPrev.disabled = strack.scrollLeft <= 4;
      sNext.disabled = strack.scrollLeft + strack.clientWidth >= strack.scrollWidth - 4;
    }

    if (sPrev) sPrev.addEventListener('click', function () { strack.scrollBy({ left: -CARD * 2, behavior: 'smooth' }); });
    if (sNext) sNext.addEventListener('click', function () { strack.scrollBy({ left: CARD * 2, behavior: 'smooth' }); });
    strack.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();
  }

  /* ------------------------------------------------------------------
     2b. VIDEO SCROLLER (YouTube, 3 columnas)
     ------------------------------------------------------------------ */
  var vtrack = document.querySelector('.social-yt .video-scroller__track');
  if (vtrack) {
    var vPrev = document.querySelector('[data-video-prev]');
    var vNext = document.querySelector('[data-video-next]');
    function videoStep() {
      var first = vtrack.querySelector('.video-embed');
      var gap = 16;
      return first ? first.getBoundingClientRect().width + gap : 320;
    }
    function updateVideoArrows() {
      if (!vPrev || !vNext) return;
      vPrev.disabled = vtrack.scrollLeft <= 4;
      vNext.disabled = vtrack.scrollLeft + vtrack.clientWidth >= vtrack.scrollWidth - 4;
    }
    if (vPrev) vPrev.addEventListener('click', function () { vtrack.scrollBy({ left: -videoStep(), behavior: 'smooth' }); });
    if (vNext) vNext.addEventListener('click', function () { vtrack.scrollBy({ left: videoStep(), behavior: 'smooth' }); });
    vtrack.addEventListener('scroll', updateVideoArrows, { passive: true });
    window.addEventListener('resize', updateVideoArrows);
    updateVideoArrows();
  }

  /* ------------------------------------------------------------------
     2c. NEWS SCROLLER (carrusel de noticias)
     ------------------------------------------------------------------ */
  var ntrack = document.querySelector('.news-scroller__track');
  if (ntrack) {
    var nPrev = document.querySelector('[data-news-prev]');
    var nNext = document.querySelector('[data-news-next]');
    function newsStep() {
      var first = ntrack.querySelector('.news-card3');
      var gap = 24;
      return first ? first.getBoundingClientRect().width + gap : 320;
    }
    function updateNewsArrows() {
      if (!nPrev || !nNext) return;
      nPrev.disabled = ntrack.scrollLeft <= 4;
      nNext.disabled = ntrack.scrollLeft + ntrack.clientWidth >= ntrack.scrollWidth - 4;
    }
    if (nPrev) nPrev.addEventListener('click', function () { ntrack.scrollBy({ left: -newsStep(), behavior: 'smooth' }); });
    if (nNext) nNext.addEventListener('click', function () { ntrack.scrollBy({ left: newsStep(), behavior: 'smooth' }); });
    ntrack.addEventListener('scroll', updateNewsArrows, { passive: true });
    window.addEventListener('resize', updateNewsArrows);
    updateNewsArrows();
  }

  /* ------------------------------------------------------------------
     3. CHATBOT — panel demo
     ------------------------------------------------------------------ */
  var fab = document.querySelector('.chatbot-fab');
  var panel = document.querySelector('.chatbot-panel');
  if (fab && panel) {
    var closeBtn = panel.querySelector('.chatbot-panel__close');

    function openPanel() {
      panel.classList.add('is-open');
      fab.setAttribute('aria-expanded', 'true');
      panel.querySelector('.chatbot-suggestion, .chatbot-panel__close').focus();
    }
    function closePanel() {
      panel.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
      fab.focus();
    }

    fab.addEventListener('click', function () {
      panel.classList.contains('is-open') ? closePanel() : openPanel();
    });
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });

    // Las sugerencias enlazan al SAC con el tema preseleccionado (demo)
    panel.querySelectorAll('.chatbot-suggestion').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.location.href = btn.getAttribute('data-href') || '/consumogob/te-ayudamos/';
      });
    });
  }
})();
