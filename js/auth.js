/**
 * Ceylon Chauffeurs - customer sign-in page (login.html)
 *
 * Google sign-in plus email / password accounts, using Firebase Authentication.
 * Customer accounts are separate from the admin dashboard: /admin only lets in users
 * whose UID is listed in the Firestore "admins" collection, and customers cannot write there.
 *
 * Each signed-in customer gets a small profile document at customers/{uid}
 * (name, email, photo, sign-in method) so the team can see who has an account.
 *
 * Firebase console setup (one time):
 *   Authentication → Sign-in method → enable "Google" and "Email/Password"
 *   Authentication → Settings → Authorized domains → add your website domain
 */
(function () {
  'use strict';

  var view = document.getElementById('auth-view');
  if (!view) return;

  var accountView = document.getElementById('auth-account');
  var alertBox = document.getElementById('auth-alert');
  var googleBtn = document.getElementById('google-btn');
  var auth = null;
  var db = null;
  var busy = false;
  var registering = false; // hold the auth listener until the new account has its name

  /* ---------------- Small helpers ---------------- */

  function $(id) { return document.getElementById(id); }

  function showAlert(type, text) {
    alertBox.className = 'auth-alert auth-alert--' + type;
    alertBox.textContent = text;
    alertBox.hidden = false;
  }
  function clearAlert() { alertBox.hidden = true; alertBox.textContent = ''; }

  function setBusy(el, on) {
    busy = on;
    view.classList.toggle('is-busy', on);
    if (el) el.classList.toggle('is-loading', on);
    view.querySelectorAll('button, input').forEach(function (b) { b.disabled = on; });
  }

  // Only allow redirects back to a page on this site, e.g. ?next=booking.html
  function nextPage() {
    try {
      var n = new URLSearchParams(location.search).get('next') || '';
      return /^[a-z0-9-]+\.html(#[a-z0-9-]*)?$/i.test(n) ? n : '';
    } catch (e) { return ''; }
  }

  function validEmail(v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }

  function friendlyError(err) {
    var code = (err && err.code) || '';
    var map = {
      'auth/invalid-email': 'That email address does not look right.',
      'auth/missing-email': 'Please enter your email address.',
      'auth/user-not-found': 'We could not find an account with that email. Try creating one.',
      'auth/wrong-password': 'Email or password is incorrect.',
      'auth/invalid-credential': 'Email or password is incorrect.',
      'auth/invalid-login-credentials': 'Email or password is incorrect.',
      'auth/email-already-in-use': 'An account already exists with this email. Sign in instead.',
      'auth/weak-password': 'Please choose a stronger password (at least 8 characters).',
      'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
      'auth/network-request-failed': 'No connection. Check your internet and try again.',
      'auth/popup-closed-by-user': 'The Google window was closed before signing in.',
      'auth/cancelled-popup-request': 'The Google window was closed before signing in.',
      'auth/account-exists-with-different-credential': 'This email already has an account. Sign in with your email and password.',
      'auth/operation-not-allowed': 'This sign-in method is not switched on yet. Please contact us on WhatsApp.',
      'auth/unauthorized-domain': 'Sign-in is not enabled for this website address yet. Please contact us on WhatsApp.',
      'auth/user-disabled': 'This account has been disabled. Please contact us.'
    };
    return map[code] || 'Something went wrong. Please try again.';
  }

  /* ---------------- Mode switching (sign in / register / reset) ---------------- */

  function setMode(mode) {
    view.setAttribute('data-mode', mode);
    view.querySelectorAll('[data-mode-btn].auth-tab').forEach(function (t) {
      t.setAttribute('aria-selected', String(t.getAttribute('data-mode-btn') === mode));
    });
    clearAlert();
    var first = view.querySelector('#form-' + mode + ' input');
    if (first && window.matchMedia('(pointer: fine)').matches) setTimeout(function () { first.focus(); }, 60);
    // Carry a typed email across modes
    var typed = ['signin-email', 'register-email', 'reset-email'].map(function (id) { return $(id).value.trim(); }).filter(Boolean)[0];
    if (typed) ['signin-email', 'register-email', 'reset-email'].forEach(function (id) { if (!$(id).value) $(id).value = typed; });
  }

  view.querySelectorAll('[data-mode-btn]').forEach(function (b) {
    b.addEventListener('click', function () { if (!busy) setMode(b.getAttribute('data-mode-btn')); });
  });

  if (/register|signup/i.test(location.hash + location.search)) setMode('register');

  // Show / hide password
  document.querySelectorAll('[data-reveal-for]').forEach(function (b) {
    b.addEventListener('click', function () {
      var input = $(b.getAttribute('data-reveal-for'));
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      b.textContent = show ? 'Hide' : 'Show';
      b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  // Password strength meter
  var strength = view.querySelector('.auth-strength');
  $('register-password').addEventListener('input', function (e) {
    var v = e.target.value, s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) s++;
    if (!v) s = 0;
    strength.setAttribute('data-score', String(s));
    $('strength-hint').textContent = !v ? 'Use 8 or more characters with a mix of letters and numbers.'
      : ['Too short', 'Weak', 'Okay', 'Good', 'Strong'][s] + (v.length < 8 ? ': use at least 8 characters.' : '.');
  });

  /* ---------------- Firebase ---------------- */

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = resolve; s.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
  }

  var base = 'https://www.gstatic.com/firebasejs/' + (window.CC_FIREBASE_SDK_VERSION || '10.14.1') + '/';

  // site-sync.js already loads the Firebase app + Firestore on every page; wait for it so the
  // SDK is loaded only once, then add Auth. Without site-sync, load everything here.
  var sdk = window.CCSync && window.CCSync.ready
    ? window.CCSync.ready
    : loadScript(base + 'firebase-app-compat.js').then(function () { return loadScript(base + 'firebase-firestore-compat.js'); });

  var ready = !window.CC_FIREBASE_READY
    ? Promise.reject(new Error('not-configured'))
    : sdk
      .then(function () { return loadScript(base + 'firebase-auth-compat.js'); })
      .then(function () {
        // Reuse the app if site-sync.js already started it
        var app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.CC_FIREBASE_CONFIG);
        auth = app.auth();
        db = app.firestore();
        try { auth.useDeviceLanguage(); } catch (e) { /* ignore */ }
      });

  ready.then(function () {
    // Finish a Google redirect sign-in (used when pop-ups are blocked)
    auth.getRedirectResult().catch(function (err) { showAlert('error', friendlyError(err)); });
    auth.onAuthStateChanged(function (user) {
      view.parentElement.classList.add('is-ready');
      if (registering) return;
      if (user) onSignedIn(user); else onSignedOut();
    });
  }).catch(function (err) {
    view.parentElement.classList.add('is-ready');
    console.warn('[Ceylon Chauffeurs] Sign-in unavailable:', err);
    showAlert('error', 'Sign-in is not available right now. You can still book as a guest, or message us on WhatsApp.');
  });

  function providerOf(user) {
    var p = (user.providerData && user.providerData[0] && user.providerData[0].providerId) || 'password';
    return p === 'google.com' ? 'google' : 'password';
  }

  function cacheCustomer(user) {
    try {
      localStorage.setItem('cc_customer', JSON.stringify({
        name: user.displayName || '',
        email: user.email || '',
        photo: user.photoURL || ''
      }));
    } catch (e) { /* private mode */ }
    if (window.CCAccountNav) window.CCAccountNav.refresh();
  }

  function saveProfile(user) {
    if (!db) return;
    var ref = db.collection('customers').doc(user.uid);
    var now = new Date().toISOString();
    var data = {
      name: String(user.displayName || '').slice(0, 120),
      email: String(user.email || '').slice(0, 160),
      photoURL: String(user.photoURL || '').slice(0, 1000),
      provider: providerOf(user),
      lastLoginAt: now
    };
    ref.get().then(function (snap) {
      if (!snap.exists) data.createdAt = now;
      return ref.set(data, { merge: true });
    }).catch(function (err) {
      // Usually means the latest firestore.rules are not published yet; sign-in still works.
      console.warn('[Ceylon Chauffeurs] Customer profile not saved:', err && err.code);
    });
  }

  function onSignedIn(user) {
    cacheCustomer(user);
    saveProfile(user);
    var next = nextPage();
    if (next) { location.replace(next); return; }
    renderAccount(user);
  }

  function onSignedOut() {
    try { localStorage.removeItem('cc_customer'); } catch (e) { /* ignore */ }
    if (window.CCAccountNav) window.CCAccountNav.refresh();
    accountView.hidden = true;
    view.hidden = false;
  }

  function renderAccount(user) {
    var name = user.displayName || (user.email ? user.email.split('@')[0] : 'traveller');
    $('account-name').textContent = name.split(' ')[0];
    $('account-email').textContent = user.email || '';

    var avatar = $('account-avatar');
    avatar.textContent = '';
    if (user.photoURL) {
      var img = document.createElement('img');
      img.src = user.photoURL; img.alt = ''; img.referrerPolicy = 'no-referrer';
      img.onerror = function () { avatar.textContent = name.charAt(0).toUpperCase(); };
      avatar.appendChild(img);
    } else {
      avatar.textContent = name.charAt(0).toUpperCase();
    }

    var google = providerOf(user) === 'google';
    $('account-provider').innerHTML = google
      ? '<i class="ph ph-google"></i> Google account'
      : '<i class="ph ph-envelope-simple"></i> Email account';
    var verified = $('account-verified');
    verified.innerHTML = user.emailVerified
      ? '<i class="ph ph-seal-check"></i> Email verified'
      : '<i class="ph ph-info"></i> Check your inbox to verify your email';
    verified.classList.toggle('is-warn', !user.emailVerified);

    view.hidden = true;
    accountView.hidden = false;
    accountView.classList.remove('is-entering');
    void accountView.offsetWidth;
    accountView.classList.add('is-entering');
  }

  /* ---------------- Actions ---------------- */

  googleBtn.addEventListener('click', function () {
    if (busy || !auth) return;
    clearAlert();
    setBusy(googleBtn, true);
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    auth.signInWithPopup(provider).catch(function (err) {
      if (err && (err.code === 'auth/popup-blocked' || err.code === 'auth/operation-not-supported-in-this-environment')) {
        return auth.signInWithRedirect(provider);
      }
      if (err && err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') console.warn(err);
      showAlert('error', friendlyError(err));
    }).then(function () { setBusy(googleBtn, false); });
  });

  $('form-signin').addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || !auth) return;
    var email = $('signin-email').value.trim();
    var pass = $('signin-password').value;
    if (!validEmail(email)) { showAlert('error', 'Please enter a valid email address.'); $('signin-email').focus(); return; }
    if (!pass) { showAlert('error', 'Please enter your password.'); $('signin-password').focus(); return; }
    var btn = e.target.querySelector('.auth-submit');
    clearAlert();
    setBusy(btn, true);
    auth.signInWithEmailAndPassword(email, pass)
      .catch(function (err) { showAlert('error', friendlyError(err)); })
      .then(function () { setBusy(btn, false); });
  });

  $('form-register').addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || !auth) return;
    var name = $('register-name').value.trim();
    var email = $('register-email').value.trim();
    var pass = $('register-password').value;
    if (name.length < 2) { showAlert('error', 'Please enter your full name.'); $('register-name').focus(); return; }
    if (!validEmail(email)) { showAlert('error', 'Please enter a valid email address.'); $('register-email').focus(); return; }
    if (pass.length < 8) { showAlert('error', 'Your password needs at least 8 characters.'); $('register-password').focus(); return; }
    var btn = e.target.querySelector('.auth-submit');
    clearAlert();
    setBusy(btn, true);
    registering = true;
    auth.createUserWithEmailAndPassword(email, pass)
      .then(function (cred) {
        return cred.user.updateProfile({ displayName: name.slice(0, 120) }).then(function () {
          cred.user.sendEmailVerification().catch(function () { /* optional */ });
          return cred.user.reload();
        }).then(function () { registering = false; onSignedIn(auth.currentUser); });
      })
      .catch(function (err) {
        registering = false;
        if (auth.currentUser) onSignedIn(auth.currentUser); // account was made even if the name step failed
        else showAlert('error', friendlyError(err));
      })
      .then(function () { setBusy(btn, false); });
  });

  $('form-reset').addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || !auth) return;
    var email = $('reset-email').value.trim();
    if (!validEmail(email)) { showAlert('error', 'Please enter a valid email address.'); $('reset-email').focus(); return; }
    var btn = e.target.querySelector('.auth-submit');
    clearAlert();
    setBusy(btn, true);
    auth.sendPasswordResetEmail(email)
      .then(function () { showAlert('success', 'If an account exists for ' + email + ', a reset link is on its way. Check your inbox and spam folder.'); })
      .catch(function (err) {
        // Do not reveal whether an account exists
        if (err && err.code === 'auth/user-not-found') showAlert('success', 'If an account exists for ' + email + ', a reset link is on its way. Check your inbox and spam folder.');
        else showAlert('error', friendlyError(err));
      })
      .then(function () { setBusy(btn, false); });
  });

  $('signout-btn').addEventListener('click', function () {
    if (!auth) return;
    auth.signOut().then(function () { setMode('signin'); });
  });
})();
