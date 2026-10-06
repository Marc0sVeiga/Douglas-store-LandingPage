const heroSlides = [
  {
    category: 'feminino',
    badge: 'FEMININO',
    eyebrow: 'Elas podem +',
    title: 'ESTILO <em>elevado</em> PARA <em>mulheres</em> DE OUTRO NÍVEL',
    description: 'Venha conhecer esta e outras de nossas peças exclusivas com caimento impecável e modelagem autoral.',
    cta: 'EXPLORAR PEÇAS FEMININAS',
    image: 'public/images/IMG_1493.jpeg',
    alt: 'Modelo feminina em editorial de moda com roupa elegante',
    label: 'DROP 01 // EDITORIAL'
  },
  {
    category: 'masculino',
    badge: 'MASCULINO',
    eyebrow: 'Com estilo +',
    title: 'ESTILO <em>atual</em> PARA <em>homens</em> QUE QUEREM SE DESTACAR',
    description: 'Coleções pensadas para compor looks versáteis com peças sofisticadas e acabamento impecável.',
    cta: 'EXPLORAR PEÇAS MASCULINAS',
    image: 'public/images/IMG_1491.jpeg',
    alt: 'Modelo masculino em estilo editorial com roupa sofisticada',
    label: 'DROP 02 // EDITORIAL'
  },
  {
    category: 'infantil',
    badge: 'INFANTIL',
    eyebrow: 'Pra brincar +',
    title: 'CONFORTO <em>inspirado</em> PARA <em>crianças</em> EM MOVIMENTO',
    description: 'Peças leves, divertidas e cheias de personalidade para o dia a dia da família.',
    cta: 'EXPLORAR PEÇAS INFANTIS',
    image: 'public/images/Code_Generated_Image (11).png',
    alt: 'Criança em look casual com peças descontraídas e modernas',
    label: 'DROP 03 // EDITORIAL'
  },
  {
    category: 'acessorios',
    badge: 'ACESSÓRIOS',
    eyebrow: 'Detalhe que faz +',
    title: 'ACESSÓRIOS <em>premium</em> QUE <em>completam</em> QUALQUER LOOK',
    description: 'Finalize o visual com detalhes que elevam o estilo e reforçam a identidade da sua rotina.',
    cta: 'EXPLORAR ACESSÓRIOS',
    image: 'public/images/Code_Generated_Image (10).png',
    alt: 'Detalhe de acessórios de moda em composição editorial',
    label: 'DROP 04 // EDITORIAL'
  }
];

const initHeroCarousel = () => {
  const tabs = document.querySelectorAll('.category-tab');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevButton = document.querySelector('.carousel-button--prev');
  const nextButton = document.querySelector('.carousel-button--next');
  const heroBadge = document.querySelector('.hero-badge-text');
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroTitle = document.querySelector('.hero-title');
  const heroDescription = document.querySelector('.hero-description');
  const heroPrimaryText = document.querySelector('.btn-primary-text');
  const heroPrimaryLink = document.querySelector('.btn-primary');
  const heroImage = document.querySelector('.hero-figure img');
  const heroImageAlt = document.querySelector('.hero-figure img');
  const heroCaption = document.querySelector('.hero-figure figcaption');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!tabs.length || !dots.length || !heroBadge || !heroEyebrow || !heroTitle || !heroDescription || !heroPrimaryText || !heroPrimaryLink || !heroImage || !heroCaption) {
    return;
  }

  let activeIndex = 0;

  const updateSlide = (nextIndex) => {
    const slide = heroSlides[nextIndex];
    if (!slide) return;

    activeIndex = nextIndex;

    heroBadge.textContent = slide.badge;
    heroEyebrow.textContent = slide.eyebrow;
    heroTitle.innerHTML = slide.title;
    heroDescription.textContent = slide.description;
    heroPrimaryText.textContent = slide.cta;
    heroImage.src = slide.image;
    heroImage.alt = slide.alt;
    heroCaption.textContent = slide.label;

    const isPrimaryWhatsApp = slide.category === 'feminino';
    heroPrimaryLink.href = isPrimaryWhatsApp
      ? 'https://wa.me/5567999999999?text=Ol%C3%A1%2C%20quero%20explorar%20as%20pe%C3%A7as%20femininas'
      : 'https://wa.me/5567999999999?text=Ol%C3%A1%2C%20quero%20conhecer%20as%20pe%C3%A7as%20da%20Douglas%20Store';

    tabs.forEach((tab, index) => {
      const isActive = index === activeIndex;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  };

  const moveToCategory = (category) => {
    const index = heroSlides.findIndex((slide) => slide.category === category);
    if (index >= 0) updateSlide(index);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => moveToCategory(tab.dataset.category));
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => moveToCategory(dot.dataset.category));
  });

  prevButton.addEventListener('click', () => {
    const nextIndex = (activeIndex - 1 + heroSlides.length) % heroSlides.length;
    updateSlide(nextIndex);
  });

  nextButton.addEventListener('click', () => {
    const nextIndex = (activeIndex + 1) % heroSlides.length;
    updateSlide(nextIndex);
  });

  if (!reduceMotionQuery.matches) {
    let autoplayId = null;
    const startAutoplay = () => {
      clearInterval(autoplayId);
      autoplayId = setInterval(() => {
        const nextIndex = (activeIndex + 1) % heroSlides.length;
        updateSlide(nextIndex);
      }, 5000);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayId);
    };

    startAutoplay();
    const carousel = document.querySelector('.hero-controls');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusin', stopAutoplay);
      carousel.addEventListener('focusout', startAutoplay);
    }
  }
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