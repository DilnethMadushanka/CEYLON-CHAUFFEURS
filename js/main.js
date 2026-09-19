/**
 * Ceylon Chauffeur - Main Application Scripts
 * Brand: Ceylon Chauffeur (ceylonchauffeur.com)
 */

// Global Configuration
const CEYLON_CHAUFFEUR_CONFIG = {
  phone: '94771234567', // Sri Lanka format for WhatsApp
  displayPhone: '+94 77 123 4567',
  email: 'bookings@ceylonchauffeur.com',
  defaultWhatsAppMessage: 'Hi Ceylon Chauffeur, I would like to inquire about a chauffeur service for my trip to Sri Lanka.'
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initWhatsAppLinks();
  initSmoothScroll();
});

/**
 * Mobile Navigation & Sticky Header Handling
 */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });

    // Close menu when clicking on any navigation link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
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

// Make openWhatsApp accessible globally
window.openWhatsApp = openWhatsApp;
window.CEYLON_CHAUFFEUR_CONFIG = CEYLON_CHAUFFEUR_CONFIG;
