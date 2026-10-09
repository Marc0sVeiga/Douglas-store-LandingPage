window.renderSharedLayout = () => {
  const header = document.querySelector("[data-shared-header]");
  const footer = document.querySelector("[data-shared-footer]");

  if (!header || !footer) {
    throw new Error("Os espaços compartilhados do cabeçalho e rodapé são obrigatórios.");
  }

  const whatsappIcon = `
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.1-3.5-8.4ZM12.1 21.7c-1.7 0-3.4-.5-4.8-1.3l-.4-.2-3.9 1 1-3.8-.2-.4a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.4-4.4 9.8-9.8 9.8Zm5.4-7.3c-.3-.2-1.7-.9-2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.2-.7l.5-.6.2-.5c.1-.2 0-.4 0-.6L9 6.8c-.2-.4-.4-.4-.7-.4h-.6c-.3 0-.6.1-.9.4s-1.1 1.1-1.1 2.7 1.2 3.1 1.4 3.4c.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.9.6.8.3 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z"></path>
    </svg>`;

  header.innerHTML = `
    <div class="header-inner">
      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-navigation" data-menu-toggle>
        <span></span><span></span><span></span>
      </button>
      <a class="brand" href="/" aria-label="Douglas Store - início">
        <span class="brand-mark"><img src="/public/logo.jpg" alt="" /></span>
        <span class="brand-copy">
          <span class="brand-name">Douglas Store</span>
          <span class="brand-location">Campo Grande - MS</span>
        </span>
      </a>
      <nav class="desktop-navigation" aria-label="Navegação principal">
        <ul class="navigation-list" data-navigation-list></ul>
      </nav>
      <a class="whatsapp-link desktop-whatsapp" href="https://wa.me/5567999999999?text=Ol%C3%A1%2C%20Douglas%20Store!" target="_blank" rel="noopener noreferrer">
        ${whatsappIcon}<span>WhatsApp</span>
      </a>
      <a class="whatsapp-link mobile-whatsapp" href="https://wa.me/5567999999999?text=Ol%C3%A1%2C%20Douglas%20Store!" target="_blank" rel="noopener noreferrer" aria-label="Falar com a Douglas Store pelo WhatsApp">
        ${whatsappIcon}
      </a>
    </div>
    <button class="menu-backdrop" type="button" aria-label="Fechar menu" data-menu-overlay hidden></button>
    <aside class="mobile-drawer" id="mobile-navigation" aria-label="Menu de navegação" aria-modal="true" role="dialog" data-mobile-menu hidden>
      <div class="drawer-header">
        <a class="brand drawer-brand" href="/" aria-label="Douglas Store - início">
          <span class="brand-mark"><img src="/public/logo.jpg" alt="" /></span>
          <span class="brand-copy">
            <span class="brand-name">Douglas Store</span>
            <span class="brand-location">Campo Grande - MS</span>
          </span>
        </a>
        <button class="drawer-close" type="button" aria-label="Fechar menu" data-menu-close><span aria-hidden="true">&times;</span></button>
      </div>
      <nav class="drawer-navigation" aria-label="Navegação mobile">
        <ul class="drawer-navigation-list" data-navigation-list></ul>
      </nav>
      <a class="whatsapp-link drawer-whatsapp" href="https://wa.me/5567999999999?text=Ol%C3%A1%2C%20Douglas%20Store!" target="_blank" rel="noopener noreferrer">
        ${whatsappIcon}<span>WhatsApp</span>
      </a>
    </aside>`;

  footer.innerHTML = `
    <a class="footer-brand" href="/" aria-label="Douglas Store - voltar ao início">
      <span class="footer-brand-mark"><img src="/public/logo.jpg" alt="Logo Douglas Store" /></span>
      <span class="footer-brand-copy">
        <span class="footer-brand-name">Douglas Store</span>
        <span class="footer-brand-location">Campo Grande - MS</span>
      </span>
    </a>
    <nav class="footer-actions" aria-label="Redes sociais e contato">
      <a class="footer-action" href="https://wa.me/5567999999999?text=Ol%C3%A1%2C%20Douglas%20Store!" target="_blank" rel="noopener noreferrer" aria-label="Chamar no WhatsApp (abre em nova aba)">
        ${whatsappIcon}<span>Chamar no WhatsApp</span>
      </a>
      <a class="footer-action" href="https://www.instagram.com/douglas.storeoficial1/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Douglas Store: @douglas.storeoficial1 (abre em nova aba)">
        <span aria-hidden="true">IG</span><span>@Douglas.StoreOficial1</span>
      </a>
    </nav>
    <hr class="footer-divider" aria-hidden="true" />
    <small class="footer-copyright">
      © 2025 Douglas Store. Todos os direitos reservados. Raw streetwear &amp;
      digital precision.
    </small>`;
};
