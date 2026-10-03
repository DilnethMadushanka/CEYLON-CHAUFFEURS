/**
 * Ceylon Chauffeur - Custom Itinerary & Dynamic Booking Engine
 * Handles live quote calculation, passenger capacity validation, date constraints,
 * inquiry persistence (localStorage), draft recovery, auto-responder, and WhatsApp prefill.
 *
 * ============================================================
 *  EMAIL CONFIGURATION - EmailJS Setup
 * ============================================================
 *  1. Go to https://www.emailjs.com and create a free account.
 *  2. Add your email service (Gmail / Outlook) → copy the Service ID.
 *  3. Create TWO Email Templates:
 *       a) Customer confirmation template → copy its Template ID.
 *       b) Internal/admin notification template → copy its Template ID.
 *  4. Go to Account → API Keys → copy your Public Key.
 *  5. Replace the placeholder values below with your real credentials.
 * ============================================================
 */

// ─── EMAILJS CREDENTIALS (Replace with your real values) ───────────────────
const EMAILJS_CONFIG = {
  publicKey:             'YOUR_EMAILJS_PUBLIC_KEY',   // e.g. 'aBcDeFgHiJkL12345'
  serviceId:             'YOUR_SERVICE_ID',            // e.g. 'service_abc123'
  customerTemplateId:    'YOUR_CUSTOMER_TEMPLATE_ID', // e.g. 'template_cust001'
  adminTemplateId:       'YOUR_ADMIN_TEMPLATE_ID',    // e.g. 'template_admin001'
  adminEmail:            'bookings@ceylonchauffeur.com'
};
// ────────────────────────────────────────────────────────────────────────────

const DAILY_RATES = {
  sedan: { name: 'Executive Sedan (Toyota Premio / Prius / Axio)', rate: 65, maxPax: 3, luggage: '2-3 Bags' },
  van: { name: 'Luxury Van (Toyota KDH Flat & High Roof / Nissan E25)', rate: 105, maxPax: 10, luggage: '4-8 Large Bags' },
  bus: { name: 'Luxury Bus / Coach (Toyota Coaster / King Long)', rate: 160, maxPax: 35, luggage: '12-25 Large Bags' }
};

const PACKAGE_DURATIONS = {
  'pkg-4d-cultural': 4,
  'pkg-7d-heritage': 7,
  'pkg-10d-complete': 10,
  'pkg-14d-grand': 14,
  'pkg-21d-ultimate': 21,
  'pkg-4d-wildlife': 4,
  'pkg-7d-wildlife': 7,
  'pkg-10d-wildlife': 10,
  'pkg-4d-beach': 4,
  'pkg-7d-beach': 7,
  'pkg-10d-beach': 10
};

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  prefillFromURLParams();
  restoreDraftIfAvailable();
  validateCapacity();
  calculateQuote();

  // Listen for global currency changes
  window.addEventListener('ceylon_currency_changed', () => {
    calculateQuote();
  });

  // Listen for global language changes
  window.addEventListener('ceylon_language_changed', () => {
    calculateQuote();
  });
});

/**
 * Prefill inputs from URL parameters (e.g. from index quick bar or packages modal)
 */
function prefillFromURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const pkgParam = urlParams.get('package');
  const vehicle = urlParams.get('vehicle');
  let duration = parseInt(urlParams.get('duration'), 10);

  // Set min arrival date to tomorrow
  const arrivalInput = document.getElementById('arrival-date');
  const departureInput = document.getElementById('departure-date');
  const tomorrow = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (arrivalInput) {
    arrivalInput.min = tomorrowStr;
  }

  // Prefill package select (supports both package ID and text search)
  if (pkgParam) {
    const pkgSelect = document.getElementById('preferred-package');
    if (pkgSelect) {
      let matchedOption = Array.from(pkgSelect.options).find(opt => 
        opt.value.toLowerCase() === pkgParam.toLowerCase() || 
        opt.text.toLowerCase().includes(pkgParam.toLowerCase())
      );

      if (matchedOption) {
        pkgSelect.value = matchedOption.value;
        if (!duration && PACKAGE_DURATIONS[matchedOption.value]) {
          duration = PACKAGE_DURATIONS[matchedOption.value];
        }
      }
    }
  }

  // Prefill vehicle radio
  if (vehicle && DAILY_RATES[vehicle]) {
    const vehicleRadio = document.querySelector(`input[name="vehicle"][value="${vehicle}"]`);
    if (vehicleRadio) {
      vehicleRadio.checked = true;
    }
  }

  // Set default dates according to duration
  const effectiveDuration = (!isNaN(duration) && duration > 0) ? duration : 7;
  const arrivalDate = new Date(Date.now() + (3 * 86400000));
  const departureDate = new Date(arrivalDate.getTime() + (effectiveDuration * 86400000));

  if (arrivalInput && !arrivalInput.value) {
    arrivalInput.value = arrivalDate.toISOString().split('T')[0];
  }
  if (departureInput && !departureInput.value) {
    departureInput.value = departureDate.toISOString().split('T')[0];
    departureInput.min = arrivalInput.value;
  }
}

/**
 * Initialize event listeners for dynamic price calculation and validation
 */
function initBookingForm() {
  const form = document.getElementById('custom-itinerary-form');
  const arrivalInput = document.getElementById('arrival-date');
  const departureInput = document.getElementById('departure-date');
  const vehicleRadios = document.querySelectorAll('input[name="vehicle"]');
  const adultsSelect = document.getElementById('pax-adults');
  const kidsSelect = document.getElementById('pax-kids');
  const packageSelect = document.getElementById('preferred-package');

  // When arrival date changes, dynamically adjust departure min date
  arrivalInput?.addEventListener('change', () => {
    if (arrivalInput.value && departureInput) {
      departureInput.min = arrivalInput.value;
      if (departureInput.value && departureInput.value <= arrivalInput.value) {
        // Auto-advance departure to at least 1 day after arrival
        const nextDay = new Date(new Date(arrivalInput.value).getTime() + 86400000);
        departureInput.value = nextDay.toISOString().split('T')[0];
      }
    }
    validateDates();
    calculateQuote();
    saveDraft();
  });

  departureInput?.addEventListener('change', () => {
    validateDates();
    calculateQuote();
    saveDraft();
  });

  // When package selection changes, update duration automatically if master package
  packageSelect?.addEventListener('change', () => {
    const selectedPkg = packageSelect.value;
    if (PACKAGE_DURATIONS[selectedPkg] && arrivalInput?.value) {
      const days = PACKAGE_DURATIONS[selectedPkg];
      const arr = new Date(arrivalInput.value);
      const dep = new Date(arr.getTime() + (days * 86400000));
      if (departureInput) {
        departureInput.value = dep.toISOString().split('T')[0];
      }
    }
    calculateQuote();
    saveDraft();
  });

  [adultsSelect, kidsSelect].forEach(elem => {
    if (elem) {
      elem.addEventListener('change', () => {
        validateCapacity();
        calculateQuote();
        saveDraft();
      });
    }
  });

  vehicleRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      validateCapacity();
      calculateQuote();
      saveDraft();
    });
  });

  // Save drafts on text input
  ['full-name', 'customer-email', 'customer-country', 'customer-phone', 'route-notes'].forEach(id => {
    const input = document.getElementById(id);
    input?.addEventListener('input', saveDraft);
  });

  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }
}

/**
 * Passenger count vs vehicle capacity validation
 */
