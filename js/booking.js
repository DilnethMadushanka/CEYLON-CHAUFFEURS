/**
 * Ceylon Chauffeur - Custom Itinerary & Dynamic Booking Engine
 * Handles live quote calculation, passenger capacity validation, date constraints,
 * inquiry persistence (localStorage), draft recovery, simulated auto-responder, and WhatsApp prefill.
 */

const DAILY_RATES = {
  sedan: { name: 'Executive Sedan (Toyota Premio / Prius / Axio)', rate: 65, maxPax: 3, luggage: '2–3 Bags' },
  van: { name: 'Luxury Van (Toyota KDH Flat & High Roof / Nissan E25)', rate: 105, maxPax: 10, luggage: '4–8 Large Bags' },
  bus: { name: 'Luxury Bus / Coach (Toyota Coaster / King Long)', rate: 160, maxPax: 35, luggage: '12–25 Large Bags' }
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
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>Toyota KDH Flat Roof (4–6 Pax • 4–5 Bags)</strong>.`;
    } else if (totalPax <= 10) {
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>Toyota KDH High Roof (8–10 Pax • 6–8 Bags)</strong>.`;
    } else if (totalPax <= 20) {
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>Toyota Coaster Mini-Coach (18–20 Pax • 12–15 Bags)</strong>.`;
    } else if (totalPax <= 35) {
      recommendation = `You have ${totalPax} passengers. The ${vehicleData.name.split('(')[0].trim()} fits up to ${vehicleData.maxPax} passengers. We recommend switching to our <strong>King Long Luxury Coach (20–35 Pax • 18–25 Bags)</strong>.`;
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
  if (totalElem) totalElem.textContent = convertedTotal.formatted;
  if (totalNoteElem) totalNoteElem.textContent = `${convertedTotal.code} • 100% All-Inclusive Guarantee`;

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

  // Pre-filled WhatsApp message with Reference Number
  const whatsAppText = `Hi Ceylon Chauffeur Concierge,
I just submitted a tour inquiry on your website!

*Booking Ref:* ${bookingRef}
*Name:* ${name}
*Country:* ${country || 'Not specified'}
*Dates:* ${travelDatesFormatted}
*Passengers:* ${adults} Adults, ${kids} Children
*Vehicle:* ${vehicleData.name}
*Tour Preference:* ${preferredPackage}
*Estimated Rate:* ${convertedTotal.formatted} (${convertedTotal.code} All-inclusive)
*Route Notes:* ${routeNotes}

Please confirm availability and share my customized proposal!`;

  // Render Confirmation Modal
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
 * Render and display the automated customer confirmation & receipt modal
 */
function renderAutoResponderModal(data) {
  const modal = document.getElementById('auto-responder-modal');
  if (!modal) return;

  const contentBox = document.getElementById('email-modal-content');
  if (contentBox) {
    contentBox.innerHTML = `
      <div class="email-inbox-modal modal-card">
        <!-- Header Bar -->
        <div class="email-header-bar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-check-circle" style="color: #22c55e; font-size: 1.2rem;"></i>
            <span style="font-weight: 700; font-size: 0.95rem; color: var(--primary-emerald);">Inquiry Received & Confirmed</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="booking-ref-badge"><i class="fas fa-ticket-alt text-gold"></i> Ref: ${data.bookingRef}</span>
            <button class="modal-close-btn" onclick="closeAutoResponderModal()">&times;</button>
          </div>
        </div>

        <!-- Simulated Email Header Fields -->
        <div style="padding: 14px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 0.88rem;">
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
            <span class="email-meta-val" style="color: var(--primary-emerald); font-weight: 700;">We received your inquiry! [Ref: ${data.bookingRef}] – Ceylon Chauffeur 🇱🇰</span>
          </div>
        </div>

        <!-- Rendered Email & Receipt Body -->
        <div class="email-body-rendered">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="assets/images/logo.png" alt="Ceylon Chauffeurs" style="height: 44px; border-radius: 6px; border: 1px solid var(--border-gold); padding: 2px; background: #ffffff;">
              <div>
                <h4 style="color: var(--primary-emerald); margin: 0; font-family: var(--font-serif); font-size: 1.15rem;">CEYLON CHAUFFEURS</h4>
                <small style="color: var(--accent-gold-hover); letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase; font-size: 0.7rem;">Official Booking Confirmation Receipt</small>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">Status:</span>
              <span style="font-size: 0.82rem; font-weight: 700; color: #15803d; background: #dcfce7; padding: 3px 10px; border-radius: 20px; display: inline-block;">
                ✓ Logged & Stored
              </span>
            </div>
          </div>

          <p style="margin-bottom: 14px;"><strong>Dear ${data.customerName},</strong></p>
          
          <p style="margin-bottom: 14px;">
            Thank you for contacting <strong>Ceylon Chauffeurs</strong>. Your private chauffeur tour inquiry has been successfully recorded in our central booking dispatch system under Reference Number <strong>${data.bookingRef}</strong>.
          </p>

          <!-- Itinerary Summary Card -->
          <div class="email-callout-box" style="margin: 16px 0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 0.88rem;">
              <div><strong>Travel Dates:</strong><br>${data.travelDates}</div>
              <div><strong>Party Size:</strong><br>${data.passengers}</div>
              <div><strong>Vehicle Class:</strong><br>${data.vehicleName.split('(')[0]}</div>
              <div><strong>Tour Selection:</strong><br>${data.preferredPackage}</div>
              <div><strong>Estimated Rate:</strong><br><span style="font-weight: 800; color: var(--primary-emerald); font-size: 1.05rem;">${data.estimatedTotalFormatted}</span></div>
              <div><strong>Inclusions:</strong><br>Fuel, Tolls & Driver Lodging (100%)</div>
            </div>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin-bottom: 18px; font-size: 0.88rem; color: #1e3a8a;">
            <strong>⏱️ Turnaround Guarantee:</strong> Our lead travel coordinator is currently reviewing your route. You will receive an individualized PDF proposal within <strong>2 to 4 hours</strong>.
          </div>

          <p style="font-size: 0.9rem; margin-bottom: 6px;"><strong>Want Instant Confirmation & Immediate Route Chat?</strong></p>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 18px;">
            Connect with our 24/7 Concierge on WhatsApp with your pre-filled inquiry to lock in vehicle availability immediately.
          </p>
        </div>

        <!-- Modal Action Footer with WhatsApp Transition & Print Option -->
        <div class="email-footer-actions">
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-whatsapp btn-lg" style="flex: 1; min-width: 250px;" onclick="continueToWhatsApp('${encodeURIComponent(data.whatsAppText)}')">
              <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i> Continue to WhatsApp with Ref #${data.bookingRef}
            </button>
            <button class="btn btn-outline-emerald btn-sm" onclick="window.print()">
              <i class="fas fa-print"></i> Print Receipt
            </button>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted); margin-top: 6px;">
            A copy of this inquiry has been preserved locally in your session.
          </span>
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
  const phone = window.CEYLON_CHAUFFEUR_CONFIG ? window.CEYLON_CHAUFFEUR_CONFIG.phone : '94771234567';
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(url, '_blank');
  closeAutoResponderModal();
}

window.closeAutoResponderModal = closeAutoResponderModal;
window.continueToWhatsApp = continueToWhatsApp;
window.validateCapacity = validateCapacity;
window.calculateQuote = calculateQuote;
