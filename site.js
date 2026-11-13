/* simonlegrand.co.uk
   Two small behaviours, no dependencies:
   1 header rule on scroll  2 full-screen menu */
(function () {
  'use strict';

  /* 1 Header: gains a hairline once the page has moved */
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

})();
