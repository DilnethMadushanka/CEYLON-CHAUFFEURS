/**
 * Home page quick estimate bar.
 * 1. The visitor picks a vehicle class.
 * 2. The "Vehicle" list fills with the vehicles in that class.
 * 3. The "Passengers" list fills automatically from the chosen vehicle's seating capacity.
 * The values go to booking.html as ?vehicle=&model=&pax=&duration=.
 */
var QUICK_FLEET = {
  sedan: {
    label: 'Sedan', rate: 65,
    models: [
      { id: 'premio', name: 'Toyota Premio', maxPax: 3 },
      { id: 'prius', name: 'Toyota Prius', maxPax: 3 },
      { id: 'axio', name: 'Toyota Axio', maxPax: 3 }
    ]
  },
  van: {
    label: 'Luxury Van (KDH)', rate: 105,
    models: [
      { id: 'kdh-flat', name: 'Toyota KDH Flat Roof', maxPax: 6 },
      { id: 'kdh-high', name: 'Toyota KDH High Roof', maxPax: 10 }
    ]
  },
  'vvip-kdh': {
    // Placeholder rate and capacity until the owner confirms them.
    label: 'VVIP KDH', rate: 130,
    models: [
      { id: 'kdh-vvip', name: 'Toyota KDH VVIP', maxPax: 6 }
    ]
  },
  bus: {
    label: 'Luxury Bus / Coach', rate: 160,
    models: [
      { id: 'coaster', name: 'Toyota Coaster', maxPax: 20 },
      { id: 'king-long', name: 'King Long Coach', maxPax: 35 }
    ]
  }
};

(function () {
  function maxPaxOf(cls) {
    return cls.models.reduce(function (m, v) { return Math.max(m, v.maxPax); }, 0);
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Admin "Vehicles & seats" lines look like "Toyota Premio | 3".
  function parseVehicleList(lines) {
    return (lines || []).map(function (line) {
      var m = String(line).match(/^(.*?)[\s|:=,-]+(\d+)\s*(pax|passengers?|seats?)?\s*$/i);
      if (!m || !m[1].trim() || !(Number(m[2]) > 0)) return null;
      return { name: m[1].trim(), maxPax: Number(m[2]) };
    }).filter(Boolean);
  }

  function money(usd) {
    if (window.convertUSD) {
      try { return window.convertUSD(usd).formatted; } catch (e) { /* fall through */ }
    }
    return '$' + usd;
  }

  function init() {
    var classSel = document.getElementById('quick-vehicle');
    var modelSel = document.getElementById('quick-model');
    var paxSel = document.getElementById('quick-pax');
    if (!classSel || !modelSel || !paxSel) return;

    function renderClasses() {
      var current = classSel.value || 'sedan';
      classSel.innerHTML = Object.keys(QUICK_FLEET).map(function (key) {
        var c = QUICK_FLEET[key];
        return '<option value="' + key + '">' + c.label + ' · 1-' + maxPaxOf(c) + ' Pax (' + money(c.rate) + '/day)</option>';
      }).join('');
      classSel.value = QUICK_FLEET[current] ? current : 'sedan';
    }

    function renderModels() {
      var cls = QUICK_FLEET[classSel.value] || QUICK_FLEET.sedan;
      modelSel.innerHTML = cls.models.map(function (m) {
        return '<option value="' + esc(m.name) + '">' + esc(m.name) + ' (up to ' + m.maxPax + ' Pax)</option>';
      }).join('');
      renderPax();
    }

    function renderPax() {
      var cls = QUICK_FLEET[classSel.value] || QUICK_FLEET.sedan;
      var model = cls.models.filter(function (m) { return m.name === modelSel.value; })[0] || cls.models[0];
      // Seating capacity of the chosen vehicle; shown read-only so visitors cannot change it.
      paxSel.value = 'Up to ' + model.maxPax + (model.maxPax === 1 ? ' Passenger' : ' Passengers');
    }

    classSel.addEventListener('change', renderModels);
    modelSel.addEventListener('change', renderPax);
    window.addEventListener('ceylon_currency_changed', renderClasses);

    renderClasses();
    renderModels();

    // Lets site-sync push admin-managed rates, vehicles and seat counts into the bar.
    window.CCQuickBooking = {
      applyRates: function (map) {
        Object.keys(QUICK_FLEET).forEach(function (k) {
          var v = map[k]; if (!v) return;
          if (Number(v.rate) > 0) QUICK_FLEET[k].rate = Number(v.rate);
          var models = parseVehicleList(v.vehicleList);
          if (models.length) QUICK_FLEET[k].models = models;
          if (v.active === false) delete QUICK_FLEET[k];
        });
        if (!Object.keys(QUICK_FLEET).length) return;
        renderClasses();
        renderModels();
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
