/**
 * Ceylon Chauffeur - Custom Itinerary & Dynamic Booking Engine
 * Handles live quote calculation, form validation, simulated auto-responder email, and WhatsApp prefill
 */

const DAILY_RATES = {
  sedan: { name: 'Sedan (Toyota Premio/Axio/Prius)', rate: 65, capacity: '1-3 Pax', luggage: '2-3 Bags' },
  suv: { name: 'SUV / Crossover (Honda Vezel/Outlander)', rate: 80, capacity: '1-4 Pax', luggage: '3-4 Bags' },
  van: { name: 'Luxury Van (Toyota KDH/HiAce Super GL)', rate: 105, capacity: '4-8 Pax', luggage: '6-8 Large Bags' }
};

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  prefillFromURLParams();
  calculateQuote();
});

/**
 * Read URL parameters to pre-fill form if arriving from package or fleet card
 */
function prefillFromURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const pkgId = urlParams.get('package');
  const vehicle = urlParams.get('vehicle');
  const duration = parseInt(urlParams.get('duration'), 10);

  // Prefill package select
  if (pkgId) {
    const pkgSelect = document.getElementById('preferred-package');
    if (pkgSelect) {
      pkgSelect.value = pkgId;
    }
  }

  // Prefill vehicle radio
  if (vehicle && DAILY_RATES[vehicle]) {
    const vehicleRadio = document.querySelector(`input[name="vehicle"][value="${vehicle}"]`);
    if (vehicleRadio) {
      vehicleRadio.checked = true;
    }
  }

  // Set default dates if duration provided
  if (duration && !isNaN(duration)) {
    const today = new Date();
    const arrival = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1 week from today
    const departure = new Date(arrival.getTime() + (duration * 24 * 60 * 60 * 1000));

    const arrivalInput = document.getElementById('arrival-date');
    const departureInput = document.getElementById('departure-date');

    if (arrivalInput && departureInput) {
      arrivalInput.value = arrival.toISOString().split('T')[0];
      departureInput.value = departure.toISOString().split('T')[0];
    }
  } else {
    // Default dates: arrival 3 days from now, departure 10 days from now (7 days tour)
    const today = new Date();
    const arrival = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    const departure = new Date(arrival.getTime() + (7 * 24 * 60 * 60 * 1000));

    const arrivalInput = document.getElementById('arrival-date');
    const departureInput = document.getElementById('departure-date');

    if (arrivalInput && !arrivalInput.value) {
      arrivalInput.value = arrival.toISOString().split('T')[0];
    }
    if (departureInput && !departureInput.value) {
      departureInput.value = departure.toISOString().split('T')[0];
    }
  }
}

/**
 * Initialize event listeners for dynamic price calculation
 */
function initBookingForm() {
  const form = document.getElementById('custom-itinerary-form');
  const arrivalInput = document.getElementById('arrival-date');
  const departureInput = document.getElementById('departure-date');
  const vehicleRadios = document.querySelectorAll('input[name="vehicle"]');
  const adultsSelect = document.getElementById('pax-adults');
  const kidsSelect = document.getElementById('pax-kids');
  const packageSelect = document.getElementById('preferred-package');

  [arrivalInput, departureInput, adultsSelect, kidsSelect, packageSelect].forEach(elem => {
    if (elem) elem.addEventListener('change', calculateQuote);
  });

  vehicleRadios.forEach(radio => {
    radio.addEventListener('change', calculateQuote);
  });

  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }
}

/**
 * Calculate live estimated quote
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    days = diffDays > 0 ? diffDays : 1;
  }

  const estimatedTotal = days * vehicleData.rate;

  // Update summary sidebar
  const durationElem = document.getElementById('summary-duration');
  const vehicleElem = document.getElementById('summary-vehicle');
  const dailyRateElem = document.getElementById('summary-daily-rate');
  const totalElem = document.getElementById('summary-total-price');

  if (durationElem) durationElem.textContent = `${days} Day${days > 1 ? 's' : ''}`;
  if (vehicleElem) vehicleElem.textContent = vehicleData.name;
  if (dailyRateElem) dailyRateElem.textContent = `$${vehicleData.rate} / day`;
  if (totalElem) totalElem.textContent = `$${estimatedTotal}`;

  return { days, vehicleData, estimatedTotal };
}

/**
 * Handle form submission:
 * 1. Validate inputs
 * 2. Simulate sending email to bookings@ceylonchauffeur.com
 * 3. Render instant Auto-Responder modal matching exact prompt requirements
 * 4. Provide "Continue to WhatsApp" button with pre-filled message
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
  const preferredPackage = document.getElementById('preferred-package')?.value || 'Custom Itinerary';
  const routeNotes = document.getElementById('route-notes')?.value.trim() || 'Standard luxury chauffeur sightseeing';

  if (!name || !email || !arrival || !departure) {
    alert('Please fill in all required fields (Name, Email, Travel Dates).');
    return;
  }

  const { days, estimatedTotal } = calculateQuote();
  const travelDatesFormatted = `${arrival} to ${departure} (${days} Days)`;

  // Generate WhatsApp Pre-filled text with all inquiry details
  const whatsAppText = `Hi Ceylon Chauffeur, I just submitted an inquiry on your website!
  
*Name:* ${name}
*Country:* ${country || 'Not specified'}
*Dates:* ${travelDatesFormatted}
*Passengers:* ${adults} Adults, ${kids} Children
*Vehicle:* ${vehicleData.name}
*Preference:* ${preferredPackage}
*Estimated Rate:* $${estimatedTotal} USD (All-inclusive)
*Notes:* ${routeNotes}

Looking forward to your customized proposal!`;

  // Render Auto-Responder Email Modal
  renderAutoResponderModal({
    customerName: name,
    customerEmail: email,
    travelDates: travelDatesFormatted,
    vehicleName: vehicleData.name,
    estimatedTotal: estimatedTotal,
    whatsAppText: whatsAppText
  });
}

/**
 * Render and display the automated customer email modal
 */
