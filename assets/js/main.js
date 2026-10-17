/**
 * DR. MCET INCUBATION CENTER & MILA (EIC)
 * Dr. Mahalingam College of Engineering and Technology, Pollachi
 * Core Interactive Scripts & Utilities
 */

window.initNavbar = initNavbar;
window.initMobileDrawer = initMobileDrawer;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initStatsCounter();
  initStartupDirectory();
  initEventsDirectory();
  initFacilityModals();
  initApplicationWizard();
  initGalleryFilter();
  initContactForm();
});

/* 1. Navbar Active Link & Scroll Effects */
function initNavbar() {
  const navbar = document.querySelector('.tbi-navbar');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active page link
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Sticky navbar shadow on scroll (GPU-optimized with RAF)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          navbar?.classList.add('scrolled');
        } else {
          navbar?.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* 2. Mobile Drawer Navigation */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  function openDrawer() {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
}

/* 3. Animated Statistics Counter */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  function triggerStat(el) {
    const targetStr = el.getAttribute('data-target');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    
    if (targetStr) {
      if (targetStr.includes('.')) {
        const targetVal = parseFloat(targetStr);
        animateFloatCount(el, targetVal, prefix, suffix);
      } else {
        const targetVal = parseInt(targetStr, 10);
        animateIntCount(el, targetVal, prefix, suffix);
      }
    }
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerStat(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  stats.forEach(stat => {
    const t = stat.getAttribute('data-target');
    const p = stat.getAttribute('data-prefix') || '';
    const s = stat.getAttribute('data-suffix') || '';
    stat.textContent = `${p}${t}${s}`;
    observer.observe(stat);
  });
}

function animateIntCount(el, target, prefix, suffix) {
  let start = 0;
  const duration = 1400;
  const steps = 30;
  const increment = target / steps;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    start += increment;
    if (currentStep >= steps || start >= target) {
      el.textContent = `${prefix}${target}${suffix}`;
      clearInterval(timer);
    } else {
      el.textContent = `${prefix}${Math.floor(start)}${suffix}`;
    }
  }, duration / steps);
}

function animateFloatCount(el, target, prefix, suffix) {
  let start = 0.0;
  const duration = 1400;
  const steps = 30;
  const increment = target / steps;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    start += increment;
    if (currentStep >= steps || start >= target) {
      el.textContent = `${prefix}${target.toFixed(1)}${suffix}`;
      clearInterval(timer);
    } else {
      el.textContent = `${prefix}${start.toFixed(1)}${suffix}`;
    }
  }, duration / steps);
}

