const content = window.douglasStoreContent;

if (!content) {
  throw new Error("O conteúdo da Douglas Store não foi carregado.");
}

const requireElement = (selector, root = document) => {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
  }

  return element;
};

const createTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
};

const renderNavigation = () => {
  document.querySelectorAll("[data-navigation-list]").forEach((list) => {
    const fragment = document.createDocumentFragment();

    content.navigation.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;

      if (item.category) {
        link.dataset.categoryLink = item.category;

        if (item.category === content.defaultCategory) {
          link.setAttribute("aria-current", "page");
        }
      }

      listItem.append(link);
      fragment.append(listItem);
    });

    list.replaceChildren(fragment);
  });
};

const renderHero = () => {
  const panels = requireElement("[data-hero-panels]");
  const controls = requireElement("[data-hero-controls]");
  const template = requireElement("[data-hero-slide-template]");

  content.categories.forEach((category, index) => {
    const slideFragment = template.content.cloneNode(true);
    const toggle = requireElement(".hero-slide-toggle", slideFragment);
    const article = requireElement(".hero-slide", slideFragment);
    const heading = requireElement("[data-slide-title]", slideFragment);
    const figure = requireElement(".hero-figure", slideFragment);

    toggle.id = `hero-${category.id}`;
    toggle.setAttribute("aria-label", category.label);
    toggle.checked = category.id === content.defaultCategory;

    article.id = category.id;
    article.setAttribute("aria-label", category.slideLabel);
    if (index === 0) article.classList.add("hero-slide--initial");

    requireElement("[data-slide-badge]", slideFragment).textContent =
      category.badge;
    requireElement("[data-slide-eyebrow]", slideFragment).textContent =
      category.eyebrow;

    const title = document.createElement(index === 0 ? "h1" : "h2");
    title.className = heading.className;
    category.title.forEach((part) => {
      if (typeof part === "string") {
        title.append(document.createTextNode(part));
      } else {
        title.append(createTextElement("em", "", part.text));
      }
    });
    heading.replaceWith(title);

    if (category.description) {
      requireElement("[data-slide-description]", slideFragment).textContent =
        category.description;
    } else {
      requireElement("[data-slide-description]", slideFragment).remove();
    }

    const contactLink = requireElement("[data-slide-contact]", slideFragment);
    contactLink.href = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(category.whatsappMessage)}`;
    contactLink.textContent = category.buttonLabel;

    if (category.figureModifier) {
      figure.classList.add(category.figureModifier);
    }
    const image = requireElement("[data-slide-image]", slideFragment);
    image.src = category.image;
    image.alt = category.imageAlt;

    panels.append(slideFragment);
  });

  const previous = document.createElement("div");
  previous.className = "carousel-navigation carousel-navigation--previous";
  const dots = document.createElement("div");
  dots.className = "carousel-dots";
  dots.setAttribute("aria-label", "Ir para uma categoria");
  const next = document.createElement("div");
  next.className = "carousel-navigation carousel-navigation--next";

  content.categories.forEach((category, index) => {
    const previousCategory =
      content.categories[(index - 1 + content.categories.length) % content.categories.length];
    const nextCategory =
      content.categories[(index + 1) % content.categories.length];

    previous.append(createCarouselControl(previousCategory, "‹"));
    next.append(createCarouselControl(nextCategory, "›"));

    const dot = document.createElement("label");
    dot.className = "carousel-dot";
    dot.htmlFor = `hero-${category.id}`;
    dot.append(
      createTextElement("span", "visually-hidden", category.label),
    );
    dots.append(dot);
  });

  controls.replaceChildren(previous, dots, next);
};

const createCarouselControl = (category, symbol) => {
  const control = document.createElement("label");
  control.className = "carousel-button";
  control.htmlFor = `hero-${category.id}`;
  control.setAttribute("aria-label", `Ir para ${category.label.toLowerCase()}`);

  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = symbol;
  control.append(icon);
  return control;
};

const renderLookbook = () => {
  const grid = requireElement("[data-lookbook-grid]");
  const fragment = document.createDocumentFragment();

  content.lookbook.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = `lookbook-item lookbook-item--${item.variant}`;

    const figure = document.createElement("figure");
    figure.className = "lookbook-card";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.imageAlt;
    image.loading = "lazy";
    image.decoding = "async";

    figure.append(image);
    listItem.append(figure);
    fragment.append(listItem);
  });

  grid.replaceChildren(fragment);
};

const initHeroCategoryNavigation = () => {
  const carousel = requireElement(".hero-carousel");
  const toggles = [...carousel.querySelectorAll(".hero-slide-toggle")];
  const navigationLinks = document.querySelectorAll("[data-category-link]");

  const updateNavigation = () => {
    const activeCategory = toggles.find((toggle) => toggle.checked)?.id.replace("hero-", "");

    navigationLinks.forEach((link) => {
      if (link.dataset.categoryLink === activeCategory) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const selectCategory = (categoryId) => {
    const toggle = toggles.find((item) => item.id === `hero-${categoryId}`);
    if (!toggle || toggle.checked) return;

    toggle.checked = true;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
  };

  carousel.addEventListener("change", updateNavigation);
  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      selectCategory(link.dataset.categoryLink);
    });
  });
  window.addEventListener("hashchange", () => {
    selectCategory(window.location.hash.slice(1));
  });

  selectCategory(window.location.hash.slice(1));
  updateNavigation();
};

const initHeroCarousel = () => {
  const carousel = document.querySelector(".hero-carousel");
  const slides = carousel?.querySelectorAll(".hero-slide-toggle");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
      nextSlide.dispatchEvent(new Event("change", { bubbles: true }));
    }, presentationTime);
  };

  carousel.addEventListener("change", scheduleAutoplay);
  carousel.addEventListener("mouseenter", () => {
    pointerInside = true;
    stopAutoplay();
  });
  carousel.addEventListener("mouseleave", () => {
    pointerInside = false;
    scheduleAutoplay();
  });
  carousel.addEventListener("focusin", () => {
    focusInside = true;
    stopAutoplay();
  });
  carousel.addEventListener("focusout", () => {
    window.setTimeout(() => {
      focusInside = carousel.contains(document.activeElement);
      scheduleAutoplay();
    }, 0);
  });
  document.addEventListener("visibilitychange", scheduleAutoplay);
  reduceMotionQuery.addEventListener("change", scheduleAutoplay);

  scheduleAutoplay();
};

const initMobileNavigation = () => {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const backdrop = document.querySelector("[data-menu-overlay]");
  const closeButton = document.querySelector("[data-menu-close]");

  if (!toggle || !menu || !backdrop || !closeButton) return;

  const mobileBreakpoint = window.matchMedia("(max-width: 767px)");
  const getFocusableElements = () => menu.querySelectorAll("a[href], button:not([disabled])");

  const closeMenu = (returnFocus = true) => {
    if (menu.hidden) return;

    menu.hidden = true;
    backdrop.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");

    if (returnFocus) toggle.focus();
  };

  const openMenu = () => {
    menu.hidden = false;
    backdrop.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    closeButton.focus();
  };

  toggle.addEventListener("click", openMenu);
  closeButton.addEventListener("click", () => closeMenu());
  backdrop.addEventListener("click", () => closeMenu());

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (menu.hidden) return;

    if (event.key === "Escape") {
      closeMenu();
      return;
    }

    if (event.key !== "Tab") return;

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

  mobileBreakpoint.addEventListener("change", (event) => {
    if (!event.matches) closeMenu(false);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderNavigation();
  renderHero();
  renderLookbook();
  initHeroCategoryNavigation();
  initHeroCarousel();
  initMobileNavigation();
});