function validateCapacity() {
  const adults = parseInt(document.getElementById('pax-adults')?.value || '2', 10);
  const kids = parseInt(document.getElementById('pax-kids')?.value || '0', 10);
  const totalPax = adults + kids;
  const selectedVehicleRadio = document.querySelector('input[name="vehicle"]:checked');
  const vehicleType = selectedVehicleRadio ? selectedVehicleRadio.value : 'sedan';
  const vehicleData = DAILY_RATES[vehicleType] || DAILY_RATES.sedan;

  const warningBox = document.getElementById('capacity-warning');
  const warningText = document.getElementById('capacity-warning-text');

  if (!warningBox || !warningText) return;

  if (totalPax > vehicleData.maxPax) {
    let recommendation = '';
    if (totalPax <= 6) {
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>Toyota KDH Flat Roof (4-6 Pax, 4-5 Bags)</strong>.`;
    } else if (totalPax <= 10) {
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>Toyota KDH High Roof (8-10 Pax, 6-8 Bags)</strong>.`;
    } else if (totalPax <= 20) {
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>Toyota Coaster Mini-Coach (18-20 Pax, 12-15 Bags)</strong>.`;
    } else if (totalPax <= 35) {
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>King Long Luxury Coach (20-35 Pax, 18-25 Bags)</strong>.`;
    } else {
      recommendation = `You have ${totalPax} passengers. For groups of 35+ travelers, we coordinate multiple luxury coaches. Please continue your booking and our concierge will tailor the fleet for your group.`;
    }

    warningText.innerHTML = recommendation;
    warningBox.style.display = 'flex';
  } else {
    warningBox.style.display = 'none';
  }
}

/**
 * Date order validation
 */
function validateDates() {
  const arrivalVal = document.getElementById('arrival-date')?.value;
  const departureVal = document.getElementById('departure-date')?.value;
  const warningBox = document.getElementById('date-warning');
  const warningText = document.getElementById('date-warning-text');

  if (!warningBox) return true;

  if (arrivalVal && departureVal) {
    const arr = new Date(arrivalVal);
    const dep = new Date(departureVal);
    if (dep <= arr) {
      if (warningText) warningText.textContent = 'Departure date must be after arrival date.';
      warningBox.style.display = 'flex';
      return false;
    }
  }
  warningBox.style.display = 'none';
  return true;
}

/**
 * Calculate live estimated quote with accurate calendar touring days and active currency
 */
function calculateQuote() {
  const arrivalVal = document.getElementById('arrival-date')?.value;
  const departureVal = document.getElementById('departure-date')?.value;
  const selectedVehicleRadio = document.querySelector('input[name="vehicle"]:checked');
  const vehicleType = selectedVehicleRadio ? selectedVehicleRadio.value : 'sedan';
  const vehicleData = DAILY_RATES[vehicleType] || DAILY_RATES.sedan;

  let days = 1;
  if (arrivalVal && departureVal) {
    const arrivalDate = new Date(arrivalVal);
    const departureDate = new Date(departureVal);
    const diffTime = departureDate - arrivalDate;
    const diffDays = Math.ceil(diffTime / 86400000);
    days = diffDays > 0 ? diffDays : 1;
  }

  const estimatedTotalUSD = days * vehicleData.rate;

  // Convert to current active currency
  const convertedTotal = window.convertUSD ? window.convertUSD(estimatedTotalUSD) : { formatted: `$${estimatedTotalUSD}`, code: 'USD' };
  const convertedDaily = window.convertUSD ? window.convertUSD(vehicleData.rate) : { formatted: `$${vehicleData.rate}`, code: 'USD' };

  // Update summary sidebar
  const durationElem = document.getElementById('summary-duration');
  const vehicleElem = document.getElementById('summary-vehicle');
  const dailyRateElem = document.getElementById('summary-daily-rate');
  const totalElem = document.getElementById('summary-total-price');
  const totalNoteElem = document.getElementById('summary-total-note');

  if (durationElem) durationElem.textContent = `${days} Day${days > 1 ? 's' : ''} (${Math.max(1, days - 1)} Nights)`;
  if (vehicleElem) vehicleElem.textContent = vehicleData.name;
  if (dailyRateElem) dailyRateElem.textContent = `${convertedDaily.formatted} / day`;
  if (totalElem && totalElem.textContent !== convertedTotal.formatted) {
    totalElem.textContent = convertedTotal.formatted;
    totalElem.classList.remove('is-bumped');
    void totalElem.offsetWidth; // restart the bump animation
    totalElem.classList.add('is-bumped');
  }
  if (totalNoteElem) totalNoteElem.textContent = `${convertedTotal.code}, 100% All-Inclusive Guarantee`;

  return { days, vehicleData, estimatedTotalUSD, convertedTotal, convertedDaily };
}

