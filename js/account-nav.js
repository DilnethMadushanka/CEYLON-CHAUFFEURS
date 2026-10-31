/**
 * Ceylon Chauffeurs - header account button + booking-form prefill
 *
 * Lightweight on purpose: it does not load Firebase. login.html keeps a small copy of the
 * signed-in customer's name, email and photo in localStorage ("cc_customer"), and this script
 * uses it to show the customer's avatar in the header and to fill empty booking-form fields.
 */
(function () {
  'use strict';

  function read() {
    try { return JSON.parse(localStorage.getItem('cc_customer') || 'null'); } catch (e) { return null; }
  }

  function refresh() {
    var c = read();
    document.querySelectorAll('[data-account-link]').forEach(function (link) {
      link.textContent = '';
      link.classList.toggle('is-signed-in', !!c);
      if (!c) {
        link.title = 'Sign in';
        link.setAttribute('aria-label', 'Sign in or create an account');
        var i = document.createElement('i');
        i.className = 'ph ph-user-circle';
        i.setAttribute('aria-hidden', 'true');
        link.appendChild(i);
        return;
      }
      var label = c.name || c.email || 'My account';
      link.title = 'My account (' + label + ')';
      link.setAttribute('aria-label', 'My account, signed in as ' + label);
      var initial = document.createElement('span');
      initial.className = 'nav-account-initial';
      initial.textContent = label.charAt(0).toUpperCase();
      if (c.photo && /^https:\/\//.test(c.photo)) {
        var img = document.createElement('img');
        img.src = c.photo;
        img.alt = '';
        img.referrerPolicy = 'no-referrer';
        img.onerror = function () { link.textContent = ''; link.appendChild(initial); };
        link.appendChild(img);
      } else {
        link.appendChild(initial);
      }
    });
  }

  function prefillBooking() {
    var c = read();
    if (!c) return;
    var name = document.getElementById('full-name');
    var email = document.getElementById('customer-email');
    if (name && !name.value && c.name) name.value = c.name;
    if (email && !email.value && c.email) email.value = c.email;
  }

  window.CCAccountNav = { refresh: refresh };

  function init() {
    refresh();
    // Run after booking.js restores any saved draft, so a draft always wins
    setTimeout(prefillBooking, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Keep every open tab in step when the customer signs in or out
  window.addEventListener('storage', function (e) { if (e.key === 'cc_customer') refresh(); });
})();
