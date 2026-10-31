/**
 * Ceylon Chauffeurs Admin - website visitor analytics
 * Data: one anonymous record per page view, written by js/site-sync.js.
 */
(function () {
  'use strict';
  var App = window.CCApp, UI = window.CCUI, Charts = window.CCCharts;
  var icon = UI.icon, esc = UI.esc;

  var TZ_COUNTRY = {
    'Asia/Colombo': 'Sri Lanka', 'Europe/London': 'United Kingdom', 'Europe/Dublin': 'Ireland', 'Europe/Berlin': 'Germany', 'Europe/Paris': 'France',
    'Europe/Amsterdam': 'Netherlands', 'Europe/Brussels': 'Belgium', 'Europe/Zurich': 'Switzerland', 'Europe/Vienna': 'Austria', 'Europe/Rome': 'Italy',
    'Europe/Madrid': 'Spain', 'Europe/Lisbon': 'Portugal', 'Europe/Stockholm': 'Sweden', 'Europe/Oslo': 'Norway', 'Europe/Copenhagen': 'Denmark',
    'Europe/Helsinki': 'Finland', 'Europe/Warsaw': 'Poland', 'Europe/Prague': 'Czechia', 'Europe/Moscow': 'Russia', 'Europe/Kiev': 'Ukraine', 'Europe/Kyiv': 'Ukraine',
    'Asia/Shanghai': 'China', 'Asia/Hong_Kong': 'Hong Kong', 'Asia/Tokyo': 'Japan', 'Asia/Seoul': 'South Korea', 'Asia/Singapore': 'Singapore',
    'Asia/Kolkata': 'India', 'Asia/Calcutta': 'India', 'Asia/Dubai': 'UAE', 'Asia/Riyadh': 'Saudi Arabia', 'Asia/Qatar': 'Qatar', 'Asia/Maldives': 'Maldives',
    'Indian/Maldives': 'Maldives', 'Asia/Bangkok': 'Thailand', 'Asia/Kuala_Lumpur': 'Malaysia', 'Asia/Jakarta': 'Indonesia', 'Asia/Tel_Aviv': 'Israel', 'Asia/Jerusalem': 'Israel',
    'Australia/Sydney': 'Australia', 'Australia/Melbourne': 'Australia', 'Australia/Brisbane': 'Australia', 'Australia/Perth': 'Australia', 'Australia/Adelaide': 'Australia',
    'Pacific/Auckland': 'New Zealand', 'America/New_York': 'United States', 'America/Chicago': 'United States', 'America/Denver': 'United States',
    'America/Los_Angeles': 'United States', 'America/Phoenix': 'United States', 'America/Toronto': 'Canada', 'America/Vancouver': 'Canada', 'America/Sao_Paulo': 'Brazil'
  };

  function country(tz) {
    if (!tz) return 'Unknown';
    if (TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
    var region = tz.split('/')[0];
    return region === 'America' ? 'Americas' : region === 'Europe' ? 'Europe (other)' : region === 'Asia' ? 'Asia (other)' : region === 'Australia' ? 'Australia' : region;
  }
  App.visitCountry = country;

  var PAGE_NAMES = { 'index.html': 'Home', 'packages.html': 'Tour packages', 'fleet.html': 'Our fleet', 'booking.html': 'Booking form', 'reviews.html': 'Reviews', '404.html': 'Not found' };
  function pageName(p) { var k = String(p || '').replace(/^\//, ''); if (k && k.indexOf('.') === -1) k += '.html'; return PAGE_NAMES[k] || k || 'Home'; }
  function sourceName(r) {
    if (!r) return 'Direct / typed';
    if (/google\./.test(r)) return 'Google';
    if (/facebook|fb\.|l\.facebook/.test(r)) return 'Facebook';
    if (/instagram/.test(r)) return 'Instagram';
    if (/tripadvisor/.test(r)) return 'TripAdvisor';
    if (/wa\.me|whatsapp/.test(r)) return 'WhatsApp';
    if (/bing\./.test(r)) return 'Bing';
    if (/t\.co|twitter|x\.com/.test(r)) return 'X / Twitter';
    if (/tiktok/.test(r)) return 'TikTok';
    if (/youtube/.test(r)) return 'YouTube';
    return r;
  }

  function uniq(list) { var m = {}; list.forEach(function (v) { m[v.vid] = 1; }); return Object.keys(m).length; }
  function top(list, keyFn, n, valueFn) {
    var m = {};
    list.forEach(function (v) { var k = keyFn(v); m[k] = m[k] || {}; m[k][valueFn ? valueFn(v) : Math.random()] = 1; });
    return Object.keys(m).map(function (k) { return { label: k, value: Object.keys(m[k]).length }; }).sort(function (a, b) { return b.value - a.value; }).slice(0, n || 6);
  }

  /** Small summary used by the Overview page */
  App.visitSummary = function () {
    var v = App.S.data.visits || [];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var t = today.toISOString();
    var five = new Date(Date.now() - 5 * 60000).toISOString();
    var todays = v.filter(function (x) { return x.at >= t; });
    return { today: uniq(todays), views: todays.length, live: uniq(v.filter(function (x) { return x.at >= five; })) };
  };

  App.views.visitors = function (host) {
    var range = 30;
    host.innerHTML = App.pageHead('Website', 'Visitors', 'Who is visiting ceylonchauffeur.com: how many people, which pages they read, where they come from and what device they use. Anonymous, no personal data.',
      '<div class="seg" data-range><button data-r="1">Today</button><button data-r="7">7 days</button><button data-r="30">30 days</button></div>') +
      '<div class="stack" data-body></div>';
    host.querySelector('[data-range]').addEventListener('click', function (e) { var b = e.target.closest('[data-r]'); if (b) { range = +b.getAttribute('data-r'); update(); } });
    var body = host.querySelector('[data-body]');
    var tick = setInterval(function () { update(); }, 30000);

    function update() {
      host.querySelectorAll('[data-r]').forEach(function (b) { b.classList.toggle('is-on', +b.getAttribute('data-r') === range); });
      if (!App.S.ready.visits) { body.innerHTML = '<div class="card skeleton" style="height:240px"></div>'; return; }
      var all = App.S.data.visits || [];
      var startDay = new Date(); startDay.setHours(0, 0, 0, 0); startDay.setDate(startDay.getDate() - (range - 1));
      var since = startDay.toISOString();
      var prevSince = new Date(startDay.getTime() - range * 86400000).toISOString();
      var list = all.filter(function (v) { return v.at >= since; });
      var prev = all.filter(function (v) { return v.at >= prevSince && v.at < since; });
      var five = new Date(Date.now() - 5 * 60000).toISOString();
      var live = all.filter(function (v) { return v.at >= five; });
      var visitors = uniq(list), prevVisitors = uniq(prev);
      var delta = prevVisitors >= 5 ? Math.round(((visitors - prevVisitors) / prevVisitors) * 100) : null;
      var sessions = list.filter(function (v) { return v.session; }).length || visitors;
      var newV = uniq(list.filter(function (v) { return v.isNew; }));
      var retV = uniq(list.filter(function (v) { return v.session && !v.isNew; }));
      var bookings = App.data.bookings.filter(function (b) { return (!b.source || /^website$/i.test(b.source)) && String(b.createdAt) >= since; }).length;
      var conv = visitors ? ((bookings / visitors) * 100).toFixed(1) : '0.0';

      if (!all.length) {
        body.innerHTML = App.emptyState('eye', 'No visits recorded yet', 'Visits are counted from the moment this update is live on the website. Open the website in another tab and come back here.');
        return;
      }

      // Series: by hour for "Today", by day otherwise
      var series = [];
      if (range === 1) {
        for (var h = 0; h < 24; h++) {
          var hv = list.filter(function (v) { return new Date(v.at).getHours() === h; });
          series.push({ label: String(h).padStart(2, '0') + ':00', value: uniq(hv), tip: String(h).padStart(2, '0') + ':00 · ' + uniq(hv) + ' visitors · ' + hv.length + ' views' });
        }
      } else {
        for (var i = range - 1; i >= 0; i--) {
          var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
          var k = d.toISOString(), k2 = new Date(d.getTime() + 86400000).toISOString();
          var dv = list.filter(function (v) { return v.at >= k && v.at < k2; });
          var lbl = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          series.push({ label: lbl, value: uniq(dv), tip: lbl + ' · ' + uniq(dv) + ' visitors · ' + dv.length + ' page views' });
        }
      }

      var devices = top(list, function (v) { return v.device || 'unknown'; }, 3, function (v) { return v.vid; });
      var devColors = { mobile: 'var(--accent)', desktop: 'var(--st-contacted)', tablet: 'var(--st-quoted)', unknown: 'var(--st-completed)' };
      var w = host.clientWidth || 900;

      body.innerHTML =
        '<section class="kpis">' +
          kpi('users', range === 1 ? 'Visitors today' : 'Visitors', visitors, delta == null ? 'Unique people' : '<span class="delta ' + (delta >= 0 ? 'up' : 'down') + '">' + (delta >= 0 ? '▲' : '▼') + ' ' + Math.abs(delta) + '%</span> vs previous ' + (range === 1 ? 'day' : range + ' days')) +
          kpi('eye', 'Page views', list.length, (visitors ? (list.length / visitors).toFixed(1) : 0) + ' pages per visitor') +
          kpi('bell', 'Online now', uniq(live), live.length ? 'Last 5 minutes · ' + esc(pageName(live[live.length - 1].page)) : 'Nobody in the last 5 minutes', null, true) +
          kpi('trend', 'Visit → inquiry', conv + '%', bookings + ' inquiries from ' + visitors + ' visitors') +
        '</section>' +
        '<section class="grid-2-1">' +
          '<article class="card card--chart"><header class="card-head"><div><h2>' + (range === 1 ? 'Visitors by hour' : 'Visitors per day') + '</h2><p>' + sessions + ' visits · ' + newV + ' new visitors</p></div></header>' + Charts.area(series, { label: 'Visitors', width: Math.round(Math.max(300, Math.min(960, window.innerWidth > 1200 ? w * 0.64 : w - 40))) }) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Devices</h2><p>Unique visitors</p></div></header>' +
            Charts.donut(devices.map(function (d) { return { label: d.label.charAt(0).toUpperCase() + d.label.slice(1), value: d.value, color: devColors[d.label] || 'var(--muted)' }; }), 'visitors', String(visitors)) +
            '<div class="split"><div><b>' + newV + '</b><small>New</small></div><div><b>' + retV + '</b><small>Returning</small></div></div></article>' +
        '</section>' +
        '<section class="grid-3">' +
          '<article class="card"><header class="card-head"><div><h2>Top pages</h2><p>Page views</p></div></header>' + Charts.bars(top(list, function (v) { return pageName(v.page); }, 6, function (v) { return v.at + v.vid; })) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Where they come from</h2><p>Visitors by source</p></div></header>' + Charts.bars(top(list.filter(function (v) { return v.session || v.ref; }), function (v) { return sourceName(v.ref); }, 6, function (v) { return v.vid; })) + '</article>' +
          '<article class="card"><header class="card-head"><div><h2>Countries</h2><p>From the visitor\'s time zone</p></div></header>' + Charts.bars(top(list, function (v) { return country(v.tz); }, 6, function (v) { return v.vid; })) + '</article>' +
        '</section>' +
        '<article class="card"><header class="card-head"><div><h2>Live feed</h2><p>Latest page views</p></div><span class="mode mode--live"><i></i>Live</span></header>' +
          '<ul class="mini-list feed">' + all.slice().sort(function (a, b) { return b.at.localeCompare(a.at); }).slice(0, 12).map(function (v) {
            return '<li><div class="feed-row"><span class="avatar">' + icon(v.device === 'desktop' ? 'monitor' : 'mobile') + '</span>' +
              '<span class="ml-main"><b>' + esc(pageName(v.page)) + '</b><small>' + esc(country(v.tz)) + ' · ' + esc(sourceName(v.ref)) + (v.isNew ? ' · new visitor' : '') + '</small></span>' +
              '<span class="ml-end">' + UI.timeAgo(v.at) + '</span></div></li>';
          }).join('') + '</ul></article>';
    }

    function kpi(ic, label, value, sub, extra, pulse) {
      return '<div class="kpi"><div class="kpi-top"><span class="kpi-ic' + (pulse ? ' kpi-ic--live' : '') + '">' + icon(ic) + '</span><span class="kpi-label">' + esc(label) + '</span></div><div class="kpi-value">' + esc(value) + '</div><div class="kpi-sub">' + sub + '</div></div>';
    }

    var onResize = UI.debounce(update, 250);
    window.addEventListener('resize', onResize);
    update();
    return { update: update, destroy: function () { clearInterval(tick); window.removeEventListener('resize', onResize); } };
  };
})();