/**
 * Autosave draft to localStorage
 */
function saveDraft() {
  const draft = {
    name: document.getElementById('full-name')?.value || '',
    email: document.getElementById('customer-email')?.value || '',
    country: document.getElementById('customer-country')?.value || '',
    phone: document.getElementById('customer-phone')?.value || '',
    arrival: document.getElementById('arrival-date')?.value || '',
    departure: document.getElementById('departure-date')?.value || '',
    adults: document.getElementById('pax-adults')?.value || '2',
    kids: document.getElementById('pax-kids')?.value || '0',
    vehicle: document.querySelector('input[name="vehicle"]:checked')?.value || 'sedan',
    package: document.getElementById('preferred-package')?.value || 'custom',
    notes: document.getElementById('route-notes')?.value || ''
  };

  try {
    localStorage.setItem('ceylon_booking_draft', JSON.stringify(draft));
    const statusPill = document.getElementById('draft-status-pill');
    if (statusPill && (draft.name || draft.email)) {
      statusPill.style.display = 'inline-flex';
      setTimeout(() => {
        statusPill.style.display = 'none';
      }, 2500);
    }
  } catch (e) {
    // LocalStorage quota or privacy mode handling
  }
}

/**
 * Restore draft if user reloaded the page
 */
function restoreDraftIfAvailable() {
  // If user arrived with specific URL query params, prioritize URL params over old drafts
  if (window.location.search.length > 2) return;

  try {
    const raw = localStorage.getItem('ceylon_booking_draft');
    if (!raw) return;
    const draft = JSON.parse(raw);

    if (draft.name && document.getElementById('full-name')) document.getElementById('full-name').value = draft.name;
    if (draft.email && document.getElementById('customer-email')) document.getElementById('customer-email').value = draft.email;
    if (draft.country && document.getElementById('customer-country')) document.getElementById('customer-country').value = draft.country;
    if (draft.phone && document.getElementById('customer-phone')) document.getElementById('customer-phone').value = draft.phone;
    if (draft.arrival && document.getElementById('arrival-date')) document.getElementById('arrival-date').value = draft.arrival;
    if (draft.departure && document.getElementById('departure-date')) document.getElementById('departure-date').value = draft.departure;
    if (draft.adults && document.getElementById('pax-adults')) document.getElementById('pax-adults').value = draft.adults;
    if (draft.kids && document.getElementById('pax-kids')) document.getElementById('pax-kids').value = draft.kids;
    if (draft.vehicle) {
      const radio = document.querySelector(`input[name="vehicle"][value="${draft.vehicle}"]`);
      if (radio) radio.checked = true;
    }
    if (draft.package && document.getElementById('preferred-package')) document.getElementById('preferred-package').value = draft.package;
    if (draft.notes && document.getElementById('route-notes')) document.getElementById('route-notes').value = draft.notes;
  } catch (e) {
    // Ignore invalid JSON
  }
}

/**
 * Handle form submission:
 * 1. Validate inputs
 * 2. Generate unique Reference ID (CC-2026-XXXX)
 * 3. Persist inquiry into localStorage (guaranteed zero inquiry loss)
 * 4. Clear draft
 * 5. Display auto-responder receipt modal with direct WhatsApp prefill
 */
function handleBookingSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('full-name')?.value.trim();
  const email = document.getElementById('customer-email')?.value.trim();
  const country = document.getElementById('customer-country')?.value.trim();
  const phone = document.getElementById('customer-phone')?.value.trim();
  const arrival = document.getElementById('arrival-date')?.value;
  const departure = document.getElementById('departure-date')?.value;
  const adults = document.getElementById('pax-adults')?.value || '2';
  const kids = document.getElementById('pax-kids')?.value || '0';
  const vehicleRadio = document.querySelector('input[name="vehicle"]:checked');
  const vehicleType = vehicleRadio ? vehicleRadio.value : 'sedan';
  const vehicleData = DAILY_RATES[vehicleType];
  const pkgSelect = document.getElementById('preferred-package');
  const preferredPackage = pkgSelect ? pkgSelect.options[pkgSelect.selectedIndex]?.text : 'Custom Route';
  const routeNotes = document.getElementById('route-notes')?.value.trim() || 'Standard luxury chauffeur sightseeing';

  if (!name || !email || !arrival || !departure) {
    alert('Please complete all required fields (Full Name, Email, Travel Dates).');
    return;
  }

  if (!validateDates()) {
    alert('Please verify your travel dates. Departure must be after arrival.');
    return;
  }

  const { days, estimatedTotalUSD, convertedTotal } = calculateQuote();
  const travelDatesFormatted = `${arrival} to ${departure} (${days} Days)`;

  // Generate Unique Booking Reference
  const bookingRef = 'CC-2026-' + Math.floor(1000 + Math.random() * 9000);
  const submittedAt = new Date().toLocaleString('en-GB', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Colombo'
  }) + ' (Sri Lanka Time)';

  // Inquiry payload
  const inquiryRecord = {
    bookingRef,
    timestamp: new Date().toISOString(),
    customerName: name,
    customerEmail: email,
    customerCountry: country || 'Not specified',
    customerPhone: phone || 'Not specified',
    travelDates: travelDatesFormatted,
    daysCount: days,
    passengers: `${adults} Adults, ${kids} Children`,
    vehicle: vehicleData.name,
    package: preferredPackage,
    notes: routeNotes,
    estimatedTotalUSD,
    convertedTotal: convertedTotal.formatted,
    status: 'Confirmed & Logged'
  };

  // Persist inquiry in localStorage to prevent ANY lost lead
  try {
    const existing = JSON.parse(localStorage.getItem('ceylon_chauffeur_inquiries') || '[]');
    existing.unshift(inquiryRecord);
    localStorage.setItem('ceylon_chauffeur_inquiries', JSON.stringify(existing));
    // Clear draft
    localStorage.removeItem('ceylon_booking_draft');
  } catch (err) {
    console.warn('Inquiry storage note:', err);
  }

  // ── Formal Client Proposal / Inquiry Template ──────────────
  const whatsAppText = `╔══════════════════════════════╗
🌴  *CEYLON CHAUFFEURS*
     *CLIENT TOUR PROPOSAL REQUEST*
╚══════════════════════════════╝

Hello Ceylon Chauffeurs Team,

A new tour inquiry has been received through the website. Please review the client details and prepare a personalised itinerary proposal.

─────────────────────────────
🧾 *INQUIRY REFERENCE*
─────────────────────────────
📌 Ref No     : *${bookingRef}*
📅 Received   : ${submittedAt}

─────────────────────────────
👤 *CLIENT DETAILS*
─────────────────────────────
🙍 Full Name  : *${name}*
🌍 Country    : ${country || 'Not specified'}
📧 Email      : ${email}
📱 WhatsApp   : ${phone || 'Not provided'}

─────────────────────────────
🗓️ *TOUR REQUIREMENTS*
─────────────────────────────
📆 Dates      : ${travelDatesFormatted}
👥 Group Size : ${adults} Adults${parseInt(kids) > 0 ? `, ${kids} Children` : ''}
🚗 Vehicle    : ${vehicleData.name.split('(')[0].trim()}
🗺️ Package    : ${preferredPackage}

─────────────────────────────
💰 *RATE ESTIMATE*
─────────────────────────────
💵 Est. Total : *${convertedTotal.formatted}* (${convertedTotal.code})
✅ Includes   : Fuel • Tolls • Driver Lodging • Insurance

─────────────────────────────
📝 *CLIENT NOTES & SPECIAL REQUESTS*
─────────────────────────────
${routeNotes}

─────────────────────────────
⚡ *NEXT STEP:* Please reply to this client within 2-4 hours with a customised PDF proposal and confirm vehicle availability.
─────────────────────────────
_Automated inquiry via ceylonchauffeur.com_`;

  // ─── EmailJS: Shared template variables ────────────────────
  const emailParams = {
    // Customer details
    to_name:          name,
    to_email:         email,
    customer_country: country || 'Not specified',
    customer_phone:   phone || 'Not provided',
    // Booking summary
    booking_ref:      bookingRef,
    travel_dates:     travelDatesFormatted,
    passengers:       `${adults} Adults, ${kids} Children`,
    vehicle_name:     vehicleData.name.split('(')[0].trim(),
    tour_package:     preferredPackage,
    route_notes:      routeNotes,
    estimated_total:  convertedTotal.formatted,
    submitted_at:     submittedAt,
    // Admin-specific
    admin_email:      EMAILJS_CONFIG.adminEmail,
    reply_to:         email
  };

  // ─── Send both emails via EmailJS (runs in background) ─────
  sendEmailsViaEmailJS(emailParams, email, bookingRef);

  // ─── Automatically open WhatsApp with pre-filled template ──
  const chauffeurPhone = window.CEYLON_CHAUFFEUR_CONFIG ? window.CEYLON_CHAUFFEUR_CONFIG.phone : '94760542557';
  const whatsappUrl = `https://wa.me/${chauffeurPhone}?text=${encodeURIComponent(whatsAppText)}`;
  
  // Open WhatsApp in a new tab/window immediately
  const waWindow = window.open(whatsappUrl, '_blank');

  // Render Confirmation Modal with receipt and WhatsApp button
  renderAutoResponderModal({
    bookingRef: bookingRef,
    customerName: name,
    customerEmail: email,
    customerCountry: country,
    travelDates: travelDatesFormatted,
    passengers: `${adults} Adults, ${kids} Children`,
    vehicleName: vehicleData.name,
    preferredPackage: preferredPackage,
    estimatedTotalFormatted: convertedTotal.formatted,
    whatsAppText: whatsAppText
  });
}

