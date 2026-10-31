# Ceylon Chauffeurs: connecting the admin dashboard to Firebase

The admin dashboard lives at **`/admin/`** (for example `https://ceylonchauffeur.com/admin/`).

Until Firebase is connected it runs in **demo mode**. Any email and password signs in, and data is saved only in that browser. This lets you try every feature before you go live.

Firebase's free **Spark** plan is enough. The site only uses **Authentication** and **Cloud Firestore**. It does not use Storage, so you never need the paid Blaze plan.

---

## 1. Create the Firebase project (about 5 minutes)

1. Go to <https://console.firebase.google.com> and click **Add project**. Name it, for example, `ceylon-chauffeurs`. You can turn Google Analytics off.
2. In the left menu open **Build → Firestore Database → Create database**.
   - Location: `asia-south1 (Mumbai)` is the closest region to Sri Lanka.
   - Start in **production mode**. The rules from step 3 will open exactly what the site needs.
3. Open **Build → Authentication → Get started → Sign-in method** and enable **Email/Password**.

## 2. Paste your web config

1. Open **Project settings** (gear icon) → **General** → **Your apps** → click the **`</>` (Web)** icon. Register the app (any nickname, no hosting needed).
2. Firebase shows a `firebaseConfig = { ... }` block. Copy its values into **`js/firebase-config.js`**:

```js
window.CC_FIREBASE_CONFIG = {
  apiKey: 'AIza...',
  authDomain: 'ceylon-chauffeurs.firebaseapp.com',
  projectId: 'ceylon-chauffeurs',
  storageBucket: 'ceylon-chauffeurs.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abc123'
};
```

These web keys are **not secret**. Google designs them to be public. Your data is protected by the security rules in the next step.

## 3. Publish the security rules

Open **Firestore Database → Rules**, replace everything with the contents of **`firestore.rules`** from this repo, and click **Publish**.

What the rules allow:

| Collection | Public website | Admins |
| --- | --- | --- |
| `bookings` | Create a new inquiry only (validated) | Read, edit, delete |
| `packages`, `vehicles`, `reviews`, `faqs`, `settings` | Read | Full access |
| `visits` (visitor analytics) | Add an anonymous page-view record only | Read, delete |
| `customers` (website accounts) | Each signed-in customer reads and writes only their own profile | Read, delete |
| `drivers` | No access | Full access |
| `admins` | No access | Full access |

## 4. Create your admin login

1. **Authentication → Users → Add user**: enter your email and a strong password.
2. Copy the new user's **User UID**.
3. **Firestore Database → Start collection**:
   - Collection ID: `admins`
   - Document ID: *paste the UID*
   - Field: `role` (string) = `owner`
4. Open `/admin/` and sign in. If you skip step 3, the dashboard shows your UID and these same instructions.

Repeat steps 1–3 for each staff member who needs access.

## 5. Import the website content

The first time you sign in, the Overview page shows **"Your Firebase database is empty"**. Click **Import website content**. This copies the site's current content into Firestore:

- all 11 tour packages with their itineraries, routes and prices
- the 3 vehicle classes and their daily rates
- the chauffeurs list, reviews, FAQs, contact details and currency rates

From then on, everything you edit in the dashboard updates the public website.

You can run **Settings → Import missing website content** again at any time. It only adds records that are missing and never overwrites your edits.

## 6. Deploy

Push to GitHub. GitHub Pages, Vercel or Firebase Hosting all work, since the site is plain HTML. To use Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # pick your project
firebase deploy               # deploys hosting + firestore.rules
```

---

## What the dashboard covers

| Website feature | Where to manage it |
| --- | --- |
| Booking / custom-itinerary form (`booking.html`) | **Bookings**: live inbox, table and drag-and-drop board, status pipeline, chauffeur assignment, final price and payments, WhatsApp templates, printable voucher, CSV export, manual bookings for phone/WhatsApp leads |
| Tours on the road | **Tour calendar**: month view of every confirmed tour, plus the month's agenda |
| Tour packages (`packages.html`, home page, booking dropdown) | **Tour packages**: title, category, days, photo, route, map stops, highlights, day-by-day itinerary, full-package price, show/hide, order, duplicate |
| Fleet and daily rates (`fleet.html`, all prices, quote calculator) | **Fleet & prices**: daily rate per vehicle class, capacity (used for the booking form's capacity warning), luggage, photo, features, and a price preview for every package |
| Driver-guides | **Chauffeurs**: profiles, languages, availability, who is on tour now, next tour |
| Reviews (`reviews.html`, home page) | **Reviews**: add, edit, publish/hide, feature, star rating, source |
| FAQ accordion (`reviews.html`) | **FAQs**: add, edit, reorder, publish/hide |
| Website traffic | **Website visitors**: visitors today / 7 / 30 days, online now, page views, daily chart, top pages, sources (Google, Instagram, TripAdvisor…), countries, devices, new vs returning, live feed, visit→inquiry rate |
| Contact details, WhatsApp number, currency switcher | **Settings**: business details, currency rates, announcement bar, pause online bookings, JSON backup |

Other features: a live Overview with KPIs and charts, real-time "new inquiry" alerts, Ctrl/Cmd + K quick search, light and dark themes, and a mobile layout with a bottom tab bar.

---

### Google Maps on the tour packages page

The route map on `packages.html` uses Google Maps when a key is set in `js/firebase-config.js` (`window.CC_GOOGLE_MAPS_KEY`). Without a key, it uses the free OpenStreetMap map, which still draws each tour along real roads using the free public OSRM router (no key, no card). A Google key is optional. Both versions show an **Open in Google Maps** button that opens the full tour route with directions.

1. Go to <https://console.cloud.google.com>, pick the same project as Firebase (`ceylon-chauffer`), and open **Billing**. Add a card. Google requires one, but the Maps JavaScript API includes a large free monthly allowance, which a tour website normally stays within.
2. Open **APIs & Services → Library** and enable **Maps JavaScript API** and **Directions API**. The second one draws the route along real roads instead of a dashed line.
3. Open **APIs & Services → Credentials → Create credentials → API key**.
4. Click the new key and set these restrictions:
   - **Application restrictions → Websites**: add `https://ceylonchauffeur.com/*`, `https://www.ceylonchauffeur.com/*` and `https://*.vercel.app/*`.
   - **API restrictions**: allow only Maps JavaScript API and Directions API.
