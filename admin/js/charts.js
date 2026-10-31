/**
 * Ceylon Chauffeurs Admin - lightweight SVG charts (no library)
 * Colours come from CSS tokens so charts follow light/dark theme.
 */
(function () {
  'use strict';
  var esc = function (s) { return window.CCUI.esc(s); };

  /** Area + line chart. points: [{label, value}] */
  function area(points, opts) {
    opts = opts || {};
    var w = opts.width || 640, h = w < 520 ? 190 : 230, padL = 36, padR = 12, padT = 16, padB = 28;
    var max = Math.max.apply(null, points.map(function (p) { return p.value; }).concat([1]));
    var niceMax = niceCeil(max);
    var iw = w - padL - padR, ih = h - padT - padB;
    var step = points.length > 1 ? iw / (points.length - 1) : iw;
    var xy = points.map(function (p, i) { return [padL + i * step, padT + ih - (p.value / niceMax) * ih]; });
    var line = smooth(xy);
    var areaPath = line + ' L' + xy[xy.length - 1][0] + ',' + (padT + ih) + ' L' + xy[0][0] + ',' + (padT + ih) + ' Z';
    var grid = '';
    for (var g = 0; g <= 4; g++) {
      var gy = padT + (ih / 4) * g;
      var val = niceMax - (niceMax / 4) * g;
      grid += '<line x1="' + padL + '" x2="' + (w - padR) + '" y1="' + gy + '" y2="' + gy + '" class="ch-grid"/>' +
        '<text x="' + (padL - 8) + '" y="' + (gy + 4) + '" class="ch-axis" text-anchor="end">' + fmtAxis(val, opts.money) + '</text>';
    }
    var labels = '';
    var every = Math.ceil(points.length / (w < 520 ? 4 : 6));
    points.forEach(function (p, i) {
      if (i % every === 0 || (i === points.length - 1 && (points.length - 1) % every >= every / 2)) {
        labels += '<text x="' + xy[i][0] + '" y="' + (h - 8) + '" class="ch-axis" text-anchor="middle">' + esc(p.label) + '</text>';
      }
    });
    var hits = points.map(function (p, i) {
      return '<g class="ch-hit"><rect x="' + (xy[i][0] - step / 2) + '" y="' + padT + '" width="' + Math.max(step, 6) + '" height="' + ih + '" fill="transparent"/>' +
        '<line x1="' + xy[i][0] + '" x2="' + xy[i][0] + '" y1="' + padT + '" y2="' + (padT + ih) + '" class="ch-cross"/>' +
        '<circle cx="' + xy[i][0] + '" cy="' + xy[i][1] + '" r="4.5" class="ch-dot"/>' +
        '<title>' + esc(p.tip || (p.label + ': ' + p.value)) + '</title></g>';
    }).join('');
    var gid = 'g' + Math.random().toString(36).slice(2, 7);
    return '<svg class="chart chart-area" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.label || 'Chart') + '">' +
      '<defs><linearGradient id="' + gid + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".32"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>' +
      grid + '<path d="' + areaPath + '" fill="url(#' + gid + ')"/>' +
      '<path d="' + line + '" class="ch-line" pathLength="1"/>' + labels + hits + '</svg>';
  }

  /** Donut. segments: [{label, value, color}] */
  function donut(segments, centerLabel, centerValue) {
    var total = segments.reduce(function (a, s) { return a + s.value; }, 0) || 1;
    var r = 70, c = 2 * Math.PI * r, off = 0;
    var arcs = segments.filter(function (s) { return s.value > 0; }).map(function (s) {
      var len = (s.value / total) * c;
      var gap = segments.length > 1 ? Math.min(4, len / 3) : 0;
      var el = '<circle r="' + r + '" cx="90" cy="90" fill="none" stroke="' + s.color + '" stroke-width="22" stroke-dasharray="' + Math.max(len - gap, 0.01) + ' ' + (c - len + gap) + '" stroke-dashoffset="' + (-off) + '" class="ch-arc"><title>' + esc(s.label + ': ' + s.value) + '</title></circle>';
      off += len;
      return el;
    }).join('');
    var legend = segments.map(function (s) {
      return '<li><span class="sw" style="background:' + s.color + '"></span><span class="lg-l">' + esc(s.label) + '</span><b>' + s.value + '</b></li>';
    }).join('');
    return '<div class="donut-wrap"><svg class="chart chart-donut" viewBox="0 0 180 180" role="img" aria-label="' + esc(centerLabel) + '">' +
      '<circle r="' + r + '" cx="90" cy="90" fill="none" stroke="var(--surface-3)" stroke-width="22"/>' +
      '<g transform="rotate(-90 90 90)">' + arcs + '</g>' +
      '<text x="90" y="86" text-anchor="middle" class="donut-val">' + esc(centerValue) + '</text>' +
      '<text x="90" y="108" text-anchor="middle" class="donut-lbl">' + esc(centerLabel) + '</text></svg>' +
      '<ul class="legend">' + legend + '</ul></div>';
  }

  /** Horizontal bars. rows: [{label, value, sub}] */
  function bars(rows, opts) {
    opts = opts || {};
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1]));
    if (!rows.length) return '<p class="empty-mini">No data yet</p>';
    return '<ul class="hbars">' + rows.map(function (r) {
      return '<li><div class="hb-top"><span>' + esc(r.label) + '</span><b>' + esc(opts.format ? opts.format(r.value) : r.value) + '</b></div>' +
        '<div class="hb-track"><span style="--w:' + Math.max(2, (r.value / max) * 100).toFixed(1) + '%"></span></div>' +
        (r.sub ? '<small>' + esc(r.sub) + '</small>' : '') + '</li>';
    }).join('') + '</ul>';
  }

  /** Tiny sparkline for KPI tiles */
  function spark(values) {
    var w = 120, h = 36;
    var max = Math.max.apply(null, values.concat([1]));
    var step = values.length > 1 ? w / (values.length - 1) : w;
    var pts = values.map(function (v, i) { return [i * step, h - 3 - (v / max) * (h - 6)]; });
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + smooth(pts) + '"/></svg>';
  }

  function smooth(pts) {
    if (!pts.length) return '';
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i];
      var cx = (p0[0] + p1[0]) / 2;
      d += ' C' + cx + ',' + p0[1] + ' ' + cx + ',' + p1[1] + ' ' + p1[0] + ',' + p1[1];
    }
    return d;
  }

  function niceCeil(v) {
    if (v <= 4) return 4;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / p;
    var nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return nice * p;
  }

  function fmtAxis(v, isMoney) {
    var s = v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : String(Math.round(v * 10) / 10);
    return (isMoney ? '$' : '') + s;
  }

  window.CCCharts = { area: area, donut: donut, bars: bars, spark: spark };
})();