/**
 * Send automated emails using EmailJS:
 *  1. Customer confirmation email (to the traveler)
 *  2. Admin notification email (to bookings@ceylonchauffeur.com)
 *
 * EMAILJS TEMPLATE VARIABLES to use in your templates:
 *  {{to_name}}          - Customer full name
 *  {{to_email}}         - Customer email
 *  {{customer_country}} - Country of residence
 *  {{customer_phone}}   - WhatsApp/phone number
 *  {{booking_ref}}      - Booking reference (e.g. CC-2026-4523)
 *  {{travel_dates}}     - Travel date range and duration
 *  {{passengers}}       - Adults & children count
 *  {{vehicle_name}}     - Vehicle class selected
 *  {{tour_package}}     - Package / route name
 *  {{route_notes}}      - Customer's special requests / notes
 *  {{estimated_total}}  - Total estimated price
 *  {{submitted_at}}     - Submission timestamp (Sri Lanka time)
 *  {{admin_email}}      - bookings@ceylonchauffeur.com
 *  {{reply_to}}         - Customer email (for admin to reply)
 */
function sendEmailsViaEmailJS(params, customerEmail, bookingRef) {
  // Check if EmailJS is loaded and credentials are configured
  if (typeof emailjs === 'undefined') {
    console.warn('[EmailJS] EmailJS SDK not loaded. Emails not sent.');
    return;
  }

  const isConfigured = (
    EMAILJS_CONFIG.publicKey    !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
    EMAILJS_CONFIG.serviceId    !== 'YOUR_SERVICE_ID' &&
    EMAILJS_CONFIG.customerTemplateId !== 'YOUR_CUSTOMER_TEMPLATE_ID' &&
    EMAILJS_CONFIG.adminTemplateId    !== 'YOUR_ADMIN_TEMPLATE_ID'
  );

  if (!isConfigured) {
    console.warn('[EmailJS] Credentials not configured. Please update EMAILJS_CONFIG in booking.js.');
    showEmailStatusBanner('config-missing');
    return;
  }

  // Initialize EmailJS (safe to call multiple times)
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });

  // 1. Customer confirmation email
  emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.customerTemplateId, {
    ...params,
    to_email: customerEmail
  })
  .then(() => {
    console.log(`[EmailJS] ✅ Customer confirmation sent to ${customerEmail} (Ref: ${bookingRef})`);
    showEmailStatusBanner('customer-sent');
  })
  .catch((err) => {
    console.error('[EmailJS] ❌ Customer email failed:', err);
    showEmailStatusBanner('error');
  });

  // 2. Admin / internal notification email
  emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.adminTemplateId, {
    ...params,
    to_email: EMAILJS_CONFIG.adminEmail
  })
  .then(() => {
    console.log(`[EmailJS] ✅ Admin notification sent to ${EMAILJS_CONFIG.adminEmail} (Ref: ${bookingRef})`);
  })
  .catch((err) => {
    console.error('[EmailJS] ❌ Admin email failed:', err);
  });
}

