/* Jubilee2040.com - navigation behaviour (drawer, focus, table cards)
   Pages in the main tour ship the nav in their HTML; other pages (papers, links,
   calculators) get the same bar + drawer injected here. */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement, body = doc.body;

  /* where this script lives = site root (works from file:// and from sub-folders) */
  var me = doc.querySelector('script[src$="nav.js"]');
  var P = me ? me.getAttribute('src').replace(/nav\.js$/, '') : '/';
  var BAR = '<div class="site-bar" role="banner"><button class="site-bar__toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line class="l1" x1="4" y1="6" x2="20" y2="6"/><line class="l2" x1="4" y1="12" x2="20" y2="12"/><line class="l3" x1="4" y1="18" x2="20" y2="18"/></svg></button><a class="site-bar__brand" href="__P__index.html">Jubilee 2040</a><a class="site-bar__tour" href="__P__01-priestly-courses.html">Start tour</a></div><div class="site-overlay" aria-hidden="true"></div>'.split('__P__').join(P);
  var NAV = '<nav class="sidebar" id="site-nav" role="navigation" aria-label="Main navigation"><div class="sidebar-header"><h2><a href="__P__index.html" class="site-title">Jubilee 2040</a></h2><p class="author">by Paul Tretter</p><button type="button" class="sidebar__close" aria-label="Close menu">&times;</button></div><ul class="nav-menu"><li><a href="__P__index.html" class="nav-link">Home</a></li><li class="nav-section-title">The Proof</li><li><a href="__P__01-priestly-courses.html" class="nav-link">1. The Priestly Courses</a></li><li><a href="__P__02-jubilee-cycles.html" class="nav-link">2. The Jubilee Cycles</a></li><li><a href="__P__03-prophetic-blocks.html" class="nav-link">3. The Prophetic Blocks</a></li><li><a href="__P__04-480-paradox.html" class="nav-link">4. The 480-Year Paradox</a></li><li><a href="__P__05-ptolemaic-error.html" class="nav-link">5. The Ptolemaic Error</a></li><li><a href="__P__06-astronomical-kill-shot.html" class="nav-link">6. The Astronomical Kill Shot</a></li><li><a href="__P__07-broken-compasses.html" class="nav-link">7. The Broken Compasses</a></li><li><a href="__P__08-bayesian-verdict.html" class="nav-link">8. The Bayesian Verdict</a></li><li><a href="__P__09-pentecost-countdown.html" class="nav-link">9. The Pentecost Countdown</a></li><li><a href="__P__10-final-calculation.html" class="nav-link">10. The Final Calculation</a></li><li><a href="__P__11-ultimate-so-what.html" class="nav-link">11. The Ultimate &quot;So What&quot;</a></li><li><a href="__P__12-final-validation.html" class="nav-link">12. The Final Validation</a></li></ul><div class="nav-section-title">Resources</div><ul class="nav-menu"><li><a href="__P__papers/index.html">📄 Research Papers</a></li><li><a href="__P__links/index.html">🔗 Other Links</a></li><li><a href="__P__about.html">ℹ️ About the Author</a></li></ul><div class="nav-section-title">Timeline</div><ul class="nav-menu"><li><a href="__P__timeline.html">📅 Master Timeline</a></li></ul><div class="utilities-section"><div class="utilities-title">Utilities</div><ul class="utilities-menu"><li><a href="__P__priestly-course-calculator.html">⚙️ Priestly Course Calculator</a></li><li><a href="__P__calculator.html">🎺 Jubilee Calculator</a></li></ul></div></nav>'.split('__P__').join(P);

  /* ---- inject on pages that don't already have the nav ---- */
  if (!doc.querySelector('.site-bar')) {
    var wrap = doc.createElement('div');
    wrap.innerHTML = BAR + NAV;
    while (wrap.firstChild) { body.insertBefore(wrap.firstChild, body.firstChild); }
    body.classList.add('has-site-bar');
  }

  var bar = doc.querySelector('.site-bar');
  var toggle = doc.querySelector('.site-bar__toggle');
  var overlay = doc.querySelector('.site-overlay');
  var drawer = doc.getElementById('site-nav');
  var closeBtn = drawer && drawer.querySelector('.sidebar__close');

  /* ---- mark the current page ---- */
  if (drawer && !drawer.querySelector('[aria-current="page"]')) {
    var path = location.pathname.replace(/index\.html$/, '');
    var best = null, bestLen = -1;
    drawer.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.pathname.replace(/index\.html$/, '');
      var hit = (h === path) || (h.slice(-1) === '/' && h.length > 1 && path.indexOf(h) === 0 && h.split('/').length > 2);
      if (hit && h.length > bestLen) { best = a; bestLen = h.length; }
    });
    if (best) { best.setAttribute('aria-current', 'page'); best.classList.add('active'); }
  }

  /* ---- drawer open / close ---- */
  var lastFocus = null;
  function isOpen() { return drawer && drawer.classList.contains('is-open'); }

  function openNav() {
    if (!drawer || isOpen()) return;
    lastFocus = doc.activeElement;
    drawer.classList.add('is-open');
    overlay && overlay.classList.add('is-visible');
    html.classList.add('nav-open');
    toggle && (toggle.setAttribute('aria-expanded', 'true'), toggle.setAttribute('aria-label', 'Close menu'));
    var cur = drawer.querySelector('[aria-current="page"]');
    if (cur) { try { cur.scrollIntoView({ block: 'center' }); } catch (e) {} }
    setTimeout(function () { (closeBtn || drawer).focus({ preventScroll: true }); }, 30);
  }
  function closeNav(returnFocus) {
    if (!drawer || !isOpen()) return;
    drawer.classList.remove('is-open');
    overlay && overlay.classList.remove('is-visible');
    html.classList.remove('nav-open');
    toggle && (toggle.setAttribute('aria-expanded', 'false'), toggle.setAttribute('aria-label', 'Open menu'));
    if (returnFocus !== false && toggle) toggle.focus({ preventScroll: true });
  }

  toggle && toggle.addEventListener('click', function () { isOpen() ? closeNav() : openNav(); });
  closeBtn && closeBtn.addEventListener('click', function () { closeNav(); });
  overlay && overlay.addEventListener('click', function () { closeNav(); });
  drawer && drawer.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a[href]')) closeNav(false);
  });

  doc.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { closeNav(); return; }
    if (e.key !== 'Tab') return;
    var f = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || doc.activeElement === drawer)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* swipe left on the drawer to dismiss */
  var sx = null, sy = null;
  drawer && drawer.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  drawer && drawer.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = sy = null;
    if (dx < -70 && Math.abs(dy) < 50) closeNav();
  }, { passive: true });

  /* leaving mobile width with the drawer open (rotate / resize) */
  if (window.matchMedia) {
    var mq = window.matchMedia('(min-width: 1024px)');
    var onMq = function () { if (mq.matches && body.classList.contains('has-sidebar')) closeNav(false); };
    mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);
  }

  /* ---- tables -> labelled cards on phones (CSS does the stacking) ----
     Only simple tables are converted: one header row, no merged cells.
     Everything else keeps horizontal scroll. */
  doc.querySelectorAll('.content-page table').forEach(function (t) {
    var ths = t.querySelectorAll('thead tr:only-child > th');
    var rows = t.querySelectorAll('tbody tr');
    if (!ths.length || !rows.length) return;
    if (t.querySelectorAll('thead tr').length !== 1) return;
    if (t.querySelector('[colspan],[rowspan]')) return;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].children.length !== ths.length) return;
    }
    var labels = Array.prototype.map.call(ths, function (th) { return th.innerText.replace(/\s+/g, ' ').trim(); });
    rows.forEach(function (r) {
      Array.prototype.forEach.call(r.children, function (td, i) { td.setAttribute('data-label', labels[i]); });
    });
    t.classList.add('table-stack');
  });
})();
