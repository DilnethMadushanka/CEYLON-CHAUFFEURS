/**
 * Ceylon Chauffeur - Main Application Scripts & Global Utilities
 * Brand: Ceylon Chauffeur (ceylonchauffeur.com)
 */

// Global Business Configuration
const CEYLON_CHAUFFEUR_CONFIG = {
  phone: '94771234567', // Sri Lanka WhatsApp format
  displayPhone: '+94 77 123 4567',
  email: 'bookings@ceylonchauffeur.com',
  officeAddress: 'Colombo & Katunayake Airport Hub, Sri Lanka',
  defaultWhatsAppMessage: 'Hi Ceylon Chauffeur, I would like to inquire about a private chauffeur service for my trip to Sri Lanka.'
};

// Global Multi-Currency Rates & Formatter
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.00, label: 'USD ($)', code: 'USD', position: 'before' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)', code: 'EUR', position: 'before' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)', code: 'GBP', position: 'before' },
  AUD: { symbol: 'A$', rate: 1.52, label: 'AUD (A$)', code: 'AUD', position: 'before' },
  LKR: { symbol: 'Rs. ', rate: 305.00, label: 'LKR (Rs)', code: 'LKR', position: 'before' }
};

let currentCurrency = localStorage.getItem('ceylon_currency') || 'USD';
if (!CURRENCIES[currentCurrency]) currentCurrency = 'USD';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initWhatsAppLinks();
  initSmoothScroll();
  initCurrencySwitcher();
  initGlobalModalAccessibility();
  initGlobalFAQAccordion();
  initPolicyModals();
  updateAllCurrencyDisplays();
});

/**
 * Currency Conversion Helpers
 */
function convertUSD(usdAmount) {
  const conf = CURRENCIES[currentCurrency] || CURRENCIES.USD;
  const converted = Math.round(usdAmount * conf.rate);
  return {
    amount: converted,
    formatted: conf.position === 'before' ? `${conf.symbol}${converted.toLocaleString()}` : `${converted.toLocaleString()} ${conf.symbol}`,
    code: conf.code,
    symbol: conf.symbol
  };
}

function setCurrency(code) {
  if (!CURRENCIES[code]) return;
  currentCurrency = code;
  localStorage.setItem('ceylon_currency', code);
  updateAllCurrencyDisplays();

  // Dispatch global event for page-specific components (packages, booking calculator)
  window.dispatchEvent(new CustomEvent('ceylon_currency_changed', { detail: { currency: code } }));
}

function updateAllCurrencyDisplays() {
  document.querySelectorAll('[data-usd-amount]').forEach(elem => {
    const usd = parseFloat(elem.getAttribute('data-usd-amount'));
    if (!isNaN(usd)) {
      const conv = convertUSD(usd);
      const isPerDay = elem.getAttribute('data-usd-period') === 'day';
      elem.innerHTML = `${conv.formatted} <span class="currency-code-tag">${conv.code}${isPerDay ? ' / Day' : ''}</span>`;
    }
  });

  // Sync all currency select dropdowns
  document.querySelectorAll('.currency-select-box').forEach(select => {
    select.value = currentCurrency;
  });
}

function initCurrencySwitcher() {
  const navCta = document.querySelector('.nav-cta');
  if (navCta && !document.querySelector('.currency-select-box')) {
    const switcherWrap = document.createElement('div');
    switcherWrap.className = 'currency-picker-wrap';
    switcherWrap.innerHTML = `
      <i class="fas fa-globe text-gold" style="font-size: 0.88rem;"></i>
      <select class="currency-select-box" aria-label="Select Currency">
        ${Object.keys(CURRENCIES).map(key => `
          <option value="${key}" ${key === currentCurrency ? 'selected' : ''}>${CURRENCIES[key].label}</option>
        `).join('')}
      </select>
    `;
    navCta.insertBefore(switcherWrap, navCta.firstChild);

    switcherWrap.querySelector('.currency-select-box').addEventListener('change', (e) => {
      setCurrency(e.target.value);
    });
  }
}

