/* =====================================================
   PetCare Planner - layout.js
   Layout compartido: sidebar, bottom nav y footer
===================================================== */

(function () {
  const layoutConfig = {
    mainNavItems: [
      { key: "index", label: "Inicio", icon: "home", fallbackIcon: "🏠" },
      { key: "mascotas", label: "Mascotas", icon: "paw-print", fallbackIcon: "🐾" },
      { key: "agenda", label: "Agenda", icon: "clipboard-check", fallbackIcon: "📋" }
    ],
    futureNavItems: [
      { label: "Recordatorios", icon: "bell", fallbackIcon: "🔔" },
      { label: "Calendario", icon: "calendar-days", fallbackIcon: "📅" },
      { label: "Perfil", icon: "circle-user", fallbackIcon: "👤" },
      { label: "Configuración", icon: "settings", fallbackIcon: "⚙️" }
    ],
    footerText: "PetCare Planner - Cuidados que mejoran vidas",
    sidebarMessageTitle: "El amor se demuestra cada día",
    sidebarMessageText: "Pequeñas rutinas, grandes beneficios para su calidad de vida."
  };

  const pageKey = String(document.body.dataset.page || "").trim().toLowerCase();

  function isInsidePagesFolder() {
    return window.location.pathname.includes("/pages/");
  }

  function resolvePageHref(key) {
    const insidePages = isInsidePagesFolder();

    if (key === "index") {
      return insidePages ? "../index.html" : "./index.html";
    }

    if (key === "mascotas") {
      return insidePages ? "./mascotas.html" : "./pages/mascotas.html";
    }

    if (key === "agenda") {
      return insidePages ? "./agenda.html" : "./pages/agenda.html";
    }

    return "#";
  }

  function renderIconMarkup(item) {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      return `<i data-lucide="${item.icon}" aria-hidden="true"></i>`;
    }

    return `<span aria-hidden="true">${item.fallbackIcon}</span>`;
  }

  function renderNavLink(item) {
    const isActive = item.key === pageKey;
    const activeClass = isActive ? " is-active" : "";
    const currentAttribute = isActive ? ' aria-current="page"' : "";

    return `
      <a class="desktop-sidebar__link${activeClass}" href="${resolvePageHref(item.key)}"${currentAttribute}>
        ${renderIconMarkup(item)}
        ${item.label}
      </a>
    `;
  }

  function renderDisabledNavLink(item) {
    return `
      <a class="desktop-sidebar__link is-disabled" href="#" aria-disabled="true">
        ${renderIconMarkup(item)}
        ${item.label}
      </a>
    `;
  }

  function renderBottomNavLink(item) {
    const isActive = item.key === pageKey;
    const activeClass = isActive ? " is-active" : "";
    const currentAttribute = isActive ? ' aria-current="page"' : "";

    return `
      <a class="bottom-nav__link${activeClass}" href="${resolvePageHref(item.key)}"${currentAttribute}>
        ${renderIconMarkup(item)}
        ${item.label}
      </a>
    `;
  }

  function renderSidebar(container) {
    if (!container) {
      return;
    }

    const insidePages = isInsidePagesFolder();
    const brandHref = insidePages ? "../index.html" : "./index.html";
    const pawsImage = insidePages
      ? "../assets/img/brand/isotipo-paw.png"
      : "./assets/img/brand/isotipo-paw.png";
    const sidebarImage = insidePages
      ? "../assets/img/pets/sidebar-pets.png"
      : "./assets/img/pets/sidebar-pets.png";

    container.innerHTML = `
      <aside class="desktop-sidebar" aria-label="Navegación lateral">
        <a class="desktop-sidebar__brand" href="${brandHref}" aria-label="Ir al inicio de PetCare Planner">
          <span class="brand-paw" aria-hidden="true">
            <img src="${pawsImage}" alt="" />
            <span>🐾</span>
          </span>
          <span>PetCare<br /><strong>Planner</strong></span>
        </a>

        <nav class="desktop-sidebar__nav" aria-label="Navegación principal">
          ${layoutConfig.mainNavItems.map((item) => renderNavLink(item)).join("")}
          ${layoutConfig.futureNavItems.map((item) => renderDisabledNavLink(item)).join("")}
        </nav>

        <article class="desktop-sidebar__message">
          <strong>${layoutConfig.sidebarMessageTitle}</strong>
          <p>${layoutConfig.sidebarMessageText}</p>
          <div class="mini-illustration" aria-hidden="true">
            <img class="sidebar-pets-image" src="${sidebarImage}" alt="" loading="lazy" onerror="this.hidden = true" />
            <span class="pet-face pet-face--dog"></span>
            <span class="pet-face pet-face--cat"></span>
          </div>
        </article>
      </aside>
    `;
  }

  function renderBottomNav(container) {
    if (!container) {
      return;
    }

    container.innerHTML = `
      <nav class="bottom-nav" aria-label="Navegación principal">
        ${layoutConfig.mainNavItems.map((item) => renderBottomNavLink(item)).join("")}
      </nav>
    `;
  }

  function renderFooter(container) {
    if (!container) {
      return;
    }

    container.className = "app-footer";
    container.innerHTML = `<p>${layoutConfig.footerText}</p>`;
  }

  function renderLayout() {
    renderSidebar(document.querySelector("[data-layout-sidebar]"));
    renderBottomNav(document.querySelector("[data-layout-bottom-nav]"));
    renderFooter(document.querySelector("[data-layout-footer]"));

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  renderLayout();
})();
