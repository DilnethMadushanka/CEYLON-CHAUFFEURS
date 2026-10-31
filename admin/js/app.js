/**
 * Ceylon Chauffeurs Admin - app shell, state, router, overview
 */
(function () {
  'use strict';
  var UI = window.CCUI, Store = window.CCStore, Charts = window.CCCharts;
  var icon = UI.icon, esc = UI.esc;

  window.CC_SITE_IMAGES = ['assets/images/hero.jpg', 'assets/images/sigiriya.jpg', 'assets/images/kandy.jpg', 'assets/images/ella.jpg', 'assets/images/galle.jpg', 'assets/images/beach.jpg', 'assets/images/wildlife.jpg', 'assets/images/sedan.jpg', 'assets/images/van.jpg', 'assets/images/bus.jpg'];

  var STATUSES = [
    { id: 'New', label: 'New', color: 'var(--st-new)', hint: 'Needs a reply' },
    { id: 'Contacted', label: 'Contacted', color: 'var(--st-contacted)', hint: 'Talking on WhatsApp / email' },
    { id: 'Quoted', label: 'Quoted', color: 'var(--st-quoted)', hint: 'Proposal sent' },
    { id: 'Confirmed', label: 'Confirmed', color: 'var(--st-confirmed)', hint: 'Booked & deposit' },
    { id: 'Completed', label: 'Completed', color: 'var(--st-completed)', hint: 'Tour finished' },
    { id: 'Cancelled', label: 'Cancelled', color: 'var(--st-cancelled)', hint: 'Lost or cancelled' }
  ];
  var OPEN_STATUSES = ['New', 'Contacted', 'Quoted'];
  var WON_STATUSES = ['Confirmed', 'Completed'];

  var CATEGORIES = [
    { id: 'all-rounder', label: 'All-Rounder / Island Highlights' },
    { id: 'wildlife', label: 'Wildlife & Nature Explorer' },
    { id: 'beach', label: 'Beach & Coastal Escape' }
  ];

  var NAV = [
    { id: 'overview', label: 'Overview', icon: 'dashboard', group: 'main' },
    { id: 'bookings', label: 'Bookings', icon: 'inbox', group: 'main', badge: true },
    { id: 'calendar', label: 'Tour calendar', icon: 'calendar', group: 'main' },
    { id: 'visitors', label: 'Website visitors', icon: 'eye', group: 'main', live: true },
    { id: 'packages', label: 'Tour packages', icon: 'map', group: 'content' },
    { id: 'fleet', label: 'Fleet & prices', icon: 'car', group: 'content' },
    { id: 'drivers', label: 'Chauffeurs', icon: 'wheel', group: 'content' },
    { id: 'reviews', label: 'Reviews', icon: 'star', group: 'content' },
    { id: 'faqs', label: 'FAQs', icon: 'help', group: 'content' },
    { id: 'settings', label: 'Settings', icon: 'settings', group: 'system' }
  ];

  var S = {
    user: null,
    ready: {},
    data: { bookings: [], packages: [], vehicles: [], drivers: [], reviews: [], faqs: [], settings: [], visits: [] },
    route: 'overview',
    view: null,
    unsubs: [],
    seenBookings: null
  };

  var App = {
    S: S, STATUSES: STATUSES, OPEN_STATUSES: OPEN_STATUSES, WON_STATUSES: WON_STATUSES, CATEGORIES: CATEGORIES,
    views: {},
    get data() { return S.data; },
    settings: function () { return S.data.settings.filter(function (s) { return s.id === 'site'; })[0] || Store.defaults.settings; },
    statusOf: function (id) { return STATUSES.filter(function (s) { return s.id === id; })[0] || STATUSES[0]; },
    driverName: function (id) { var d = S.data.drivers.filter(function (x) { return x.id === id; })[0]; return d ? d.name : ''; },
    vehicleOf: function (id) { return S.data.vehicles.filter(function (x) { return x.id === id; })[0] || Store.defaults.vehicles.filter(function (x) { return x.id === id; })[0]; },
    packageOf: function (id) { return S.data.packages.filter(function (x) { return x.id === id; })[0]; },
    bookingValue: function (b) { var v = b.finalPriceUSD != null && b.finalPriceUSD !== '' ? b.finalPriceUSD : b.estimatedTotalUSD; return Number(v) || 0; },
    statusPill: function (status) {
      var st = App.statusOf(status);
      return '<span class="pill" style="--c:' + st.color + '"><i></i>' + esc(st.label) + '</span>';
    },
    go: function (route) { location.hash = '#/' + route; },
    rerender: function () { if (S.view && S.view.update) S.view.update(); },
    save: function (col, id, data, msg) {
      return Store.save(col, id, data).then(function (newId) {
        if (msg !== false) UI.toast(msg || 'Saved');
        return newId;
      }).catch(function (err) { UI.toast(friendlyError(err), 'error'); throw err; });
    },
    remove: function (col, id, msg) {
      return Store.remove(col, id).then(function () { UI.toast(msg || 'Deleted'); })
        .catch(function (err) { UI.toast(friendlyError(err), 'error'); throw err; });
    },
    emptyState: function (iconName, title, text, action) {
      return '<div class="empty">' + icon(iconName) + '<h3>' + esc(title) + '</h3><p>' + text + '</p>' + (action || '') + '</div>';
    },
    pageHead: function (eyebrow, title, sub, actions) {
      return '<header class="page-head"><div><span class="eyebrow">' + esc(eyebrow) + '</span><h1>' + esc(title) + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (actions ? '<div class="page-actions">' + actions + '</div>' : '') + '</header>';
    }
  };
  window.CCApp = App;

  function friendlyError(err) {
    var code = (err && err.code) || '';
    if (code.indexOf('permission-denied') > -1) return 'Permission denied. Is this account listed in the "admins" collection?';
    if (code.indexOf('wrong-password') > -1 || code.indexOf('invalid-credential') > -1 || code.indexOf('user-not-found') > -1) return 'Email or password is incorrect.';
    if (code.indexOf('too-many-requests') > -1) return 'Too many attempts. Please wait a minute and try again.';
    if (code.indexOf('network') > -1 || code.indexOf('unavailable') > -1) return 'Network problem. Check your connection.';
    return (err && err.message) || 'Something went wrong.';
  }
  App.friendlyError = friendlyError;

  /* ---------------- Theme ---------------- */
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }
  function currentTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  try { applyTheme(localStorage.getItem('cc_admin_theme')); } catch (e) { /* ignore */ }

  /* ---------------- Boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderModeBadges();
    wireLogin();
    wireShell();
    Store.init().then(function () {
      Store.onAuth(function (user, info) {
        if (!user) { showLogin(); return; }
        if (!info.authorized) { showUnauthorized(user); return; }
        S.user = user;
        showApp();
      });
    }).catch(function (err) {
      showLogin(err.message);
    });
  });

  function renderModeBadges() {
    var demo = Store.mode === 'demo';
    document.querySelectorAll('[data-mode-badge]').forEach(function (el) {
      el.innerHTML = demo ? '<span class="mode mode--demo"><i></i>Demo mode · data saved in this browser</span>' : '<span class="mode mode--live"><i></i>Live · Firebase connected</span>';
    });
    document.body.classList.toggle('is-demo', demo);
  }

  /* ---------------- Login ---------------- */
  function wireLogin() {
    var form = document.getElementById('login-form');
    var err = document.getElementById('login-error');
    var demo = Store.mode === 'demo';
    if (demo) {
      document.getElementById('login-email').value = 'demo@ceylonchauffeur.com';
      document.getElementById('login-password').value = 'demo1234';
      document.getElementById('login-demo-note').hidden = false;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.classList.add('is-loading');
      Store.signIn(document.getElementById('login-email').value.trim(), document.getElementById('login-password').value)
        .catch(function (e2) { err.textContent = friendlyError(e2); })
        .then(function () { btn.disabled = false; btn.classList.remove('is-loading'); });
    });
    document.getElementById('login-toggle-pw').addEventListener('click', function () {
      var pw = document.getElementById('login-password');
      var show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      this.innerHTML = icon(show ? 'eyeOff' : 'eye');
    });
    document.getElementById('login-forgot').addEventListener('click', function () {
      var email = document.getElementById('login-email').value.trim();
      if (!email) { err.textContent = 'Type your email first, then tap "Forgot password".'; return; }
      Store.resetPassword(email).then(function () { err.textContent = ''; UI.toast('Password reset email sent to ' + email); })
        .catch(function (e2) { err.textContent = friendlyError(e2); });
    });
  }

  function showLogin(message) {
    teardown();
    document.body.classList.remove('is-booting');
    document.getElementById('app').hidden = true;
    document.getElementById('unauthorized').hidden = true;
    document.getElementById('login').hidden = false;
    if (message) document.getElementById('login-error').textContent = message;
  }

  function showUnauthorized(user) {
    teardown();
    document.body.classList.remove('is-booting');
    document.getElementById('app').hidden = true;
    document.getElementById('login').hidden = true;
    var el = document.getElementById('unauthorized');
    el.hidden = false;
    el.querySelector('[data-uid]').textContent = user.uid;
    el.querySelector('[data-email]').textContent = user.email || '';
    el.querySelector('[data-copy]').onclick = function () {
      navigator.clipboard && navigator.clipboard.writeText(user.uid).then(function () { UI.toast('UID copied'); });
    };
    el.querySelector('[data-signout]').onclick = function () { Store.signOut(); };
  }

  /* ---------------- App shell ---------------- */
  function wireShell() {
    var nav = document.getElementById('nav');
    var groups = { main: 'Operations', content: 'Website content', system: 'System' };
    var html = '';
    Object.keys(groups).forEach(function (g) {
      html += '<p class="nav-group">' + groups[g] + '</p>';
      NAV.filter(function (n) { return n.group === g; }).forEach(function (n) {
        html += '<a href="#/' + n.id + '" class="nav-link" data-route="' + n.id + '">' + icon(n.icon) + '<span>' + n.label + '</span>' + (n.badge ? '<b class="nav-badge" data-new-count hidden>0</b>' : '') + (n.live ? '<b class="nav-live" data-live-count hidden>0</b>' : '') + '</a>';
      });
    });
    nav.innerHTML = html;

    // Mobile bottom tab bar
    var tabs = ['overview', 'bookings', 'visitors', 'calendar'];
    var short = { overview: 'Overview', bookings: 'Bookings', visitors: 'Visitors', calendar: 'Calendar' };
    document.getElementById('tabbar').innerHTML = tabs.map(function (id) {
      var n = NAV.filter(function (x) { return x.id === id; })[0];
      return '<a href="#/' + id + '" data-route="' + id + '">' + icon(n.icon) + '<span>' + short[id] + '</span>' + (n.badge ? '<b class="nav-badge" data-new-count hidden>0</b>' : '') + '</a>';
    }).join('') + '<button type="button" data-open-menu>' + icon('menu') + '<span>More</span></button>';

    document.querySelectorAll('[data-open-menu]').forEach(function (b) { b.addEventListener('click', function () { document.body.classList.add('nav-open'); }); });
    document.querySelectorAll('[data-close-menu]').forEach(function (b) { b.addEventListener('click', function () { document.body.classList.remove('nav-open'); }); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });

    document.getElementById('theme-toggle').addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('cc_admin_theme', next); } catch (e) { /* ignore */ }
      syncThemeIcon();
    });
    syncThemeIcon();
    document.getElementById('signout').addEventListener('click', function () {
      UI.confirm({ title: 'Sign out?', text: 'You will need your password to sign in again.', ok: 'Sign out' }).then(function (ok) { if (ok) Store.signOut(); });
    });
    document.getElementById('cmdk-open').addEventListener('click', openPalette);
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !document.getElementById('app').hidden) { e.preventDefault(); openPalette(); }
    });
    window.addEventListener('hashchange', route);

    // Demo mode: pick up bookings submitted on the public site in another tab
    window.addEventListener('storage', function (e) {
      if (e.key === 'ceylon_chauffeur_inquiries' && Store.mode === 'demo') Store.refreshPublicInquiries();
    });
  }

  function syncThemeIcon() {
    var b = document.getElementById('theme-toggle');
    b.innerHTML = icon(currentTheme() === 'dark' ? 'sun' : 'moon');
    b.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function showApp() {
    document.body.classList.remove('is-booting');
    document.getElementById('login').hidden = true;
    document.getElementById('unauthorized').hidden = true;
    document.getElementById('app').hidden = false;
    var email = S.user.email || 'admin';
    document.querySelectorAll('[data-user-email]').forEach(function (el) { el.textContent = email; });
    document.querySelectorAll('[data-user-initials]').forEach(function (el) { el.textContent = email.slice(0, 2).toUpperCase(); });
    if (!S.unsubs.length) subscribeAll();
    route();
  }

  function teardown() {
    S.unsubs.forEach(function (u) { u(); });
    S.unsubs = [];
    S.ready = {};
    S.seenBookings = null;
  }

  function subscribeAll() {
    subscribeVisits();
    Store.collections.forEach(function (col) {
      S.unsubs.push(Store.subscribe(col, function (rows) {
        if (col === 'bookings') notifyNewBookings(rows);
        S.data[col] = sortRows(col, rows);
        S.ready[col] = true;
        updateBadges();
        App.rerender();
      }, function (err) {
        S.ready[col] = true;
        UI.toast('Could not load ' + col + ': ' + friendlyError(err), 'error');
        App.rerender();
      }));
    });
  }

  function subscribeVisits() {
    S.unsubs.push(Store.subscribeVisits(60, function (rows) {
      S.data.visits = rows;
      S.ready.visits = true;
      updateLive();
      if (S.route === 'visitors' || S.route === 'overview') App.rerender();
    }, function (err) {
      S.ready.visits = true;
      console.warn('Visits unavailable', err);
      App.rerender();
    }));
    var t = setInterval(updateLive, 30000);
    S.unsubs.push(function () { clearInterval(t); });
  }

  function updateLive() {
    if (!App.visitSummary) return;
    var n = App.visitSummary().live;
    document.querySelectorAll('[data-live-count]').forEach(function (el) { el.textContent = n + ' live'; el.hidden = !n; });
  }

  function sortRows(col, rows) {
    if (col === 'bookings') return rows.sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
    return rows.sort(function (a, b) { return (a.order || 999) - (b.order || 999) || String(a.name || a.title || '').localeCompare(String(b.name || b.title || '')); });
  }

  function notifyNewBookings(rows) {
    var ids = {};
    rows.forEach(function (r) { ids[r.id] = true; });
    if (S.seenBookings) {
      rows.filter(function (r) { return !S.seenBookings[r.id]; }).forEach(function (r) {
        UI.toast('New inquiry: ' + (r.customerName || 'Traveler') + ' · ' + (r.package || ''), 'info');
        try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) { /* ignore */ }
      });
    }
    S.seenBookings = ids;
  }

  function updateBadges() {
    var n = S.data.bookings.filter(function (b) { return b.status === 'New'; }).length;
    document.querySelectorAll('[data-new-count]').forEach(function (el) { el.textContent = n; el.hidden = !n; });
    document.title = (n ? '(' + n + ') ' : '') + 'Admin | Ceylon Chauffeurs';
  }

  function route() {
    if (document.getElementById('app').hidden) return;
    var r = (location.hash.replace(/^#\/?/, '') || 'overview').split('?')[0];
    var parts = r.split('/');
    var name = App.views[parts[0]] ? parts[0] : 'overview';
    S.route = name;
    document.querySelectorAll('[data-route]').forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-route') === name); });
    var navItem = NAV.filter(function (n) { return n.id === name; })[0];
    document.getElementById('crumb').textContent = navItem ? navItem.label : '';
    var host = document.getElementById('view');
    if (S.view && S.view.destroy) S.view.destroy();
    host.innerHTML = '';
    host.classList.remove('view-enter');
    void host.offsetWidth;
    host.classList.add('view-enter');
    S.view = App.views[name](host, parts.slice(1));
    window.scrollTo(0, 0);
    document.getElementById('main').scrollTop = 0;
  }

  /* ---------------- Command palette ---------------- */
  function openPalette() {
    var layer = UI.openLayer({
      kind: 'modal', size: 'palette', title: 'Quick search',
      body: '<div class="palette"><div class="search-box">' + icon('search') + '<input type="search" placeholder="Search bookings, travelers, packages, chauffeurs…" autofocus data-q></div><ul class="palette-list" data-results></ul></div>'
    });
    var input = layer.el.querySelector('[data-q]');
    var list = layer.el.querySelector('[data-results]');
    function render() {
      var q = input.value.trim().toLowerCase();
      var items = [];
      NAV.forEach(function (n) { items.push({ icon: n.icon, title: n.label, sub: 'Go to page', go: '#/' + n.id, hay: n.label }); });
      S.data.bookings.forEach(function (b) { items.push({ icon: 'inbox', title: b.customerName + ' · ' + b.bookingRef, sub: (b.package || '') + ' · ' + b.status, go: '#/bookings/' + b.id, hay: [b.customerName, b.bookingRef, b.customerEmail, b.customerCountry, b.package].join(' ') }); });
      S.data.packages.forEach(function (p) { items.push({ icon: 'map', title: p.title, sub: 'Tour package · ' + p.days + ' days', go: '#/packages/' + p.id, hay: p.title + ' ' + p.route }); });
      S.data.drivers.forEach(function (d) { items.push({ icon: 'wheel', title: d.name, sub: 'Chauffeur · ' + (d.languages || ''), go: '#/drivers/' + d.id, hay: d.name + ' ' + d.languages }); });
      var res = q ? items.filter(function (i) { return i.hay.toLowerCase().indexOf(q) > -1; }) : items.slice(0, NAV.length);
      list.innerHTML = res.slice(0, 12).map(function (i, idx) {
        return '<li><a href="' + i.go + '" class="' + (idx === 0 ? 'is-hl' : '') + '">' + icon(i.icon) + '<span><b>' + esc(i.title) + '</b><small>' + esc(i.sub) + '</small></span>' + icon('right', 'chev') + '</a></li>';
      }).join('') || '<li class="palette-empty">No results for “' + esc(q) + '”</li>';
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var a = list.querySelector('a'); if (a) { location.hash = a.getAttribute('href'); layer.close(); } }
    });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) layer.close(); });
    render();
  }

  /* ================================================================
     OVERVIEW
     ================================================================ */
  App.views.overview = function (host) {
    function update() {
      var D = S.data;
      var bookings = D.bookings;
      var now = new Date();
      var today = now.toISOString().slice(0, 10);
      var newCount = bookings.filter(function (b) { return b.status === 'New'; }).length;
      var open = bookings.filter(function (b) { return OPEN_STATUSES.indexOf(b.status) > -1; });
      var won = bookings.filter(function (b) { return WON_STATUSES.indexOf(b.status) > -1; });
      var decided = bookings.filter(function (b) { return b.status !== 'New' && b.status !== 'Contacted' && b.status !== 'Quoted'; });
      var pipeline = open.reduce(function (a, b) { return a + App.bookingValue(b); }, 0);
      var revenue = won.reduce(function (a, b) { return a + App.bookingValue(b); }, 0);
      var collected = bookings.reduce(function (a, b) { return a + (Number(b.amountPaidUSD) || 0); }, 0);
      var conv = decided.length ? Math.round((won.length / decided.length) * 100) : 0;
      var upcoming = bookings.filter(function (b) { return WON_STATUSES.indexOf(b.status) > -1 && b.arrival && b.arrival >= today; })
        .sort(function (a, b) { return a.arrival.localeCompare(b.arrival); });
      var onTour = bookings.filter(function (b) { return b.status === 'Confirmed' && b.arrival <= today && b.departure >= today; });

      // last 30 days series
      var days = [];
      for (var i = 29; i >= 0; i--) {
        var d = new Date(now.getTime() - i * 86400000);
        days.push({ key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), value: 0, money: 0 });
      }
      var idx = {};
      days.forEach(function (d, k) { idx[d.key] = k; });
      bookings.forEach(function (b) {
        var k = String(b.createdAt || '').slice(0, 10);
        if (idx[k] != null) { days[idx[k]].value++; days[idx[k]].money += App.bookingValue(b); }
      });
      var mode = host._chartMode || 'count';
      var series = days.map(function (d) {
        var v = mode === 'count' ? d.value : d.money;
        return { label: d.label, value: v, tip: d.label + ': ' + d.value + ' inquiries · ' + UI.money(d.money) };
      });
      var last7 = days.slice(-7).reduce(function (a, d) { return a + d.value; }, 0);
      var prev7 = days.slice(-14, -7).reduce(function (a, d) { return a + d.value; }, 0);
      var delta = prev7 ? Math.round(((last7 - prev7) / prev7) * 100) : (last7 ? 100 : 0);

      var statusSeg = STATUSES.map(function (s) { return { label: s.label, value: bookings.filter(function (b) { return b.status === s.id; }).length, color: s.color }; });
      var vehRows = (D.vehicles.length ? D.vehicles : Store.defaults.vehicles).map(function (v) {
        var list = bookings.filter(function (b) { return b.vehicleType === v.id; });
        return { label: v.name, value: list.length, sub: UI.money(list.reduce(function (a, b) { return a + App.bookingValue(b); }, 0)) + ' total value' };
      });
      var pkgCount = {};
      bookings.forEach(function (b) { var k = b.package || 'Custom'; pkgCount[k] = (pkgCount[k] || 0) + 1; });
      var pkgRows = Object.keys(pkgCount).map(function (k) { return { label: k.replace(/\s*\(.*\)\s*/, ''), value: pkgCount[k] }; }).sort(function (a, b) { return b.value - a.value; }).slice(0, 5);
      var cCount = {};
      bookings.forEach(function (b) { var k = b.customerCountry || 'Unknown'; cCount[k] = (cCount[k] || 0) + 1; });
      var countryRows = Object.keys(cCount).map(function (k) { return { label: k, value: cCount[k] }; }).sort(function (a, b) { return b.value - a.value; }).slice(0, 5);

      var hour = now.getHours();
      var greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      var emptyDb = Store.mode === 'firebase' && S.ready.packages && !D.packages.length;
      var vs = App.visitSummary ? App.visitSummary() : { today: 0, views: 0, live: 0 };
      var visitLine = '<a class="visit-strip" href="#/visitors">' + icon('eye') + '<span><b>' + vs.today + '</b> visitors today</span><span><b>' + vs.views + '</b> page views</span>' + (vs.live ? '<span class="live-dot"><i></i><b>' + vs.live + '</b> online now</span>' : '') + icon('right', 'chev') + '</a>';

      host.innerHTML =
        App.pageHead(now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }), greet + ', ' + (S.user.email || '').split('@')[0],
          newCount ? '<b class="accent">' + newCount + ' new ' + (newCount === 1 ? 'inquiry needs' : 'inquiries need') + '</b> a reply. ' + (onTour.length ? onTour.length + ' tour' + (onTour.length > 1 ? 's are' : ' is') + ' on the road today.' : '') : 'You are all caught up. ' + (onTour.length ? onTour.length + ' tour' + (onTour.length > 1 ? 's are' : ' is') + ' on the road today.' : ''),
          '<a class="btn btn-ghost" href="../index.html" target="_blank" rel="noopener">' + icon('external') + '<span>View site</span></a><a class="btn btn-primary" href="#/bookings?status=New">' + icon('inbox') + '<span>Open inbox</span></a>') +
        visitLine +
        (emptyDb ? '<div class="banner banner--warn">' + icon('database') + '<div><b>Your Firebase database is empty.</b><p>Import the tours, vehicles, prices, reviews and FAQs that are on the website now, then manage them here.</p></div><button class="btn btn-primary" data-import>' + icon('download') + '<span>Import website content</span></button></div>' : '') +
        '<section class="kpis">' +
          kpi('inbox', 'New inquiries', newCount, open.length + ' open in pipeline', null, '#/bookings?status=New') +
          kpi('trend', 'Pipeline value', UI.compactMoney(pipeline), 'Open quotes (New, Contacted, Quoted)', Charts.spark(days.map(function (d) { return d.money; }))) +
          kpi('dollar', 'Booked revenue', UI.compactMoney(revenue), UI.money(collected) + ' collected so far') +
          kpi('check', 'Conversion', conv + '%', won.length + ' won of ' + decided.length + ' decided') +
        '</section>' +
        '<section class="grid-2-1">' +
          '<article class="card card--chart"><header class="card-head"><div><h2>Inquiries · last 30 days</h2><p>' + last7 + ' this week <span class="delta ' + (delta >= 0 ? 'up' : 'down') + '">' + (delta >= 0 ? '▲' : '▼') + ' ' + Math.abs(delta) + '%</span> vs last week</p></div>' +
            '<div class="seg" role="tablist"><button data-mode="count" class="' + (mode === 'count' ? 'is-on' : '') + '">Count</button><button data-mode="money" class="' + (mode === 'money' ? 'is-on' : '') + '">Value</button></div></header>' +
            Charts.area(series, { money: mode === 'money', label: 'Inquiries per day', width: chartWidth() }) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Booking status</h2><p>All ' + bookings.length + ' inquiries</p></div></header>' +
            Charts.donut(statusSeg, 'inquiries', String(bookings.length)) + '</article>' +
        '</section>' +
        '<section class="grid-3">' +
          '<article class="card"><header class="card-head"><div><h2>Upcoming tours</h2><p>Confirmed arrivals</p></div><a class="link" href="#/calendar">Calendar ' + icon('right') + '</a></header>' + upcomingList(upcoming.slice(0, 5)) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Latest inquiries</h2><p>Newest first</p></div><a class="link" href="#/bookings">All ' + icon('right') + '</a></header>' + recentList(bookings.slice(0, 5)) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Chauffeurs</h2><p>Availability today</p></div><a class="link" href="#/drivers">Manage ' + icon('right') + '</a></header>' + driverList(onTour) + '</article>' +
        '</section>' +
        '<section class="grid-3">' +
          '<article class="card"><header class="card-head"><div><h2>Vehicle demand</h2><p>Inquiries per class</p></div></header>' + Charts.bars(vehRows) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Top tour packages</h2><p>Most requested</p></div></header>' + Charts.bars(pkgRows) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Top markets</h2><p>Traveler countries</p></div></header>' + Charts.bars(countryRows) + '</article>' +
        '</section>';

      host.querySelectorAll('[data-mode]').forEach(function (b) {
        b.addEventListener('click', function () { host._chartMode = b.getAttribute('data-mode'); update(); });
      });
      var imp = host.querySelector('[data-import]');
      if (imp) imp.addEventListener('click', function () {
        imp.disabled = true;
        Store.importSiteContent().then(function () { UI.toast('Website content imported'); }).catch(function (e) { imp.disabled = false; UI.toast(friendlyError(e), 'error'); });
      });
    }

    function chartWidth() {
      var w = host.clientWidth || 900;
      return Math.round(Math.max(300, Math.min(960, window.innerWidth > 1200 ? w * 0.64 : w - 40)));
    }

    function kpi(ic, label, value, sub, extra, href) {
      var tag = href ? 'a href="' + href + '"' : 'div';
      return '<' + tag + ' class="kpi">' + '<div class="kpi-top"><span class="kpi-ic">' + icon(ic) + '</span><span class="kpi-label">' + esc(label) + '</span></div>' +
        '<div class="kpi-value">' + esc(value) + '</div><div class="kpi-sub">' + sub + '</div>' + (extra || '') + '</' + (href ? 'a' : 'div') + '>';
    }

    function upcomingList(list) {
      if (!list.length) return '<p class="empty-mini">No confirmed tours coming up.</p>';
      return '<ul class="mini-list">' + list.map(function (b) {
        var d = new Date(b.arrival + 'T00:00:00');
        var inDays = Math.round((d - new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00')) / 86400000);
        return '<li><a href="#/bookings/' + b.id + '"><span class="date-chip"><b>' + d.getDate() + '</b>' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</span>' +
          '<span class="ml-main"><b>' + esc(b.customerName) + '</b><small>' + esc((b.package || '').replace(/\s*\(.*\)\s*/, '')) + ' · ' + (App.driverName(b.assignedDriver) || '<em class="warn-text">No driver</em>') + '</small></span>' +
          '<span class="ml-end">' + (inDays === 0 ? 'Today' : 'in ' + inDays + 'd') + '</span></a></li>';
      }).join('') + '</ul>';
    }

    function recentList(list) {
      if (!list.length) return '<p class="empty-mini">No inquiries yet.</p>';
      return '<ul class="mini-list">' + list.map(function (b) {
        return '<li><a href="#/bookings/' + b.id + '"><span class="avatar">' + esc(UI.initials(b.customerName)) + '</span>' +
          '<span class="ml-main"><b>' + esc(b.customerName) + '</b><small>' + esc(b.customerCountry || '') + ' · ' + UI.money(App.bookingValue(b)) + '</small></span>' +
          '<span class="ml-end">' + App.statusPill(b.status) + '<small>' + UI.timeAgo(b.createdAt) + '</small></span></a></li>';
      }).join('') + '</ul>';
    }

    function driverList(onTour) {
      var drivers = S.data.drivers;
      if (!drivers.length) return '<p class="empty-mini">No chauffeurs added yet.</p>';
      var busy = {};
      onTour.forEach(function (b) { if (b.assignedDriver) busy[b.assignedDriver] = b; });
      return '<ul class="mini-list">' + drivers.slice(0, 6).map(function (d) {
        var b = busy[d.id];
        var st = b ? ['On tour', 'var(--st-quoted)'] : d.status === 'off' ? ['Off duty', 'var(--st-cancelled)'] : ['Available', 'var(--st-confirmed)'];
        return '<li><a href="#/drivers/' + d.id + '"><span class="avatar">' + esc(UI.initials(d.name)) + '</span><span class="ml-main"><b>' + esc(d.name) + '</b><small>' + esc(b ? b.customerName + ' until ' + UI.fmtDate(b.departure) : (d.languages || '')) + '</small></span>' +
          '<span class="ml-end"><span class="pill" style="--c:' + st[1] + '"><i></i>' + st[0] + '</span></span></a></li>';
      }).join('') + '</ul>';
    }

    var onResize = UI.debounce(update, 250);
    window.addEventListener('resize', onResize);
    update();
    return { update: update, destroy: function () { window.removeEventListener('resize', onResize); } };
  };
})();