/**
 * Mobile Navigation & Sticky Header Handling with Drawer Backdrop
 */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Inject mobile backdrop if not present
  let backdrop = document.querySelector('.nav-drawer-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-drawer-backdrop';
    document.body.appendChild(backdrop);
  }

  function closeMenu() {
    navMenu?.classList.remove('active');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileToggle?.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
  }

  function openMenu() {
    navMenu?.classList.add('active');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
    const icon = mobileToggle?.querySelector('i');
    if (icon) icon.className = 'fas fa-times';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener('click', closeMenu);

    // Close menu when clicking on any navigation link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Sticky header shadow change on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

/**
 * Global Modal Accessibility (Close on Escape, Click Backdrop)
 */
function initGlobalModalAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllActiveModals();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
      closeAllActiveModals();
    }
  });
}

function closeAllActiveModals() {
  document.querySelectorAll('.modal-overlay.active').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

/**
 * Global FAQ Accordion (with ARIA attributes & keyboard support)
 */
function initGlobalFAQAccordion() {
  document.querySelectorAll('.faq-question').forEach((btn, index) => {
    const item = btn.parentElement;
    const answer = item?.querySelector('.faq-answer');
    
    // Set accessibility attributes
    btn.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    const answerId = answer?.id || `faq-answer-${index}`;
    if (answer) answer.id = answerId;
    btn.setAttribute('aria-controls', answerId);

    btn.addEventListener('click', () => {
      const isExpanded = item.classList.toggle('active');
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  });
}

/**
 * Initialize all WhatsApp buttons with pre-filled message
 */
function initWhatsAppLinks() {
  const whatsappButtons = document.querySelectorAll('.action-whatsapp-btn');

  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customMsg = btn.getAttribute('data-whatsapp-msg') || CEYLON_CHAUFFEUR_CONFIG.defaultWhatsAppMessage;
      openWhatsApp(customMsg);
    });
  });
}

/**
 * Open WhatsApp with custom encoded text
 */
function openWhatsApp(message) {
  const encoded = encodeURIComponent(message || CEYLON_CHAUFFEUR_CONFIG.defaultWhatsAppMessage);
  const url = `https://wa.me/${CEYLON_CHAUFFEUR_CONFIG.phone}?text=${encoded}`;
  window.open(url, '_blank');
}

/**
 * Smooth scrolling for internal hash links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Terms & Conditions and Cancellation Policy Modal
 */
function initPolicyModals() {
  let policyModal = document.getElementById('ceylon-policy-modal');
  if (!policyModal) {
    policyModal = document.createElement('div');
    policyModal.id = 'ceylon-policy-modal';
    policyModal.className = 'modal-overlay';
    policyModal.innerHTML = `
      <div class="modal-card policy-modal-card">
        <div class="modal-header">
          <h3 id="policy-modal-title">Booking Terms & Conditions</h3>
          <button class="modal-close-btn" onclick="closeAllActiveModals()">&times;</button>
        </div>
        <div id="policy-modal-content" class="modal-content" style="max-height: 70vh; overflow-y: auto; font-size: 0.92rem; line-height: 1.7; color: var(--text-dark);">
          <!-- Dynamic Policy Content -->
        </div>
        <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">Ceylon Chauffeur – SLTDA Certified Excellence</span>
          <button class="btn btn-primary btn-sm" onclick="closeAllActiveModals()">Understood & Agree</button>
        </div>
      </div>
    `;
    document.body.appendChild(policyModal);
  }

  // Intercept all Booking Terms and Trust Guarantee links in footers
  document.querySelectorAll('a[href="booking.html"], a[href="#"]').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text === 'booking terms' || text === 'terms & conditions') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openPolicyModal('terms');
      });
    } else if (text === 'cancellation policy' || text === 'trust guarantee') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openPolicyModal('cancellation');
      });
    }
  });
}