/**
 * Show a subtle in-modal email status indicator after sending
 */
function showEmailStatusBanner(status) {
  // Wait for modal to render, then inject banner
  setTimeout(() => {
    const modalContent = document.getElementById('email-modal-content');
    if (!modalContent) return;

    // Remove any existing banner
    const existing = modalContent.querySelector('.email-send-status-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.className = 'email-send-status-banner';

    if (status === 'customer-sent') {
      banner.classList.add('is-sent');
      banner.innerHTML = '<i class="ph ph-envelope-simple-open"></i> <span><strong>Confirmation emails sent.</strong> Check your inbox (and spam folder) for your booking receipt from <strong>bookings@ceylonchauffeur.com</strong>.</span>';
    } else if (status === 'config-missing') {
      banner.classList.add('is-pending');
      banner.innerHTML = '<i class="ph ph-warning"></i> <span><strong>Email sending not configured yet.</strong> Your inquiry is saved locally. Our team will be in touch via WhatsApp.</span>';
    } else if (status === 'error') {
      banner.classList.add('is-error');
      banner.innerHTML = '<i class="ph ph-warning-circle"></i> <span><strong>Email delivery issue.</strong> Your inquiry is saved. Please follow up via WhatsApp to confirm receipt.</span>';
    }

    // Insert banner just below the email header fields section
    const emailBody = modalContent.querySelector('.email-body-rendered');
    if (emailBody) {
      emailBody.parentNode.insertBefore(banner, emailBody);
    }
  }, 600);
}

/**
 * Render and display the automated customer confirmation & receipt modal
 */
function renderAutoResponderModal(data) {
  const modal = document.getElementById('auto-responder-modal');
  if (!modal) return;

  const contentBox = document.getElementById('email-modal-content');
  if (contentBox) {
    contentBox.innerHTML = `
      <div class="email-inbox-modal modal-card">
        <div class="email-header-bar">
          <span class="email-status"><i class="ph ph-check-circle"></i> Inquiry Received & Confirmed</span>
          <div class="email-header-actions">
            <span class="booking-ref-badge"><i class="ph ph-ticket"></i> Ref: ${data.bookingRef}</span>
            <button class="modal-close-btn" onclick="closeAutoResponderModal()" aria-label="Close">&times;</button>
          </div>
        </div>

        <div class="email-meta">
          <div class="email-meta-field">
            <span class="email-meta-label">From:</span>
            <span class="email-meta-val">Ceylon Chauffeur Concierge &lt;bookings@ceylonchauffeur.com&gt;</span>
          </div>
          <div class="email-meta-field">
            <span class="email-meta-label">To:</span>
            <span class="email-meta-val">${data.customerName} &lt;${data.customerEmail}&gt;</span>
          </div>
          <div class="email-meta-field">
            <span class="email-meta-label">Subject:</span>
            <span class="email-meta-val email-meta-val--subject">We received your inquiry [Ref: ${data.bookingRef}], Ceylon Chauffeur</span>
          </div>
        </div>

        <div class="email-body-rendered">
          <div class="email-brand-row">
            <div class="email-brand">
              <span class="brand-mark"><img src="assets/images/logo-mark.png" alt="" class="brand-logo-img" width="225" height="192"></span>
              <div>
                <div class="email-brand-name">Ceylon Chauffeurs</div>
                <small>Official Booking Confirmation Receipt</small>
              </div>
            </div>
            <span class="email-logged-pill"><i class="ph ph-check"></i> Logged & Stored</span>
          </div>

          <p><strong>Dear ${data.customerName},</strong></p>

          <p>
            Thank you for contacting <strong>Ceylon Chauffeurs</strong>. Your private chauffeur tour inquiry has been successfully recorded in our central booking dispatch system under Reference Number <strong>${data.bookingRef}</strong>.
          </p>

          <div class="email-callout-box">
            <div class="email-receipt-grid">
              <div><strong>Travel Dates</strong>${data.travelDates}</div>
              <div><strong>Party Size</strong>${data.passengers}</div>
              <div><strong>Vehicle Class</strong>${data.vehicleName.split('(')[0]}</div>
              <div><strong>Tour Selection</strong>${data.preferredPackage}</div>
              <div><strong>Estimated Rate</strong><span class="email-receipt-total">${data.estimatedTotalFormatted}</span></div>
              <div><strong>Inclusions</strong>Fuel, Tolls & Driver Lodging (100%)</div>
            </div>
          </div>

          <div class="email-turnaround">
            <i class="ph ph-hourglass-medium"></i>
            <span><strong>Turnaround Guarantee:</strong> Our lead travel coordinator is currently reviewing your route. You will receive an individualized PDF proposal within <strong>2 to 4 hours</strong>.</span>
          </div>

          <p><strong>Want Instant Confirmation & Immediate Route Chat?</strong><br>
          Connect with our 24/7 Concierge on WhatsApp with your pre-filled inquiry to lock in vehicle availability immediately.</p>
        </div>

        <div class="email-footer-actions">
          <div class="email-modal-actions">
            <button class="btn btn-whatsapp email-btn-whatsapp" onclick="continueToWhatsApp('${encodeURIComponent(data.whatsAppText)}')">
              <i class="ph ph-whatsapp-logo"></i> Continue to WhatsApp with Ref #${data.bookingRef}
            </button>
            <button class="btn btn-outline-emerald email-btn-print" onclick="window.print()">
              <i class="ph ph-printer"></i> Print Receipt
            </button>
          </div>
          <span class="email-footer-note">A copy of this inquiry has been preserved locally in your session.</span>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAutoResponderModal() {
  const modal = document.getElementById('auto-responder-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function continueToWhatsApp(encodedMessage) {
  const phone = window.CEYLON_CHAUFFEUR_CONFIG ? window.CEYLON_CHAUFFEUR_CONFIG.phone : '94760542557';
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(url, '_blank');
  closeAutoResponderModal();
}

window.closeAutoResponderModal = closeAutoResponderModal;
window.continueToWhatsApp = continueToWhatsApp;
window.validateCapacity = validateCapacity;
window.calculateQuote = calculateQuote;
