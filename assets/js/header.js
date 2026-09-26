/**
 * DR. MCET INCUBATION CENTER & MILA CLUB (EIC)
 * Standardized Global Header Component (Top Branding Header + Navigation Bar + Dropdowns + Mobile Drawer)
 * 
 * Editing this file automatically updates the header, navigation, and drawer across all pages!
 */

(function () {
  const navStructure = [
    { href: 'index.html', label: 'Home' },
    {
      href: 'about.html',
      label: 'About Us',
      dropdown: [
        { href: 'vision-mission.html', label: 'Vision & Mission', icon: 'fa-bullseye' },
        { href: 'services.html', label: 'Services', icon: 'fa-cubes' },
        { href: 'leadership.html', label: 'Leadership', icon: 'fa-user-tie' },
        { href: 'partners.html', label: 'Partners', icon: 'fa-handshake' },
        { href: 'mentors.html', label: 'Mentors', icon: 'fa-chalkboard-teacher' },
        { href: 'team.html', label: 'Meet The Team', icon: 'fa-users' }
      ]
    },
    {
      href: 'facilities.html',
      label: 'Facilities',
      dropdown: [
        { href: 'facilities.html', label: 'Facilities', icon: 'fa-building' },
        { href: 'workspaces.html', label: 'Workspaces', icon: 'fa-laptop-code' },
        { href: 'makerspace.html', label: 'Makerspace', icon: 'fa-tools' },
        { href: 'meeting-rooms.html', label: 'Meeting Rooms', icon: 'fa-door-open' }
      ]
    },
    {
      href: 'initiatives.html',
      label: 'Initiatives',
      dropdown: [
        { href: 'initiatives.html', label: 'All Initiatives', icon: 'fa-lightbulb' },
        { href: 'events.html', label: 'Events', icon: 'fa-calendar-alt' },
        { href: 'funding.html', label: 'Startup Grants', icon: 'fa-coins' },
        { href: 'programs.html', label: 'Incubation Programs', icon: 'fa-layer-group' },
        { href: 'virtual-incubation.html', label: 'Virtual Incubation', icon: 'fa-globe' },
        { href: 'students-incubation.html', label: 'Students Incubation', icon: 'fa-user-graduate' },
        { href: 'womens-incubation.html', label: "Women's Incubation", icon: 'fa-female' },
        { href: 'startup-kits.html', label: 'Startup Kits', icon: 'fa-box-open' }
      ]
    },
    {
      href: 'startups.html',
      label: 'Startups',
      dropdown: [
        { href: 'startups.html', label: 'Pre Incubation Startups', icon: 'fa-rocket' },
        { href: 'incubation.html', label: 'Incubation Startups', icon: 'fa-building' }
      ]
    },
    { href: 'gallery.html', label: 'Gallery' },
    {
      href: 'ebooks-policies.html',
      label: 'Info Hub',
      dropdown: [
        { href: 'announcements.html', label: 'Announcements', icon: 'fa-bullhorn' },
        { href: 'ebooks-policies.html', label: 'e-Books & Policies', icon: 'fa-book' },
        { href: 'newsletter.html', label: 'News Letter', icon: 'fa-newspaper' }
      ]
    },
    {
      href: 'apply.html',
      label: 'Join Us',
      dropdown: [
        { href: 'apply.html', label: 'Become an Incubatee', icon: 'fa-user-plus' },
        { href: 'become-a-mentor.html', label: 'Become a Mentor', icon: 'fa-hands-helping' },
        { href: 'csr.html', label: 'CSR Partnerships', icon: 'fa-building' }
      ]
    },
    { href: 'contact.html', label: 'Contact' },
    { href: 'feedback.html', label: 'Feedback' }
  ];

  function isItemActive(item, currentPage) {
    if (currentPage === item.href) return true;
    if (currentPage === '' && item.href === 'index.html') return true;
    if (item.dropdown) {
      return item.dropdown.some(sub => sub.href === currentPage);
    }
    return false;
  }

  function buildHeaderHTML(currentPage) {
    const desktopLinks = navStructure.map(item => {
      const active = isItemActive(item, currentPage);
      const activeClass = active ? ' active' : '';

      if (item.dropdown && item.dropdown.length) {
        const subItems = item.dropdown.map(sub => {
          const subActive = (currentPage === sub.href) ? ' active' : '';
          return `<li><a href="${sub.href}" class="dropdown-link${subActive}">${sub.label}</a></li>`;
        }).join('');

        return `
          <li class="nav-item has-dropdown">
            <a href="${item.href}" class="nav-link${activeClass}">${item.label} <i class="fas fa-chevron-down nav-chevron"></i></a>
            <ul class="nav-dropdown-menu">
              ${subItems}
            </ul>
          </li>`;
      } else {
        return `
          <li class="nav-item">
            <a href="${item.href}" class="nav-link${activeClass}">${item.label}</a>
          </li>`;
      }
    }).join('');

    const mobileLinks = navStructure.map(item => {
      const active = isItemActive(item, currentPage);
      const activeClass = active ? ' active' : '';

      if (item.dropdown && item.dropdown.length) {
        const subItems = item.dropdown.map(sub => {
          const subActive = (currentPage === sub.href) ? ' active' : '';
          return `<li><a href="${sub.href}" class="mobile-sub-link${subActive}">${sub.label}</a></li>`;
        }).join('');

        return `
          <li class="mobile-nav-item has-dropdown">
            <div class="mobile-nav-row">
              <a href="${item.href}" class="mobile-nav-link${activeClass}">${item.label}</a>
              <button class="mobile-submenu-toggle" aria-label="Toggle submenu"><i class="fas fa-chevron-down"></i></button>
            </div>
            <ul class="mobile-sub-menu">
              ${subItems}
            </ul>
          </li>`;
      } else {
        return `
          <li class="mobile-nav-item">
            <a href="${item.href}" class="mobile-nav-link${activeClass}">${item.label}</a>
          </li>`;
      }
    }).join('');

    return `
  <!-- Top Institutional Branding Header -->
  <div class="top-header-wrap">
    <div class="container top-header-container">
      <div class="top-header-left">
        <a href="index.html" class="top-brand-link" aria-label="MILA - Dr. MCET Incubation Center">
          <img decoding="async" src="assets/images/mila_logo.png" alt="MILA MCET Incubation and Innovation Launchpad Association" class="mila-top-logo">
        </a>
      </div>
      <div class="top-header-right">
        <div class="top-partner-logos">
          <a href="https://startuptn.in" target="_blank" rel="noopener noreferrer" class="top-brand-link" title="StartupTN (Government of Tamil Nadu)">
            <img decoding="async" src="assets/images/startuptn_logo.png" alt="StartupTN Logo" class="startuptn-top-logo">
          </a>
          <a href="https://editn.in" target="_blank" rel="noopener noreferrer" class="top-brand-link" title="EDII-TN">
            <img decoding="async" src="assets/images/ediitn_logo.png" alt="EDII-TN Logo" class="ediitn-top-logo">
          </a>
          <a href="https://msme.gov.in" target="_blank" rel="noopener noreferrer" class="top-brand-link" title="Ministry of MSME">
            <img decoding="async" src="assets/images/msme_logo.png" alt="MSME Logo" class="msme-top-logo">
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Primary Navigation Bar -->
  <header class="tbi-navbar">
    <div class="container nav-container">
      <nav>
        <ul class="nav-menu">
          ${desktopLinks}
        </ul>
      </nav>

      <div class="nav-actions">
        <button class="mobile-toggle" aria-label="Toggle navigation">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer Navigation -->
  <div class="drawer-backdrop"></div>
  <div class="mobile-drawer">
    <div class="mobile-drawer-header">
      <div class="nav-brand" style="display:flex; align-items:center; gap:0.6rem;">
        <img loading="lazy" decoding="async" src="assets/images/mila_logo.png" alt="MILA Logo" style="height:36px; width:auto;">
        <span style="font-weight:800; font-size:1rem; color:var(--text); letter-spacing:-0.02em;">DR. MCET <span style="color:var(--accent);">MILA</span></span>
      </div>
      <button class="mobile-drawer-close" aria-label="Close menu">&times;</button>
    </div>
    <ul class="mobile-nav-list">
      ${mobileLinks}
    </ul>
    <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border);">
      <a href="apply.html" class="btn btn-primary" style="width:100%; justify-content:center;">
        <i class="fas fa-rocket"></i> Apply for Incubation
      </a>
    </div>
  </div>`;
  }

  function setupMobileSubmenus() {
    const toggles = document.querySelectorAll('.mobile-submenu-toggle');
    toggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = btn.closest('.mobile-nav-item');
        if (parent) {
          parent.classList.toggle('open');
        }
      });
    });
  }

  function renderStandardHeader() {
    const container = document.getElementById('global-header');
    if (!container) return;

    let path = window.location.pathname.split('/').pop() || 'index.html';
    if (!path.endsWith('.html')) path = 'index.html';

    container.innerHTML = buildHeaderHTML(path);
    setupMobileSubmenus();

    // Re-initialize navbar & mobile drawer from main.js if present
    if (typeof window.initNavbar === 'function') window.initNavbar();
    if (typeof window.initMobileDrawer === 'function') window.initMobileDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderStandardHeader);
  } else {
    renderStandardHeader();
  }
})();