function openPolicyModal(type) {
  const modal = document.getElementById('ceylon-policy-modal');
  const title = document.getElementById('policy-modal-title');
  const content = document.getElementById('policy-modal-content');
  if (!modal || !title || !content) return;

  if (type === 'cancellation') {
    title.innerHTML = `<i class="fas fa-shield-alt text-gold"></i> Cancellation, Refund & Change Policy`;
    content.innerHTML = `
      <h4 style="color: var(--primary-emerald); margin-bottom: 8px;">1. Transparent Cancellation Guarantee</h4>
      <p style="margin-bottom: 16px;">We understand international flight plans change. Ceylon Chauffeur provides flexible cancellation terms designed for foreign travelers:</p>
      <ul style="padding-left: 20px; margin-bottom: 16px;">
        <li><strong>Cancellation 48+ Hours Before Pickup:</strong> 100% Full Refund of any advance deposit with zero administrative penalties.</li>
        <li><strong>Cancellation Within 24–48 Hours:</strong> 80% Refund or free date rescheduling within 12 months.</li>
        <li><strong>Flight Delays or Rescheduling:</strong> Free automatic rescheduling. We track your flight into Colombo (CMB) at all times.</li>
      </ul>
      <h4 style="color: var(--primary-emerald); margin-bottom: 8px;">2. Zero Hidden Surcharges Guarantee</h4>
      <p style="margin-bottom: 16px;">The daily rate agreed in your proposal is 100% all-inclusive. You will never be asked to pay extra for driver fuel, expressway tolls, tourist parking permits, or driver overnight meals/accommodation.</p>
      <h4 style="color: var(--primary-emerald); margin-bottom: 8px;">3. Route Adjustments During Your Tour</h4>
      <p>Your itinerary is completely flexible. You may request reasonable detour stops, change daily start times, or adjust sightseeing durations directly with your chauffeur at zero extra cost.</p>
    `;
  } else {
    title.innerHTML = `<i class="fas fa-file-contract text-gold"></i> Chauffeur Service Terms & Traveler Protection`;
    content.innerHTML = `
      <h4 style="color: var(--primary-emerald); margin-bottom: 8px;">1. Chauffeur Standards & Credentials</h4>
      <p style="margin-bottom: 16px;">All Ceylon Chauffeur drivers are licensed by the Sri Lanka Tourism Development Authority (SLTDA), police background verified, medically certified, and fluent in spoken English.</p>
      <h4 style="color: var(--primary-emerald); margin-bottom: 8px;">2. Vehicle Specifications & Amenities</h4>
      <p style="margin-bottom: 16px;">Every vehicle is late-model Japanese manufacture (Toyota/Honda), strictly non-smoking, equipped with dual air conditioning, complimentary onboard high-speed 4G Wi-Fi, USB charging ports, and chilled bottled water supplied daily.</p>
      <h4 style="color: var(--primary-emerald); margin-bottom: 8px;">3. Inclusions vs. Exclusions</h4>
      <p style="margin-bottom: 8px;"><strong>100% Included:</strong> Vehicle, licensed chauffeur, unlimited touring mileage, petrol/diesel fuel, all highway/expressway tolls, airport parking fees, and driver lodging & meals.</p>
      <p style="margin-bottom: 16px;"><strong>Excluded:</strong> Personal monument entrance fees (e.g. Sigiriya, Polonnaruwa, national park jeep fees) and personal hotel bookings, unless you choose our Full All-Inclusive Package.</p>
      <h4 style="color: var(--primary-emerald); margin-bottom: 8px;">4. Passenger Insurance</h4>
      <p>All passengers in Ceylon Chauffeur vehicles are fully covered under comprehensive luxury commercial passenger vehicle insurance.</p>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Make accessible globally
window.openWhatsApp = openWhatsApp;
window.CEYLON_CHAUFFEUR_CONFIG = CEYLON_CHAUFFEUR_CONFIG;
window.CURRENCIES = CURRENCIES;
window.convertUSD = convertUSD;
window.setCurrency = setCurrency;
window.updateAllCurrencyDisplays = updateAllCurrencyDisplays;
window.closeAllActiveModals = closeAllActiveModals;
window.openPolicyModal = openPolicyModal;