/* 4. Startup Directory Search & Filter */
function initStartupDirectory() {
  const startupCardsView = document.getElementById('startup-cards-view') || document.getElementById('startup-grid');
  const searchInput = document.getElementById('startup-search');
  const filterBtns = document.querySelectorAll('.filter-tab-btn[data-category]');

  const dataset = window.MCET_DATA || window.TBI_DATA;
  if (!startupCardsView || !dataset || !dataset.startups) return;

  let activeCategory = 'all';
  let searchTerm = '';

  // Brand Colors for each Startup Monogram & Accents
  const brandColorMap = {
    'Trolleywise': '#16a34a',
    'Coralgenz Global': '#0284c7',
    'AERONIXA': '#0284c7',
    'Intellicane systems': '#be123c',
    'Unuman Corps': '#18181b',
    'Safoura': '#1e3932',
    'Micro Renewables': '#b45309',
    'Vita Wing': '#0284c7',
    'TheAtpass': '#0f2b5c',
    'ReArm Technologies': '#0f2942',
    'Vhelan Technologies': '#0284c7',
    'VOLTERRA TECHNOLOGIES': '#065f46',
    'Novexa Technology': '#0e2a47',
    'APTRA': '#0f2942',
    'NOTEIT': '#6b21a8',
    'STARKYN TECHNOLOGIES LLP': '#d97706',
    'Madhina Enterprises': '#b91c1c'
  };

  function getBrandColor(name) {
    return brandColorMap[name] || '#374151';
  }

  function getInitials(name) {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  function getFounderInitials(founderName) {
    if (!founderName) return '?';
    const parts = founderName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function renderStartups() {
    const list = dataset.startups.filter(s => {
      let matchCat = activeCategory === 'all';
      if (!matchCat) {
        const cat = activeCategory.toLowerCase();
        const fullText = `${s.name} ${s.sector} ${s.theme} ${s.dept} ${s.category || ''} ${s.grant || ''}`.toLowerCase();
        if (cat === 'agritech') {
          matchCat = fullText.includes('agri') || fullText.includes('clean') || fullText.includes('renewable') || fullText.includes('solar');
        } else if (cat === 'engineering') {
          matchCat = fullText.includes('engineering') || fullText.includes('robot') || fullText.includes('drone') || fullText.includes('electronics') || fullText.includes('mobility') || fullText.includes('hardware') || fullText.includes('avionics');
        } else if (cat === 'software') {
          matchCat = fullText.includes('software') || fullText.includes('it ') || fullText.includes('ai') || fullText.includes('saas') || fullText.includes('edtech') || fullText.includes('cyber');
        } else if (cat === 'grant') {
          matchCat = true;
        } else if (cat === 'student') {
          matchCat = true;
        } else {
          matchCat = fullText.includes(cat);
        }
      }

      const matchSearch = searchTerm === '' || 
        (s.name && s.name.toLowerCase().includes(searchTerm)) || 
        (s.founders && s.founders.toLowerCase().includes(searchTerm)) ||
        (s.dept && s.dept.toLowerCase().includes(searchTerm)) ||
        (s.theme && s.theme.toLowerCase().includes(searchTerm)) ||
        (s.sector && s.sector.toLowerCase().includes(searchTerm));
      return matchCat && matchSearch;
    });

    // Render Corporate Professional Cards
    if (startupCardsView) {
      if (list.length === 0) {
        startupCardsView.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
            <h3 style="font-weight: 700; color: #111827; margin-bottom: 0.5rem;">No ventures found</h3>
            <p style="color: #6b7280; font-size: 0.9rem;">Try adjusting your search or category filters.</p>
          </div>
        `;
      } else {
        startupCardsView.innerHTML = list.map((s, idx) => {
          const brandColor = getBrandColor(s.name);
          const monogram = getInitials(s.name);
          const founderInit = getFounderInitials(s.founders);
          const logoHtml = s.logo
            ? `<div class="startup-brand-logo startup-has-real-logo">
                 <img src="${s.logo}" alt="${s.name} Logo" class="startup-real-logo-img" loading="lazy">
               </div>`
            : `<div class="startup-brand-logo" style="background: ${brandColor};">${monogram}</div>`;
          return `
            <div class="startup-brand-card" style="--card-accent: ${brandColor};">
              <div class="startup-brand-top">
                ${logoHtml}
                <div class="startup-brand-meta">
                  <h3 class="startup-brand-title">${s.name}</h3>
                </div>
              </div>
              <div class="startup-brand-theme-box">
                <div class="startup-brand-label">Theme &amp; Innovation</div>
                <p class="startup-brand-theme-text">${s.theme || ''}</p>
              </div>
              <div class="startup-brand-founder-box">
                <div class="startup-brand-founder-avatar">${founderInit}</div>
                <div class="startup-brand-founder-info">
                  <div class="startup-brand-founder-label">Student Founder</div>
                  <div class="startup-brand-founder-name">${s.founders || ''}</div>
                  <div class="startup-brand-founder-dept">${s.dept || ''}</div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderStartups();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    renderStartups();
  });

  renderStartups();
}

/* 4b. Events, Hackathons & Workshops Showcase with Interactive Detail Modal & Fullscreen Lightbox */
function initEventsDirectory() {
  const eventsGrid = document.getElementById('events-showcase-grid');
  const searchInput = document.getElementById('event-search');
  const filterBtns = document.querySelectorAll('.event-filter-tab-btn[data-category]');

  // Event Detail Modal Elements
  const modal = document.getElementById('event-detail-modal');
  const modalCloseBtn = document.getElementById('close-event-modal');
  const modalSlideImg = document.getElementById('event-modal-slide-img');
  const modalImgCaption = document.getElementById('event-modal-img-caption');
  const modalThumbBar = document.getElementById('event-modal-thumb-bar');
  const modalZoomTrigger = document.getElementById('event-modal-zoom-trigger');
  const modalTitle = document.getElementById('event-modal-title');
  const modalDate = document.getElementById('event-modal-date');
  const modalVenue = document.getElementById('event-modal-venue');
  const modalCat = document.getElementById('event-modal-cat');
  const modalOrg = document.getElementById('event-modal-org');
  const modalChiefGuest = document.getElementById('event-modal-chief-guest');
  const modalGuestOrg = document.getElementById('event-modal-guest-org');
  const modalParticipants = document.getElementById('event-modal-participants');
  const modalDept = document.getElementById('event-modal-dept');
  const modalOrganizer = document.getElementById('event-modal-organizer');

  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('image-lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxMainImg = document.getElementById('lightbox-main-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  const dataset = window.MCET_DATA || window.TBI_DATA;
  if (!eventsGrid || !dataset || !dataset.events) return;

  let activeCategory = 'all';
  let searchTerm = '';
  let activeEventGallery = [];
  let currentImageIndex = 0;

  // --- Lightbox Functions ---
  function openLightbox(index = 0) {
    if (!lightboxModal || !activeEventGallery.length) return;
    currentImageIndex = (index + activeEventGallery.length) % activeEventGallery.length;
    const currentItem = activeEventGallery[currentImageIndex];
    if (lightboxMainImg) lightboxMainImg.src = currentItem.url;
    if (lightboxCaption) lightboxCaption.textContent = currentItem.title || 'Event Visual Record';
    
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    lightboxModal?.classList.remove('active');
  }

  function showNextImage() {
    openLightbox(currentImageIndex + 1);
  }

  function showPrevImage() {
    openLightbox(currentImageIndex - 1);
  }

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  lightboxNextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
  lightboxPrevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  // --- Modal Functions ---
  function setActiveModalImage(index) {
    if (!activeEventGallery.length) return;
    currentImageIndex = index;
    const item = activeEventGallery[index];
    if (modalSlideImg) modalSlideImg.src = item.url;
    if (modalImgCaption) modalImgCaption.textContent = item.title;

    // Update active thumb button
    const thumbBtns = modalThumbBar?.querySelectorAll('.event-modal-thumb-btn');
    thumbBtns?.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });
  }

  function openEventModal(eventObj) {
    if (!modal) return;

    // Build Gallery Array
    activeEventGallery = [];
    if (eventObj.slideImage) {
      activeEventGallery.push({ url: eventObj.slideImage, title: 'Complete Presentation Slide & Record' });
    }
    if (eventObj.photoImage) {
      activeEventGallery.push({ url: eventObj.photoImage, title: 'Live Event Photography' });
    }
    if (eventObj.posterImage) {
      activeEventGallery.push({ url: eventObj.posterImage, title: 'Official Event Poster & Pamphlet' });
    }
    if (eventObj.galleryImage) {
      activeEventGallery.push({ url: eventObj.galleryImage, title: 'Award & Valedictory Collage' });
    }
    if (activeEventGallery.length === 0 && eventObj.image) {
      activeEventGallery.push({ url: eventObj.image, title: eventObj.title });
    }

    currentImageIndex = 0;
    setActiveModalImage(0);

    // Build Thumbnails in modal
    if (modalThumbBar) {
      modalThumbBar.innerHTML = activeEventGallery.map((item, idx) => `
        <button type="button" class="event-modal-thumb-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <img src="${item.url}" alt="${item.title}" loading="lazy">
          <span class="thumb-label">${item.title.split(' ')[0]} ${item.title.split(' ')[1] || ''}</span>
        </button>
      `).join('');

      const thumbBtns = modalThumbBar.querySelectorAll('.event-modal-thumb-btn');
      thumbBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          setActiveModalImage(idx);
        });
      });
    }

    // Set textual details
    if (modalTitle) modalTitle.textContent = eventObj.title;
    if (modalDate) modalDate.textContent = eventObj.date;
    if (modalCat) modalCat.textContent = eventObj.category || 'MILA Program';
    if (modalOrg) modalOrg.textContent = eventObj.organizer || 'CIBIE-MCET & EIC';
    if (modalChiefGuest) modalChiefGuest.textContent = eventObj.chiefGuest || 'Distinguished Guests';
    if (modalGuestOrg) modalGuestOrg.textContent = eventObj.guestOrg || 'Partner Ecosystem';
    if (modalVenue) modalVenue.textContent = eventObj.venue || 'Dr. MCET Campus, Pollachi';
    if (modalParticipants) modalParticipants.textContent = eventObj.participants || 'Registered Participants';
    if (modalDept) modalDept.textContent = eventObj.department || 'Students & Faculty';
    if (modalOrganizer) modalOrganizer.textContent = eventObj.organizer || 'MILA & EIC';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Click on main modal image triggers Lightbox
  modalZoomTrigger?.addEventListener('click', () => {
    openLightbox(currentImageIndex);
  });

  function closeEventModal() {
    modal?.classList.remove('active');
    closeLightbox();
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeEventModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeEventModal();
  });

  // Global Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (lightboxModal?.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    } else if (modal?.classList.contains('active')) {
      if (e.key === 'Escape') closeEventModal();
    }
  });

  function parseEventDate(dateStr) {
    if (!dateStr) return 0;
    const firstPart = dateStr.split('&')[0].trim();
    const parts = firstPart.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day).getTime();
    }
    return 0;
  }

  function renderEvents() {
    let list = dataset.events.filter(ev => {
      const matchSearch = searchTerm === '' ||
        (ev.title && ev.title.toLowerCase().includes(searchTerm)) ||
        (ev.chiefGuest && ev.chiefGuest.toLowerCase().includes(searchTerm)) ||
        (ev.venue && ev.venue.toLowerCase().includes(searchTerm)) ||
        (ev.date && ev.date.toLowerCase().includes(searchTerm)) ||
        (ev.department && ev.department.toLowerCase().includes(searchTerm)) ||
        (ev.category && ev.category.toLowerCase().includes(searchTerm));

      return matchSearch;
    });

    // Ensure strict New-to-Old chronological sorting
    list.sort((a, b) => parseEventDate(b.date) - parseEventDate(a.date));

    if (list.length === 0) {
      eventsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <h3 style="font-weight: 700; color: #111827; margin-bottom: 0.5rem;">No events found</h3>
          <p style="color: #6b7280; font-size: 0.9rem;">Try adjusting your search query.</p>
        </div>
      `;
    } else {
      eventsGrid.innerHTML = list.map((ev, idx) => `
        <div class="event-card" data-event-id="${ev.id || idx}">
          <div class="event-card-img-wrap">
            <img src="${ev.image}" alt="${ev.title}" loading="lazy">
            <span class="event-card-date-badge"><i class="far fa-calendar-alt"></i> ${ev.date}</span>
          </div>
          <div class="event-card-body">
            <h3 class="event-card-title">${ev.title}</h3>
            <div class="event-card-meta-row">
              <span class="event-card-participants"><i class="fas fa-users"></i> ${ev.participants || 'Participants'}</span>
              <span class="event-card-action-btn">View Details <i class="fas fa-arrow-right"></i></span>
            </div>
          </div>
        </div>
      `).join('');

      // Add click listeners to cards
      const cards = eventsGrid.querySelectorAll('.event-card');
      cards.forEach((card, i) => {
        card.addEventListener('click', () => {
          openEventModal(list[i]);
        });
      });
    }
  }

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    renderEvents();
  });

  renderEvents();
}

/* 5. Facility Booking Modal & Modals */
function initFacilityModals() {
  const modal = document.getElementById('facility-modal');
  const closeBtn = document.getElementById('close-facility-modal');
  const form = document.getElementById('facility-booking-form');
  const openBtns = document.querySelectorAll('.open-facility-modal-btn');
  const labNameInput = document.getElementById('facility-lab-name');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const labName = btn.getAttribute('data-lab') || 'AICTE IDEA Lab / C-DAT Center';
      if (labNameInput) labNameInput.value = labName;
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Success! Your facility slot request has been submitted to Dr. MCET EIC / MILA lab managers.', 'success');
    closeModal();
    form.reset();
  });
}

/* 6. Multi-Step Interactive Application Wizard */
function initApplicationWizard() {
  const wizardForm = document.getElementById('incubator-application-form');
  if (!wizardForm) return;

  let currentStep = 1;
  const totalSteps = 4;

  const nextBtn = document.getElementById('wizard-next-btn');
  const prevBtn = document.getElementById('wizard-prev-btn');
  const submitBtn = document.getElementById('wizard-submit-btn');

  function updateWizardUI() {
    for (let i = 1; i <= totalSteps; i++) {
      const stepPanel = document.getElementById(`step-panel-${i}`);
      const stepIndicator = document.getElementById(`step-indicator-${i}`);
      
      if (stepPanel) {
        stepPanel.style.display = i === currentStep ? 'block' : 'none';
      }
      
      if (stepIndicator) {
        if (i < currentStep) {
          stepIndicator.classList.add('completed');
          stepIndicator.classList.remove('active');
        } else if (i === currentStep) {
          stepIndicator.classList.add('active');
          stepIndicator.classList.remove('completed');
        } else {
          stepIndicator.classList.remove('active', 'completed');
        }
      }
    }

    if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'inline-flex' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

    calculateReadinessScore();
  }

  function validateStep(step) {
    const panel = document.getElementById(`step-panel-${step}`);
    if (!panel) return true;
    const requiredInputs = panel.querySelectorAll('[required]');
    for (let input of requiredInputs) {
      if (!input.value.trim()) {
        input.focus();
        showToast(`Please fill out required field: ${input.previousElementSibling?.textContent || 'all fields'}`, 'warning');
        return false;
      }
    }
    return true;
  }

  nextBtn?.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep = Math.min(currentStep + 1, totalSteps);
      updateWizardUI();
      window.scrollTo({ top: wizardForm.offsetTop - 100, behavior: 'smooth' });
    }
  });

  prevBtn?.addEventListener('click', () => {
    currentStep = Math.max(currentStep - 1, 1);
    updateWizardUI();
    window.scrollTo({ top: wizardForm.offsetTop - 100, behavior: 'smooth' });
  });

  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const startupName = document.getElementById('startup-name')?.value || 'Innovator Venture';
    const founderName = document.getElementById('founder-name')?.value || 'Founder';
    const appId = 'MCET-MILA-' + Math.floor(100000 + Math.random() * 900000);

    const successBox = document.getElementById('wizard-success-box');
    if (successBox) {
      document.getElementById('display-app-id').textContent = appId;
      document.getElementById('display-founder-name').textContent = founderName;
      document.getElementById('display-startup-name').textContent = startupName;
      
      document.getElementById('wizard-form-container').style.display = 'none';
      successBox.style.display = 'block';
    }

    showToast(`MILA Application ${appId} submitted successfully!`, 'success');
  });

  function calculateReadinessScore() {
    const stage = document.getElementById('startup-stage')?.value;
    const ip = document.getElementById('ip-status')?.value;
    const domain = document.getElementById('startup-domain')?.value;
    let score = 50;

    if (stage === 'Working Prototype' || stage === 'Market Ready') score += 25;
    if (stage === 'Early Revenue') score += 35;
    if (ip === 'Provisional Filed' || ip === 'Granted') score += 15;
    if (domain) score += 5;

    score = Math.min(score, 100);
    const scoreBar = document.getElementById('readiness-score-bar');
    const scoreVal = document.getElementById('readiness-score-val');
    if (scoreBar) scoreBar.style.width = `${score}%`;
    if (scoreVal) scoreVal.textContent = `${score}% Ready`;
  }

  const stageInput = document.getElementById('startup-stage');
  const ipInput = document.getElementById('ip-status');
  stageInput?.addEventListener('change', calculateReadinessScore);
  ipInput?.addEventListener('change', calculateReadinessScore);

  updateWizardUI();
}

/* 7. Gallery Category Filter & Lightbox */
function initGalleryFilter() {
  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  const dataset = window.MCET_DATA || window.TBI_DATA;
  if (!galleryGrid || !dataset || !dataset.events) return;

  function renderGallery(cat = 'all') {
    const events = dataset.events;
    galleryGrid.innerHTML = events.map(ev => `
      <div class="glass-card" style="border-radius: var(--radius-md); overflow: hidden;">
        <div style="height: 220px; overflow: hidden; position: relative;">
          <img src="${ev.image}" alt="${ev.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
          <span class="badge-pill badge-solid" style="position: absolute; bottom: 10px; right: 10px; font-size: 0.75rem;">
            ${ev.date}
          </span>
        </div>
        <div style="padding: 1.25rem;">
          <h4 style="font-size: 1.05rem; line-height: 1.35; margin-bottom: 0.5rem;">${ev.title}</h4>
          <span style="font-size: 0.8rem; color: var(--accent); font-weight: 600;">Dr. MCET MILA Launchpad &bull; Pollachi</span>
        </div>
      </div>
    `).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderGallery(cat);
    });
  });

  renderGallery();
}

/* 8. Contact & Enquiry Form */
function initContactForm() {
  const contactForm = document.getElementById('tbi-contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you! Your message has been sent to Dr. MCET EIC / MILA Incubation Office, Pollachi.', 'success');
    contactForm.reset();
  });
}

/* 9. Global Toast Notifications */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  
  const icon = type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
  const color = type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : 'var(--accent)';

  toast.innerHTML = `
    <i class="fas ${icon}" style="color: ${color}; font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
