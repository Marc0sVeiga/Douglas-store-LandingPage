const initHeroCarousel = () => {
  const carousel = document.querySelector('.hero-carousel');
  const slides = carousel?.querySelectorAll('.hero-slide-toggle');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!carousel || !slides?.length || reduceMotionQuery.matches) {
    return;
  }

  const presentationTime = 7000;
  let autoplayId = null;
  let pointerInside = false;
  let focusInside = false;

  const stopAutoplay = () => {
    window.clearTimeout(autoplayId);
    autoplayId = null;
  };

  const scheduleAutoplay = () => {
    stopAutoplay();
    if (pointerInside || focusInside || document.hidden || reduceMotionQuery.matches) return;

    autoplayId = window.setTimeout(() => {
      const currentIndex = [...slides].findIndex((slide) => slide.checked);
      const nextSlide = slides[(currentIndex + 1) % slides.length];

      nextSlide.checked = true;
      nextSlide.dispatchEvent(new Event('change', { bubbles: true }));
    }, presentationTime);
  };

  carousel.addEventListener('change', scheduleAutoplay);
  carousel.addEventListener('mouseenter', () => {
    pointerInside = true;
    stopAutoplay();
  });
  carousel.addEventListener('mouseleave', () => {
    pointerInside = false;
    scheduleAutoplay();
  });
  carousel.addEventListener('focusin', () => {
    focusInside = true;
    stopAutoplay();
  });
  carousel.addEventListener('focusout', () => {
    window.setTimeout(() => {
      focusInside = carousel.contains(document.activeElement);
      scheduleAutoplay();
    }, 0);
  });
  document.addEventListener('visibilitychange', scheduleAutoplay);
  reduceMotionQuery.addEventListener('change', scheduleAutoplay);

  scheduleAutoplay();
};

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

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initMobileNavigation();
});