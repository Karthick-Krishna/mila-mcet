/**
 * DR. MCET INCUBATION CENTER & MILA CLUB (CIBIE)
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
  const startupGrid = document.getElementById('startup-grid');
  const searchInput = document.getElementById('startup-search');
  const filterBtns = document.querySelectorAll('.filter-tab-btn[data-category]');

  const dataset = window.MCET_DATA || window.TBI_DATA;
  if (!startupGrid || !dataset || !dataset.startups) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function renderStartups() {
    const list = dataset.startups.filter(s => {
      const matchCat = activeCategory === 'all' || 
        s.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
        s.sector.toLowerCase().includes(activeCategory.toLowerCase());
      const matchSearch = searchTerm === '' || 
        s.name.toLowerCase().includes(searchTerm) || 
        s.sector.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm) ||
        s.founders.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    if (list.length === 0) {
      startupGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>No ventures matching your query</h3>
          <p class="text-muted">Try adjusting your keywords or category filters for Dr. MCET startups.</p>
        </div>
      `;
      return;
    }

    startupGrid.innerHTML = list.map(s => `
      <div class="glass-card startup-card">
        <div>
          <div class="startup-header">
            <img src="${s.image}" alt="${s.name}" class="startup-avatar" onerror="this.src='https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&auto=format&fit=crop&q=80'">
            <div class="startup-info">
              <h4>${s.name}</h4>
              <span class="startup-category-tag">${s.sector}</span>
            </div>
          </div>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            ${s.description}
          </p>
        </div>
        <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border);">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.84rem; color: var(--text-muted); margin-bottom: 0.75rem; flex-wrap:wrap; gap:0.5rem;">
            <span><i class="fas fa-user-tie text-orange"></i> ${s.founders}</span>
            <span class="badge-pill badge-outline" style="font-size: 0.75rem; font-weight:700;">${s.stage}</span>
          </div>
          ${s.grant ? `<div class="startup-grant-tag"><i class="fas fa-award text-orange"></i> ${s.grant}</div>` : ''}
        </div>
      </div>
    `).join('');
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
    showToast('Success! Your facility slot request has been submitted to Dr. MCET CIBIE / MILA lab managers.', 'success');
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
    showToast('Thank you! Your message has been sent to Dr. MCET CIBIE / MILA Incubation Office, Pollachi.', 'success');
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
