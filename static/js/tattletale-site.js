/**
 * Tatle tale Website Polish & Interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenuFix();
    fixNavbarLinks();
});

/**
 * Ensure mobile menu works correctly and closes on link click
 */
function initMobileMenuFix() {
    const overlay = document.getElementById('tt-mobile-menu-overlay');
    if (!overlay) return;

    const navLinks = overlay.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Surgical fix for navbar links if they are still using Wix format
 */
function fixNavbarLinks() {
    const links = document.querySelectorAll('a[data-testid="linkElement"], .wixui-horizontal-menu__item-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Clean up Wix URLs
        if (href.includes('turtle-tales-story')) link.setAttribute('href', '/turtle-tales-story');
        if (href.includes('workshop-chapters')) link.setAttribute('href', '/workshop-chapters');
        if (href.includes('community-survey')) link.setAttribute('href', '/survey');
        if (href.includes('about-lana')) link.setAttribute('href', '/about-lana');
        if (href === '/index.html' || href === 'index.html') link.setAttribute('href', '/');
    });
}


/**
 * Navbar order + font consistency only.
 * Keeps the original layout, but standardizes menu labels/order across pages.
 */
(function () {
  const DESIRED_NAV = [
    { href: '/', label: 'Home' },
    { href: '/turtle-tales-story', label: 'Tatle tale Story' },
    { href: '/workshop-chapters', label: 'Workshops' },
    { href: '/survey', label: 'Community Survey' },
    { href: '/event-booking', label: 'Bookings' },
    { href: '/about-lana', label: 'About Us' },
    { href: '/contact', label: 'Contact' }
  ];

  function normalizeLabel(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function keyForLink(a) {
    const href = (a.getAttribute('href') || '').toLowerCase();
    const text = normalizeLabel(a.textContent);
    if (href === '/' || href.endsWith('/')) return 'home';
    if (href.includes('turtle-tales-story') || text.includes('story')) return 'story';
    if (href.includes('workshop-chapters') || text.includes('workshop')) return 'workshops';
    if (href.includes('survey') || href.includes('community-survey') || text.includes('survey')) return 'survey';
    if (href.includes('event-booking') || href.includes('booking')) return 'bookings';
    if (href.includes('about-lana') || text.includes('about')) return 'about';
    if (href.includes('contact') || text.includes('contact')) return 'contact';
    return null;
  }

  function setLinkLabel(a, label) {
    const labelEl = a.querySelector('[data-part="label"], .wixui-horizontal-menu__item-label');
    if (labelEl) labelEl.textContent = label;
    else a.textContent = label;
  }

  function standardizeNav(nav) {
    const links = Array.from(nav.querySelectorAll('a'))
      .filter(a => keyForLink(a));
    if (links.length < 3) return;

    const map = {};
    links.forEach(a => {
      const key = keyForLink(a);
      if (key && !map[key]) map[key] = a;
    });

    const keyOrder = ['home','story','workshops','survey','bookings','about','contact'];
    const labelByKey = {
      home: 'Home', story: 'Tatle tale Story', workshops: 'Workshops', survey: 'Community Survey',
      bookings: 'Bookings', about: 'About Us', contact: 'Contact'
    };
    const hrefByKey = {
      home: '/', story: '/turtle-tales-story', workshops: '/workshop-chapters', survey: '/survey',
      bookings: '/event-booking', about: '/about-lana', contact: '/contact'
    };

    keyOrder.forEach((key, idx) => {
      let a = map[key];
      if (!a && nav.classList.contains('site-nav')) {
        a = document.createElement('a');
        nav.appendChild(a);
        map[key] = a;
      }
      if (!a) return;
      a.setAttribute('href', hrefByKey[key]);
      setLinkLabel(a, labelByKey[key]);
      const item = a.closest('li') || a.closest('[data-part="menu-item"]') || a;
      if (item && item.style) item.style.order = String(idx + 1);
    });
  }

  function runNavbarFix() {
    document.querySelectorAll('nav, .site-nav').forEach(standardizeNav);
  }

  document.addEventListener('DOMContentLoaded', runNavbarFix);
  window.addEventListener('load', runNavbarFix);
  setTimeout(runNavbarFix, 500);
  setTimeout(runNavbarFix, 1500);
})();


/* FINAL UNIFIED HEADER + NAVBAR FIX START */
(function () {
    const NAV_ITEMS = [
        { href: '/', label: 'Home' },
        { href: '/turtle-tales-story', label: 'Tatle tale Story' },
        { href: '/workshop-chapters', label: 'Workshops' },
        { href: '/survey', label: 'Community Survey' },
        { href: '/event-booking', label: 'Bookings' },
        { href: '/about-lana', label: 'About Us' },
        { href: '/contact', label: 'Contact' }
    ];

    function currentPath() {
        return (window.location.pathname || '/').replace(/\/$/, '') || '/';
    }

    function buildUnifiedHeader() {
        let header = document.querySelector('.tt-unified-header');
        if (!header) {
            header = document.createElement('header');
            header.className = 'tt-unified-header';

            const logoLink = document.createElement('a');
            logoLink.className = 'tt-header-logo-link';
            logoLink.href = '/';
            logoLink.setAttribute('aria-label', 'Tatle Tale home');

            const logo = document.createElement('img');
            logo.className = 'tt-header-logo';
            logo.src = '/static/images/tatle-tale-top-left-logo.png';
            logo.alt = 'Tatle Tale logo';
            logoLink.appendChild(logo);

            const wrap = document.createElement('div');
            wrap.className = 'tt-unified-navbar-wrap';
            const nav = document.createElement('nav');
            nav.className = 'tt-unified-navbar';
            nav.setAttribute('aria-label', 'Main navigation');
            wrap.appendChild(nav);

            header.appendChild(logoLink);
            header.appendChild(wrap);
            document.body.insertBefore(header, document.body.firstChild);
        }

        const nav = header.querySelector('.tt-unified-navbar');
        const path = currentPath();
        nav.innerHTML = NAV_ITEMS.map(item => {
            const itemPath = item.href.replace(/\/$/, '') || '/';
            const active = path === itemPath ? ' class="active"' : '';
            return `<a href="${item.href}"${active}>${item.label}</a>`;
        }).join('');
    }

    function looksLikeOldMainNav(el) {
        if (!el || el.closest?.('.tt-unified-header')) return false;
        const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').toLowerCase();
        const compact = text.replace(/\s+/g, '');
        const labels = ['home', 'tatle tale story', 'workshops', 'community survey', 'bookings', 'about us', 'contact'];
        const compactLabels = labels.map(x => x.replace(/\s+/g, ''));
        const hits = labels.filter(label => text.includes(label)).length;
        const compactHits = compactLabels.filter(label => compact.includes(label)).length;
        const linkCount = el.querySelectorAll ? el.querySelectorAll('a').length : 0;
        return hits >= 3 || compactHits >= 3 || (linkCount >= 4 && compact.includes('home') && compact.includes('contact'));
    }

    function hideOldNavbarsAndOldLogos() {
        document.querySelectorAll('nav, header, .site-nav, .navbar, .menu, .navigation, [role="navigation"], [class*="nav"], [id*="nav"], [class*="menu"], [id*="menu"], div').forEach(el => {
            if (looksLikeOldMainNav(el)) el.classList.add('tt-old-navbar-hidden');
        });

        document.querySelectorAll('img').forEach(img => {
            if (img.closest('.tt-unified-header')) return;
            const src = (img.getAttribute('src') || '').toLowerCase();
            const alt = (img.getAttribute('alt') || '').toLowerCase();
            if (src.includes('logo') || src.includes('tatle') || alt.includes('tatle') || alt.includes('logo')) {
                img.classList.add('tt-old-logo-hidden');
            }
        });
    }

    function run() {
        buildUnifiedHeader();
        hideOldNavbarsAndOldLogos();
    }

    document.addEventListener('DOMContentLoaded', run);
    window.addEventListener('load', run);
    setTimeout(run, 300);
    setTimeout(run, 1000);
    setTimeout(run, 2000);
})();
/* FINAL UNIFIED HEADER + NAVBAR FIX END */
