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
