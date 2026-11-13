/* simonlegrand.co.uk
   Three small behaviours, no dependencies:
   1 header state on scroll  2 full-screen menu  3 Idea Observatory themes */
(function () {
  'use strict';

  /* 1 Header: clear over the hero, solid once the page has moved */
  var header = document.querySelector('.site-header');
  if (header) {
    var setScrolled = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  /* 2 Menu: a modal layer. Opening moves focus in, Escape or a link closes it,
     and focus returns to the button. The rest of the page is made inert. */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu && header) {
    var label = toggle.querySelector('.menu-toggle__label');
    var outside = document.querySelectorAll('main, .site-footer');

    var setMenu = function (open) {
      menu.classList.toggle('is-open', open);
      header.classList.toggle('is-menu-open', open);
      document.documentElement.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) { label.textContent = open ? 'Close' : 'Menu'; }
      outside.forEach(function (el) { el.inert = open; });
      if (open) {
        var first = menu.querySelector('a');
        if (first) { first.focus({ preventScroll: true }); }
      } else {
        toggle.focus({ preventScroll: true });
      }
    };
    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };

    toggle.addEventListener('click', function () { setMenu(!isOpen()); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setMenu(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) { return; }
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key !== 'Tab') { return; }
      /* Keep Tab inside the header controls and the menu links */
      var stops = Array.prototype.slice.call(header.querySelectorAll('a, button'))
        .concat(Array.prototype.slice.call(menu.querySelectorAll('a')))
        .filter(function (el) { return el.offsetParent !== null; });
      var first = stops[0];
      var last = stops[stops.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* 3 Idea Observatory: choose a theme to see which questions cross it.
     Nothing is removed from the page, so it reads the same with scripts off. */
  var obs = document.querySelector('[data-observatory]');
  if (obs) {
    var buttons = obs.querySelectorAll('[data-theme]');
    var items = obs.querySelectorAll('[data-themes]');
    var status = obs.querySelector('[data-status]');
    var idle = status ? status.textContent : '';

    var apply = function (theme, name) {
      var count = 0;
      items.forEach(function (item) {
        var match = !!theme && item.getAttribute('data-themes').split(' ').indexOf(theme) !== -1;
        item.classList.toggle('is-match', match);
        item.classList.toggle('is-dim', !!theme && !match);
        if (match) { count += 1; }
      });
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-theme') === theme));
      });
      if (status) {
        status.textContent = theme
          ? count + ' of ' + items.length + ' questions cross ' + name + '. Select it again to clear.'
          : idle;
      }
    };

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') === 'true';
        apply(on ? '' : b.getAttribute('data-theme'), b.textContent.trim().toLowerCase());
      });
    });
  }
})();
