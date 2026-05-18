/**
 * Tatle tale Website Polish & Interactions
 * Single JS file.
 */
(function () {
  const NAV_ITEMS = [
    { key: 'home', href: '/', label: 'Home' },
    { key: 'story', href: '/turtle-tales-story', label: 'Tatle tale Story' },
    { key: 'workshops', href: '/workshop-chapters', label: 'Workshops' },
    { key: 'survey', href: '/survey', label: 'Community Survey' },
    { key: 'bookings', href: '/event-booking', label: 'Bookings' },
    { key: 'about', href: '/about-lana', label: 'About Us' },
    { key: 'contact', href: '/contact', label: 'Contact' }
  ];

  function norm(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function navKeyFrom(anchor) {
    const href = (anchor.getAttribute('href') || '').toLowerCase();
    const text = norm(anchor.textContent);
    if (href === '/' || href.endsWith('/index.html') || text === 'home') return 'home';
    if (href.includes('turtle-tales-story') || text.includes('tatle tale story') || text === 'story') return 'story';
    if (href.includes('workshop-chapters') || text.includes('workshop')) return 'workshops';
    if (href.includes('survey') || href.includes('community-survey') || text.includes('survey')) return 'survey';
    if (href.includes('event-booking') || text.includes('booking')) return 'bookings';
    if (href.includes('about-lana') || text.includes('about')) return 'about';
    if (href.includes('contact') || text.includes('contact')) return 'contact';
    return null;
  }

  function setAnchorLabel(anchor, label) {
    const labelEl = anchor.querySelector('[data-part="label"], .wixui-horizontal-menu__item-label, .wixui-menu__item-label');
    if (labelEl) labelEl.textContent = label;
    else anchor.textContent = label;
  }

  function getMoveElement(anchor, container) {
    return anchor.closest('li') || anchor.closest('[data-part="menu-item"]') || anchor.closest('.wixui-horizontal-menu__item') || anchor;
  }

  function standardizeNavContainer(container) {
    const anchors = Array.from(container.querySelectorAll('a')).filter(a => navKeyFrom(a));
    if (anchors.length < 3) return;

    const byKey = {};
    anchors.forEach(anchor => {
      const key = navKeyFrom(anchor);
      if (!key || byKey[key]) return;
      byKey[key] = anchor;
    });

    NAV_ITEMS.forEach((item, index) => {
      let anchor = byKey[item.key];
      if (!anchor && container.classList.contains('site-nav')) {
        anchor = document.createElement('a');
        container.appendChild(anchor);
        byKey[item.key] = anchor;
      }
      if (!anchor) return;

      anchor.setAttribute('href', item.href);
      anchor.removeAttribute('target');
      setAnchorLabel(anchor, item.label);

      const moveEl = getMoveElement(anchor, container);
      moveEl.style.order = String(index + 1);
      moveEl.setAttribute('data-tt-nav-key', item.key);
    });
  }

  function fixNavbarLinksAndOrder() {
    document.querySelectorAll('.site-nav, nav[data-hook="menu-root"], nav[data-part="navbar"], .wixui-horizontal-menu').forEach(standardizeNavContainer);
  }

  function initMobileMenuFix() {
    const buttons = document.querySelectorAll('.mobile-menu-toggle');
    buttons.forEach(btn => {
      if (btn.dataset.ttBound === '1') return;
      btn.dataset.ttBound = '1';
      btn.addEventListener('click', () => document.body.classList.toggle('menu-open'));
    });

    document.querySelectorAll('.site-nav a').forEach(link => {
      if (link.dataset.ttCloseBound === '1') return;
      link.dataset.ttCloseBound = '1';
      link.addEventListener('click', () => document.body.classList.remove('menu-open'));
    });
  }

  function run() {
    fixNavbarLinksAndOrder();
    initMobileMenuFix();
  }

  document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
  setTimeout(run, 250);
  setTimeout(run, 1000);
  setTimeout(run, 2500);
})();
