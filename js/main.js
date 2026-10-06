const initMobileNavigation = () => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const backdrop = document.querySelector('[data-menu-overlay]');
  const closeButton = document.querySelector('[data-menu-close]');

  if (!toggle || !menu || !backdrop || !closeButton) return;

  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');
  const getFocusableElements = () => menu.querySelectorAll('a[href], button:not([disabled])');

  const closeMenu = (returnFocus = true) => {
    if (menu.hidden) return;

    menu.hidden = true;
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');

    if (returnFocus) toggle.focus();
  };

  const openMenu = () => {
    menu.hidden = false;
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeButton.focus();
  };

  toggle.addEventListener('click', openMenu);
  closeButton.addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (menu.hidden) return;

    if (event.key === 'Escape') {
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  mobileBreakpoint.addEventListener('change', (event) => {
    if (!event.matches) closeMenu(false);
  });
};

document.addEventListener('DOMContentLoaded', initMobileNavigation);