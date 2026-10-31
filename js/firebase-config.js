/**
 * Ceylon Chauffeurs - Firebase configuration (shared by the public site and /admin)
 *
 * HOW TO CONNECT (see FIREBASE_SETUP.md for the full guide):
 *   1. Firebase console → Project settings → General → "Your apps" → Web app (</>)
 *   2. Copy the firebaseConfig values and paste them below.
 *   3. Deploy firestore.rules and add your admin user (FIREBASE_SETUP.md, step 4).
 *
 * While apiKey is still 'YOUR_API_KEY' the admin dashboard runs in DEMO MODE
 * (data is kept in this browser only) and the public site uses its built-in data.
 * These web keys are not secret: access is protected by firestore.rules.
 */
window.CC_FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

window.CC_FIREBASE_SDK_VERSION = '10.14.1';

window.CC_FIREBASE_READY = (function () {
  var c = window.CC_FIREBASE_CONFIG || {};
  return !!(c.apiKey && c.projectId && c.apiKey.indexOf('YOUR_') !== 0 && c.projectId.indexOf('YOUR_') !== 0);
})();
