/**
 * Ceylon Chauffeurs Admin - UI toolkit
 * Icons, escaping, formatting, toasts, modal/drawer, confirm dialog, form builder, CSV.
 */
(function () {
  'use strict';

  /* ---------------- Icons (inline SVG, stroke style) ---------------- */
  var P = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    map: '<path d="M14.1 4.6 9.9 2.4a2 2 0 0 0-1.8 0L3.6 4.7A1 1 0 0 0 3 5.6v14.8a1 1 0 0 0 1.4.9l3.7-1.9a2 2 0 0 1 1.8 0l4.2 2.2a2 2 0 0 0 1.8 0l4.5-2.3a1 1 0 0 0 .6-.9V3.6a1 1 0 0 0-1.4-.9l-3.7 1.9a2 2 0 0 1-1.8 0z"/><path d="M15 5v16M9 3v16"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6A2 2 0 0 0 13.7 6H6.6a2 2 0 0 0-1.8 1.1L3 11v5c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/>',
    wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 14v7M10 12H3.5M14 12h6.5"/>',
    star: '<path d="M11.5 2.8a.6.6 0 0 1 1 0l2.6 5.3 5.8.8a.6.6 0 0 1 .3 1l-4.2 4.1 1 5.8a.6.6 0 0 1-.8.6L12 17.7l-5.2 2.7a.6.6 0 0 1-.8-.6l1-5.8-4.2-4.1a.6.6 0 0 1 .3-1l5.8-.8z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    settings: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.4 3.6a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    whatsapp: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M9 10.5c.5 2 2.5 4 4.5 4.5l1.2-1.2 2 1-.4 1.6c-3.6.3-7.9-4-7.6-7.6l1.6-.4 1 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    dollar: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    board: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M9.9 4.2A9 9 0 0 1 12 4c7 0 10 8 10 8a13 13 0 0 1-1.7 2.7M6.6 6.6A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M14.1 14.1a3 3 0 1 1-4.2-4.2"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3zM12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    mobile: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>'
  };

  function icon(name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || P.info) + '</svg>';
  }

  /* ---------------- Text helpers ---------------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function money(n, opts) {
    var v = Number(n) || 0;
    return '$' + v.toLocaleString('en-US', { maximumFractionDigits: opts && opts.decimals ? 2 : 0 });
  }

  function compactMoney(n) {
    var v = Number(n) || 0;
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e4) return '$' + (v / 1e3).toFixed(1) + 'k';
    return money(v);
  }

  function fmtDate(iso, withTime) {
    if (!iso) return '—';
    var d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
    if (isNaN(d)) return esc(iso);
    var o = { day: 'numeric', month: 'short', year: 'numeric' };
    if (withTime) { o.hour = '2-digit'; o.minute = '2-digit'; }
    return d.toLocaleString('en-GB', o);
  }

  function timeAgo(iso) {
    if (!iso) return '';
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    if (s < 86400 * 30) return Math.floor(s / 86400) + 'd ago';
    return fmtDate(iso);
  }

  function initials(name) {
    return String(name || '?').replace(/[^A-Za-zÀ-ÿ\s&]/g, '').split(/\s+/).filter(function (w) { return w && w !== '&' && w.toLowerCase() !== 'the'; }).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase() || '?';
  }

  function debounce(fn, ms) {
    var t;
    return function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, ms); };
  }

  /* ---------------- Toasts ---------------- */
  function toast(msg, type) {
    var host = document.getElementById('toast-host');
    if (!host) return;
    var el = document.createElement('div');
    el.className = 'toast toast--' + (type || 'ok');
    el.setAttribute('role', 'status');
    el.innerHTML = icon(type === 'error' ? 'alert' : (type === 'info' ? 'bell' : 'check')) + '<span>' + esc(msg) + '</span>';
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    setTimeout(function () {
      el.classList.remove('is-in');
      setTimeout(function () { el.remove(); }, 400);
    }, type === 'error' ? 6000 : 3200);
  }

  /* ---------------- Modal / drawer ---------------- */
  var openLayers = [];

  function openLayer(opts) {
    // opts: { title, subtitle, body (html), footer (html), kind: 'drawer'|'modal', size, onMount(el), onClose }
    var root = document.createElement('div');
    root.className = 'layer layer--' + (opts.kind || 'modal') + (opts.size ? ' layer--' + opts.size : '');
    root.innerHTML =
      '<div class="layer-scrim" data-close></div>' +
      '<section class="layer-panel" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || 'Dialog') + '">' +
        '<header class="layer-head">' +
          '<div class="layer-titles">' + (opts.eyebrow ? '<span class="eyebrow">' + opts.eyebrow + '</span>' : '') + '<h2>' + esc(opts.title || '') + '</h2>' + (opts.subtitle ? '<p>' + opts.subtitle + '</p>' : '') + '</div>' +
          '<button class="icon-btn" data-close aria-label="Close">' + icon('x') + '</button>' +
        '</header>' +
        '<div class="layer-body">' + (opts.body || '') + '</div>' +
        (opts.footer ? '<footer class="layer-foot">' + opts.footer + '</footer>' : '') +
      '</section>';
    document.body.appendChild(root);
    document.body.classList.add('has-layer');
    var api = {
      el: root,
      close: function () {
        if (root._closing) return;
        root._closing = true;
        root.classList.remove('is-open');
        openLayers = openLayers.filter(function (l) { return l !== api; });
        if (!openLayers.length) document.body.classList.remove('has-layer');
        setTimeout(function () { root.remove(); }, 380);
        if (opts.onClose) opts.onClose();
      }
    };
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) api.close();
    });
    openLayers.push(api);
    requestAnimationFrame(function () { root.classList.add('is-open'); });
    if (opts.onMount) opts.onMount(root, api);
    setTimeout(function () {
      var f = root.querySelector('[autofocus]') || root.querySelector('.layer-panel');
      if (f) f.focus({ preventScroll: true });
    }, 60);
    return api;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openLayers.length) openLayers[openLayers.length - 1].close();
  });

  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var done = false;
      var layer = openLayer({
        kind: 'modal', size: 'sm',
        title: opts.title || 'Are you sure?',
        body: '<p class="confirm-text">' + (opts.text || '') + '</p>',
        footer: '<button class="btn btn-ghost" data-close>Cancel</button><button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" data-ok autofocus>' + esc(opts.ok || 'Confirm') + '</button>',
        onClose: function () { if (!done) resolve(false); }
      });
      layer.el.querySelector('[data-ok]').addEventListener('click', function () { done = true; resolve(true); layer.close(); });
    });
  }

  /* ---------------- Form builder ---------------- */
  // field: { name, label, type: text|number|email|textarea|select|toggle|list|image|stars|date, options, hint, span, required, min, max, step, rows, placeholder }
  function field(f, value) {
    var id = 'f-' + f.name.replace(/\W/g, '_');
    var v = value == null ? (f.default != null ? f.default : '') : value;
    var span = f.span ? ' span-' + f.span : '';
    var req = f.required ? ' required' : '';
    var hint = f.hint ? '<small class="hint">' + f.hint + '</small>' : '';
    var label = '<label for="' + id + '">' + esc(f.label) + (f.required ? ' <i class="req">*</i>' : '') + '</label>';
    var input;
    switch (f.type) {
      case 'textarea':
        input = '<textarea id="' + id + '" name="' + f.name + '" rows="' + (f.rows || 3) + '"' + req + ' placeholder="' + esc(f.placeholder || '') + '">' + esc(v) + '</textarea>';
        break;
      case 'select':
        input = '<div class="select-wrap"><select id="' + id + '" name="' + f.name + '"' + req + '>' + (f.options || []).map(function (o) {
          var ov = typeof o === 'object' ? o.value : o;
          var ol = typeof o === 'object' ? o.label : o;
          return '<option value="' + esc(ov) + '"' + (String(ov) === String(v) ? ' selected' : '') + '>' + esc(ol) + '</option>';
        }).join('') + '</select>' + icon('down') + '</div>';
        break;
      case 'toggle':
        return '<div class="field field--toggle' + span + '"><label class="switch"><input type="checkbox" id="' + id + '" name="' + f.name + '"' + (v ? ' checked' : '') + '><span class="switch-track"><span class="switch-thumb"></span></span><span class="switch-label">' + esc(f.label) + '</span></label>' + hint + '</div>';
      case 'list':
        input = '<textarea id="' + id + '" name="' + f.name + '" data-list rows="' + (f.rows || 4) + '" placeholder="One item per line">' + esc((v || []).join('\n')) + '</textarea>';
        hint = hint || '<small class="hint">One item per line</small>';
        break;
      case 'image':
        var imgs = window.CC_SITE_IMAGES || [];
        input = '<div class="image-field"><div class="image-preview"><img src="' + esc(resolveImg(v)) + '" alt="" onerror="this.style.opacity=0"></div><div class="image-inputs">' +
          '<div class="image-row"><input type="text" id="' + id + '" name="' + f.name + '" value="' + esc(v) + '" placeholder="assets/images/… or https://…"><label class="btn btn-ghost btn-sm upload-btn">' + icon('image') + '<span>Upload</span><input type="file" accept="image/*" data-upload hidden></label></div>' +
          '<div class="chip-row">' + imgs.map(function (src) { return '<button type="button" class="img-chip" data-img="' + src + '"><img src="../' + src + '" alt=""></button>'; }).join('') + '</div></div></div>';
        break;
      case 'stars':
        input = '<div class="stars-input" data-stars>' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-star="' + n + '" class="' + (n <= v ? 'on' : '') + '" aria-label="' + n + ' stars">' + icon('star') + '</button>'; }).join('') + '<input type="hidden" name="' + f.name + '" value="' + esc(v) + '"></div>';
        break;
      default:
        input = '<input type="' + (f.type || 'text') + '" id="' + id + '" name="' + f.name + '" value="' + esc(v) + '"' + req +
          (f.min != null ? ' min="' + f.min + '"' : '') + (f.max != null ? ' max="' + f.max + '"' : '') + (f.step != null ? ' step="' + f.step + '"' : '') +
          (f.prefix ? ' class="has-prefix"' : '') + ' placeholder="' + esc(f.placeholder || '') + '">';
        if (f.prefix) input = '<div class="input-prefix"><span>' + esc(f.prefix) + '</span>' + input + '</div>';
    }
    return '<div class="field' + span + '">' + label + input + hint + '</div>';
  }

  function resolveImg(v) {
    if (!v) return '';
    return /^(https?:|data:|\/)/.test(v) ? v : '../' + v;
  }

  function wireForm(root) {
    root.querySelectorAll('.image-field').forEach(function (wrap) {
      var input = wrap.querySelector('input[type=text]');
      var img = wrap.querySelector('.image-preview img');
      function sync() { img.style.opacity = 1; img.src = resolveImg(input.value); }
      input.addEventListener('input', sync);
      wrap.querySelectorAll('[data-img]').forEach(function (b) {
        b.addEventListener('click', function () { input.value = b.getAttribute('data-img'); sync(); });
      });
      var up = wrap.querySelector('[data-upload]');
      if (up) up.addEventListener('change', function () {
        var file = up.files[0]; if (!file || !window.CCMedia) return;
        var btn = up.closest('.upload-btn'); var lbl = btn.querySelector('span');
        btn.classList.add('is-loading-soft'); lbl.textContent = 'Optimising…';
        img.style.opacity = 1; img.src = URL.createObjectURL(file);
        window.CCMedia.upload(file, { slot: input.name, onStatus: function (t) { lbl.textContent = t; } })
          .then(function (url) { input.value = url; toast('Photo uploaded. Press Save to apply it.'); })
          .catch(function (err) { toast(err.message || 'Upload failed', 'error'); sync(); })
          .then(function () { btn.classList.remove('is-loading-soft'); lbl.textContent = 'Upload'; up.value = ''; });
      });
    });
    root.querySelectorAll('[data-stars]').forEach(function (wrap) {
      var hidden = wrap.querySelector('input');
      wrap.querySelectorAll('[data-star]').forEach(function (b) {
        b.addEventListener('click', function () {
          var n = +b.getAttribute('data-star');
          hidden.value = n;
          wrap.querySelectorAll('[data-star]').forEach(function (x) { x.classList.toggle('on', +x.getAttribute('data-star') <= n); });
        });
      });
    });
  }

  function readForm(root, fields) {
    var out = {};
    fields.forEach(function (f) {
      var el = root.querySelector('[name="' + f.name + '"]');
      if (!el) return;
      var v;
      if (f.type === 'toggle') v = el.checked;
      else if (f.type === 'number' || f.type === 'stars') v = el.value === '' ? null : Number(el.value);
      else if (f.type === 'list') v = el.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      else v = el.value.trim();
      setPath(out, f.name, v);
    });
    return out;
  }

  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  function setPath(obj, path, v) {
    var keys = path.split('.');
    var last = keys.pop();
    var o = keys.reduce(function (acc, k) { acc[k] = acc[k] || {}; return acc[k]; }, obj);
    o[last] = v;
  }

  /* ---------------- CSV ---------------- */
  function downloadCSV(filename, rows, columns) {
    var head = columns.map(function (c) { return '"' + c.label.replace(/"/g, '""') + '"'; }).join(',');
    var body = rows.map(function (r) {
      return columns.map(function (c) {
        var v = typeof c.value === 'function' ? c.value(r) : r[c.value];
        return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
      }).join(',');
    });
    var blob = new Blob(['﻿' + [head].concat(body).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  window.CCUI = {
    icon: icon, esc: esc, money: money, compactMoney: compactMoney, fmtDate: fmtDate, timeAgo: timeAgo,
    initials: initials, debounce: debounce, toast: toast, openLayer: openLayer, confirm: confirmDialog,
    field: field, wireForm: wireForm, readForm: readForm, getPath: getPath, resolveImg: resolveImg, downloadCSV: downloadCSV
  };
})();
