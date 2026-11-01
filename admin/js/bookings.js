/**
 * Ceylon Chauffeurs Admin - bookings inbox (table / board), booking drawer, tour calendar
 */
(function () {
  'use strict';
  var App = window.CCApp, UI = window.CCUI, Store = window.CCStore;
  var icon = UI.icon, esc = UI.esc;

  var VIEW_KEY = 'cc_admin_bookings_view';

  function hashParams() {
    var q = location.hash.split('?')[1] || '';
    var out = {};
    q.split('&').forEach(function (kv) { if (!kv) return; var p = kv.split('='); out[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    return out;
  }

  function shortPkg(b) { return String(b.package || 'Custom route').replace(/\s*\(.*\)\s*/, ''); }

  /* ================================================================
     BOOKINGS VIEW
     ================================================================ */
  App.views.bookings = function (host, args) {
    var params = hashParams();
    var st = {
      q: '',
      status: params.status || 'all',
      vehicle: 'all',
      sort: 'newest',
      layout: (function () { try { return localStorage.getItem(VIEW_KEY) || 'table'; } catch (e) { return 'table'; } })()
    };
    if (window.matchMedia('(max-width: 720px)').matches && st.layout === 'board') st.layout = 'table';

    host.innerHTML =
      App.pageHead('Operations', 'Bookings & inquiries', 'Every request from the website booking form lands here in real time. Reply, quote, confirm and assign a chauffeur.',
        '<button class="btn btn-ghost" data-export>' + icon('download') + '<span>Export CSV</span></button><button class="btn btn-primary" data-new>' + icon('plus') + '<span>New booking</span></button>') +
      '<div class="toolbar card">' +
        '<div class="search-box">' + icon('search') + '<input type="search" placeholder="Search name, email, country, ref…" data-q></div>' +
        '<div class="toolbar-row">' +
          '<div class="select-wrap select-sm"><select data-vehicle><option value="all">All vehicles</option><option value="sedan">Sedan</option><option value="van">Van</option><option value="bus">Coach / Bus</option></select>' + icon('down') + '</div>' +
          '<div class="select-wrap select-sm"><select data-sort><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="arrival">Arrival date</option><option value="value">Highest value</option></select>' + icon('down') + '</div>' +
          '<div class="seg" data-layout><button data-l="table" aria-label="Table view">' + icon('list') + '</button><button data-l="board" aria-label="Board view">' + icon('board') + '</button></div>' +
        '</div>' +
      '</div>' +
      '<div class="chips" data-chips></div>' +
      '<div data-list></div>';

    var qInput = host.querySelector('[data-q]');
    qInput.addEventListener('input', UI.debounce(function () { st.q = qInput.value.trim().toLowerCase(); update(); }, 120));
    host.querySelector('[data-vehicle]').addEventListener('change', function () { st.vehicle = this.value; update(); });
    host.querySelector('[data-sort]').addEventListener('change', function () { st.sort = this.value; update(); });
    host.querySelector('[data-layout]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-l]'); if (!b) return;
      st.layout = b.getAttribute('data-l');
      try { localStorage.setItem(VIEW_KEY, st.layout); } catch (err) { /* ignore */ }
      update();
    });
    host.querySelector('[data-chips]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-status]'); if (!b) return;
      st.status = b.getAttribute('data-status'); update();
    });
    host.querySelector('[data-new]').addEventListener('click', function () { openNewBooking(); });
    host.querySelector('[data-export]').addEventListener('click', function () {
      var rows = filtered();
      UI.downloadCSV('ceylon-chauffeurs-bookings-' + new Date().toISOString().slice(0, 10) + '.csv', rows, [
        { label: 'Booking Ref', value: 'bookingRef' }, { label: 'Created', value: 'createdAt' }, { label: 'Status', value: 'status' },
        { label: 'Traveler', value: 'customerName' }, { label: 'Email', value: 'customerEmail' }, { label: 'Phone', value: 'customerPhone' },
        { label: 'Country', value: 'customerCountry' }, { label: 'Arrival', value: 'arrival' }, { label: 'Departure', value: 'departure' },
        { label: 'Days', value: 'daysCount' }, { label: 'Adults', value: 'adults' }, { label: 'Children', value: 'kids' },
        { label: 'Vehicle', value: 'vehicle' }, { label: 'Package', value: 'package' },
        { label: 'Estimate USD', value: 'estimatedTotalUSD' }, { label: 'Final price USD', value: 'finalPriceUSD' },
        { label: 'Paid USD', value: 'amountPaidUSD' }, { label: 'Payment', value: 'paymentStatus' },
        { label: 'Chauffeur', value: function (b) { return App.driverName(b.assignedDriver); } },
        { label: 'Traveler notes', value: 'notes' }, { label: 'Admin notes', value: 'adminNotes' }
      ]);
      UI.toast(rows.length + ' bookings exported');
    });

    var list = host.querySelector('[data-list]');
    list.addEventListener('click', function (e) {
      var wa = e.target.closest('[data-wa]');
      if (wa) { e.stopPropagation(); e.preventDefault(); var b0 = find(wa.getAttribute('data-wa')); if (b0) openWhatsApp(b0, 'reply'); return; }
      var row = e.target.closest('[data-id]');
      if (row && !e.target.closest('a[href^="mailto"],a[href^="tel"]')) location.hash = '#/bookings/' + row.getAttribute('data-id');
    });
    list.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.matches('[data-id]')) location.hash = '#/bookings/' + e.target.getAttribute('data-id');
    });

    function find(id) { return App.data.bookings.filter(function (b) { return b.id === id; })[0]; }

    function baseFiltered() {
      return App.data.bookings.filter(function (b) {
        if (st.vehicle !== 'all' && b.vehicleType !== st.vehicle) return false;
        if (st.q) {
          var hay = [b.customerName, b.customerEmail, b.customerCountry, b.customerPhone, b.bookingRef, b.package, b.notes].join(' ').toLowerCase();
          if (hay.indexOf(st.q) === -1) return false;
        }
        return true;
      });
    }

    function filtered() {
      var rows = baseFiltered().filter(function (b) { return st.status === 'all' || b.status === st.status; });
      var sorters = {
        newest: function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); },
        oldest: function (a, b) { return String(a.createdAt).localeCompare(String(b.createdAt)); },
        arrival: function (a, b) { return String(a.arrival || '9').localeCompare(String(b.arrival || '9')); },
        value: function (a, b) { return App.bookingValue(b) - App.bookingValue(a); }
      };
      return rows.sort(sorters[st.sort]);
    }

    function update() {
      var base = baseFiltered();
      host.querySelector('[data-chips]').innerHTML = [{ id: 'all', label: 'All', color: 'var(--ink)' }].concat(App.STATUSES).map(function (s) {
        var n = s.id === 'all' ? base.length : base.filter(function (b) { return b.status === s.id; }).length;
        return '<button class="chip' + (st.status === s.id ? ' is-on' : '') + '" data-status="' + s.id + '" style="--c:' + s.color + '">' + (s.id !== 'all' ? '<i></i>' : '') + esc(s.label) + '<b>' + n + '</b></button>';
      }).join('');
      host.querySelectorAll('[data-l]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-l') === st.layout); });

      if (!App.S.ready.bookings) { list.innerHTML = skeleton(); return; }
      var rows = filtered();
      if (st.layout === 'board') { list.innerHTML = board(base); wireBoard(); return; }
      if (!rows.length) {
        list.innerHTML = App.emptyState('inbox', App.data.bookings.length ? 'No matching bookings' : 'No bookings yet', App.data.bookings.length ? 'Try a different search or status filter.' : 'When travelers submit the booking form on the website, their inquiries will appear here instantly.');
        return;
      }
      list.innerHTML = '<div class="card table-card"><table class="dtable"><thead><tr><th>Traveler</th><th>Trip</th><th>Vehicle</th><th>Value</th><th>Status</th><th>Chauffeur</th><th aria-label="Actions"></th></tr></thead><tbody>' +
        rows.map(rowHtml).join('') + '</tbody></table></div><p class="table-foot">' + rows.length + ' booking' + (rows.length === 1 ? '' : 's') + '</p>';
    }

    function rowHtml(b) {
      var v = App.vehicleOf(b.vehicleType);
      return '<tr data-id="' + esc(b.id) + '" tabindex="0" class="' + (b.status === 'New' ? 'is-new' : '') + '">' +
        '<td data-label="Traveler"><div class="cell-person"><span class="avatar">' + esc(UI.initials(b.customerName)) + '</span><div><b>' + esc(b.customerName) + '</b><small>' + esc(b.bookingRef) + ' · ' + esc(b.customerCountry || '') + ' · ' + UI.timeAgo(b.createdAt) + '</small></div></div></td>' +
        '<td data-label="Trip"><b>' + esc(shortPkg(b)) + '</b><small>' + (b.arrival ? UI.fmtDate(b.arrival) + ' → ' + UI.fmtDate(b.departure) : esc(b.travelDates || '')) + ' · ' + (b.daysCount || '?') + 'd · ' + ((+b.adults || 0) + (+b.kids || 0)) + ' pax</small></td>' +
        '<td data-label="Vehicle">' + esc(v ? v.name : b.vehicle || '') + '</td>' +
        '<td data-label="Value"><b>' + UI.money(App.bookingValue(b)) + '</b><small>' + esc(b.paymentStatus || 'Unpaid') + (b.amountPaidUSD ? ' · ' + UI.money(b.amountPaidUSD) + ' paid' : '') + '</small></td>' +
        '<td data-label="Status">' + App.statusPill(b.status) + '</td>' +
        '<td data-label="Chauffeur">' + (App.driverName(b.assignedDriver) ? esc(App.driverName(b.assignedDriver)) : '<span class="muted">Unassigned</span>') + '</td>' +
        '<td class="cell-actions"><button class="icon-btn icon-btn--wa" data-wa="' + esc(b.id) + '" aria-label="WhatsApp ' + esc(b.customerName) + '">' + icon('whatsapp') + '</button>' + icon('right', 'chev') + '</td></tr>';
    }

    function board(rows) {
      return '<div class="board">' + App.STATUSES.map(function (s) {
        var col = rows.filter(function (b) { return b.status === s.id; });
        var sum = col.reduce(function (a, b) { return a + App.bookingValue(b); }, 0);
        return '<section class="board-col" data-drop="' + s.id + '" style="--c:' + s.color + '"><header><span class="pill" style="--c:' + s.color + '"><i></i>' + s.label + '</span><b>' + col.length + '</b><small>' + UI.compactMoney(sum) + '</small></header><div class="board-cards">' +
          col.map(function (b) {
            return '<article class="bcard" draggable="true" data-id="' + esc(b.id) + '" tabindex="0"><div class="bcard-top"><b>' + esc(b.customerName) + '</b><span>' + UI.money(App.bookingValue(b)) + '</span></div>' +
              '<small>' + esc(shortPkg(b)) + '</small><div class="bcard-meta"><span>' + icon('calendar') + (b.arrival ? UI.fmtDate(b.arrival) : '—') + '</span><span>' + icon('users') + ((+b.adults || 0) + (+b.kids || 0)) + '</span>' +
              (App.driverName(b.assignedDriver) ? '<span>' + icon('wheel') + esc(App.driverName(b.assignedDriver).split(' ')[0]) + '</span>' : '') + '</div></article>';
          }).join('') + '<div class="board-empty">Drop here</div></div></section>';
      }).join('') + '</div>';
    }

    function wireBoard() {
      var dragId = null;
      list.querySelectorAll('.bcard').forEach(function (c) {
        c.addEventListener('dragstart', function (e) { dragId = c.getAttribute('data-id'); c.classList.add('is-drag'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); });
        c.addEventListener('dragend', function () { c.classList.remove('is-drag'); });
      });
      list.querySelectorAll('[data-drop]').forEach(function (col) {
        col.addEventListener('dragover', function (e) { e.preventDefault(); col.classList.add('is-over'); });
        col.addEventListener('dragleave', function () { col.classList.remove('is-over'); });
        col.addEventListener('drop', function (e) {
          e.preventDefault(); col.classList.remove('is-over');
          var id = dragId || e.dataTransfer.getData('text/plain');
          var b = find(id); var status = col.getAttribute('data-drop');
          if (b && b.status !== status) changeStatus(b, status);
        });
      });
    }

    update();
    var drawer = null;
    if (args[0]) setTimeout(function () { drawer = openBooking(args[0]); }, 50);
    return {
      update: function () { update(); if (drawer && drawer.refresh) drawer.refresh(); },
      destroy: function () { if (drawer) drawer.close(); }
    };
  };

  function skeleton() {
    return '<div class="card table-card skeleton">' + new Array(6).join('<div class="sk-row"><span></span><span></span><span></span></div>') + '</div>';
  }

  function logEntry(text) {
    return { at: new Date().toISOString(), by: (App.S.user && App.S.user.email) || 'admin', text: text };
  }

  function changeStatus(b, status) {
    var activity = (b.activity || []).concat([logEntry('Status changed from ' + b.status + ' to ' + status)]);
    var patch = { status: status, activity: activity };
    if (status === 'Completed' && b.paymentStatus !== 'Paid') { /* leave payment for admin */ }
    return App.save('bookings', b.id, patch, 'Moved to ' + status);
  }
  App.changeStatus = changeStatus;

  /* ================================================================
     BOOKING DRAWER
     ================================================================ */
  function openBooking(id) {
    var b = App.data.bookings.filter(function (x) { return x.id === id; })[0];
    if (!b) { if (App.S.ready.bookings) UI.toast('Booking not found', 'error'); return null; }
    var dirty = false;

    var layer = UI.openLayer({
      kind: 'drawer', size: 'lg',
      eyebrow: esc(b.bookingRef) + ' · received ' + UI.fmtDate(b.createdAt, true),
      title: b.customerName,
      subtitle: App.statusPill(b.status) + ' <span class="muted">' + esc(b.customerCountry || '') + '</span>',
      body: drawerBody(b),
      footer: '<button class="btn btn-danger-ghost" data-del>' + icon('trash') + '<span>Delete</span></button><span class="spacer"></span>' +
        '<button class="btn btn-ghost" data-quote>' + icon('mail') + '<span>Email quote</span></button>' +
        '<button class="btn btn-ghost" data-print>' + icon('print') + '<span>Voucher</span></button>' +
        '<button class="btn btn-primary" data-save>' + icon('check') + '<span>Save changes</span></button>',
      onClose: function () { if (location.hash.indexOf('#/bookings/') === 0) history.replaceState(null, '', '#/bookings'); }
    });
    var el = layer.el;
    el.addEventListener('input', function () { dirty = true; });
    el.addEventListener('change', function () { dirty = true; });

    el.querySelector('[data-status-steps]').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-set-status]'); if (!btn) return;
      el.querySelector('[name=status]').value = btn.getAttribute('data-set-status');
      el.querySelectorAll('[data-set-status]').forEach(function (x) { x.classList.toggle('is-on', x === btn); });
      dirty = true;
    });
    el.querySelectorAll('[data-template]').forEach(function (btn) {
      btn.addEventListener('click', function () { openWhatsApp(current(), btn.getAttribute('data-template')); });
    });
    el.querySelector('[data-copy-email]').addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(b.customerEmail || '').then(function () { UI.toast('Email copied'); });
    });
    el.querySelector('[data-add-note]').addEventListener('click', function () {
      var ta = el.querySelector('[data-note-text]');
      var t = ta.value.trim(); if (!t) return;
      var cur = current();
      App.save('bookings', cur.id, { activity: (cur.activity || []).concat([logEntry(t)]) }, 'Note added').then(function () { ta.value = ''; });
    });
    // auto-calc payment status from paid amount
    var paidInput = el.querySelector('[name=amountPaidUSD]');
    var priceInput = el.querySelector('[name=finalPriceUSD]');
    var payStatus = el.querySelector('[name=paymentStatus]');
    function syncPay() {
      var paid = Number(paidInput.value) || 0, price = Number(priceInput.value) || Number(b.estimatedTotalUSD) || 0;
      if (paid <= 0) payStatus.value = 'Unpaid'; else if (paid >= price) payStatus.value = 'Paid'; else payStatus.value = 'Deposit';
      el.querySelector('[data-balance]').textContent = UI.money(Math.max(price - paid, 0));
    }
    paidInput.addEventListener('input', syncPay);
    priceInput.addEventListener('input', syncPay);

    el.querySelector('[data-save]').addEventListener('click', function () {
      var cur = current();
      var form = el.querySelector('form');
      var f = new FormData(form);
      var patch = {
        status: f.get('status'),
        assignedDriver: f.get('assignedDriver'),
        vehicleType: f.get('vehicleType'),
        finalPriceUSD: f.get('finalPriceUSD') === '' ? null : Number(f.get('finalPriceUSD')),
        amountPaidUSD: Number(f.get('amountPaidUSD')) || 0,
        paymentStatus: f.get('paymentStatus'),
        adminNotes: String(f.get('adminNotes') || '').trim(),
        arrival: f.get('arrival') || cur.arrival || '',
        departure: f.get('departure') || cur.departure || '',
        pickupLocation: String(f.get('pickupLocation') || '').trim(),
        flightNumber: String(f.get('flightNumber') || '').trim()
      };
      var v = App.vehicleOf(patch.vehicleType);
      if (v && patch.vehicleType !== cur.vehicleType) patch.vehicle = v.name + ' (' + v.models + ')';
      if (patch.arrival && patch.departure) {
        patch.daysCount = Math.max(1, Math.round((new Date(patch.departure) - new Date(patch.arrival)) / 86400000));
        patch.travelDates = patch.arrival + ' to ' + patch.departure + ' (' + patch.daysCount + ' Days)';
      }
      var log = [];
      if (patch.status !== cur.status) log.push('Status changed from ' + cur.status + ' to ' + patch.status);
      if (patch.assignedDriver !== (cur.assignedDriver || '')) log.push(patch.assignedDriver ? 'Chauffeur assigned: ' + App.driverName(patch.assignedDriver) : 'Chauffeur unassigned');
      if (patch.finalPriceUSD !== (cur.finalPriceUSD == null ? null : Number(cur.finalPriceUSD))) log.push('Final price set to ' + UI.money(patch.finalPriceUSD));
      if (patch.amountPaidUSD !== (Number(cur.amountPaidUSD) || 0)) log.push('Payment recorded: ' + UI.money(patch.amountPaidUSD) + ' paid');
      if (log.length) patch.activity = (cur.activity || []).concat(log.map(logEntry));
      App.save('bookings', cur.id, patch, 'Booking updated').then(function () { dirty = false; });
    });
    el.querySelector('[data-del]').addEventListener('click', function () {
      UI.confirm({ title: 'Delete this booking?', text: 'Booking ' + esc(b.bookingRef) + ' for ' + esc(b.customerName) + ' will be permanently removed.', ok: 'Delete', danger: true })
        .then(function (ok) { if (ok) App.remove('bookings', b.id, 'Booking deleted').then(function () { layer.close(); }); });
    });
    el.querySelector('[data-print]').addEventListener('click', function () { printVoucher(current()); });
    el.querySelector('[data-quote]').addEventListener('click', function () {
      // Use what is on screen, even before "Save changes", so the quote matches the edits.
      var f = new FormData(el.querySelector('form.drawer-form'));
      var cur = Object.assign({}, current());
      if (f.get('finalPriceUSD') !== null && f.get('finalPriceUSD') !== '') cur.finalPriceUSD = Number(f.get('finalPriceUSD'));
      ['arrival', 'departure', 'vehicleType', 'pickupLocation', 'flightNumber'].forEach(function (k) { if (f.get(k)) cur[k] = String(f.get(k)); });
      if (cur.arrival && cur.departure) cur.daysCount = Math.max(1, Math.round((new Date(cur.departure) - new Date(cur.arrival)) / 86400000));
      openQuoteEmail(cur);
    });

    function current() { return App.data.bookings.filter(function (x) { return x.id === id; })[0] || b; }

    layer.refresh = function () {
      var cur = App.data.bookings.filter(function (x) { return x.id === id; })[0];
      if (!cur) { layer.close(); return; }
      b = cur;
      el.querySelector('.layer-head p').innerHTML = App.statusPill(cur.status) + ' <span class="muted">' + esc(cur.customerCountry || '') + '</span>';
      el.querySelector('[data-activity]').innerHTML = activityHtml(cur);
      if (!dirty) {
        el.querySelector('[name=status]').value = cur.status;
        el.querySelectorAll('[data-set-status]').forEach(function (x) { x.classList.toggle('is-on', x.getAttribute('data-set-status') === cur.status); });
      }
    };
    return layer;
  }
  App.openBooking = openBooking;

  function drawerBody(b) {
    var drivers = App.data.drivers;
    var vehicles = App.data.vehicles.length ? App.data.vehicles : Store.defaults.vehicles;
    var price = b.finalPriceUSD != null ? b.finalPriceUSD : '';
    var balance = Math.max((Number(price) || Number(b.estimatedTotalUSD) || 0) - (Number(b.amountPaidUSD) || 0), 0);
    var phoneDigits = String(b.customerPhone || '').replace(/[^\d+]/g, '');
    return '<form class="drawer-form" onsubmit="return false">' +
      '<div class="quick-actions">' +
        '<button type="button" class="qa qa--wa" data-template="reply">' + icon('whatsapp') + '<span>WhatsApp</span></button>' +
        '<a class="qa" href="mailto:' + esc(b.customerEmail) + '?subject=' + encodeURIComponent('Your Sri Lanka tour proposal · ' + b.bookingRef) + '">' + icon('mail') + '<span>Email</span></a>' +
        (phoneDigits.length > 5 ? '<a class="qa" href="tel:' + esc(phoneDigits) + '">' + icon('phone') + '<span>Call</span></a>' : '') +
        '<button type="button" class="qa" data-copy-email>' + icon('copy') + '<span>Copy email</span></button>' +
      '</div>' +

      '<section class="dsec"><h3>Pipeline stage</h3><input type="hidden" name="status" value="' + esc(b.status) + '">' +
        '<div class="steps" data-status-steps>' + App.STATUSES.map(function (s) {
          return '<button type="button" class="step' + (s.id === b.status ? ' is-on' : '') + '" data-set-status="' + s.id + '" style="--c:' + s.color + '"><i></i><span>' + s.label + '</span></button>';
        }).join('') + '</div></section>' +

      '<section class="dsec"><h3>Traveler</h3><dl class="facts">' +
        fact('Email', '<a href="mailto:' + esc(b.customerEmail) + '">' + esc(b.customerEmail) + '</a>') +
        fact('Phone / WhatsApp', esc(b.customerPhone || '—')) +
        fact('Country', esc(b.customerCountry || '—')) +
        fact('Passengers', esc(((+b.adults || 0)) + ' adults, ' + (+b.kids || 0) + ' children')) +
      '</dl></section>' +

      '<section class="dsec"><h3>Trip</h3><dl class="facts">' +
        fact('Package', esc(b.package || 'Custom route')) +
        fact('Requested vehicle', esc(b.vehicle || '')) +
        fact('Duration', esc((b.daysCount || '?') + ' days')) +
        fact('Website estimate', UI.money(b.estimatedTotalUSD) + (b.convertedTotal && String(b.convertedTotal).indexOf('$') !== 0 ? ' <span class="muted">(' + esc(b.convertedTotal) + ')</span>' : '')) +
      '</dl>' + (b.notes ? '<blockquote class="note">' + esc(b.notes) + '</blockquote>' : '') + '</section>' +

      '<section class="dsec"><h3>Plan & dispatch</h3><div class="form-grid">' +
        '<div class="field"><label>Arrival</label><input type="date" name="arrival" value="' + esc(b.arrival || '') + '"></div>' +
        '<div class="field"><label>Departure</label><input type="date" name="departure" value="' + esc(b.departure || '') + '"></div>' +
        '<div class="field"><label>Vehicle class</label><div class="select-wrap"><select name="vehicleType">' + vehicles.map(function (v) { return '<option value="' + v.id + '"' + (v.id === b.vehicleType ? ' selected' : '') + '>' + esc(v.name) + ' · ' + UI.money(v.rate) + '/day</option>'; }).join('') + '</select>' + icon('down') + '</div></div>' +
        '<div class="field"><label>Chauffeur</label><div class="select-wrap"><select name="assignedDriver"><option value="">Unassigned</option>' + drivers.map(function (d) { return '<option value="' + esc(d.id) + '"' + (d.id === b.assignedDriver ? ' selected' : '') + '>' + esc(d.name) + (d.status === 'off' ? ' (off duty)' : '') + '</option>'; }).join('') + '</select>' + icon('down') + '</div></div>' +
        '<div class="field"><label>Pickup location</label><input name="pickupLocation" value="' + esc(b.pickupLocation || '') + '" placeholder="e.g. CMB Airport arrivals"></div>' +
        '<div class="field"><label>Flight number</label><input name="flightNumber" value="' + esc(b.flightNumber || '') + '" placeholder="e.g. UL 504"></div>' +
      '</div></section>' +

      '<section class="dsec"><h3>Price & payment</h3><div class="form-grid">' +
        '<div class="field"><label>Final price (USD)</label><div class="input-prefix"><span>$</span><input type="number" min="0" step="1" name="finalPriceUSD" value="' + esc(price) + '" placeholder="' + esc(b.estimatedTotalUSD) + '"></div></div>' +
        '<div class="field"><label>Amount paid (USD)</label><div class="input-prefix"><span>$</span><input type="number" min="0" step="1" name="amountPaidUSD" value="' + esc(b.amountPaidUSD || 0) + '"></div></div>' +
        '<div class="field"><label>Payment status</label><div class="select-wrap"><select name="paymentStatus">' + ['Unpaid', 'Deposit', 'Paid', 'Refunded'].map(function (p) { return '<option' + (p === b.paymentStatus ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select>' + icon('down') + '</div></div>' +
        '<div class="field"><label>Balance due</label><div class="balance" data-balance>' + UI.money(balance) + '</div></div>' +
      '</div></section>' +

      '<section class="dsec"><h3>WhatsApp templates</h3><div class="tpl-row">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-template="quote">' + icon('send') + '<span>Send quote</span></button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-template="confirm">' + icon('check') + '<span>Confirmation</span></button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-template="driver">' + icon('wheel') + '<span>Chauffeur details</span></button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-template="review">' + icon('star') + '<span>Ask for review</span></button>' +
      '</div></section>' +

      '<section class="dsec"><h3>Internal notes</h3><textarea name="adminNotes" rows="3" placeholder="Only admins see this. Hotels, special requests, payment links…">' + esc(b.adminNotes || '') + '</textarea></section>' +

      '<section class="dsec"><h3>Activity</h3><div class="add-note"><input data-note-text placeholder="Log a call, message or update…"><button type="button" class="btn btn-ghost btn-sm" data-add-note>' + icon('plus') + '<span>Add</span></button></div>' +
        '<ol class="timeline" data-activity>' + activityHtml(b) + '</ol></section>' +
    '</form>';
  }

  function fact(k, v) { return '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>'; }

  function activityHtml(b) {
    var items = (b.activity || []).slice().reverse();
    if (!items.length) items = [{ at: b.createdAt, by: 'website', text: 'Inquiry submitted from the booking form' }];
    return items.map(function (a) {
      return '<li><span class="tl-dot"></span><div><p>' + esc(a.text) + '</p><small>' + UI.fmtDate(a.at, true) + ' · ' + esc(a.by || '') + '</small></div></li>';
    }).join('');
  }

  /* ---------------- WhatsApp ---------------- */
  function openWhatsApp(b, kind) {
    var first = String(b.customerName || 'there').split(/\s|&/)[0];
    var biz = App.settings();
    var price = UI.money(App.bookingValue(b));
    var driver = App.data.drivers.filter(function (d) { return d.id === b.assignedDriver; })[0];
    var dates = b.arrival ? UI.fmtDate(b.arrival) + ' to ' + UI.fmtDate(b.departure) : (b.travelDates || '');
    var texts = {
      reply: 'Hello ' + first + ', thank you for your inquiry with ' + (biz.businessName || 'Ceylon Chauffeurs') + ' (Ref ' + b.bookingRef + '). We have received your request for ' + shortPkg(b) + ' (' + dates + '). Our concierge will share your personalised proposal shortly. 🇱🇰',
      quote: 'Hello ' + first + ', here is your tour proposal from ' + (biz.businessName || 'Ceylon Chauffeurs') + ':\n\n🧾 Ref: ' + b.bookingRef + '\n🗺️ Tour: ' + shortPkg(b) + '\n📅 Dates: ' + dates + ' (' + (b.daysCount || '') + ' days)\n🚘 Vehicle: ' + (App.vehicleOf(b.vehicleType) || {}).name + '\n👥 Guests: ' + ((+b.adults || 0) + (+b.kids || 0)) + '\n💵 Total: ' + price + ' (fuel, tolls, parking & driver lodging included)\n\nReply YES to confirm and we will send the deposit details.',
      confirm: 'Hello ' + first + ', your Sri Lanka tour is CONFIRMED ✅\n\nRef: ' + b.bookingRef + '\nDates: ' + dates + '\nTotal: ' + price + '\nPaid: ' + UI.money(b.amountPaidUSD || 0) + '\n\nWe look forward to welcoming you to Sri Lanka!',
      driver: 'Hello ' + first + ', your chauffeur for ' + b.bookingRef + ' is ' + (driver ? driver.name + ' (' + (driver.phone || '') + ')' : '[driver name]') + '. ' + (b.pickupLocation ? 'Pickup: ' + b.pickupLocation + '. ' : '') + (b.flightNumber ? 'Flight: ' + b.flightNumber + '. ' : '') + 'He will meet you with a name board. Have a wonderful trip!',
      review: 'Hello ' + first + ', thank you for travelling with ' + (biz.businessName || 'Ceylon Chauffeurs') + '! 🙏 If you enjoyed your tour, we would be very grateful for a short review on TripAdvisor or Google. It really helps our small team.'
    };
    var phone = String(b.customerPhone || '').replace(/\D/g, '');
    var url = 'https://wa.me/' + (phone.length > 6 ? phone : '') + '?text=' + encodeURIComponent(texts[kind] || texts.reply);
    window.open(url, '_blank', 'noopener');
    if (kind !== 'reply' || b.status === 'New') {
      var patch = { activity: (b.activity || []).concat([logEntry('WhatsApp message opened: ' + kind)]) };
      if (b.status === 'New') patch.status = 'Contacted';
      App.save('bookings', b.id, patch, b.status === 'New' ? 'Marked as Contacted' : false);
    }
  }

  /* ---------------- Quotation by email ---------------- */
  function quoteData(b) {
    var biz = App.settings();
    var v = App.vehicleOf(b.vehicleType) || {};
    var pkg = (b.packageId && App.packageOf && App.packageOf(b.packageId)) ||
      App.data.packages.filter(function (p) { return p.title === b.package; })[0];
    var days = Number(b.daysCount) || 0;
    var dates = b.arrival ? UI.fmtDate(b.arrival) + ' to ' + UI.fmtDate(b.departure) : (b.travelDates || 'To be confirmed');
    return {
      biz: biz,
      first: String(b.customerName || '').split(/\s|&/)[0] || 'there',
      ref: b.bookingRef || '',
      tour: shortPkg(b),
      route: pkg && pkg.route ? pkg.route : '',
      dates: dates + (days ? ' (' + days + ' days / ' + Math.max(days - 1, 0) + ' nights)' : ''),
      guests: (+b.adults || 0) + ' adults' + (+b.kids ? ', ' + (+b.kids) + ' children' : ''),
      vehicle: (v.name || b.vehicle || '') + (v.models ? ' (' + v.models + ')' : ''),
      pickup: b.pickupLocation || '',
      total: UI.money(App.bookingValue(b)),
      paid: Number(b.amountPaidUSD) || 0,
      included: 'Private air-conditioned vehicle with an English-speaking chauffeur guide, fuel, highway tolls, parking fees, and the chauffeur\'s accommodation and meals.',
      issued: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  }

  function quoteEmailText(b) {
    var q = quoteData(b);
    var name = q.biz.businessName || 'Ceylon Chauffeurs';
    var lines = [
      'Dear ' + q.first + ',',
      '',
      'Thank you for choosing ' + name + '. Here is your personalised Sri Lanka tour quotation.',
      '',
      'QUOTATION  ·  Ref ' + q.ref + '  ·  ' + q.issued,
      '',
      'Tour: ' + q.tour
    ];
    if (q.route) lines.push('Route: ' + q.route);
    lines.push('Dates: ' + q.dates, 'Guests: ' + q.guests, 'Vehicle: ' + q.vehicle);
    if (q.pickup) lines.push('Pickup: ' + q.pickup);
    lines.push('', 'TOTAL PRICE: ' + q.total + ' (USD)');
    if (q.paid) lines.push('Already paid: ' + UI.money(q.paid));
    lines.push(
      '',
      'Included: ' + q.included,
      '',
      'To confirm, simply reply to this email' + (q.biz.displayPhone ? ' or message us on WhatsApp at ' + q.biz.displayPhone : '') + '. We will then send the deposit details.',
      '',
      'Warm regards,',
      name,
      [q.biz.displayPhone, q.biz.email].filter(Boolean).join('  ·  '),
      location.origin.indexOf('localhost') === -1 ? location.origin : ''
    );
    return {
      subject: 'Your Sri Lanka tour quotation · ' + q.tour + ' · Ref ' + q.ref,
      body: lines.join('\n').replace(/\n+$/, '')
    };
  }

  function openQuoteEmail(b) {
    var t = quoteEmailText(b);
    var layer = UI.openLayer({
      kind: 'modal', size: 'lg',
      eyebrow: esc(b.bookingRef) + ' · quotation',
      title: 'Email quotation',
      subtitle: 'Check the message, then send it from your email. You can edit anything below.',
      body: '<form class="quote-form" onsubmit="return false">' +
        '<div class="field"><label>To</label><input type="email" name="to" value="' + esc(b.customerEmail || '') + '" placeholder="customer@email.com"></div>' +
        '<div class="field"><label>Subject</label><input name="subject" value="' + esc(t.subject) + '"></div>' +
        '<div class="field"><label>Message</label><textarea name="body" rows="16" class="quote-body">' + esc(t.body) + '</textarea></div>' +
        '<p class="muted quote-hint">Tip: press <b>Quotation PDF</b>, choose "Save as PDF", and attach the file to the email for a branded copy.</p>' +
        '</form>',
      footer: '<button class="btn btn-ghost" data-copy>' + icon('copy') + '<span>Copy</span></button>' +
        '<button class="btn btn-ghost" data-pdf>' + icon('print') + '<span>Quotation PDF</span></button><span class="spacer"></span>' +
        '<button class="btn btn-ghost" data-gmail>' + icon('mail') + '<span>Send with Gmail</span></button>' +
        '<button class="btn btn-primary" data-mailapp>' + icon('mail') + '<span>Send with email app</span></button>'
    });
    var el = layer.el;
    function val(n) { return String(el.querySelector('[name=' + n + ']').value || '').trim(); }
    function check() {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val('to'))) { UI.toast('Add the customer\'s email address first', 'error'); el.querySelector('[name=to]').focus(); return false; }
      return true;
    }
    function sent(via) {
      var cur = App.data.bookings.filter(function (x) { return x.id === b.id; })[0] || b;
      var patch = { activity: (cur.activity || []).concat([logEntry('Quotation emailed (' + via + ') · ' + UI.money(App.bookingValue(b)))]) };
      if (cur.status === 'New' || cur.status === 'Contacted') patch.status = 'Quoted';
      if (!cur.customerEmail && val('to')) patch.customerEmail = val('to');
      App.save('bookings', cur.id, patch, patch.status ? 'Marked as Quoted' : 'Quotation logged');
      layer.close();
    }
    el.querySelector('[data-mailapp]').addEventListener('click', function () {
      if (!check()) return;
      location.href = 'mailto:' + encodeURIComponent(val('to')).replace(/%40/g, '@') + '?subject=' + encodeURIComponent(val('subject')) + '&body=' + encodeURIComponent(el.querySelector('[name=body]').value);
      sent('email app');
    });
    el.querySelector('[data-gmail]').addEventListener('click', function () {
      if (!check()) return;
      var url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(val('to')) + '&su=' + encodeURIComponent(val('subject')) + '&body=' + encodeURIComponent(el.querySelector('[name=body]').value);
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (e) { /* ignore */ } } else { UI.toast('Allow pop-ups to open Gmail', 'error'); return; }
      sent('Gmail');
    });
    el.querySelector('[data-copy]').addEventListener('click', function () {
      var text = val('subject') + '\n\n' + el.querySelector('[name=body]').value;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { UI.toast('Quotation copied'); });
    });
    el.querySelector('[data-pdf]').addEventListener('click', function () { printQuotation(b); });
  }

  function printQuotation(b) {
    var q = quoteData(b);
    var w = window.open('', '_blank');
    if (!w) { UI.toast('Allow pop-ups to open the quotation', 'error'); return; }
    var row = function (k, v) { return v ? '<tr><th>' + k + '</th><td>' + esc(v) + '</td></tr>' : ''; };
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Quotation ' + esc(q.ref) + '</title><style>' +
      'body{font-family:Geist,system-ui,sans-serif;color:#0f0f0e;margin:40px;max-width:760px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #9b5a1b;padding-bottom:16px;margin-bottom:24px}' +
      'img{height:56px}h1{font-size:24px;margin:6px 0 0}small{color:#5f5e58}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{text-align:left;padding:10px;border-bottom:1px solid #e4e4df;font-size:14px;vertical-align:top}th{width:32%;color:#5f5e58;font-weight:500}' +
      '.ref{font:600 18px "Geist Mono",monospace;color:#9b5a1b}.total{display:flex;justify-content:space-between;align-items:center;background:#f6efe6;border-radius:12px;padding:18px 20px;margin:8px 0 22px}.total b{font-size:28px;color:#9b5a1b}' +
      'h2{font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:#9b5a1b;margin:22px 0 8px}p{font-size:14px;line-height:1.6}footer{margin-top:32px;font-size:12px;color:#5f5e58;border-top:1px solid #e4e4df;padding-top:12px}</style></head><body>' +
      '<header><div><img src="' + location.href.replace(/admin\/.*$/, '') + 'assets/images/logo.png" alt=""><h1>Tour Quotation</h1></div><div style="text-align:right"><div class="ref">' + esc(q.ref) + '</div><small>Issued ' + esc(q.issued) + '</small></div></header>' +
      '<p>Dear ' + esc(q.first) + ', thank you for choosing ' + esc(q.biz.businessName || 'Ceylon Chauffeurs') + '. Here is your personalised Sri Lanka tour quotation.</p>' +
      '<h2>Your tour</h2><table>' + row('Tour', q.tour) + row('Route', q.route) + row('Dates', q.dates) + row('Guests', q.guests) + row('Vehicle', q.vehicle) + row('Pickup', q.pickup) + '</table>' +
      '<div class="total"><span>Total price (USD)</span><b>' + esc(q.total) + '</b></div>' +
      (q.paid ? '<p><small>Already paid: ' + esc(UI.money(q.paid)) + '</small></p>' : '') +
      '<h2>Included</h2><p>' + esc(q.included) + '</p>' +
      '<h2>How to confirm</h2><p>Reply to our email' + (q.biz.displayPhone ? ' or message us on WhatsApp at ' + esc(q.biz.displayPhone) : '') + ', and we will send the deposit details.</p>' +
      '<footer>' + esc(q.biz.businessName || 'Ceylon Chauffeurs') + ' · ' + esc(q.biz.displayPhone || '') + ' · ' + esc(q.biz.email || '') + ' · ' + esc(q.biz.officeAddress || '') + '</footer>' +
      '<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>');
    w.document.close();
  }

  /* ---------------- Voucher ---------------- */
  function printVoucher(b) {
    var biz = App.settings();
    var driver = App.data.drivers.filter(function (d) { return d.id === b.assignedDriver; })[0];
    var w = window.open('', '_blank');
    if (!w) { UI.toast('Allow pop-ups to print the voucher', 'error'); return; }
    var row = function (k, v) { return '<tr><th>' + k + '</th><td>' + esc(v == null || v === '' ? '—' : v) + '</td></tr>'; };
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Voucher ' + esc(b.bookingRef) + '</title><style>' +
      'body{font-family:Geist,system-ui,sans-serif;color:#0f0f0e;margin:40px;max-width:760px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #9b5a1b;padding-bottom:16px;margin-bottom:24px}' +
      'img{height:56px}h1{font-size:22px;margin:0}small{color:#5f5e58}table{width:100%;border-collapse:collapse;margin-bottom:24px}th,td{text-align:left;padding:9px 10px;border-bottom:1px solid #e4e4df;font-size:14px;vertical-align:top}th{width:38%;color:#5f5e58;font-weight:500}' +
      'h2{font-size:13px;text-transform:uppercase;letter-spacing:.12em;color:#9b5a1b;margin:24px 0 8px}.ref{font:600 18px "Geist Mono",monospace;color:#9b5a1b}footer{margin-top:32px;font-size:12px;color:#5f5e58;border-top:1px solid #e4e4df;padding-top:12px}</style></head><body>' +
      '<header><div><img src="' + location.href.replace(/admin\/.*$/, '') + 'assets/images/logo.png" alt=""><h1>Tour Dispatch Voucher</h1></div><div style="text-align:right"><div class="ref">' + esc(b.bookingRef) + '</div><small>Issued ' + new Date().toLocaleDateString('en-GB') + '</small></div></header>' +
      '<h2>Traveler</h2><table>' + row('Name', b.customerName) + row('Email', b.customerEmail) + row('Phone', b.customerPhone) + row('Country', b.customerCountry) + row('Passengers', (+b.adults || 0) + ' adults, ' + (+b.kids || 0) + ' children') + '</table>' +
      '<h2>Tour</h2><table>' + row('Package', b.package) + row('Dates', (b.arrival || '') + ' → ' + (b.departure || '') + ' (' + (b.daysCount || '') + ' days)') + row('Vehicle', (App.vehicleOf(b.vehicleType) || {}).name) + row('Pickup', b.pickupLocation) + row('Flight', b.flightNumber) + row('Traveler notes', b.notes) + '</table>' +
      '<h2>Chauffeur</h2><table>' + row('Name', driver ? driver.name : 'To be assigned') + row('Phone', driver ? driver.phone : '') + row('Languages', driver ? driver.languages : '') + '</table>' +
      '<h2>Payment</h2><table>' + row('Total (USD)', UI.money(App.bookingValue(b))) + row('Paid', UI.money(b.amountPaidUSD || 0)) + row('Status', b.paymentStatus) + '</table>' +
      '<footer>' + esc(biz.businessName || 'Ceylon Chauffeurs') + ' · ' + esc(biz.displayPhone || '') + ' · ' + esc(biz.email || '') + ' · ' + esc(biz.officeAddress || '') + '<br>Fuel, highway tolls, parking fees and driver accommodation & meals are included.</footer>' +
      '<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>');
    w.document.close();
  }

  /* ---------------- New booking (phone / walk-in) ---------------- */
  function openNewBooking() {
    var vehicles = App.data.vehicles.length ? App.data.vehicles : Store.defaults.vehicles;
    var fields = [
      { name: 'customerName', label: 'Traveler name', required: true, span: 2 },
      { name: 'customerEmail', label: 'Email', type: 'email' },
      { name: 'customerPhone', label: 'Phone / WhatsApp' },
      { name: 'customerCountry', label: 'Country' },
      { name: 'source', label: 'Source', type: 'select', options: ['WhatsApp', 'Phone', 'Email', 'Walk-in', 'Agent', 'Website'] },
      { name: 'arrival', label: 'Arrival', type: 'date', required: true },
      { name: 'departure', label: 'Departure', type: 'date', required: true },
      { name: 'adults', label: 'Adults', type: 'number', min: 1, default: 2 },
      { name: 'kids', label: 'Children', type: 'number', min: 0, default: 0 },
      { name: 'vehicleType', label: 'Vehicle', type: 'select', options: vehicles.map(function (v) { return { value: v.id, label: v.name + ' · $' + v.rate + '/day' }; }) },
      { name: 'packageId', label: 'Tour package', type: 'select', options: [{ value: 'custom', label: 'Custom route' }].concat(App.data.packages.map(function (p) { return { value: p.id, label: p.title }; })) },
      { name: 'notes', label: 'Notes', type: 'textarea', span: 2 }
    ];
    var layer = UI.openLayer({
      kind: 'modal', size: 'md', title: 'New booking', eyebrow: 'Manual entry',
      body: '<form class="form-grid" data-form>' + fields.map(function (f) { return UI.field(f); }).join('') + '</form>',
      footer: '<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-ok>' + icon('plus') + '<span>Create booking</span></button>'
    });
    layer.el.querySelector('[data-ok]').addEventListener('click', function () {
      var form = layer.el.querySelector('[data-form]');
      if (!form.reportValidity()) return;
      var d = UI.readForm(form, fields);
      var v = vehicles.filter(function (x) { return x.id === d.vehicleType; })[0] || vehicles[0];
      var pkg = App.packageOf(d.packageId);
      var days = Math.max(1, Math.round((new Date(d.departure) - new Date(d.arrival)) / 86400000));
      var now = new Date().toISOString();
      var rec = {
        bookingRef: 'CC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: now, timestamp: now,
        customerName: d.customerName, customerEmail: d.customerEmail, customerPhone: d.customerPhone, customerCountry: d.customerCountry,
        arrival: d.arrival, departure: d.departure, daysCount: days, travelDates: d.arrival + ' to ' + d.departure + ' (' + days + ' Days)',
        adults: d.adults || 0, kids: d.kids || 0, passengers: (d.adults || 0) + ' Adults, ' + (d.kids || 0) + ' Children',
        vehicleType: v.id, vehicle: v.name + ' (' + v.models + ')',
        packageId: d.packageId, package: pkg ? pkg.title : 'Custom Route (Tailored to your preferences)',
        notes: d.notes, estimatedTotalUSD: days * (Number(v.rate) || 0), status: 'New', assignedDriver: '',
        paymentStatus: 'Unpaid', amountPaidUSD: 0, source: d.source,
        activity: [logEntry('Booking created manually (' + d.source + ')')]
      };
      App.save('bookings', null, rec, 'Booking created').then(function (id) { layer.close(); location.hash = '#/bookings/' + id; });
    });
  }

  /* ================================================================
     TOUR CALENDAR
     ================================================================ */
  App.views.calendar = function (host) {
    var cur = new Date(); cur.setDate(1);
    var showOpen = true;
    host.innerHTML = App.pageHead('Operations', 'Tour calendar', 'See which tours are on the road each day and which chauffeurs are busy.',
      '<label class="switch switch--inline"><input type="checkbox" data-open checked><span class="switch-track"><span class="switch-thumb"></span></span><span class="switch-label">Show quotes</span></label>') +
      '<div class="card cal-card"><header class="cal-head"><button class="icon-btn" data-prev aria-label="Previous month">' + icon('left') + '</button><h2 data-title></h2><button class="icon-btn" data-next aria-label="Next month">' + icon('right') + '</button><button class="btn btn-ghost btn-sm" data-today>Today</button></header>' +
      '<div class="cal-dow">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div><div class="cal-grid" data-grid></div></div>' +
      '<div class="card"><header class="card-head"><div><h2>Tours this month</h2></div></header><div data-agenda></div></div>';
    host.querySelector('[data-prev]').onclick = function () { cur.setMonth(cur.getMonth() - 1); update(); };
    host.querySelector('[data-next]').onclick = function () { cur.setMonth(cur.getMonth() + 1); update(); };
    host.querySelector('[data-today]').onclick = function () { cur = new Date(); cur.setDate(1); update(); };
    host.querySelector('[data-open]').onchange = function () { showOpen = this.checked; update(); };
    host.addEventListener('click', function (e) { var t = e.target.closest('[data-bid]'); if (t) location.hash = '#/bookings/' + t.getAttribute('data-bid'); });

    function key(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

    function update() {
      var statuses = showOpen ? ['Confirmed', 'Completed', 'Quoted', 'Contacted'] : ['Confirmed', 'Completed'];
      var tours = App.data.bookings.filter(function (b) { return b.arrival && b.departure && statuses.indexOf(b.status) > -1; });
      host.querySelector('[data-title]').textContent = cur.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      var first = new Date(cur.getFullYear(), cur.getMonth(), 1);
      var start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
      var todayK = key(new Date());
      var html = '';
      for (var i = 0; i < 42; i++) {
        var d = new Date(start); d.setDate(start.getDate() + i);
        var k = key(d);
        var dayTours = tours.filter(function (b) { return b.arrival <= k && b.departure >= k; });
        var inMonth = d.getMonth() === cur.getMonth();
        html += '<div class="cal-cell' + (inMonth ? '' : ' is-out') + (k === todayK ? ' is-today' : '') + '"><span class="cal-day">' + d.getDate() + '</span>' +
          dayTours.slice(0, 3).map(function (b) {
            var st = App.statusOf(b.status);
            var startHere = b.arrival === k;
            return '<button class="cal-ev' + (startHere ? ' is-start' : '') + '" style="--c:' + st.color + '" data-bid="' + esc(b.id) + '" title="' + esc(b.customerName + ' · ' + shortPkg(b)) + '">' + (startHere ? esc(b.customerName.split(' ')[0]) : '&nbsp;') + '</button>';
          }).join('') + (dayTours.length > 3 ? '<span class="cal-more">+' + (dayTours.length - 3) + '</span>' : '') + '</div>';
        if (i === 34 && start.getMonth() !== cur.getMonth() && new Date(start.getTime() + 35 * 86400000).getMonth() !== cur.getMonth()) break;
      }
      host.querySelector('[data-grid]').innerHTML = html;
      var mStart = key(first), mEnd = key(new Date(cur.getFullYear(), cur.getMonth() + 1, 0));
      var monthTours = tours.filter(function (b) { return b.arrival <= mEnd && b.departure >= mStart; }).sort(function (a, b) { return a.arrival.localeCompare(b.arrival); });
      host.querySelector('[data-agenda]').innerHTML = monthTours.length ? '<ul class="mini-list">' + monthTours.map(function (b) {
        var d = new Date(b.arrival + 'T00:00:00');
        return '<li><a href="#/bookings/' + esc(b.id) + '"><span class="date-chip"><b>' + d.getDate() + '</b>' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</span><span class="ml-main"><b>' + esc(b.customerName) + '</b><small>' + esc(shortPkg(b)) + ' · ' + b.daysCount + ' days · ' + esc((App.vehicleOf(b.vehicleType) || {}).name || '') + ' · ' + (App.driverName(b.assignedDriver) ? esc(App.driverName(b.assignedDriver)) : '<em class="warn-text">No chauffeur</em>') + '</small></span><span class="ml-end">' + App.statusPill(b.status) + '</span></a></li>';
      }).join('') + '</ul>' : '<p class="empty-mini">No tours in this month.</p>';
    }
    update();
    return { update: update };
  };
})();