5. Paste the key into `window.CC_GOOGLE_MAPS_KEY` in `js/firebase-config.js` and deploy.
6. Optional, as a safety net: **Billing → Budgets & alerts**, add a budget of $1 so that you get an email if usage ever goes over the free allowance.

If the key is wrong or blocked, the page switches back to the OpenStreetMap map by itself.

### About website images

Open **Website images** in the admin to replace any photo on the site (hero, tour photos, fleet photos, logos). Each card has a ready-made AI image prompt and a **Replace** button. The package and vehicle editors also have an **Upload** button next to the photo field.

Uploaded photos are resized and compressed in the browser (about 1600 px wide, under 700 KB). If Firebase **Storage** is enabled, they go there (publish `storage.rules`). If it is not enabled, which is normal on the free Spark plan, they are saved in the Firestore `media` collection instead, so nothing extra needs to be set up. Publish the updated `firestore.rules` so that admins can write to `media`.

### About visitor analytics

Each page view on the public site writes one small, anonymous record to `visits`. The record holds the page, the source site, the device type, the time zone and a random browser ID. It does not store names, emails or IP addresses. The country is estimated from the visitor's time zone.

The Visitors page loads the last 60 days. On the free plan (50,000 reads/day), this is comfortable for a few hundred visits a day. If traffic grows a lot, delete old `visits` documents, or ask for a daily-summary version.

### Customer accounts (login.html)

Visitors can create an account or sign in at **`/login.html`** (the round person icon in the header), with **Google** or with an email and password. Their name and email then fill in by themselves on the booking form. Customer accounts never get dashboard access: `/admin/` only lets in users listed in the `admins` collection, and the rules stop customers writing there.

One-time setup in the Firebase console:

1. **Authentication → Sign-in method → Add new provider → Google** → Enable, pick a support email, **Save**. (Email/Password is already on for the admin login.)
2. **Authentication → Settings → Authorized domains**: make sure your website domain is listed, for example `ceylonchauffeur.com` and `www.ceylonchauffeur.com` (plus your `*.vercel.app` / `github.io` address if you use one). `localhost` is there by default for testing.
3. Publish the updated **`firestore.rules`** so each customer's small profile (`customers/{uid}`) can be saved. Sign-in still works before this, only the profile is skipped.

## සිංහලෙන් කෙටියෙන්

1. <https://console.firebase.google.com> එකේ project එකක් හදන්න. **Firestore Database** සහ **Authentication → Email/Password** enable කරන්න.
2. Project settings → Web app (`</>`) එකේ තියෙන `firebaseConfig` අගයන් **`js/firebase-config.js`** file එකට paste කරන්න.
3. Firestore → **Rules** එකට **`firestore.rules`** file එකේ content එක paste කරලා **Publish** කරන්න.
4. Authentication → **Add user** කරලා ඔයාගේ email/password හදන්න. ඊට පස්සේ Firestore එකේ `admins` කියලා collection එකක් හදලා, document ID එක ඔයාගේ **UID** එක දාලා `role = owner` field එක එකතු කරන්න.
5. `/admin/` එකට log වෙලා **Import website content** button එක ඔබන්න. එතැන් සිට dashboard එකේ කරන හැම වෙනස්කමක්ම website එකේ පෙන්නනවා. Website එකෙන් එන booking ද live dashboard එකට එනවා. Website එකට කී දෙනෙක් ආවද, කොහේ ඉඳන්ද, මොන page බැලුවද කියලා **Website visitors** page එකේ බලන්න පුළුවන්.
6. Customer login (`login.html`) එකට Google sign-in වැඩ කරන්න: Firebase console → **Authentication → Sign-in method → Google** enable කරන්න. **Authentication → Settings → Authorized domains** එකේ ඔයාගේ website domain එක (`ceylonchauffeur.com`) තියෙනවද බලන්න. අලුත් `firestore.rules` එකත් ආයෙත් Publish කරන්න. Customer account එකකට admin dashboard එකට යන්න බෑ, `admins` collection එකේ ඉන්න අයට විතරයි.
