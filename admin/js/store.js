/**
 * Ceylon Chauffeurs Admin - data layer
 *
 * One API for two back ends:
 *   - Firebase mode: Firebase Auth + Cloud Firestore (real-time, shared by every device)
 *   - Demo mode: browser localStorage, used until js/firebase-config.js is filled in
 *
 * Collections: bookings, packages, vehicles, drivers, reviews, faqs, settings, admins
 */
(function () {
  'use strict';

  var VERSION = window.CC_FIREBASE_SDK_VERSION || '10.14.1';
  var DEMO_KEY = 'cc_admin_demo_v1';
  var DEMO_SESSION = 'cc_admin_demo_session';
  var PUBLIC_INQUIRIES_KEY = 'ceylon_chauffeur_inquiries';

  var mode = window.CC_FIREBASE_READY ? 'firebase' : 'demo';
  var db = null;
  var auth = null;
  var listeners = {};
  var demoData = null;

  /* ---------------- Default content (mirrors the public site) ---------------- */

  var seed = window.CC_SEED || { packages: [], reviews: [], faqs: [] };

  var DEFAULT_VEHICLES = [
    {
      id: 'sedan', order: 1, active: true,
      name: 'Executive Sedan', models: 'Toyota Premio / Prius / Axio',
      rate: 65, minPax: 1, maxPax: 3, luggage: '2-3 Bags', image: 'assets/images/sedan.jpg',
      description: 'Premium Japanese comfort with whisper-quiet ride, hybrid efficiency, and climate control.',
      features: ['Dual-zone climate control', 'Free high-speed Wi-Fi', 'Fuel, tolls, parking & driver lodging included', 'Chilled water and phone charging'],
      units: 3
    },
    {
      id: 'van', order: 2, active: true,
      name: 'Luxury Van', models: 'Toyota KDH Flat / High Roof, Nissan E25',
      rate: 105, minPax: 4, maxPax: 10, luggage: '4-8 Large Bags', image: 'assets/images/van.jpg',
      description: 'Spacious reclining seats and rear A/C for families and small groups.',
      features: ['Rear air-conditioning vents', 'Reclining captain seats', 'Large luggage space', 'Child seats on request'],
      units: 2
    },
    {
      id: 'bus', order: 3, active: true,
      name: 'Luxury Coach / Bus', models: 'Toyota Coaster, King Long / Yutong',
      rate: 160, minPax: 18, maxPax: 35, luggage: '12-25 Large Bags', image: 'assets/images/bus.jpg',
      description: 'Tourist-grade coaches for groups, delegations and wedding parties.',
      features: ['Reclining coach seats', 'PA system & microphone', 'Large luggage bay', 'Experienced coach driver & assistant'],
      units: 1
    }
  ];

  var DEFAULT_DRIVERS = [
    { id: 'drv-chaminda', name: 'Chaminda Perera', phone: '+94 77 000 0001', languages: 'English, German', specialty: 'Cultural Triangle', vehicle: 'sedan', status: 'available', sltda: true, rating: 4.9 },
    { id: 'drv-roshan', name: 'Roshan Silva', phone: '+94 77 000 0002', languages: 'English', specialty: 'Hill Country Specialist', vehicle: 'bus', status: 'available', sltda: true, rating: 4.9 },
    { id: 'drv-duminda', name: 'Duminda Fernando', phone: '+94 77 000 0003', languages: 'English, French', specialty: 'Van Expert', vehicle: 'van', status: 'available', sltda: true, rating: 4.8 },
    { id: 'drv-sunimal', name: 'Sunimal Jayawardena', phone: '+94 77 000 0004', languages: 'English', specialty: 'Wildlife Spotter', vehicle: 'van', status: 'available', sltda: true, rating: 5 },
    { id: 'drv-nalin', name: 'Nalin Wickramasinghe', phone: '+94 77 000 0005', languages: 'English', specialty: 'Luxury Fleet', vehicle: 'sedan', status: 'off', sltda: true, rating: 4.9 }
  ];

  var DEFAULT_SETTINGS = {
    id: 'site',
    businessName: 'Ceylon Chauffeurs',
    phone: '94760542557',
    displayPhone: '+94 76 054 2557',
    email: 'bookings@ceylonchauffeur.com',
    infoEmail: 'info@ceylonchauffeur.com',
    officeAddress: 'Colombo & Katunayake Airport Hub, Sri Lanka',
    defaultWhatsAppMessage: 'Hi Ceylon Chauffeur, I would like to inquire about a private chauffeur service for my trip to Sri Lanka.',
    currencies: { EUR: 0.92, GBP: 0.79, AUD: 1.52, RUB: 92.5, CNY: 7.24, LKR: 305 },
    acceptingBookings: true,
    announcement: ''
  };

  function daysFromNow(n) {
    return new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  }

  function demoBookings() {
    var rows = [
      ['Alexander Wright', 'alex.wright@uktravel.co.uk', 'United Kingdom', '+44 7911 123456', 'bus', 'pkg-7d-heritage', 14, 2, 'Confirmed', 'drv-roshan', 12, 7, -1],
      ['Markus & Lena Klein', 'markus.klein@munich-mail.de', 'Germany', '+49 170 9876543', 'sedan', 'pkg-14d-grand', 2, 1, 'Contacted', 'drv-chaminda', 20, 14, -4],
      ['The Larsson Family', 'j.larsson@stockholm-nordic.se', 'Sweden', '+46 70 123 4567', 'van', 'pkg-7d-wildlife', 4, 2, 'New', '', 40, 7, -0.2],
      ['Robert Kessler', 'rkessler@sf-enterprise.com', 'United States', '+1 415 555 0192', 'sedan', 'pkg-10d-complete', 1, 0, 'Completed', 'drv-sunimal', -14, 10, -30],
      ['Amelie Martin', 'amelie.martin@orange.fr', 'France', '+33 6 12 34 56 78', 'van', 'pkg-10d-wildlife', 5, 1, 'Quoted', '', 25, 10, -2],
      ['Ivan Petrov', 'i.petrov@yandex.ru', 'Russia', '+7 912 345 6789', 'sedan', 'pkg-7d-beach', 2, 0, 'Confirmed', 'drv-nalin', 5, 7, -9],
      ['Li Wei', 'li.wei@163.com', 'China', '+86 138 0013 8000', 'van', 'pkg-4d-cultural', 6, 2, 'New', '', 9, 4, -0.05],
      ['Sophie Turner', 'sophie.t@gmail.com', 'Australia', '+61 412 345 678', 'sedan', 'custom', 2, 0, 'Cancelled', '', 30, 5, -12],
      ['Hans Müller', 'hans.mueller@web.de', 'Germany', '+49 151 2345678', 'sedan', 'pkg-4d-wildlife', 2, 0, 'Completed', 'drv-chaminda', -25, 4, -40],
      ['Olivia Brown', 'olivia.brown@outlook.com', 'United Kingdom', '+44 7700 900123', 'van', 'pkg-14d-grand', 4, 3, 'Confirmed', 'drv-duminda', 3, 14, -16]
    ];
    var rates = { sedan: 65, van: 105, bus: 160 };
    return rows.map(function (r, i) {
      var pkg = (seed.packages || []).filter(function (p) { return p.id === r[5]; })[0];
      var vehicle = DEFAULT_VEHICLES.filter(function (v) { return v.id === r[4]; })[0];
      var created = new Date(Date.now() + r[12] * 86400000).toISOString();
      var arrival = daysFromNow(r[10]);
      var departure = daysFromNow(r[10] + r[11]);
      var est = r[11] * rates[r[4]];
      var paid = r[8] === 'Completed' ? est : (r[8] === 'Confirmed' ? Math.round(est * 0.3) : 0);
      return {
        id: 'demo-' + (i + 1),
        bookingRef: 'CC-2026-' + (4100 + i * 517),
        timestamp: created,
        createdAt: created,
        customerName: r[0], customerEmail: r[1], customerCountry: r[2], customerPhone: r[3],
        arrival: arrival, departure: departure,
        travelDates: arrival + ' to ' + departure + ' (' + r[11] + ' Days)',
        daysCount: r[11], adults: r[6], kids: r[7],
        passengers: r[6] + ' Adults, ' + r[7] + ' Children',
        vehicleType: r[4], vehicle: vehicle.name + ' (' + vehicle.models + ')',
        packageId: r[5], package: pkg ? pkg.title : 'Custom Route (Tailored to your preferences)',
        notes: 'Demo inquiry. Replace with real bookings once Firebase is connected.',
        estimatedTotalUSD: est, finalPriceUSD: r[8] === 'New' ? null : est,
        amountPaidUSD: paid,
        paymentStatus: paid >= est ? 'Paid' : (paid > 0 ? 'Deposit' : 'Unpaid'),
        status: r[8], assignedDriver: r[9],
        source: 'website',
        activity: [{ at: created, by: 'website', text: 'Inquiry submitted from the booking form' }]
      };
    });
  }

  // Sample traffic for demo mode (stable per browser, regenerated daily)
  var _demoVisits = null;
  function demoVisits() {
    if (_demoVisits) return _demoVisits;
    var seedN = 7;
    function rnd() { seedN = (seedN * 16807) % 2147483647; return (seedN - 1) / 2147483646; }
    function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
    var pages = ['index.html', 'index.html', 'index.html', 'packages.html', 'packages.html', 'fleet.html', 'booking.html', 'reviews.html'];
    var refs = ['', '', '', 'google.com', 'google.com', 'instagram.com', 'facebook.com', 'tripadvisor.com', 'l.wa.me'];
    var tzs = ['Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Asia/Colombo', 'Asia/Colombo', 'Australia/Sydney', 'America/New_York', 'Europe/Moscow', 'Asia/Shanghai', 'Asia/Kolkata'];
    var out = [];
    var now = Date.now();
    var visitors = [];
    for (var d = 29; d >= 0; d--) {
      var dayStart = now - d * 86400000;
      var n = Math.round(14 + rnd() * 18 + (29 - d) * 0.6);
      for (var i = 0; i < n; i++) {
        var returning = visitors.length > 20 && rnd() < 0.3;
        var vid = returning ? pick(visitors) : 'demo' + out.length;
        if (!returning) visitors.push(vid);
        var t = dayStart - rnd() * 86400000 * (d === 0 ? 0.4 : 1);
        var device = rnd() < 0.62 ? 'mobile' : (rnd() < 0.85 ? 'desktop' : 'tablet');
        var ref = pick(refs), tz = pick(tzs);
        var views = 1 + Math.floor(rnd() * 3);
        for (var v = 0; v < views; v++) {
          out.push({ at: new Date(t + v * 60000).toISOString(), page: v === 0 ? pick(pages) : pick(pages.slice(3)), ref: v === 0 ? ref : '', device: device, tz: tz, lang: 'en', vid: vid, isNew: !returning && v === 0, session: v === 0 });
        }
      }
    }
    for (var l = 0; l < 3; l++) {
      out.push({ at: new Date(now - (l + 1) * 70000).toISOString(), page: ['packages.html', 'index.html', 'booking.html'][l], ref: ['google.com', '', 'instagram.com'][l], device: l === 1 ? 'desktop' : 'mobile', tz: ['Europe/London', 'Europe/Berlin', 'Australia/Sydney'][l], lang: 'en', vid: 'demo-live-' + l, isNew: true, session: true });
    }
    _demoVisits = out;
    return out;
  }

  function defaultContent(includeDemoBookings) {
    var out = {
      packages: (seed.packages || []).map(clone),
      vehicles: DEFAULT_VEHICLES.map(clone),
      drivers: DEFAULT_DRIVERS.map(clone),
      reviews: (seed.reviews || []).map(clone),
      faqs: (seed.faqs || []).map(clone),
      settings: [clone(DEFAULT_SETTINGS)]
    };
    if (includeDemoBookings) out.bookings = demoBookings();
    return out;
  }

  /* ---------------- Helpers ---------------- */

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function uid(prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function emit(col, rows) {
    (listeners[col] || []).forEach(function (cb) {
      try { cb(rows); } catch (e) { console.error(e); }
    });
  }

  function stripId(data) {
    var d = clone(data);
    delete d.id;
    return d;
  }

  /* ---------------- Demo back end ---------------- */

  function demoLoad() {
    if (demoData) return demoData;
    try { demoData = JSON.parse(localStorage.getItem(DEMO_KEY) || 'null'); } catch (e) { demoData = null; }
    if (!demoData) {
      demoData = {};
      var content = defaultContent(true);
      Object.keys(content).forEach(function (col) {
        demoData[col] = {};
        content[col].forEach(function (doc) { demoData[col][doc.id] = doc; });
      });
    }
    importPublicInquiries();
    demoPersist();
    return demoData;
  }

  // Bookings made on the public site in this same browser (pre-Firebase) are pulled in.
  function importPublicInquiries() {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(PUBLIC_INQUIRIES_KEY) || '[]'); } catch (e) { list = []; }
    demoData.bookings = demoData.bookings || {};
    var known = {};
    Object.keys(demoData.bookings).forEach(function (k) { known[demoData.bookings[k].bookingRef] = true; });
    (demoData._deletedRefs || []).forEach(function (ref) { known[ref] = true; });
    list.forEach(function (rec) {
      if (!rec || !rec.bookingRef || known[rec.bookingRef]) return;
      var id = 'web-' + rec.bookingRef;
      var b = normalizeBooking(clone(rec));
      b.id = id;
      demoData.bookings[id] = b;
    });
  }

  function demoPersist() {
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(demoData)); } catch (e) { console.warn(e); }
  }

  function demoRows(col) {
    var d = demoLoad();
    var map = d[col] || {};
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  /* ---------------- Normalisation ---------------- */

  var STATUS_MAP = {
    'confirmed & logged': 'New',
    'pending': 'New',
    'pending review': 'New'
  };

  function normalizeBooking(b) {
    var s = (b.status || 'New');
    b.status = STATUS_MAP[s.toLowerCase()] || s;
    if (!b.createdAt) b.createdAt = b.timestamp || new Date().toISOString();
    if ((!b.arrival || !b.departure) && b.travelDates) {
      var m = String(b.travelDates).match(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/);
      if (m) { b.arrival = b.arrival || m[1]; b.departure = b.departure || m[2]; }
    }
    if (!b.vehicleType && b.vehicle) {
      var v = b.vehicle.toLowerCase();
      b.vehicleType = v.indexOf('bus') > -1 || v.indexOf('coach') > -1 ? 'bus' : (v.indexOf('van') > -1 ? 'van' : 'sedan');
    }
    if (b.adults == null && b.passengers) {
      var pm = String(b.passengers).match(/(\d+)\D+(\d+)?/);
      if (pm) { b.adults = +pm[1]; b.kids = +(pm[2] || 0); }
    }
    if (b.assignedDriver === 'unassigned') b.assignedDriver = '';
    if (!b.paymentStatus) b.paymentStatus = 'Unpaid';
    if (b.amountPaidUSD == null) b.amountPaidUSD = 0;
    if (!Array.isArray(b.activity)) b.activity = [];
    return b;
  }

  /* ---------------- Public API ---------------- */

  var Store = {
    get mode() { return mode; },
    collections: ['bookings', 'packages', 'vehicles', 'drivers', 'reviews', 'faqs', 'settings'],
    defaults: { settings: DEFAULT_SETTINGS, vehicles: DEFAULT_VEHICLES },
    uid: uid,
    normalizeBooking: normalizeBooking,

    init: function () {
      if (mode === 'demo') { demoLoad(); return Promise.resolve(); }
      var base = 'https://www.gstatic.com/firebasejs/' + VERSION + '/';
      return loadScript(base + 'firebase-app-compat.js')
        .then(function () { return Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-firestore-compat.js')]); })
        .then(function () {
          var app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.CC_FIREBASE_CONFIG);
          auth = app.auth();
          db = app.firestore();
        })
        .catch(function (err) {
          console.error(err);
          throw new Error('Firebase could not load. Check your internet connection and js/firebase-config.js.');
        });
    },

    /** cb(user|null, info) where info.authorized says if the user is in /admins */
    onAuth: function (cb) {
      if (mode === 'demo') {
        var email = sessionStorage.getItem(DEMO_SESSION);
        setTimeout(function () { cb(email ? { email: email, uid: 'demo' } : null, { authorized: true }); }, 0);
        Store._demoAuthCb = cb;
        return;
      }
      auth.onAuthStateChanged(function (user) {
        if (!user) { cb(null, {}); return; }
        db.collection('admins').doc(user.uid).get()
          .then(function (snap) { cb(user, { authorized: snap.exists, role: snap.exists ? (snap.data().role || 'admin') : null }); })
          .catch(function () { cb(user, { authorized: false }); });
      });
    },

    signIn: function (email, password) {
      if (mode === 'demo') {
        sessionStorage.setItem(DEMO_SESSION, email || 'demo@ceylonchauffeur.com');
        if (Store._demoAuthCb) Store._demoAuthCb({ email: email || 'demo@ceylonchauffeur.com', uid: 'demo' }, { authorized: true });
        return Promise.resolve();
      }
      return auth.signInWithEmailAndPassword(email, password);
    },

    resetPassword: function (email) {
      if (mode === 'demo') return Promise.resolve();
      return auth.sendPasswordResetEmail(email);
    },

    signOut: function () {
      if (mode === 'demo') {
        sessionStorage.removeItem(DEMO_SESSION);
        if (Store._demoAuthCb) Store._demoAuthCb(null, {});
        return Promise.resolve();
      }
      return auth.signOut();
    },

    /** Live subscription. Returns an unsubscribe function. */
    subscribe: function (col, cb, onError) {
      listeners[col] = listeners[col] || [];
      listeners[col].push(cb);
      if (mode === 'demo') {
        var rows = demoRows(col);
        if (col === 'bookings') rows = rows.map(normalizeBooking);
        setTimeout(function () { cb(rows); }, 0);
        return function () { listeners[col] = listeners[col].filter(function (f) { return f !== cb; }); };
      }
      var unsub = db.collection(col).onSnapshot(function (snap) {
        var rows = snap.docs.map(function (d) { var o = d.data(); o.id = d.id; return col === 'bookings' ? normalizeBooking(o) : o; });
        cb(rows);
      }, function (err) {
        console.error(col, err);
        if (onError) onError(err);
      });
      return function () {
        unsub();
        listeners[col] = listeners[col].filter(function (f) { return f !== cb; });
      };
    },

    /** Website visits from the last `days` days (live). */
    subscribeVisits: function (days, cb, onError) {
      var since = new Date(Date.now() - days * 86400000).toISOString();
      if (mode === 'demo') {
        function read() {
          var real = [];
          try { real = JSON.parse(localStorage.getItem('cc_demo_visits') || '[]'); } catch (e) { real = []; }
          return demoVisits().concat(real).filter(function (v) { return v.at >= since; });
        }
        setTimeout(function () { cb(read()); }, 0);
        var onStorage = function (e) { if (e.key === 'cc_demo_visits') cb(read()); };
        window.addEventListener('storage', onStorage);
        return function () { window.removeEventListener('storage', onStorage); };
      }
      return db.collection('visits').where('at', '>=', since).onSnapshot(function (snap) {
        cb(snap.docs.map(function (d) { return d.data(); }));
      }, function (err) { console.error('visits', err); if (onError) onError(err); });
    },

    /** Create or merge a document. Returns the id. */
    save: function (col, id, data) {
      id = id || uid(col.slice(0, 3));
      var payload = stripId(data);
      payload.updatedAt = new Date().toISOString();
      if (mode === 'demo') {
        var d = demoLoad();
        d[col] = d[col] || {};
        var prev = d[col][id] || {};
        var next = Object.assign({}, prev, payload, { id: id });
        d[col][id] = next;
        demoPersist();
        var rows = demoRows(col);
        emit(col, col === 'bookings' ? rows.map(normalizeBooking) : rows);
        return Promise.resolve(id);
      }
      return db.collection(col).doc(id).set(payload, { merge: true }).then(function () { return id; });
    },

    remove: function (col, id) {
      if (mode === 'demo') {
        var d = demoLoad();
        if (col === 'bookings' && d.bookings && d.bookings[id]) {
          d._deletedRefs = d._deletedRefs || [];
          d._deletedRefs.push(d.bookings[id].bookingRef);
        }
        if (d[col]) delete d[col][id];
        demoPersist();
        emit(col, demoRows(col));
        return Promise.resolve();
      }
      return db.collection(col).doc(id).delete();
    },

    /** Write the website's built-in content to the database. Existing docs are left alone unless overwrite. */
    importSiteContent: function (opts) {
      opts = opts || {};
      var content = defaultContent(false);
      if (mode === 'demo') {
        var d = demoLoad();
        Object.keys(content).forEach(function (col) {
          d[col] = d[col] || {};
          content[col].forEach(function (doc) { if (opts.overwrite || !d[col][doc.id]) d[col][doc.id] = doc; });
          emit(col, demoRows(col));
        });
        demoPersist();
        return Promise.resolve();
      }
      var writes = [];
      Object.keys(content).forEach(function (col) {
        content[col].forEach(function (doc) { writes.push([col, doc]); });
      });
      // Firestore batches allow 500 writes; our content is far smaller, but chunk anyway.
      var chunks = [];
      for (var i = 0; i < writes.length; i += 400) chunks.push(writes.slice(i, i + 400));
      return chunks.reduce(function (p, chunk) {
        return p.then(function () {
          var batch = db.batch();
          var reads = chunk.map(function (w) { return db.collection(w[0]).doc(w[1].id).get(); });
          return Promise.all(reads).then(function (snaps) {
            snaps.forEach(function (snap, idx) {
              if (opts.overwrite || !snap.exists) {
                var w = chunk[idx];
                var payload = stripId(w[1]);
                payload.updatedAt = new Date().toISOString();
                batch.set(db.collection(w[0]).doc(w[1].id), payload);
              }
            });
            return batch.commit();
          });
        });
      }, Promise.resolve());
    },

    /** Demo only: wipe local data and start fresh. */
    resetDemo: function () {
      localStorage.removeItem(DEMO_KEY);
      demoData = null;
      demoLoad();
      Store.collections.forEach(function (col) { emit(col, demoRows(col).map(col === 'bookings' ? normalizeBooking : function (x) { return x; })); });
    },

    /** Pull new bookings made on the public site in this browser (demo mode). */
    refreshPublicInquiries: function () {
      if (mode !== 'demo') return;
      demoLoad();
      importPublicInquiries();
      demoPersist();
      emit('bookings', demoRows('bookings').map(normalizeBooking));
    }
  };

  window.CCStore = Store;
})();
