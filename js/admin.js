/**
 * Ceylon Chauffeurs - Admin Concierge Operations Portal
 * Handles inquiry retrieval, KPI calculations, status updates, chauffeur assignments,
 * customer WhatsApp dispatching, CSV export, and demo inquiry seeding.
 */

const CHAUFFEUR_ROSTER = [
  { id: 'unassigned', name: '-- Unassigned (Pending Allocation) --' },
  { id: 'drv-chaminda', name: 'Chaminda Perera (SLTDA Certified • English / German)' },
  { id: 'drv-roshan', name: 'Roshan Silva (SLTDA Certified • English • Hill Country Specialist)' },
  { id: 'drv-duminda', name: 'Duminda Fernando (SLTDA Certified • English / French • Van Expert)' },
  { id: 'drv-sunimal', name: 'Sunimal Jayawardena (SLTDA Certified • English • Wildlife Spotter)' },
  { id: 'drv-nalin', name: 'Nalin Wickramasinghe (SLTDA Certified • English • Luxury Fleet)' }
];

const DEMO_SEED_INQUIRIES = [
  {
    bookingRef: 'CC-2026-9281',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    customerName: 'Alexander Wright',
    customerEmail: 'alex.wright@uktravel.co.uk',
    customerCountry: 'United Kingdom',
    customerPhone: '+44 7911 123456',
    travelDates: '2026-10-15 to 2026-10-22 (7 Days)',
    daysCount: 7,
    passengers: '14 Adults, 2 Children',
    vehicle: 'Luxury Coach / Bus (Toyota Coaster)',
    package: '7-Day Heritage & Hill Country Classic',
    notes: 'Group delegation tour. Scenic train ride coordination and tea factory tasting required.',
    estimatedTotalUSD: 1120,
    convertedTotal: '$1,120 USD',
    status: 'Confirmed & Logged',
    assignedDriver: 'drv-roshan'
  },
  {
    bookingRef: 'CC-2026-8419',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    customerName: 'Markus & Lena Klein',
    customerEmail: 'markus.klein@munich-mail.de',
    customerCountry: 'Germany',
    customerPhone: '+49 170 9876543',
    travelDates: '2026-11-01 to 2026-11-15 (14 Days)',
    daysCount: 14,
    passengers: '2 Adults, 1 Child',
    vehicle: 'Executive Sedan (Toyota Prius / Axio)',
    package: '14-Day Grand Sri Lanka Loop',
    notes: 'Please recommend quiet boutique heritage hotels. Want to see wild elephants in Minneriya.',
    estimatedTotalUSD: 910,
    convertedTotal: '$910 USD',
    status: 'Contacted',
    assignedDriver: 'drv-chaminda'
  },
  {
    bookingRef: 'CC-2026-7720',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    customerName: 'The Larsson Family',
    customerEmail: 'j.larsson@stockholm-nordic.se',
    customerCountry: 'Sweden',
    customerPhone: '+46 70 123 4567',
    travelDates: '2026-12-10 to 2026-12-17 (7 Days)',
    daysCount: 7,
    passengers: '4 Adults, 2 Children',
    vehicle: 'Luxury Van (Toyota KDH Flat/High Roof)',
    package: '7-Day Wild & National Parks Safari',
    notes: 'Family with two kids aged 5 and 8. Would like child booster seat and spacious luggage trunk for surfboards.',
    estimatedTotalUSD: 735,
    convertedTotal: '$735 USD',
    status: 'Pending',
    assignedDriver: 'unassigned'
  },
  {
    bookingRef: 'CC-2026-6154',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    customerName: 'Robert Kessler',
    customerEmail: 'rkessler@sf-enterprise.com',
    customerCountry: 'United States',
    customerPhone: '+1 415 555 0192',
    travelDates: '2026-10-05 to 2026-10-15 (10 Days)',
    daysCount: 10,
    passengers: '1 Adult, 0 Children',
    vehicle: 'Executive Sedan (Toyota Prius / Axio)',
    package: '10-Day Complete Island Highlights',
    notes: 'Solo photography expedition. Need early morning start for Sigiriya sunrise and Ella Nine Arches Bridge.',
    estimatedTotalUSD: 650,
    convertedTotal: '$650 USD',
    status: 'Confirmed',
    assignedDriver: 'drv-sunimal'
  }
];