function renderAutoResponderModal(data) {
  const modal = document.getElementById('auto-responder-modal');
  if (!modal) return;

  const contentBox = document.getElementById('email-modal-content');
  if (contentBox) {
    contentBox.innerHTML = `
      <div class="email-inbox-modal modal-card">
        <!-- Email Client Top Header -->
        <div class="email-header-bar">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-envelope-open-text" style="color: var(--accent-gold); font-size: 1.2rem;"></i>
            <span style="font-weight: 700; font-size: 0.95rem; color: var(--primary-emerald);">Automated Confirmation Sent</span>
          </div>
          <button class="modal-close-btn" onclick="closeAutoResponderModal()">&times;</button>
        </div>

        <!-- Simulated Email Header Fields -->
        <div style="padding: 16px 28px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <div class="email-meta-field">
            <span class="email-meta-label">From:</span>
            <span class="email-meta-val">Ceylon Chauffeur &lt;bookings@ceylonchauffeur.com&gt;</span>
          </div>
          <div class="email-meta-field">
            <span class="email-meta-label">To:</span>
            <span class="email-meta-val">${data.customerName} &lt;${data.customerEmail}&gt;</span>
          </div>
          <div class="email-meta-field">
            <span class="email-meta-label">Subject:</span>
            <span class="email-meta-val" style="color: var(--primary-emerald);">We received your inquiry! – Ceylon Chauffeur 🇱🇰</span>
          </div>
        </div>

        <!-- Rendered Email Body Matching Specification Verbatim -->
        <div class="email-body-rendered">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
            <img src="assets/images/logo.png" alt="Ceylon Chauffeurs" style="height: 48px; border-radius: 6px; border: 1px solid var(--border-gold); padding: 2px; background: #ffffff;">
            <div>
              <h4 style="color: var(--primary-emerald); margin: 0; font-family: var(--font-serif); font-size: 1.2rem;">CEYLON CHAUFFEURS</h4>
              <small style="color: var(--accent-gold-hover); letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase; font-size: 0.72rem;">Explore Sri Lanka in Luxury</small>
            </div>
          </div>

          <p style="margin-bottom: 16px;"><strong>Hi ${data.customerName},</strong></p>
          
          <p style="margin-bottom: 16px;">
            Thank you for reaching out to <strong>Ceylon Chauffeur</strong>!
          </p>

          <p style="margin-bottom: 16px;">
            We have received your tour inquiry for <strong>${data.travelDates}</strong> with requested vehicle <strong>${data.vehicleName}</strong>. Our team is currently reviewing your details to provide you with a customized itinerary and exact quote.
          </p>

          <div class="email-callout-box">
            <p style="font-weight: 600; color: var(--primary-emerald); margin-bottom: 4px;">
              📩 <strong>Next Step:</strong> You will receive a detailed proposal within <strong>2 to 4 hours</strong>.
            </p>
            <p style="font-size: 0.88rem; color: var(--text-muted);">
              All our chauffeur rates strictly include fuel, highway tolls, parking fees, and driver lodging/meals. Zero hidden charges.
            </p>
          </div>

          <p style="margin-bottom: 8px;">🚀 <strong>Need Instant Assistance?</strong></p>
          <p style="margin-bottom: 16px;">Chat directly with us on WhatsApp for immediate route planning and real-time quotes.</p>

          <p style="margin-bottom: 4px;">Best regards,</p>
          <p style="font-weight: 700; color: var(--primary-emerald);">Ceylon Chauffeur Team</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            🌐 <a href="https://ceylonchauffeur.com" target="_blank" style="color: var(--accent-gold); text-decoration: underline;">www.ceylonchauffeur.com</a> | ✉️ bookings@ceylonchauffeur.com
          </p>
        </div>

        <!-- Modal Action Footer with WhatsApp Transition -->
        <div class="email-footer-actions">
          <button class="btn btn-whatsapp btn-lg" onclick="continueToWhatsApp('${encodeURIComponent(data.whatsAppText)}')">
            <i class="fab fa-whatsapp" style="font-size: 1.3rem;"></i> Continue to WhatsApp with Pre-filled Details
          </button>
          <span style="font-size: 0.82rem; color: var(--text-muted);">
            Opens WhatsApp directly with your trip details so our concierge can assist you instantly.
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
    document.body.style.overflow = 'auto';
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
