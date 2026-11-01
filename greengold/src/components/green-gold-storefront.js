"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { catalog, formatPrice } from "@/data/catalog";

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "search") {
    return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
  }
  if (name === "bag") {
    return <svg {...common}><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>;
  }
  if (name === "arrow") {
    return <svg {...common}><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></svg>;
  }
  if (name === "close") {
    return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  }
  if (name === "plus") {
    return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
  }
  if (name === "minus") {
    return <svg {...common}><path d="M5 12h14" /></svg>;
  }
  if (name === "menu") {
    return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  }
  if (name === "spark") {
    return <svg {...common}><path d="m12 2 1.7 7.3L21 12l-7.3 1.7L12 21l-1.7-7.3L3 12l7.3-2.7L12 2Z" /></svg>;
  }
  return null;
}

const filterOptions = {
  ropa: ["Todo", "Capas", "Prendas", "Calzado"],
  accesorios: ["Todo", "Brazaletes", "Cadenas"],
};

export default function GreenGoldStorefront() {
  const [activeCategory, setActiveCategory] = useState("ropa");
  const [activeFilter, setActiveFilter] = useState("Todo");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const products = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("es");
    return catalog.filter((product) => {
      const inCategory = product.category === activeCategory;
      const inFilter = activeFilter === "Todo" || product.subcategory === activeFilter;
      const inSearch = !query || `${product.name} ${product.description} ${product.subcategory}`.toLocaleLowerCase("es").includes(query);
      return inCategory && inFilter && inSearch;
    });
  }, [activeCategory, activeFilter, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = catalog.find((entry) => entry.id === item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const cartProducts = cart
    .map((item) => ({ ...item, product: catalog.find((entry) => entry.id === item.id) }))
    .filter((item) => item.product);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [activeCategory, activeFilter, searchQuery]);

  useEffect(() => {
    if (!cartOpen && !mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cartOpen, mobileOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function changeCategory(category) {
    setActiveCategory(category);
    setActiveFilter("Todo");
    setMobileOpen(false);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { id: product.id, quantity: 1 }];
    });
    setToast(`${product.name} se añadió a tu bolsa`);
  }

  function updateQuantity(id, amount) {
    setCart((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0));
  }

  function jumpToCatalog(category) {
    setActiveCategory(category);
    setActiveFilter("Todo");
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const categoryName = activeCategory === "ropa" ? "ROPA URBANA" : "ORO + ESMERALDAS";

  return (
    <main className="storefront">
      <div className="announcement-bar">
        <span>DROP 01 — PIEZAS PARA MOVERTE A TU MANERA</span>
        <span className="announcement-right"><i /> COLECCIÓN DISPONIBLE</span>
      </div>

      <header className="site-header">
        <a className="brand-lockup" href="#inicio" aria-label="GreenGold, inicio">
          <span className="brand-orbit" aria-hidden="true"><i /></span>
          <span className="brand-name">Green<span>Gold</span></span>
        </a>

        <nav className={`main-nav ${mobileOpen ? "nav-open" : ""}`} aria-label="Navegación principal">
          <button className={activeCategory === "ropa" ? "nav-link active" : "nav-link"} onClick={() => changeCategory("ropa")}>Ropa</button>
          <button className={activeCategory === "accesorios" ? "nav-link active" : "nav-link"} onClick={() => changeCategory("accesorios")}>Accesorios</button>
          <a className="nav-link" href="#catalogo" onClick={() => setMobileOpen(false)}>Nueva colección</a>
          <a className="nav-link" href="#historia" onClick={() => setMobileOpen(false)}>La marca</a>
        </nav>

        <div className="header-actions">
          <button className={`icon-button ${searchOpen ? "is-active" : ""}`} aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar productos"} onClick={() => setSearchOpen((open) => !open)}>
            <Icon name={searchOpen ? "close" : "search"} />
          </button>
          <button className="bag-button" aria-label={`Abrir bolsa, ${cartCount} productos`} onClick={() => setCartOpen(true)}>
            <Icon name="bag" />
            <span className="bag-label">Bolsa</span>
            <span className="bag-count">{cartCount}</span>
          </button>
          <button className="icon-button mobile-menu-button" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
        </div>

        {searchOpen && (
          <form className="search-panel" role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}>
            <label htmlFor="site-search">Busca en GreenGold</label>
            <div className="search-field">
              <Icon name="search" size={18} />
              <input id="site-search" autoFocus placeholder="Chaqueta, brazalete…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
              {searchQuery && <button type="button" aria-label="Borrar búsqueda" onClick={() => setSearchQuery("")}><Icon name="close" size={17} /></button>}
            </div>
          </form>
        )}
      </header>

      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <Image
          className="hero-image"
          src="/images/green-gold-hero.png"
          alt="Ciudad nocturna con una figura en ropa urbana al fondo"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="eyebrow-star"><Icon name="spark" size={14} /></span> DROP 01 <span className="eyebrow-slash">/</span> COLECCIÓN NOCTURNA</p>
          <h1 id="hero-title"><span className="hero-wordmark">Green<span>Gold</span></span><span className="hero-headline">ESTILO EN OTRA<br /><em>frecuencia.</em></span></h1>
          <p className="hero-description">Streetwear masculino y piezas con carácter propio.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => jumpToCatalog("ropa")}>Explorar ropa <Icon name="arrow" size={17} /></button>
            <button className="button button-ghost" onClick={() => jumpToCatalog("accesorios")}>Ver accesorios <Icon name="arrow" size={17} /></button>
          </div>
          <div className="hero-meta"><span>01 — 05</span><span className="hero-meta-line" /><span>UNA NUEVA FORMA DE ESTAR</span></div>
        </div>
        <a className="hero-scroll" href="#catalogo" aria-label="Desplazarse al catálogo"><span>BAJA PARA EXPLORAR</span><i /></a>
        <div className="hero-location"><span className="location-dot" /> EDITION 01 <span>·</span> STREET / OBJECTS</div>
      </section>

      <section className="catalog-section" id="catalogo" aria-labelledby="catalog-title">
        <div className="catalog-intro" data-reveal>
          <div className="section-kicker"><span>GREEN / GOLD</span><span>CATÁLOGO 01</span></div>
          <div className="catalog-heading-row">
            <div>
              <h2 id="catalog-title">Encuentra tu <em>frecuencia.</em></h2>
              <p className="catalog-lede">Dos expresiones. Una misma actitud.</p>
            </div>
            <div className="catalog-switch" role="tablist" aria-label="Seleccionar catálogo">
              <button className={activeCategory === "ropa" ? "switch-option selected" : "switch-option"} role="tab" aria-selected={activeCategory === "ropa"} onClick={() => { setActiveCategory("ropa"); setActiveFilter("Todo"); }}>
                <span className="switch-number">01</span> Ropa urbana
              </button>
              <button className={activeCategory === "accesorios" ? "switch-option selected" : "switch-option"} role="tab" aria-selected={activeCategory === "accesorios"} onClick={() => { setActiveCategory("accesorios"); setActiveFilter("Todo"); }}>
                <span className="switch-number">02</span> Oro + esmeraldas
              </button>
            </div>
          </div>
        </div>

        <div className="catalog-toolbar" data-reveal>
          <div className="catalog-context"><span className="catalog-index">{activeCategory === "ropa" ? "A /" : "B /"}</span><span>{categoryName}</span></div>
          <div className="filter-list" aria-label="Filtrar productos">
            {filterOptions[activeCategory].map((filter) => (
              <button key={filter} className={activeFilter === filter ? "filter-chip selected" : "filter-chip"} onClick={() => setActiveFilter(filter)}>{filter}</button>
            ))}
          </div>
          <span className="product-count">{products.length.toString().padStart(2, "0")} PIEZAS</span>
        </div>

        {products.length > 0 ? (
          <div className="product-grid" key={`${activeCategory}-${activeFilter}-${searchQuery}`}>
            {products.map((product, index) => (
              <article className="product-item" key={product.id} data-reveal style={{ "--reveal-delay": `${index * 90}ms` }}>
                <div className="product-photo-wrap">
                  <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw" className="product-photo" />
                  <span className="product-badge">{product.badge}</span>
                  <button className="quick-add" aria-label={`Añadir ${product.name} a la bolsa`} onClick={() => addToCart(product)}>
                    <span>Añadir a la bolsa</span><Icon name="plus" size={17} />
                  </button>
                </div>
                <div className="product-info">
                  <div><p className="product-category">{product.subcategory} <span>·</span> GREEN / GOLD</p><h3>{product.name}</h3><p className="product-description">{product.description}</p></div>
                  <p className="product-price">{formatPrice(product.price)}</p>
                </div>
              </article>
            ))}
            {activeCategory === "accesorios" && products.length === 2 && activeFilter === "Todo" && (
              <aside className="jewelry-note" data-reveal>
                <span className="jewelry-note-orbit" aria-hidden="true"><i /><b /></span>
                <p className="eyebrow">OBJETOS CON INTENCIÓN</p>
                <h3>Detalles que<br /><em>permanecen.</em></h3>
                <p>Oro laminado y tonos de esmeralda, en piezas para llevar todos los días.</p>
                <span className="jewelry-note-index">GREEN / GOLD — 02</span>
              </aside>
            )}
          </div>
        ) : (
          <div className="empty-state"><span className="empty-orbit" /><p>No encontramos piezas con ese filtro.</p><button onClick={() => { setActiveFilter("Todo"); setSearchQuery(""); }}>Ver todo el catálogo</button></div>
        )}

        <div className="catalog-footnote" data-reveal><span>PIEZAS SELECCIONADAS, SIN EXCESOS.</span><span>GREEN <i>✳</i> GOLD</span></div>
      </section>

      <section className="brand-story" id="historia" data-reveal>
        <div className="story-mark" aria-hidden="true"><span>G</span><i /></div>
        <div className="story-copy"><p className="eyebrow">GREEN / GOLD — NUESTRA FRECUENCIA</p><h2>La calle cambia.<br /><em>Tu esencia queda.</em></h2><p>GreenGold reúne prendas urbanas y objetos que expresan quién eres, sin decir demasiado.</p></div>
        <a className="story-link" href="#catalogo" onClick={() => setActiveCategory("ropa")}>Conoce la colección <Icon name="arrow" size={17} /></a>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#inicio">Green<span>Gold</span><i /></a>
        <p>Vístete en tu propia frecuencia.</p>
        <div className="footer-links"><a href="#catalogo" onClick={() => setActiveCategory("ropa")}>Ropa</a><a href="#catalogo" onClick={() => setActiveCategory("accesorios")}>Accesorios</a><a href="#historia">La marca</a></div>
        <span className="footer-copy">© 2026 GREENGOLD STUDIO</span>
      </footer>

      {cartOpen && (
        <div className="cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="cart-header"><div><p className="eyebrow">GREEN / GOLD</p><h2 id="cart-title">Tu bolsa <span>({cartCount})</span></h2></div><button className="icon-button dark-icon" aria-label="Cerrar bolsa" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>
            {cartProducts.length ? (
              <>
                <div className="cart-items">
                  {cartProducts.map(({ id, quantity, product }) => (
                    <div className="cart-item" key={id}>
                      <div className="cart-thumb"><Image src={product.image} alt="" fill sizes="72px" /></div>
                      <div className="cart-item-copy"><p className="product-category">{product.subcategory}</p><h3>{product.name}</h3><p>{formatPrice(product.price)}</p><div className="quantity-control"><button aria-label={`Quitar una unidad de ${product.name}`} onClick={() => updateQuantity(id, -1)}><Icon name="minus" size={14} /></button><span>{quantity}</span><button aria-label={`Añadir una unidad de ${product.name}`} onClick={() => updateQuantity(id, 1)}><Icon name="plus" size={14} /></button></div></div>
                    </div>
                  ))}
                </div>
                <div className="cart-bottom"><div className="cart-subtotal"><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><p>Los precios son de muestra. El pago se habilitará al conectar el proveedor.</p><button className="button button-primary checkout-button" onClick={() => setToast("Checkout de demostración: los pagos se conectarán después.")}>Continuar <Icon name="arrow" size={17} /></button></div>
              </>
            ) : (
              <div className="cart-empty"><span className="empty-orbit" /><h3>Tu bolsa está en calma.</h3><p>Explora la colección y guarda aquí tus piezas favoritas.</p><button className="button button-primary" onClick={() => { setCartOpen(false); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}>Explorar catálogo <Icon name="arrow" size={17} /></button></div>
            )}
          </aside>
        </div>
      )}

      <div className="toast-message" aria-live="polite" aria-atomic="true">{toast && <span><i />{toast}</span>}</div>
    </main>
  );
}
