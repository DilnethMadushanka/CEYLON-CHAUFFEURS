/**
 * Ceylon Chauffeurs - public website ⇄ Firebase sync
 *
 * When js/firebase-config.js holds a real Firebase config, this script:
 *   1. Saves every booking-form inquiry to Firestore (collection "bookings") so it appears
 *      live in the admin dashboard.
 *   2. Loads content managed in /admin (settings, vehicle prices, tour packages, reviews, FAQs)
 *      and applies it to the page, replacing the built-in defaults.
 *
 * Without a config it does nothing and the site keeps using its built-in data.
 * Load order on each page: firebase-config.js → i18n.js → main.js → (page script) → site-sync.js
 */
(function () {
  'use strict';

  var DEFAULT_DAILY = { 65: 'sedan', 105: 'van', 160: 'bus' };
  var db = null;

  var sync = {
    enabled: !!window.CC_FIREBASE_READY,
    ready: null,
    saveBooking: function (record) {
      if (!sync.enabled) return Promise.resolve(null);
      return sync.ready.then(function () {
        var payload = {};
        Object.keys(record).forEach(function (k) { if (record[k] !== undefined) payload[k] = record[k]; });
        payload.status = 'New';
        payload.source = 'website';
        payload.createdAt = new Date().toISOString();
        payload.amountPaidUSD = 0;
        payload.paymentStatus = 'Unpaid';
        payload.assignedDriver = '';
        payload.activity = [{ at: payload.createdAt, by: 'website', text: 'Inquiry submitted from the booking form' }];
        return db.collection('bookings').add(payload).then(function (ref) { return ref.id; });
      }).catch(function (err) {
        console.warn('[Ceylon Chauffeurs] Booking could not be saved to Firebase:', err);
        return null;
      });
    }
  };
  window.CCSync = sync;

  /* ---------------- Visitor analytics ----------------
   * One small record per page view: page, source, device, time zone, language and an
   * anonymous browser id (no names, emails or IP addresses). Shown in Admin → Visitors.
   */
  function buildVisit() {
    var ua = navigator.userAgent || '';
    if (/bot|crawl|spider|slurp|lighthouse|headless/i.test(ua)) return null;
    var vid = null, isNew = false, session = false;
    try {
      vid = localStorage.getItem('cc_vid');
      if (!vid) { vid = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem('cc_vid', vid); isNew = true; }
      if (!sessionStorage.getItem('cc_sess')) { sessionStorage.setItem('cc_sess', '1'); session = true; }
    } catch (e) { vid = vid || 'anon'; }
    var ref = '';
    try { if (document.referrer) { var r = new URL(document.referrer); if (r.host !== location.host) ref = r.host.replace(/^www\./, ''); } } catch (e) { /* ignore */ }
    var utm = '';
    try { utm = new URLSearchParams(location.search).get('utm_source') || ''; } catch (e) { /* ignore */ }
    var w = Math.min(screen.width || 0, window.innerWidth || 9999);
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* ignore */ }
    var path = location.pathname.replace(/\/index\.html$/, '/').split('/').pop() || 'index.html';
    return {
      at: new Date().toISOString(),
      page: path.slice(0, 80),
      title: String(document.title || '').split('|')[0].trim().slice(0, 120),
      ref: (utm || ref).slice(0, 80),
      device: /iPad|Tablet/i.test(ua) || (w >= 600 && w < 1024 && /Mobi|Android/i.test(ua)) ? 'tablet' : (/Mobi|Android|iPhone/i.test(ua) || w < 600 ? 'mobile' : 'desktop'),
      tz: tz.slice(0, 60),
      lang: String(navigator.language || '').slice(0, 12),
      vid: String(vid).slice(0, 40),
      isNew: isNew,
      session: session
    };
  }

  var visit = buildVisit();

  if (!sync.enabled) {
    sync.ready = Promise.resolve();
    // Demo mode: keep visits in this browser so the admin demo can show them.
    if (visit) {
      try {
        var list = JSON.parse(localStorage.getItem('cc_demo_visits') || '[]');
        list.push(visit);
        localStorage.setItem('cc_demo_visits', JSON.stringify(list.slice(-3000)));
      } catch (e) { /* ignore */ }
    }
    return;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.async = true; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  var base = 'https://www.gstatic.com/firebasejs/' + (window.CC_FIREBASE_SDK_VERSION || '10.14.1') + '/';
  sync.ready = loadScript(base + 'firebase-app-compat.js')
    .then(function () { return loadScript(base + 'firebase-firestore-compat.js'); })
    .then(function () {
      var app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.CC_FIREBASE_CONFIG);
      db = app.firestore();
    });

  if (visit) {
    sync.ready.then(function () { return db.collection('visits').add(visit); })
      .catch(function (err) { console.warn('[Ceylon Chauffeurs] Visit not recorded:', err && err.code); });
  }

  function getAll(col) {
    return db.collection(col).get().then(function (snap) {
      return snap.docs.map(function (d) { var o = d.data(); o.id = d.id; return o; });
    }).catch(function (err) { console.warn('[Ceylon Chauffeurs] Could not load ' + col, err); return []; });
  }

  function byOrder(a, b) { return (a.order || 999) - (b.order || 999); }

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function domReady() {
    return new Promise(function (resolve) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resolve);
      else resolve();
    });
  }

  Promise.all([sync.ready, domReady()]).then(function () {
    return Promise.all([
      db.collection('settings').doc('site').get().then(function (s) { return s.exists ? s.data() : null; }).catch(function () { return null; }),
      getAll('vehicles'), getAll('packages'), getAll('reviews'), getAll('faqs')
    ]);
  }).then(function (res) {
    var settings = res[0], vehicles = res[1], packages = res[2], reviews = res[3], faqs = res[4];
    try { if (settings) applySettings(settings); } catch (e) { console.warn(e); }
    try { if (vehicles.length) applyVehicles(vehicles); } catch (e) { console.warn(e); }
    try { if (packages.length) applyPackages(packages.filter(function (p) { return p.active !== false; }).sort(byOrder)); } catch (e) { console.warn(e); }
    try { if (reviews.length) applyReviews(reviews.filter(function (r) { return r.published !== false; }).sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || byOrder(a, b); })); } catch (e) { console.warn(e); }
    try { if (faqs.length) applyFaqs(faqs.filter(function (f) { return f.published !== false; }).sort(byOrder)); } catch (e) { console.warn(e); }
    if (typeof window.updateAllCurrencyDisplays === 'function') window.updateAllCurrencyDisplays();
    else if (typeof updateAllCurrencyDisplays === 'function') updateAllCurrencyDisplays();
    document.documentElement.classList.add('cc-synced');
    window.dispatchEvent(new CustomEvent('ceylon_content_synced'));
  }).catch(function (err) {
    console.warn('[Ceylon Chauffeurs] Firebase sync skipped:', err);
  });

  /* ---------------- Settings ---------------- */
  function applySettings(s) {
    var cfg = window.CEYLON_CHAUFFEUR_CONFIG;
    if (cfg) {
      var oldPhone = cfg.phone, oldDisplay = cfg.displayPhone, oldEmail = cfg.email, oldInfo = cfg.infoEmail;
      ['phone', 'displayPhone', 'email', 'infoEmail', 'officeAddress', 'defaultWhatsAppMessage'].forEach(function (k) { if (s[k]) cfg[k] = s[k]; });
      if (s.phone && s.phone !== oldPhone) {
        document.querySelectorAll('a[href*="wa.me/' + oldPhone + '"], a[href^="tel:"]').forEach(function (a) {
          a.href = a.href.replace(oldPhone, s.phone);
        });
      }
      if (s.displayPhone && s.displayPhone !== oldDisplay) replaceText(oldDisplay, s.displayPhone);
      if (s.email && s.email !== oldEmail) { replaceText(oldEmail, s.email); replaceHref('mailto:' + oldEmail, 'mailto:' + s.email); }
      if (s.infoEmail && s.infoEmail !== oldInfo) { replaceText(oldInfo, s.infoEmail); replaceHref('mailto:' + oldInfo, 'mailto:' + s.infoEmail); }
    }
    if (s.currencies && typeof CURRENCIES !== 'undefined') {
      Object.keys(s.currencies).forEach(function (code) {
        var r = Number(s.currencies[code]);
        if (CURRENCIES[code] && r > 0) CURRENCIES[code].rate = r;
      });
      window.dispatchEvent(new CustomEvent('ceylon_currency_changed', { detail: { currency: window.currentCurrency } }));
    }
    if (s.announcement && !document.querySelector('.cc-announcement')) {
      var bar = document.createElement('div');
      bar.className = 'cc-announcement';
      bar.setAttribute('role', 'status');
      bar.style.cssText = 'position:relative;z-index:41;padding:9px 16px;text-align:center;font-size:.86rem;font-weight:550;background:var(--accent);color:var(--accent-ink);';
      bar.textContent = s.announcement;
      document.body.insertBefore(bar, document.body.firstChild);
    }
    if (s.acceptingBookings === false) {
      var form = document.getElementById('custom-itinerary-form');
      if (form) {
        var note = document.createElement('p');
        note.style.cssText = 'padding:14px 16px;border-radius:14px;background:var(--warn-soft);color:var(--warn);font-weight:550;margin-bottom:16px;';
        note.textContent = 'Online bookings are paused right now. Please contact us on WhatsApp and we will help you straight away.';
        form.insertBefore(note, form.firstChild);
        var btn = form.querySelector('[type=submit]');
        if (btn) btn.disabled = true;
      }
    }
  }

  function replaceText(from, to) {
    if (!from) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = walker.nextNode())) { if (n.nodeValue.indexOf(from) > -1) n.nodeValue = n.nodeValue.split(from).join(to); }
  }

  function replaceHref(from, to) {
    document.querySelectorAll('a[href^="' + from + '"]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').replace(from, to)); });
  }

  /* ---------------- Vehicles & daily rates ---------------- */
  function applyVehicles(list) {
    var map = {};
    list.forEach(function (v) { map[v.id] = v; });
    // Every "per day" price on the page is tagged with its original USD amount.
    document.querySelectorAll('[data-usd-period="day"][data-usd-amount]').forEach(function (el) {
      var orig = el.getAttribute('data-usd-orig') || el.getAttribute('data-usd-amount');
      el.setAttribute('data-usd-orig', orig);
      var key = DEFAULT_DAILY[orig];
      if (key && map[key] && Number(map[key].rate) > 0) el.setAttribute('data-usd-amount', map[key].rate);
    });
    if (typeof VEHICLE_RATES !== 'undefined') {
      Object.keys(VEHICLE_RATES).forEach(function (k) { if (map[k] && Number(map[k].rate) > 0) VEHICLE_RATES[k].rate = Number(map[k].rate); });
    }
    if (typeof DAILY_RATES !== 'undefined') {
      Object.keys(DAILY_RATES).forEach(function (k) {
        var v = map[k]; if (!v) return;
        if (Number(v.rate) > 0) DAILY_RATES[k].rate = Number(v.rate);
        if (Number(v.maxPax) > 0) DAILY_RATES[k].maxPax = Number(v.maxPax);
        if (v.luggage) DAILY_RATES[k].luggage = v.luggage;
      });
      if (typeof validateCapacity === 'function') validateCapacity();
      if (typeof calculateQuote === 'function') calculateQuote();
    }
    // Hide vehicle classes switched off in the admin (fleet page tabs/cards)
    list.forEach(function (v) {
      if (v.active === false) {
        document.querySelectorAll('#' + v.id + '.fleet-card, .fleet-tab-btn[data-vehicle="' + v.id + '"]').forEach(function (el) { el.hidden = true; });
      }
    });
  }

  /* ---------------- Tour packages ---------------- */
  function applyPackages(list) {
    if (typeof MASTER_PACKAGES !== 'undefined' && Array.isArray(MASTER_PACKAGES)) {
      MASTER_PACKAGES.splice.apply(MASTER_PACKAGES, [0, MASTER_PACKAGES.length].concat(list.map(function (p) {
        return Object.assign({ highlights: [], itinerary: [], routePoints: [] }, p);
      })));
      if (typeof renderPackages === 'function') renderPackages();
    }
    if (typeof PACKAGE_DURATIONS !== 'undefined') {
      list.forEach(function (p) { PACKAGE_DURATIONS[p.id] = Number(p.days) || PACKAGE_DURATIONS[p.id]; });
    }
    var select = document.getElementById('preferred-package');
    if (select) {
      var current = select.value;
      var groups = {};
      list.forEach(function (p) { (groups[p.categoryName || p.category] = groups[p.categoryName || p.category] || []).push(p); });
      var custom = select.querySelector('option[value="custom"]');
      select.innerHTML = '';
      if (custom) select.appendChild(custom);
      Object.keys(groups).forEach(function (g) {
        var og = document.createElement('optgroup');
        og.label = g;
        groups[g].forEach(function (p) {
          var o = document.createElement('option');
          o.value = p.id; o.textContent = p.title + ', ' + p.days + ' Days';
          og.appendChild(o);
        });
        select.appendChild(og);
      });
      if (Array.prototype.some.call(select.options, function (o) { return o.value === current; })) select.value = current;
    }
  }

  /* ---------------- Reviews ---------------- */
  function reviewCard(r) {
    var stars = '';
    for (var i = 0; i < 5; i++) stars += '<i class="ph-fill ph-star"' + (i < r.rating ? '' : ' style="opacity:.25"') + '></i>';
    var platform = r.source === 'google'
      ? '<a href="https://maps.google.com" target="_blank" rel="noopener" class="platform-badge"><i class="ph ph-google"></i> Google Verified Review <i class="ph ph-arrow-up-right"></i></a>'
      : r.source === 'tripadvisor'
        ? '<a href="https://www.tripadvisor.com" target="_blank" rel="noopener" class="platform-badge"><i class="ph ph-tripadvisor"></i> TripAdvisor Verified <i class="ph ph-arrow-up-right"></i></a>'
        : '<span class="platform-badge"><i class="ph ph-seal-check"></i> Verified Guest</span>';
    var initials = String(r.name || '?').split(/\s+/).filter(function (w) { return /^[A-Za-zÀ-ÿ]/.test(w) && w.toLowerCase() !== 'the'; }).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    return '<article class="review-card" data-reveal><div class="review-source-tag"><div class="stars-row" aria-label="' + r.rating + ' out of 5 stars">' + stars + '</div>' + platform + '</div>' +
      '<p class="review-quote">“' + esc(r.quote) + '”</p><div class="reviewer-meta"><div class="reviewer-avatar">' + esc(initials) + '</div><div class="reviewer-details"><h5>' + esc(r.name) + '</h5><p>' + esc(r.location || '') + '</p></div></div></article>';
  }

  function applyReviews(list) {
    if (!list.length) return;
    document.querySelectorAll('.reviews-grid').forEach(function (grid) {
      var isWall = grid.classList.contains('reviews-grid--wall');
      var count = isWall ? list.length : Math.max(grid.querySelectorAll('.review-card').length, 3);
      grid.innerHTML = list.slice(0, count).map(reviewCard).join('');
      if (typeof window.observeReveal === 'function') window.observeReveal(grid);
      else grid.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
    });
  }

  /* ---------------- FAQs ---------------- */
  function applyFaqs(list) {
    var wrap = document.querySelector('.faq-list');
    if (!wrap || !list.length) return;
    wrap.innerHTML = list.map(function (f, i) {
      return '<div class="faq-item' + (i === 0 ? ' active' : '') + '"><button class="faq-question" aria-expanded="' + (i === 0) + '" aria-controls="faq-answer-db-' + i + '"><span>' + esc(f.question) + '</span><span class="faq-toggle-icon" aria-hidden="true">+</span></button>' +
        '<div class="faq-answer" id="faq-answer-db-' + i + '"><div><p>' + esc(f.answer) + '</p></div></div></div>';
    }).join('');
    wrap.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.parentElement.classList.toggle('active');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }
})();
