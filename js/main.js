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
  const categoryPage = document.body.dataset.categoryPage;

  document.querySelectorAll("[data-navigation-list]").forEach((list) => {
    const fragment = document.createDocumentFragment();

    content.navigation.forEach((item) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.category
        ? window.douglasStorePath(`${item.category}/`)
        : `${categoryPage ? window.douglasStorePath() : ""}#${item.anchor}`;
      link.textContent = item.label;

      if (item.category) {
        if (item.category === categoryPage) {
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
    contactLink.href = window.douglasStorePath(`${category.id}/`);
    contactLink.textContent = category.buttonLabel;
    contactLink.removeAttribute("target");
    contactLink.removeAttribute("rel");

    if (category.figureModifier) {
      figure.classList.add(category.figureModifier);
    }
    const image = requireElement("[data-slide-image]", slideFragment);
    image.src = window.douglasStorePath(category.image);
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

const createLookbookItem = (item) => {
  const listItem = document.createElement("li");
  listItem.className = `lookbook-item lookbook-item--${item.variant}`;

  const figure = document.createElement("figure");
  figure.className = "lookbook-card";

  const image = document.createElement("img");
  image.src = window.douglasStorePath(item.src);
  image.alt = item.alt;
  image.loading = "lazy";
  image.decoding = "async";

  figure.append(image);
  listItem.append(figure);
  return listItem;
};

const renderLookbook = (items, grid) => {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.append(createLookbookItem(item));
  });

  grid.replaceChildren(fragment);
};

const renderCategoryLookbook = (category) => {
  const grid = requireElement("[data-category-lookbook-grid]");
  const items = content.lookbook.filter((item) => item.category === category);

  renderLookbook(items, grid);
  if (items.length > 0) return;

  const categoryLabel =
    content.categories.find((item) => item.id === category)?.label ?? category;
  const listItem = document.createElement("li");
  listItem.className = "category-lookbook-empty-item";
  const emptyState = document.createElement("article");
  emptyState.className = "category-empty-state";
  const heading = createTextElement(
    "h2",
    "",
    category === "infantil"
      ? "Em breve, novidades para os pequenos"
      : `Em breve, novidades em ${categoryLabel}`,
  );
  const message = createTextElement(
    "p",
    "",
    `Estamos preparando novidades para a categoria ${categoryLabel}.`,
  );
  const contactLink = createTextElement(
    "a",
    "category-empty-contact",
    "Chamar no WhatsApp",
  );
  contactLink.href = `https://wa.me/${content.whatsappNumber}?text=${encodeURIComponent(`Olá, quero saber sobre novidades da categoria ${categoryLabel}`)}`;
  contactLink.target = "_blank";
  contactLink.rel = "noopener noreferrer";

  emptyState.append(heading, message, contactLink);
  listItem.append(emptyState);
  grid.append(listItem);
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
  window.renderSharedLayout();
  renderNavigation();

  const categoryPage = document.body.dataset.categoryPage;
  if (categoryPage) {
    if (!content.categories.some((category) => category.id === categoryPage)) {
      throw new Error(`Categoria de página desconhecida: ${categoryPage}`);
    }
    renderCategoryLookbook(categoryPage);
  } else {
    renderHero();
    renderLookbook(content.lookbook, requireElement("[data-lookbook-grid]"));
    initHeroCarousel();
  }

  initMobileNavigation();
});
