/**
 * Ceylon Chauffeurs Admin - website content editors
 * Tour packages, fleet & prices, chauffeurs, reviews, FAQs, settings
 */
(function () {
  'use strict';
  var App = window.CCApp, UI = window.CCUI, Store = window.CCStore;
  var icon = UI.icon, esc = UI.esc;

  /* ---------------- Generic editor ---------------- */
  function openEditor(opts) {
    // opts: { title, eyebrow, col, id, doc, fields, size, extraHtml, wireExtra(el), collect(el, data), afterSave }
    var doc = opts.doc || {};
    var layer = UI.openLayer({
      kind: 'drawer', size: opts.size || 'md', title: opts.title, eyebrow: opts.eyebrow,
      body: '<form class="form-grid" data-form onsubmit="return false">' + opts.fields.map(function (f) { return UI.field(f, UI.getPath(doc, f.name)); }).join('') + '</form>' + (opts.extraHtml || ''),
      footer: (opts.id && opts.canDelete !== false ? '<button class="btn btn-danger-ghost" data-del>' + icon('trash') + '<span>Delete</span></button>' : '') + '<span class="spacer"></span><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" data-ok>' + icon('check') + '<span>Save</span></button>'
    });
    var el = layer.el;
    UI.wireForm(el);
    if (opts.wireExtra) opts.wireExtra(el);
    el.querySelector('[data-ok]').addEventListener('click', function () {
      var form = el.querySelector('[data-form]');
      if (!form.reportValidity()) return;
      var data = UI.readForm(form, opts.fields);
      if (opts.collect) data = opts.collect(el, data) || data;
      if (!data) return;
      var btn = this; btn.disabled = true;
      App.save(opts.col, opts.id || data.id || null, data, (opts.id ? 'Saved' : 'Added') + ' · live on the website')
        .then(function () { layer.close(); if (opts.afterSave) opts.afterSave(); })
        .catch(function () { btn.disabled = false; });
    });
    var del = el.querySelector('[data-del]');
    if (del) del.addEventListener('click', function () {
      UI.confirm({ title: 'Delete “' + esc(opts.deleteName || opts.title) + '”?', text: 'This removes it from the dashboard and the website. This cannot be undone.', ok: 'Delete', danger: true })
        .then(function (ok) { if (ok) App.remove(opts.col, opts.id).then(function () { layer.close(); }); });
    });
    return layer;
  }

  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40); }

  function toggleActive(col, doc, field, label) {
    field = field || 'active';
    var patch = {}; patch[field] = !doc[field];
    App.save(col, doc.id, patch, (patch[field] ? 'Shown on' : 'Hidden from') + ' the website');
  }

  function reorder(col, list, id, dir) {
    var i = list.findIndex(function (x) { return x.id === id; });
    var j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    var a = list[i], b = list[j];
    var oa = a.order || i + 1, ob = b.order || j + 1;
    if (oa === ob) { oa = i + 1; ob = j + 1; }
    Promise.all([Store.save(col, a.id, { order: ob }), Store.save(col, b.id, { order: oa })]).then(function () { UI.toast('Order updated'); });
  }

  function vehicles() { return App.data.vehicles.length ? App.data.vehicles : Store.defaults.vehicles; }
  function rateOf(id) { var v = vehicles().filter(function (x) { return x.id === id; })[0]; return v ? Number(v.rate) || 0 : 0; }

  /* ================================================================
     TOUR PACKAGES
     ================================================================ */
  App.views.packages = function (host, args) {
    var st = { cat: 'all', q: '' };
    host.innerHTML = App.pageHead('Website content', 'Tour packages', 'Edit itineraries, prices, routes and photos. Changes appear on the Tour Packages page and booking form.',
      '<button class="btn btn-primary" data-new>' + icon('plus') + '<span>New package</span></button>') +
      '<div class="toolbar card"><div class="search-box">' + icon('search') + '<input type="search" placeholder="Search packages, places…" data-q></div>' +
      '<div class="seg seg--wrap" data-cats><button data-cat="all">All</button>' + App.CATEGORIES.map(function (c) { return '<button data-cat="' + c.id + '">' + esc(c.label.split(' /')[0].split(' &')[0]) + '</button>'; }).join('') + '</div></div>' +
      '<div class="pkg-grid" data-grid></div>';
    host.querySelector('[data-q]').addEventListener('input', UI.debounce(function (e) { st.q = e.target.value.toLowerCase(); update(); }, 120));
    host.querySelector('[data-cats]').addEventListener('click', function (e) { var b = e.target.closest('[data-cat]'); if (b) { st.cat = b.getAttribute('data-cat'); update(); } });
    host.querySelector('[data-new]').addEventListener('click', function () { editPackage(null); });
    var grid = host.querySelector('[data-grid]');
    grid.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]'); if (!a) return;
      var p = App.packageOf(a.getAttribute('data-id'));
      var act = a.getAttribute('data-act');
      if (act === 'edit') editPackage(p);
      if (act === 'toggle') toggleActive('packages', p);
      if (act === 'dup') { var c = JSON.parse(JSON.stringify(p)); c.id = p.id + '-copy'; c.title = p.title + ' (copy)'; c.active = false; c.order = (p.order || 0) + 0.5; App.save('packages', c.id, c, 'Duplicated (hidden until you publish it)'); }
      if (act === 'up' || act === 'down') reorder('packages', sorted(), p.id, act === 'up' ? -1 : 1);
    });

    function sorted() { return App.data.packages.slice().sort(function (a, b) { return (a.order || 99) - (b.order || 99); }); }

    function update() {
      host.querySelectorAll('[data-cat]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-cat') === st.cat); });
      if (!App.S.ready.packages) { grid.innerHTML = '<div class="card skeleton" style="height:280px"></div>'; return; }
      var rows = sorted().filter(function (p) {
        if (st.cat !== 'all' && p.category !== st.cat) return false;
        if (st.q && (p.title + ' ' + p.route + ' ' + (p.keyFeature || '')).toLowerCase().indexOf(st.q) === -1) return false;
        return true;
      });
      if (!rows.length) { grid.innerHTML = App.emptyState('map', 'No packages', App.data.packages.length ? 'Nothing matches this filter.' : 'Import your website content from Settings, or add a new package.'); return; }
      var demand = {};
      App.data.bookings.forEach(function (b) { if (b.packageId) demand[b.packageId] = (demand[b.packageId] || 0) + 1; });
      grid.innerHTML = rows.map(function (p) {
        var base = (Number(p.days) || 0) * rateOf('sedan');
        return '<article class="pkg-card' + (p.active === false ? ' is-off' : '') + '">' +
          '<div class="pkg-media"><img src="' + esc(UI.resolveImg(p.image)) + '" alt="" loading="lazy"><span class="pkg-days">' + esc(p.days) + ' days</span>' + (p.active === false ? '<span class="pkg-hidden">' + icon('eyeOff') + 'Hidden</span>' : '') + '</div>' +
          '<div class="pkg-body"><span class="eyebrow">' + esc((App.CATEGORIES.filter(function (c) { return c.id === p.category; })[0] || {}).label || p.categoryName || '') + '</span>' +
          '<h3>' + esc(p.title) + '</h3><p class="muted">' + esc(p.keyFeature || '') + '</p>' +
          '<div class="pkg-prices"><div><small>Chauffeur only (sedan)</small><b>' + UI.money(base) + '</b></div><div><small>Full package</small><b>' + UI.money(p.fullRate) + '</b></div><div><small>Inquiries</small><b>' + (demand[p.id] || 0) + '</b></div></div>' +
          '<div class="pkg-actions"><button class="btn btn-ghost btn-sm" data-act="edit" data-id="' + esc(p.id) + '">' + icon('edit') + '<span>Edit</span></button>' +
          '<button class="icon-btn" data-act="toggle" data-id="' + esc(p.id) + '" aria-label="' + (p.active === false ? 'Show on website' : 'Hide from website') + '" title="' + (p.active === false ? 'Show on website' : 'Hide from website') + '">' + icon(p.active === false ? 'eyeOff' : 'eye') + '</button>' +
          '<button class="icon-btn" data-act="dup" data-id="' + esc(p.id) + '" aria-label="Duplicate" title="Duplicate">' + icon('copy') + '</button>' +
          '<span class="spacer"></span><button class="icon-btn" data-act="up" data-id="' + esc(p.id) + '" aria-label="Move up">' + icon('up') + '</button><button class="icon-btn" data-act="down" data-id="' + esc(p.id) + '" aria-label="Move down">' + icon('down') + '</button></div></div></article>';
      }).join('');
    }
    update();
    if (args[0]) setTimeout(function () { var p = App.packageOf(args[0]); if (p) editPackage(p); }, 80);
    return { update: update };
  };

  function editPackage(p) {
    var isNew = !p;
    p = p || { category: 'all-rounder', days: 7, active: true, image: 'assets/images/hero.jpg', itinerary: [], highlights: [], routePoints: [], order: App.data.packages.length + 1 };
    var coords = (window.CC_SEED && window.CC_SEED.coords) || {};
    var fields = [
      { name: 'title', label: 'Package title', required: true, span: 2 },
      { name: 'category', label: 'Category', type: 'select', options: App.CATEGORIES.map(function (c) { return { value: c.id, label: c.label }; }) },
      { name: 'days', label: 'Days', type: 'number', min: 1, max: 60, required: true },
      { name: 'fullRate', label: 'Full package price (USD)', type: 'number', min: 0, prefix: '$', hint: 'Hotels + chauffeur, shown with the "Full package" switch' },
      { name: 'baseRateSedan', label: 'Chauffeur-only price (sedan)', type: 'number', min: 0, prefix: '$', hint: 'The site calculates days × vehicle daily rate; this is kept for reference' },
      { name: 'keyFeature', label: 'Key feature line', span: 2, placeholder: 'e.g. 2 Nights in Sigiriya + 2 Nights in Ella' },
      { name: 'image', label: 'Cover photo', type: 'image', span: 2 },
      { name: 'route', label: 'Route text', type: 'textarea', rows: 2, span: 2 },
      { name: 'routePoints', label: 'Map stops (in order)', type: 'list', rows: 4, hint: 'Known places: ' + Object.keys(coords).join(', ') },
      { name: 'highlights', label: 'Highlights', type: 'list', rows: 4 },
      { name: 'active', label: 'Show on website', type: 'toggle', span: 2 }
    ];
    var days = (p.itinerary || []).slice();
    function dayRow(d, i) {
      return '<div class="it-day" data-day><div class="it-num">' + (i + 1) + '</div><div class="it-fields">' +
        '<input data-k="title" value="' + esc(d.title || '') + '" placeholder="Day title, e.g. Kandy → Ella scenic train">' +
        '<input data-k="tag" value="' + esc(d.tag || '') + '" placeholder="Tag (optional), e.g. REST & EXPLORE">' +
        '<textarea data-k="details" rows="2" placeholder="What happens this day">' + esc(d.details || '') + '</textarea></div>' +
        '<div class="it-tools"><button type="button" class="icon-btn" data-it="up" aria-label="Move day up">' + icon('up') + '</button><button type="button" class="icon-btn" data-it="down" aria-label="Move day down">' + icon('down') + '</button><button type="button" class="icon-btn" data-it="del" aria-label="Remove day">' + icon('trash') + '</button></div></div>';
    }
    function readDays(el) {
      return Array.prototype.map.call(el.querySelectorAll('[data-day]'), function (row, i) {
        var o = { day: i + 1 };
        row.querySelectorAll('[data-k]').forEach(function (inp) { var v = inp.value.trim(); if (v) o[inp.getAttribute('data-k')] = v; });
        return o;
      });
    }
    openEditor({
      col: 'packages', id: isNew ? null : p.id, doc: p, size: 'lg', fields: fields,
      title: isNew ? 'New tour package' : p.title, eyebrow: isNew ? 'Tour packages' : 'Edit package', deleteName: p.title,
      extraHtml: '<section class="dsec"><div class="dsec-head"><h3>Day-by-day itinerary</h3><button type="button" class="btn btn-ghost btn-sm" data-add-day>' + icon('plus') + '<span>Add day</span></button></div><div class="it-list" data-days>' + days.map(dayRow).join('') + '</div></section>',
      wireExtra: function (el) {
        var wrap = el.querySelector('[data-days]');
        function renum() { wrap.querySelectorAll('.it-num').forEach(function (n, i) { n.textContent = i + 1; }); }
        el.querySelector('[data-add-day]').addEventListener('click', function () {
          wrap.insertAdjacentHTML('beforeend', dayRow({}, wrap.children.length));
          wrap.lastElementChild.querySelector('input').focus();
        });
        wrap.addEventListener('click', function (e) {
          var b = e.target.closest('[data-it]'); if (!b) return;
          var row = b.closest('[data-day]'); var act = b.getAttribute('data-it');
          if (act === 'del') row.remove();
          if (act === 'up' && row.previousElementSibling) wrap.insertBefore(row, row.previousElementSibling);
          if (act === 'down' && row.nextElementSibling) wrap.insertBefore(row.nextElementSibling, row);
          renum();
        });
      },
      collect: function (el, data) {
        var unknown = (data.routePoints || []).filter(function (r) { return !coords[r]; });
        if (unknown.length) UI.toast('Not on the map yet: ' + unknown.join(', ') + ' (they will be skipped on the route map)', 'info');
        data.itinerary = readDays(el);
        data.categoryName = (App.CATEGORIES.filter(function (c) { return c.id === data.category; })[0] || {}).label;
        if (isNew) { data.id = 'pkg-' + data.days + 'd-' + slug(data.title).slice(0, 24); data.order = p.order; }
        return data;
      }
    });
  }

  /* ================================================================
     FLEET & PRICES
     ================================================================ */
  App.views.fleet = function (host) {
    host.innerHTML = App.pageHead('Website content', 'Fleet & daily prices', 'Daily rates here drive every price on the website: fleet cards, package prices and the booking calculator.',
      '<button class="btn btn-primary" data-new>' + icon('plus') + '<span>Add vehicle class</span></button>') +
      '<div class="fleet-grid" data-grid></div>' +
      '<div class="card"><header class="card-head"><div><h2>Package price preview</h2><p>Chauffeur-only price = days × daily rate</p></div></header><div class="table-wrap" data-matrix></div></div>';
    host.querySelector('[data-new]').addEventListener('click', function () { editVehicle(null); });
    var grid = host.querySelector('[data-grid]');
    grid.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]'); if (!a) return;
      var v = vehicles().filter(function (x) { return x.id === a.getAttribute('data-id'); })[0];
      var act = a.getAttribute('data-act');
      if (act === 'edit') editVehicle(v);
      if (act === 'toggle') toggleActive('vehicles', v);
      if (act === 'rate') {
        var input = grid.querySelector('[data-rate="' + v.id + '"]');
        var val = Number(input.value);
        if (!(val > 0)) { UI.toast('Enter a valid rate', 'error'); return; }
        App.save('vehicles', v.id, Object.assign({}, App.data.vehicles.length ? {} : v, { rate: val }), 'Daily rate updated to $' + val);
      }
    });
    grid.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.matches('[data-rate]')) grid.querySelector('[data-act="rate"][data-id="' + e.target.getAttribute('data-rate') + '"]').click();
    });

    function update() {
      var list = vehicles();
      grid.innerHTML = list.map(function (v) {
        var count = App.data.bookings.filter(function (b) { return b.vehicleType === v.id && App.WON_STATUSES.indexOf(b.status) > -1; }).length;
        return '<article class="veh-card' + (v.active === false ? ' is-off' : '') + '"><div class="veh-media"><img src="' + esc(UI.resolveImg(v.image)) + '" alt="" loading="lazy"></div>' +
          '<div class="veh-body"><div class="veh-title"><div><h3>' + esc(v.name) + '</h3><p class="muted">' + esc(v.models || '') + '</p></div><button class="icon-btn" data-act="toggle" data-id="' + esc(v.id) + '" title="' + (v.active === false ? 'Show on website' : 'Hide from website') + '" aria-label="Toggle visibility">' + icon(v.active === false ? 'eyeOff' : 'eye') + '</button></div>' +
          '<div class="veh-specs"><span>' + icon('users') + esc((v.minPax || 1) + '–' + (v.maxPax || '?')) + ' pax</span><span>' + icon('inbox') + esc(v.luggage || '') + '</span><span>' + icon('car') + esc(v.units || 1) + ' in fleet</span><span>' + icon('check') + count + ' booked</span></div>' +
          '<label class="rate-edit"><span>Daily rate (USD, all-inclusive)</span><div class="rate-row"><div class="input-prefix"><span>$</span><input type="number" min="1" step="1" value="' + esc(v.rate) + '" data-rate="' + esc(v.id) + '"></div><button class="btn btn-primary btn-sm" data-act="rate" data-id="' + esc(v.id) + '">Update</button></div></label>' +
          '<button class="btn btn-ghost btn-sm btn-block" data-act="edit" data-id="' + esc(v.id) + '">' + icon('edit') + '<span>Edit details</span></button></div></article>';
      }).join('');
      var pk = App.data.packages.slice().sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
      host.querySelector('[data-matrix]').innerHTML = pk.length ? '<table class="dtable dtable--plain"><thead><tr><th>Package</th><th>Days</th>' + list.map(function (v) { return '<th>' + esc(v.name.split(' ')[0] === 'Luxury' ? v.name.replace('Luxury ', '') : v.name.split(' ').pop()) + '</th>'; }).join('') + '<th>Full package</th></tr></thead><tbody>' +
        pk.map(function (p) { return '<tr><td data-label="Package">' + esc(p.title.replace(/\s*\(.*\)\s*/, '')) + '</td><td data-label="Days">' + esc(p.days) + '</td>' + list.map(function (v) { return '<td data-label="' + esc(v.name) + '">' + UI.money(p.days * v.rate) + '</td>'; }).join('') + '<td data-label="Full package"><b>' + UI.money(p.fullRate) + '</b></td></tr>'; }).join('') + '</tbody></table>' : '<p class="empty-mini">No packages yet.</p>';
    }
    update();
    return { update: update };
  };

  function editVehicle(v) {
    var isNew = !v;
    v = v || { active: true, units: 1, minPax: 1, maxPax: 3, image: 'assets/images/sedan.jpg', features: [], order: vehicles().length + 1 };
    openEditor({
      col: 'vehicles', id: isNew ? null : v.id, doc: v, size: 'md', title: isNew ? 'New vehicle class' : v.name, eyebrow: 'Fleet', deleteName: v.name,
      canDelete: isNew ? false : ['sedan', 'van', 'bus'].indexOf(v.id) === -1,
      fields: [
        { name: 'name', label: 'Class name', required: true, span: 2, placeholder: 'e.g. Executive Sedan' },
        { name: 'models', label: 'Models', span: 2, placeholder: 'e.g. Toyota Premio / Prius / Axio' },
        { name: 'rate', label: 'Daily rate (USD)', type: 'number', min: 1, prefix: '$', required: true },
        { name: 'units', label: 'Vehicles in fleet', type: 'number', min: 0 },
        { name: 'minPax', label: 'Min passengers', type: 'number', min: 1 },
        { name: 'maxPax', label: 'Max passengers', type: 'number', min: 1, hint: 'The booking form warns travelers above this' },
        { name: 'luggage', label: 'Luggage', span: 2, placeholder: 'e.g. 2-3 Bags' },
        { name: 'image', label: 'Photo', type: 'image', span: 2 },
        { name: 'description', label: 'Short description', type: 'textarea', rows: 2, span: 2 },
        { name: 'features', label: 'Features', type: 'list', span: 2 },
        { name: 'active', label: 'Show on website', type: 'toggle', span: 2 }
      ],
      collect: function (el, data) { if (isNew) { data.id = slug(data.name); data.order = v.order; } return data; }
    });
  }

  /* ================================================================
     CHAUFFEURS
     ================================================================ */
  var DRIVER_STATUS = [{ value: 'available', label: 'Available' }, { value: 'off', label: 'Off duty / leave' }];

  App.views.drivers = function (host, args) {
    host.innerHTML = App.pageHead('Team', 'Chauffeurs', 'Your driver-guides, their languages and who is on tour. Assign them to bookings from the booking panel.',
      '<button class="btn btn-primary" data-new>' + icon('plus') + '<span>Add chauffeur</span></button>') + '<div class="people-grid" data-grid></div>';
    host.querySelector('[data-new]').addEventListener('click', function () { editDriver(null); });
    var grid = host.querySelector('[data-grid]');
    grid.addEventListener('click', function (e) {
      var a = e.target.closest('[data-edit]'); if (!a) return;
      editDriver(App.data.drivers.filter(function (d) { return d.id === a.getAttribute('data-edit'); })[0]);
    });
    function update() {
      var today = new Date().toISOString().slice(0, 10);
      if (!App.data.drivers.length) { grid.innerHTML = App.emptyState('wheel', 'No chauffeurs yet', 'Add your driver-guides so you can assign them to tours.'); return; }
      grid.innerHTML = App.data.drivers.map(function (d) {
        var jobs = App.data.bookings.filter(function (b) { return b.assignedDriver === d.id && App.WON_STATUSES.indexOf(b.status) > -1; });
        var now = jobs.filter(function (b) { return b.arrival <= today && b.departure >= today && b.status === 'Confirmed'; })[0];
        var next = jobs.filter(function (b) { return b.arrival > today; }).sort(function (a, b) { return a.arrival.localeCompare(b.arrival); })[0];
        var st = now ? ['On tour', 'var(--st-quoted)'] : d.status === 'off' ? ['Off duty', 'var(--st-cancelled)'] : ['Available', 'var(--st-confirmed)'];
        var phone = String(d.phone || '').replace(/\D/g, '');
        return '<article class="person card"><header><span class="avatar avatar--lg">' + esc(UI.initials(d.name)) + '</span><div><h3>' + esc(d.name) + '</h3><span class="pill" style="--c:' + st[1] + '"><i></i>' + st[0] + '</span></div></header>' +
          '<dl class="facts facts--tight">' +
            '<div><dt>Languages</dt><dd>' + esc(d.languages || '—') + '</dd></div>' +
            '<div><dt>Specialty</dt><dd>' + esc(d.specialty || '—') + '</dd></div>' +
            '<div><dt>Vehicle</dt><dd>' + esc((App.vehicleOf(d.vehicle) || {}).name || '—') + '</dd></div>' +
            '<div><dt>Tours done</dt><dd>' + jobs.filter(function (b) { return b.status === 'Completed'; }).length + (d.rating ? ' · ★ ' + esc(d.rating) : '') + '</dd></div>' +
          '</dl>' +
          '<p class="person-next">' + (now ? icon('car') + 'With <a href="#/bookings/' + esc(now.id) + '">' + esc(now.customerName) + '</a> until ' + UI.fmtDate(now.departure) : next ? icon('calendar') + 'Next: <a href="#/bookings/' + esc(next.id) + '">' + esc(next.customerName) + '</a> · ' + UI.fmtDate(next.arrival) : icon('calendar') + 'No upcoming tours') + '</p>' +
          '<footer>' + (phone ? '<a class="icon-btn" href="tel:+' + phone + '" aria-label="Call">' + icon('phone') + '</a><a class="icon-btn icon-btn--wa" href="https://wa.me/' + phone + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon('whatsapp') + '</a>' : '') +
          (d.sltda ? '<span class="tag">' + icon('check') + 'SLTDA licensed</span>' : '') + '<span class="spacer"></span><button class="btn btn-ghost btn-sm" data-edit="' + esc(d.id) + '">' + icon('edit') + '<span>Edit</span></button></footer></article>';
      }).join('');
    }
    update();
    if (args[0]) setTimeout(function () { var d = App.data.drivers.filter(function (x) { return x.id === args[0]; })[0]; if (d) editDriver(d); }, 80);
    return { update: update };
  };

  function editDriver(d) {
    var isNew = !d;
    d = d || { status: 'available', sltda: true };
    openEditor({
      col: 'drivers', id: isNew ? null : d.id, doc: d, title: isNew ? 'New chauffeur' : d.name, eyebrow: 'Chauffeurs', deleteName: d.name,
      fields: [
        { name: 'name', label: 'Full name', required: true, span: 2 },
        { name: 'phone', label: 'Phone / WhatsApp', placeholder: '+94 7X XXX XXXX' },
        { name: 'languages', label: 'Languages', placeholder: 'English, German' },
        { name: 'specialty', label: 'Specialty', placeholder: 'e.g. Wildlife spotter' },
        { name: 'vehicle', label: 'Usual vehicle', type: 'select', options: [{ value: '', label: '—' }].concat(vehicles().map(function (v) { return { value: v.id, label: v.name }; })) },
        { name: 'status', label: 'Availability', type: 'select', options: DRIVER_STATUS },
        { name: 'rating', label: 'Rating', type: 'number', min: 0, max: 5, step: 0.1 },
        { name: 'licenseNo', label: 'License / SLTDA no.' },
        { name: 'sltda', label: 'SLTDA licensed guide', type: 'toggle' },
        { name: 'notes', label: 'Notes', type: 'textarea', span: 2 }
      ],
      collect: function (el, data) { if (isNew) data.id = 'drv-' + slug(data.name.split(' ')[0]) + '-' + Math.random().toString(36).slice(2, 5); return data; }
    });
  }

  /* ================================================================
     REVIEWS
     ================================================================ */
  App.views.reviews = function (host) {
    var st = { filter: 'all' };
    host.innerHTML = App.pageHead('Website content', 'Reviews & testimonials', 'Published reviews show on the Trust & Reviews page. Feature your best ones.',
      '<button class="btn btn-primary" data-new>' + icon('plus') + '<span>Add review</span></button>') +
      '<section class="kpis kpis--3" data-stats></section>' +
      '<div class="chips" data-chips></div><div class="review-grid" data-grid></div>';
    host.querySelector('[data-new]').addEventListener('click', function () { editReview(null); });
    host.querySelector('[data-chips]').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (b) { st.filter = b.getAttribute('data-f'); update(); } });
    var grid = host.querySelector('[data-grid]');
    grid.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]'); if (!a) return;
      var r = App.data.reviews.filter(function (x) { return x.id === a.getAttribute('data-id'); })[0];
      var act = a.getAttribute('data-act');
      if (act === 'edit') editReview(r);
      if (act === 'pub') toggleActive('reviews', r, 'published');
      if (act === 'feat') App.save('reviews', r.id, { featured: !r.featured }, r.featured ? 'Removed from featured' : 'Featured');
    });
    function update() {
      var all = App.data.reviews;
      var pub = all.filter(function (r) { return r.published !== false; });
      var avg = pub.length ? (pub.reduce(function (a, r) { return a + (Number(r.rating) || 0); }, 0) / pub.length).toFixed(2) : '—';
      host.querySelector('[data-stats]').innerHTML =
        '<div class="kpi"><div class="kpi-top"><span class="kpi-ic">' + icon('star') + '</span><span class="kpi-label">Average rating</span></div><div class="kpi-value">' + avg + '</div><div class="kpi-sub">Published reviews</div></div>' +
        '<div class="kpi"><div class="kpi-top"><span class="kpi-ic">' + icon('eye') + '</span><span class="kpi-label">Published</span></div><div class="kpi-value">' + pub.length + '</div><div class="kpi-sub">of ' + all.length + ' total</div></div>' +
        '<div class="kpi"><div class="kpi-top"><span class="kpi-ic">' + icon('check') + '</span><span class="kpi-label">Featured</span></div><div class="kpi-value">' + all.filter(function (r) { return r.featured; }).length + '</div><div class="kpi-sub">Shown first</div></div>';
      var filters = [['all', 'All'], ['published', 'Published'], ['hidden', 'Hidden'], ['tripadvisor', 'TripAdvisor'], ['google', 'Google'], ['direct', 'Direct']];
      host.querySelector('[data-chips]').innerHTML = filters.map(function (f) { return '<button class="chip' + (st.filter === f[0] ? ' is-on' : '') + '" data-f="' + f[0] + '">' + f[1] + '</button>'; }).join('');
      var rows = all.filter(function (r) {
        if (st.filter === 'published') return r.published !== false;
        if (st.filter === 'hidden') return r.published === false;
        if (st.filter === 'all') return true;
        return r.source === st.filter;
      });
      if (!rows.length) { grid.innerHTML = App.emptyState('star', 'No reviews', 'Add reviews from TripAdvisor, Google or happy guests.'); return; }
      grid.innerHTML = rows.map(function (r) {
        return '<article class="review card' + (r.published === false ? ' is-off' : '') + '"><header><span class="stars" aria-label="' + r.rating + ' stars">' + [1, 2, 3, 4, 5].map(function (n) { return '<i class="' + (n <= r.rating ? 'on' : '') + '">' + icon('star') + '</i>'; }).join('') + '</span><span class="tag">' + esc({ tripadvisor: 'TripAdvisor', google: 'Google', direct: 'Direct' }[r.source] || r.source || '') + '</span>' + (r.featured ? '<span class="tag tag--accent">Featured</span>' : '') + '</header>' +
          '<p class="review-q">“' + esc(r.quote) + '”</p><footer><span class="avatar">' + esc(UI.initials(r.name)) + '</span><div><b>' + esc(r.name) + '</b><small>' + esc(r.location || '') + '</small></div><span class="spacer"></span>' +
          '<button class="icon-btn" data-act="feat" data-id="' + esc(r.id) + '" title="Feature" aria-label="Toggle featured">' + icon('star') + '</button>' +
          '<button class="icon-btn" data-act="pub" data-id="' + esc(r.id) + '" title="' + (r.published === false ? 'Publish' : 'Hide') + '" aria-label="Toggle published">' + icon(r.published === false ? 'eyeOff' : 'eye') + '</button>' +
          '<button class="icon-btn" data-act="edit" data-id="' + esc(r.id) + '" aria-label="Edit">' + icon('edit') + '</button></footer></article>';
      }).join('');
    }
    update();
    return { update: update };
  };

  function editReview(r) {
    var isNew = !r;
    r = r || { rating: 5, source: 'tripadvisor', published: true, order: App.data.reviews.length + 1 };
    openEditor({
      col: 'reviews', id: isNew ? null : r.id, doc: r, title: isNew ? 'New review' : r.name, eyebrow: 'Reviews', deleteName: r.name,
      fields: [
        { name: 'name', label: 'Guest name', required: true, span: 2 },
        { name: 'location', label: 'Location & tour', span: 2, placeholder: 'e.g. Bristol, UK, 10-Day Complete Island Tour' },
        { name: 'rating', label: 'Rating', type: 'stars' },
        { name: 'source', label: 'Source', type: 'select', options: [{ value: 'tripadvisor', label: 'TripAdvisor' }, { value: 'google', label: 'Google' }, { value: 'direct', label: 'Direct / email' }] },
        { name: 'quote', label: 'Review text', type: 'textarea', rows: 5, required: true, span: 2 },
        { name: 'published', label: 'Published on website', type: 'toggle' },
        { name: 'featured', label: 'Featured', type: 'toggle' }
      ],
      collect: function (el, data) { if (isNew) { data.id = 'rev-' + Date.now().toString(36); data.order = r.order; } return data; }
    });
  }

  /* ================================================================
     FAQS
     ================================================================ */
  App.views.faqs = function (host) {
    host.innerHTML = App.pageHead('Website content', 'FAQs', 'Questions and answers shown on the Trust & Reviews page. Use the arrows to change the order.',
      '<button class="btn btn-primary" data-new>' + icon('plus') + '<span>Add FAQ</span></button>') + '<div class="faq-admin" data-list></div>';
    host.querySelector('[data-new]').addEventListener('click', function () { editFaq(null); });
    var list = host.querySelector('[data-list]');
    list.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]'); if (!a) return;
      var sorted = App.data.faqs.slice();
      var f = sorted.filter(function (x) { return x.id === a.getAttribute('data-id'); })[0];
      var act = a.getAttribute('data-act');
      if (act === 'edit') editFaq(f);
      if (act === 'pub') toggleActive('faqs', f, 'published');
      if (act === 'up' || act === 'down') reorder('faqs', sorted, f.id, act === 'up' ? -1 : 1);
    });
    function update() {
      if (!App.data.faqs.length) { list.innerHTML = App.emptyState('help', 'No FAQs yet', 'Add the questions travelers ask most often.'); return; }
      list.innerHTML = App.data.faqs.map(function (f, i) {
        return '<article class="faq-row card' + (f.published === false ? ' is-off' : '') + '"><span class="faq-n">' + String(i + 1).padStart(2, '0') + '</span><div class="faq-text"><h3>' + esc(f.question) + '</h3><p>' + esc(f.answer) + '</p></div>' +
          '<div class="faq-tools"><button class="icon-btn" data-act="up" data-id="' + esc(f.id) + '" aria-label="Move up">' + icon('up') + '</button><button class="icon-btn" data-act="down" data-id="' + esc(f.id) + '" aria-label="Move down">' + icon('down') + '</button>' +
          '<button class="icon-btn" data-act="pub" data-id="' + esc(f.id) + '" aria-label="Toggle published">' + icon(f.published === false ? 'eyeOff' : 'eye') + '</button><button class="icon-btn" data-act="edit" data-id="' + esc(f.id) + '" aria-label="Edit">' + icon('edit') + '</button></div></article>';
      }).join('');
    }
    update();
    return { update: update };
  };

  function editFaq(f) {
    var isNew = !f;
    f = f || { published: true, order: App.data.faqs.length + 1 };
    openEditor({
      col: 'faqs', id: isNew ? null : f.id, doc: f, title: isNew ? 'New FAQ' : 'Edit FAQ', eyebrow: 'FAQs', deleteName: f.question,
      fields: [
        { name: 'question', label: 'Question', required: true, span: 2 },
        { name: 'answer', label: 'Answer', type: 'textarea', rows: 6, required: true, span: 2 },
        { name: 'published', label: 'Show on website', type: 'toggle', span: 2 }
      ],
      collect: function (el, data) { if (isNew) { data.id = 'faq-' + Date.now().toString(36); data.order = f.order; } return data; }
    });
  }

  /* ================================================================
     SETTINGS
     ================================================================ */
  App.views.settings = function (host) {
    var fieldsBiz = [
      { name: 'businessName', label: 'Business name', span: 2 },
      { name: 'phone', label: 'WhatsApp number (digits only)', hint: 'Used for every "Book via WhatsApp" button, e.g. 94760542557' },
      { name: 'displayPhone', label: 'Phone as displayed', placeholder: '+94 76 054 2557' },
      { name: 'email', label: 'Bookings email', type: 'email' },
      { name: 'infoEmail', label: 'General email', type: 'email' },
      { name: 'officeAddress', label: 'Office address', span: 2 },
      { name: 'defaultWhatsAppMessage', label: 'Default WhatsApp message', type: 'textarea', rows: 2, span: 2 },
      { name: 'announcement', label: 'Website announcement bar', type: 'textarea', rows: 2, span: 2, hint: 'Optional. Shown at the top of every page, e.g. "Peak season Dec–Mar: book early". Leave empty to hide.' },
      { name: 'acceptingBookings', label: 'Accept new bookings on the website', type: 'toggle', span: 2 }
    ];
    var curFields = ['EUR', 'GBP', 'AUD', 'RUB', 'CNY', 'LKR'].map(function (c) { return { name: 'currencies.' + c, label: '1 USD in ' + c, type: 'number', step: 0.01, min: 0 }; });

    function render() {
      var s = App.settings();
      host._readyRendered = !!App.S.ready.settings;
      var live = Store.mode === 'firebase';
      host.innerHTML = App.pageHead('System', 'Settings', 'Business details, currency rates and your database.') +
        '<div class="settings-grid">' +
        '<form class="card" data-biz onsubmit="return false"><header class="card-head"><div><h2>Business & contact</h2><p>Shown across the public website</p></div></header><div class="form-grid">' + fieldsBiz.map(function (f) { return UI.field(f, UI.getPath(s, f.name)); }).join('') + '</div><div class="card-foot"><button class="btn btn-primary" data-save-biz>' + icon('check') + '<span>Save details</span></button></div></form>' +
        '<form class="card" data-cur onsubmit="return false"><header class="card-head"><div><h2>Currency rates</h2><p>Website prices are set in USD and converted with these rates</p></div></header><div class="form-grid form-grid--3">' + curFields.map(function (f) { return UI.field(f, UI.getPath(s, f.name)); }).join('') + '</div><div class="card-foot"><button class="btn btn-primary" data-save-cur>' + icon('check') + '<span>Save rates</span></button></div></form>' +
        '<section class="card"><header class="card-head"><div><h2>Database</h2><p>' + (live ? 'Connected to Firebase project <b>' + esc(window.CC_FIREBASE_CONFIG.projectId) + '</b>' : 'Demo mode. Data is stored only in this browser.') + '</p></div><span class="mode ' + (live ? 'mode--live' : 'mode--demo') + '"><i></i>' + (live ? 'Live' : 'Demo') + '</span></header>' +
          (live ? '' : '<div class="banner banner--info">' + icon('info') + '<div><b>Connect Firebase to go live.</b><p>Paste your Firebase web config into <code>js/firebase-config.js</code> and follow <code>FIREBASE_SETUP.md</code>. Then bookings from every visitor arrive here in real time and your edits update the website.</p></div></div>') +
          '<div class="db-actions">' +
            '<button class="btn btn-ghost" data-import>' + icon('download') + '<span>Import missing website content</span></button>' +
            '<button class="btn btn-ghost" data-backup>' + icon('database') + '<span>Download full backup (JSON)</span></button>' +
            (live ? '' : '<button class="btn btn-danger-ghost" data-reset>' + icon('refresh') + '<span>Reset demo data</span></button>') +
          '</div>' +
          '<dl class="facts facts--tight">' + Store.collections.map(function (c) { return '<div><dt>' + c + '</dt><dd>' + (App.data[c] || []).length + ' records</dd></div>'; }).join('') + '</dl>' +
        '</section>' +
        '<section class="card"><header class="card-head"><div><h2>Your account</h2><p>' + esc(App.S.user.email || '') + '</p></div></header>' +
          '<p class="muted small">' + (live ? 'Admins are managed in Firebase: add a user in Authentication, then create a document with their UID in the <code>admins</code> collection.' : 'In demo mode any email and password signs in.') + '</p>' +
          '<div class="db-actions">' + (live ? '<button class="btn btn-ghost" data-reset-pw>' + icon('lock') + '<span>Send password reset email</span></button>' : '') + '<button class="btn btn-ghost" data-signout>' + icon('logout') + '<span>Sign out</span></button></div>' +
        '</section></div>';
      UI.wireForm(host);
      host.querySelector('[data-save-biz]').onclick = function () {
        var f = host.querySelector('[data-biz]'); if (!f.reportValidity()) return;
        var d = UI.readForm(f, fieldsBiz); d.phone = String(d.phone || '').replace(/\D/g, '');
        App.save('settings', 'site', d, 'Business details saved');
      };
      host.querySelector('[data-save-cur]').onclick = function () {
        var d = UI.readForm(host.querySelector('[data-cur]'), curFields);
        App.save('settings', 'site', d, 'Currency rates saved');
      };
      host.querySelector('[data-import]').onclick = function () {
        var b = this; b.disabled = true;
        Store.importSiteContent().then(function () { UI.toast('Website content imported (existing records kept)'); }).catch(function (e) { UI.toast(App.friendlyError(e), 'error'); }).then(function () { b.disabled = false; });
      };
      host.querySelector('[data-backup]').onclick = function () {
        var out = { exportedAt: new Date().toISOString(), mode: Store.mode };
        Store.collections.forEach(function (c) { out[c] = App.data[c]; });
        var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ceylon-chauffeurs-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click();
      };
      var rs = host.querySelector('[data-reset]');
      if (rs) rs.onclick = function () { UI.confirm({ title: 'Reset demo data?', text: 'All demo changes in this browser will be replaced with fresh sample data.', ok: 'Reset', danger: true }).then(function (ok) { if (ok) { Store.resetDemo(); UI.toast('Demo data reset'); } }); };
      var rp = host.querySelector('[data-reset-pw]');
      if (rp) rp.onclick = function () { Store.resetPassword(App.S.user.email).then(function () { UI.toast('Reset email sent'); }).catch(function (e) { UI.toast(App.friendlyError(e), 'error'); }); };
      host.querySelector('[data-signout]').onclick = function () { Store.signOut(); };
    }
    render();
    // Settings are a form: do not re-render while the user is typing; only refresh counts.
    return {
      update: function () {
        if (!host._readyRendered && App.S.ready.settings) { render(); return; }
        var dl = host.querySelector('.facts');
        if (dl) dl.innerHTML = Store.collections.map(function (c) { return '<div><dt>' + c + '</dt><dd>' + (App.data[c] || []).length + ' records</dd></div>'; }).join('');
      }
    };
  };
})();