// State
let allInquiries = [];
let activeSearch = '';
let activeStatusFilter = 'all';
let activeVehicleFilter = 'all';
let currentSelectedBookingRef = null;

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  loadInquiries();
  initAdminToolbar();
  initExportCsvButton();
});

/**
 * Initialize live operations clock
 */
function initClock() {
  const clockElem = document.getElementById('current-time');
  function update() {
    const now = new Date();
    if (clockElem) {
      clockElem.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    }
  }
  update();
  setInterval(update, 1000);
}

/**
 * Load inquiries from localStorage
 */
function loadInquiries() {
  try {
    const raw = localStorage.getItem('ceylon_chauffeur_inquiries');
    if (raw) {
      allInquiries = JSON.parse(raw);
    } else {
      allInquiries = [];
    }
  } catch (e) {
    allInquiries = [];
  }

  // If completely empty on first load, seed demo records so the admin portal looks alive
  if (allInquiries.length === 0) {
    allInquiries = [...DEMO_SEED_INQUIRIES];
    saveInquiries();
  }

  updateKpis();
  renderInquiriesTable();
}

function saveInquiries() {
  try {
    localStorage.setItem('ceylon_chauffeur_inquiries', JSON.stringify(allInquiries));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

/**
 * Compute and render top KPI cards
 */
function updateKpis() {
  const totalElem = document.getElementById('kpi-total-inquiries');
  const revenueElem = document.getElementById('kpi-pipeline-revenue');
  const pendingElem = document.getElementById('kpi-pending-inquiries');
  const confirmedElem = document.getElementById('kpi-confirmed-inquiries');

  const totalCount = allInquiries.length;
  const pendingCount = allInquiries.filter(i => (i.status || '').toLowerCase().includes('pending') || (i.status || '').toLowerCase().includes('confirmed & logged')).length;
  const confirmedCount = allInquiries.filter(i => (i.status || '').toLowerCase() === 'confirmed').length;

  const totalUSD = allInquiries.reduce((acc, curr) => {
    const val = parseFloat(curr.estimatedTotalUSD);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  if (totalElem) totalElem.textContent = totalCount;
  if (revenueElem) revenueElem.textContent = `$${totalUSD.toLocaleString()} USD`;
  if (pendingElem) pendingElem.textContent = pendingCount;
  if (confirmedElem) confirmedElem.textContent = confirmedCount;
}

/**
 * Filter & Render inquiries data table
 */
function renderInquiriesTable() {
  const tbody = document.getElementById('inquiries-tbody');
  const countBadge = document.getElementById('table-count-badge');
  if (!tbody) return;

  const filtered = allInquiries.filter(item => {
    // Search filter
    let matchSearch = true;
    if (activeSearch.trim().length > 0) {
      const q = activeSearch.toLowerCase();
      matchSearch = (item.customerName || '').toLowerCase().includes(q) ||
                    (item.customerEmail || '').toLowerCase().includes(q) ||
                    (item.customerCountry || '').toLowerCase().includes(q) ||
                    (item.bookingRef || '').toLowerCase().includes(q);
    }

    // Status filter
    let matchStatus = true;
    if (activeStatusFilter !== 'all') {
      matchStatus = (item.status || '') === activeStatusFilter;
    }

    // Vehicle filter
    let matchVehicle = true;
    if (activeVehicleFilter !== 'all') {
      matchVehicle = (item.vehicle || '').toLowerCase().includes(activeVehicleFilter.toLowerCase());
    }

    return matchSearch && matchStatus && matchVehicle;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} record${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <i class="fas fa-folder-open text-gold" style="font-size: 2rem; margin-bottom: 8px; display: block;"></i>
          <strong>No booking records found matching current filters.</strong><br>
          <button class="btn btn-outline-emerald btn-sm" onclick="resetFilters()" style="margin-top: 10px;">Clear Filters</button>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const formattedDate = item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
    const statusClass = getStatusBadgeClass(item.status);
    const assignedDriverObj = CHAUFFEUR_ROSTER.find(d => d.id === item.assignedDriver);
    const driverShortName = assignedDriverObj && assignedDriverObj.id !== 'unassigned' ? assignedDriverObj.name.split('(')[0].trim() : 'Unassigned';

    return `
      <tr onclick="openDossierModal('${item.bookingRef}')" style="cursor: pointer;" title="Click to view traveler dossier">
        <td>
          <span class="table-ref-code"><i class="fas fa-ticket-alt text-gold"></i> ${item.bookingRef || 'N/A'}</span>
        </td>
        <td style="font-size: 0.82rem; color: var(--text-muted);">${formattedDate}</td>
        <td>
          <strong>${item.customerName || 'Guest'}</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${item.customerEmail || ''}</div>
        </td>
        <td>
          <span class="country-pill"><i class="fas fa-globe-americas"></i> ${item.customerCountry || 'Not Specified'}</span>
        </td>
        <td>
          <span style="font-size: 0.85rem; font-weight: 600;">${item.travelDates || 'Custom'}</span>
        </td>
        <td>
          <span style="font-size: 0.82rem;">${(item.vehicle || '').split('(')[0]}</span>
        </td>
        <td>
          <strong style="color: var(--primary-emerald);">${item.convertedTotal || '$' + (item.estimatedTotalUSD || 0)}</strong>
        </td>
        <td>
          <span class="status-pill ${statusClass}">${item.status || 'Pending'}</span>
        </td>
        <td onclick="event.stopPropagation();">
          <div style="display: flex; gap: 6px;">
            <button class="btn-action-icon" onclick="openDossierModal('${item.bookingRef}')" title="Inspect & Edit">
              <i class="fas fa-eye text-gold"></i>
            </button>
            <button class="btn-action-icon" onclick="directWhatsAppChat('${item.bookingRef}')" title="Direct WhatsApp Response">
              <i class="fab fa-whatsapp" style="color: #22c55e;"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('confirmed & logged')) return 'status-logged';
  if (s === 'confirmed') return 'status-confirmed';
  if (s.includes('contacted')) return 'status-contacted';
  if (s.includes('completed')) return 'status-completed';
  if (s.includes('cancelled')) return 'status-cancelled';
  return 'status-pending';
}

/**
 * Toolbar event listeners
 */
function initAdminToolbar() {
  const searchInput = document.getElementById('admin-search-input');
  const statusSelect = document.getElementById('filter-status');
  const vehicleSelect = document.getElementById('filter-vehicle');
  const resetBtn = document.getElementById('btn-reset-filters');

  searchInput?.addEventListener('input', (e) => {
    activeSearch = e.target.value;
    renderInquiriesTable();
  });

  statusSelect?.addEventListener('change', (e) => {
    activeStatusFilter = e.target.value;
    renderInquiriesTable();
  });

  vehicleSelect?.addEventListener('change', (e) => {
    activeVehicleFilter = e.target.value;
    renderInquiriesTable();
  });

  resetBtn?.addEventListener('click', resetFilters);
}

function resetFilters() {
  activeSearch = '';
  activeStatusFilter = 'all';
  activeVehicleFilter = 'all';

  const searchInput = document.getElementById('admin-search-input');
  const statusSelect = document.getElementById('filter-status');
  const vehicleSelect = document.getElementById('filter-vehicle');

  if (searchInput) searchInput.value = '';
  if (statusSelect) statusSelect.value = 'all';
  if (vehicleSelect) vehicleSelect.value = 'all';

  renderInquiriesTable();
}

/**
 * Open Booking Dossier Modal
 */
function openDossierModal(bookingRef) {
  const item = allInquiries.find(i => i.bookingRef === bookingRef);
  if (!item) return;

  currentSelectedBookingRef = bookingRef;

  const modal = document.getElementById('booking-dossier-modal');
  const refTag = document.getElementById('dossier-ref-tag');
  const title = document.getElementById('dossier-traveler-title');
  const content = document.getElementById('dossier-content');
  const waBtn = document.getElementById('btn-whatsapp-traveler');
  const deleteBtn = document.getElementById('btn-delete-inquiry');
  const printBtn = document.getElementById('btn-print-voucher');

  if (refTag) refTag.innerHTML = `<i class="fas fa-ticket-alt text-gold"></i> ${item.bookingRef}`;
  if (title) title.textContent = `${item.customerName} (${item.customerCountry || 'International Traveler'})`;

  if (content) {
    content.innerHTML = `
      <div class="dossier-grid">
        <!-- Traveler Card -->
        <div class="dossier-box">
          <h4 style="color: var(--primary-emerald); margin-bottom: 12px; font-size: 0.95rem;">
            <i class="fas fa-user text-gold"></i> Traveler Profile
          </h4>
          <div class="dossier-info-row"><span>Name:</span> <strong>${item.customerName}</strong></div>
          <div class="dossier-info-row"><span>Email:</span> <a href="mailto:${item.customerEmail}" style="color: var(--accent-gold); text-decoration: underline;">${item.customerEmail}</a></div>
          <div class="dossier-info-row"><span>WhatsApp/Phone:</span> <strong>${item.customerPhone || 'Not Specified'}</strong></div>
          <div class="dossier-info-row"><span>Country:</span> <strong>${item.customerCountry || 'Not Specified'}</strong></div>
          <div class="dossier-info-row"><span>Logged Date:</span> <span>${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}</span></div>
        </div>

        <!-- Tour & Vehicle Card -->
        <div class="dossier-box">
          <h4 style="color: var(--primary-emerald); margin-bottom: 12px; font-size: 0.95rem;">
            <i class="fas fa-car-side text-gold"></i> Tour & Fleet Allocation
          </h4>
          <div class="dossier-info-row"><span>Travel Dates:</span> <strong>${item.travelDates}</strong></div>
          <div class="dossier-info-row"><span>Party Count:</span> <strong>${item.passengers}</strong></div>
          <div class="dossier-info-row"><span>Vehicle Class:</span> <strong>${item.vehicle}</strong></div>
          <div class="dossier-info-row"><span>Tour Preference:</span> <strong>${item.package}</strong></div>
          <div class="dossier-info-row"><span>Estimated Rate:</span> <strong style="color: var(--primary-emerald); font-size: 1.1rem;">${item.convertedTotal || '$' + item.estimatedTotalUSD}</strong></div>
        </div>
      </div>

      <!-- Special Notes -->
      <div class="dossier-box" style="margin-top: 14px;">
        <h4 style="color: var(--primary-emerald); margin-bottom: 8px; font-size: 0.95rem;">
          <i class="fas fa-sticky-note text-gold"></i> Traveler Route Requests & Notes
        </h4>
        <p style="font-size: 0.9rem; color: var(--text-dark); background: var(--bg-sand); padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-gold);">
          ${item.notes || 'No special requests submitted.'}
        </p>
      </div>

      <!-- Operational Management Controls -->
      <div class="dossier-box" style="margin-top: 14px; background: #f8fafc;">
        <h4 style="color: var(--primary-emerald); margin-bottom: 12px; font-size: 0.95rem;">
          <i class="fas fa-sliders-h text-gold"></i> Reservation Management & Driver Allocation
        </h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--primary-emerald); display: block; margin-bottom: 4px;">
              Update Booking Status:
            </label>
            <select id="modal-status-select" class="form-control" onchange="updateBookingStatus('${item.bookingRef}', this.value)">
              <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending Review</option>
              <option value="Confirmed & Logged" ${item.status === 'Confirmed & Logged' ? 'selected' : ''}>Confirmed & Logged</option>
              <option value="Contacted" ${item.status === 'Contacted' ? 'selected' : ''}>Contacted via WhatsApp</option>
              <option value="Confirmed" ${item.status === 'Confirmed' ? 'selected' : ''}>Confirmed & Driver Assigned</option>
              <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed Tour</option>
              <option value="Cancelled" ${item.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: var(--primary-emerald); display: block; margin-bottom: 4px;">
              Assign Chauffeur-Guide:
            </label>
            <select id="modal-driver-select" class="form-control" onchange="updateAssignedDriver('${item.bookingRef}', this.value)">
              ${CHAUFFEUR_ROSTER.map(d => `
                <option value="${d.id}" ${item.assignedDriver === d.id ? 'selected' : ''}>${d.name}</option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>
    `;
  }

  if (waBtn) {
    waBtn.onclick = () => {
      directWhatsAppChat(item.bookingRef);
    };
  }

  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (confirm(`Are you sure you want to permanently delete inquiry ${item.bookingRef}?`)) {
        deleteInquiry(item.bookingRef);
        closeDossierModal();
      }
    };
  }

  if (printBtn) {
    printBtn.onclick = () => {
      printDispatchVoucher(item);
    };
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDossierModal() {
  const modal = document.getElementById('booking-dossier-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  currentSelectedBookingRef = null;
}

/**
 * Update booking status and persist
 */
function updateBookingStatus(bookingRef, newStatus) {
  const item = allInquiries.find(i => i.bookingRef === bookingRef);
  if (item) {
    item.status = newStatus;
    saveInquiries();
    updateKpis();
    renderInquiriesTable();
  }
}

/**
 * Update assigned driver and persist
 */
function updateAssignedDriver(bookingRef, driverId) {
  const item = allInquiries.find(i => i.bookingRef === bookingRef);
  if (item) {
    item.assignedDriver = driverId;
    saveInquiries();
    renderInquiriesTable();
  }
}

/**
 * Delete inquiry record
 */
function deleteInquiry(bookingRef) {
  allInquiries = allInquiries.filter(i => i.bookingRef !== bookingRef);
  saveInquiries();
  updateKpis();
  renderInquiriesTable();
}

/**
 * Launch WhatsApp direct message to the traveler
 */
function directWhatsAppChat(bookingRef) {
  const item = allInquiries.find(i => i.bookingRef === bookingRef);
  if (!item) return;

  const targetPhone = (item.customerPhone || '').replace(/[^0-9]/g, '');
  const assignedDriverObj = CHAUFFEUR_ROSTER.find(d => d.id === item.assignedDriver);
  const driverText = assignedDriverObj && assignedDriverObj.id !== 'unassigned' ? `Assigned Chauffeur: ${assignedDriverObj.name}` : 'A licensed private driver-guide is being allocated for your tour.';

  const message = `Dear ${item.customerName},
Warm greetings from Ceylon Chauffeurs Sri Lanka! 🇱🇰

We have reviewed your tour inquiry [Ref #${item.bookingRef}] for:
• Dates: ${item.travelDates}
• Party: ${item.passengers}
• Vehicle: ${item.vehicle}
• Itinerary: ${item.package}
• Rate: ${item.convertedTotal || '$' + item.estimatedTotalUSD} (100% All-inclusive of fuel, highway tolls & driver lodging)

${driverText}

Would you like us to send through your personalized day-by-day itinerary proposal or discuss any route adjustments?`;

  const phoneToUse = targetPhone.length >= 8 ? targetPhone : window.CEYLON_CHAUFFEUR_CONFIG.phone;
  const url = `https://wa.me/${phoneToUse}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

/**
 * Print clean Chauffeur Dispatch Voucher
 */
function printDispatchVoucher(item) {
  const assignedDriverObj = CHAUFFEUR_ROSTER.find(d => d.id === item.assignedDriver);
  const driverName = assignedDriverObj ? assignedDriverObj.name : 'Unassigned';

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Chauffeur Dispatch Voucher - ${item.bookingRef}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #111; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #092c23; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #092c23; font-size: 24px; font-weight: bold; margin: 0; }
        .ref-badge { background: #fef3c7; border: 1px solid #d4af37; padding: 6px 14px; font-weight: bold; }
        .section { margin-bottom: 24px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">CEYLON CHAUFFEURS</div>
          <small>Official Chauffeur Dispatch & Tour Voucher</small>
        </div>
        <div class="ref-badge">Booking Ref: ${item.bookingRef}</div>
      </div>

      <div class="grid">
        <div class="box">
          <h3 style="margin-top:0; color:#092c23;">Traveler Information</h3>
          <div class="row"><span>Lead Passenger:</span> <strong>${item.customerName}</strong></div>
          <div class="row"><span>Email:</span> <span>${item.customerEmail}</span></div>
          <div class="row"><span>Phone:</span> <strong>${item.customerPhone}</strong></div>
          <div class="row"><span>Country of Origin:</span> <span>${item.customerCountry}</span></div>
          <div class="row"><span>Party Size:</span> <strong>${item.passengers}</strong></div>
        </div>

        <div class="box">
          <h3 style="margin-top:0; color:#092c23;">Chauffeur & Fleet Assignment</h3>
          <div class="row"><span>Vehicle Class:</span> <strong>${item.vehicle}</strong></div>
          <div class="row"><span>Travel Dates:</span> <strong>${item.travelDates}</strong></div>
          <div class="row"><span>Itinerary:</span> <span>${item.package}</span></div>
          <div class="row"><span>Assigned Driver:</span> <strong>${driverName}</strong></div>
          <div class="row"><span>Total All-Inclusive Rate:</span> <strong>${item.convertedTotal || '$' + item.estimatedTotalUSD}</strong></div>
        </div>
      </div>

      <div class="box section">
        <h4 style="margin-top:0; color:#092c23;">Special Itinerary Instructions & Notes</h4>
        <p style="margin:0; font-size:14px;">${item.notes || 'Standard executive tour procedure. Inclusions: fuel, tolls, parking, and driver lodging 100% covered.'}</p>
      </div>

      <div class="footer">
        Ceylon Chauffeurs • SLTDA Certified Luxury Tours • Colombo & Airport Operations • bookings@ceylonchauffeur.com
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

/**
 * Export all inquiries to CSV for Excel / Google Sheets
 */
function initExportCsvButton() {
  const btn = document.getElementById('btn-export-csv');
  btn?.addEventListener('click', () => {
    if (allInquiries.length === 0) {
      alert('No inquiries to export.');
      return;
    }

    const headers = [
      'BookingRef', 'Timestamp', 'CustomerName', 'CustomerEmail', 'CustomerPhone',
      'Country', 'TravelDates', 'Days', 'Passengers', 'Vehicle', 'Package',
      'RateUSD', 'Status', 'AssignedDriver', 'Notes'
    ];

    const rows = allInquiries.map(item => [
      `"${item.bookingRef || ''}"`,
      `"${item.timestamp || ''}"`,
      `"${(item.customerName || '').replace(/"/g, '""')}"`,
      `"${item.customerEmail || ''}"`,
      `"${item.customerPhone || ''}"`,
      `"${item.customerCountry || ''}"`,
      `"${item.travelDates || ''}"`,
      `"${item.daysCount || ''}"`,
      `"${item.passengers || ''}"`,
      `"${(item.vehicle || '').replace(/"/g, '""')}"`,
      `"${(item.package || '').replace(/"/g, '""')}"`,
      `"${item.estimatedTotalUSD || ''}"`,
      `"${item.status || ''}"`,
      `"${item.assignedDriver || ''}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ceylon_Chauffeurs_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}


// Window globals
window.openDossierModal = openDossierModal;
window.closeDossierModal = closeDossierModal;
window.updateBookingStatus = updateBookingStatus;
window.updateAssignedDriver = updateAssignedDriver;
window.directWhatsAppChat = directWhatsAppChat;
window.resetFilters = resetFilters;
