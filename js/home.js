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
    var pauseBtn = carousel.querySelector('[data-hero-pause]');
    var current = 0;
    var timer = null;
    var INTERVAL = 7000;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var playing = !reducedMotion;

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, idx) {
        d.setAttribute('aria-current', idx === current ? 'true' : 'false');
      });
      slides.forEach(function (s, idx) {
        s.setAttribute('aria-hidden', idx === current ? 'false' : 'true');
        // Evitar foco en slides ocultas
        var links = s.querySelectorAll('a, button');
        links.forEach(function (l) { l.tabIndex = idx === current ? 0 : -1; });
      });
    }

    function play() {
      if (timer || reducedMotion) return;
      playing = true;
      updatePauseBtn();
      timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
    }

    function stop() {
      playing = false;
      updatePauseBtn();
      clearInterval(timer);
      timer = null;
    }

    function updatePauseBtn() {
      if (!pauseBtn) return;
      pauseBtn.setAttribute('aria-label', playing ? 'Pausar carrusel' : 'Reproducir carrusel');
      pauseBtn.querySelector('.icon-pause').hidden = !playing;
      pauseBtn.querySelector('.icon-play').hidden = playing;
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { stop(); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stop(); goTo(current + 1); });
    if (pauseBtn) pauseBtn.addEventListener('click', function () { playing ? stop() : play(); });

    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { stop(); goTo(idx); });
    });

    // Pausa al pasar el ratón o al enfocar con teclado
    carousel.addEventListener('mouseenter', function () { if (playing) { clearInterval(timer); timer = null; } });
    carousel.addEventListener('mouseleave', function () { if (playing && !timer) { timer = setInterval(function () { goTo(current + 1); }, INTERVAL); } });
    carousel.addEventListener('focusin', function () { if (playing) { clearInterval(timer); timer = null; } });
    carousel.addEventListener('focusout', function () { if (playing && !timer) { timer = setInterval(function () { goTo(current + 1); }, INTERVAL); } });

    // Teclado: flechas izquierda/derecha cuando el carrusel tiene foco
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { stop(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { stop(); goTo(current + 1); }
    });

    goTo(0);
    play();
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
     2b. INSTAGRAM SCROLLER (vertical)
     ------------------------------------------------------------------ */
  var insta = document.querySelector('.insta-scroller');
  if (insta) {
    var iUp = document.querySelector('[data-insta-up]');
    var iDown = document.querySelector('[data-insta-down]');
    var STEP = 340;
    function updateInstaArrows() {
      if (!iUp || !iDown) return;
      iUp.disabled = insta.scrollTop <= 4;
      iDown.disabled = insta.scrollTop + insta.clientHeight >= insta.scrollHeight - 4;
    }
    if (iUp) iUp.addEventListener('click', function () { insta.scrollBy({ top: -STEP, behavior: 'smooth' }); });
    if (iDown) iDown.addEventListener('click', function () { insta.scrollBy({ top: STEP, behavior: 'smooth' }); });
    insta.addEventListener('scroll', updateInstaArrows, { passive: true });
    updateInstaArrows();
  }

  /* ------------------------------------------------------------------
     2c. VIDEO SCROLLER (horizontal)
     ------------------------------------------------------------------ */
  var vtrack = document.querySelector('.video-scroller__track');
  if (vtrack) {
    var vPrev = document.querySelector('[data-video-prev]');
    var vNext = document.querySelector('[data-video-next]');
    var VCARD = 356;
    function updateVideoArrows() {
      if (!vPrev || !vNext) return;
      vPrev.disabled = vtrack.scrollLeft <= 4;
      vNext.disabled = vtrack.scrollLeft + vtrack.clientWidth >= vtrack.scrollWidth - 4;
    }
    if (vPrev) vPrev.addEventListener('click', function () { vtrack.scrollBy({ left: -VCARD * 2, behavior: 'smooth' }); });
    if (vNext) vNext.addEventListener('click', function () { vtrack.scrollBy({ left: VCARD * 2, behavior: 'smooth' }); });
    vtrack.addEventListener('scroll', updateVideoArrows, { passive: true });
    window.addEventListener('resize', updateVideoArrows);
    updateVideoArrows();
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
