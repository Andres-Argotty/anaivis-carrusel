// Carrusel Anaivi's — navegación con flechas, puntos, teclado y gesto táctil.
(function () {
  const track = document.getElementById("track");
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsContainer = document.getElementById("dots");

  let index = 0;

  // Crear un punto por cada diapositiva
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Ir a la diapositiva " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function update() {
    track.style.transform = "translateX(" + -index * 100 + "%)";
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length; // circular
    update();
  }

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Teclado: flechas izquierda/derecha.
  // Se ignora si el foco está en un control interactivo (botones del
  // selector de estilo u otro carrusel), para no mover este carrusel por error.
  document.addEventListener("keydown", (e) => {
    const el = document.activeElement;
    if (el && el.closest && el.closest("button, .selector, .carousel--products")) return;
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Gesto táctil (deslizar) en móviles
  let startX = 0;
  let dragging = false;
  const viewport = track.parentElement;

  viewport.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
  });

  update();
})();

// Selector de productos — muestra un panel a la vez según el botón activo.
(function () {
  const styleTabs = Array.from(document.querySelectorAll("#styleTabs .tab"));
  const track = document.getElementById("prodTrack");
  if (!styleTabs.length || !track) return;

  const slides = Array.from(track.children);
  const prevBtn = document.getElementById("prodPrev");
  const nextBtn = document.getElementById("prodNext");
  const dotsContainer = document.getElementById("prodDots");

  const PRODUCTS = {
    cuaderno: "Cuaderno",
    camisa: "Camisa",
    reloj: "Reloj",
    separador: "Separador de libros",
  };
  const STYLES = { multicolor: "multicolor", flor: "con flor" };

  // Descripción y prompt por producto (el estilo se inserta dinámicamente)
  const PRODUCT_INFO = {
    cuaderno: {
      desc: (s) => `El colibrí ${s} sobre la portada de un cuaderno artesanal.`,
      prompt:
        '"Usa este colibrí exacto (misma pose, colores y estilo acuarela) impreso sobre la portada de un cuaderno de tapa kraft. Mockup realista, fondo neutro."',
    },
    camisa: {
      desc: (s) => `El colibrí ${s} estampado al frente de una camiseta.`,
      prompt:
        '"Usa este colibrí exacto (misma pose, colores y estilo acuarela) estampado al frente de una camiseta blanca. Mockup de prenda realista, fondo neutro."',
    },
    reloj: {
      desc: (s) => `El colibrí ${s} integrado en un reloj de pared circular de madera.`,
      prompt:
        '"Usa este colibrí exacto (misma pose, colores y estilo acuarela) sobre un reloj de pared circular de madera, con números y manecillas. Mockup realista."',
    },
    separador: {
      desc: (s) => `El colibrí ${s} en un separador de libros vertical alargado.`,
      prompt:
        '"Usa este colibrí exacto (misma pose, colores y estilo acuarela) en un separador de libros vertical y estrecho, con remate artesanal. Mockup realista."',
    },
  };

  let style = "multicolor";
  let index = 0;

  // --- Carrusel de productos ---
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Ir al producto " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function updateCarousel() {
    track.style.transform = "translateX(" + -index * 100 + "%)";
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }
  function goTo(i) { index = (i + slides.length) % slides.length; updateCarousel(); }
  const nextProd = () => goTo(index + 1);
  const prevProd = () => goTo(index - 1);

  nextBtn.addEventListener("click", nextProd);
  prevBtn.addEventListener("click", prevProd);

  // Gesto táctil
  let startX = 0, dragging = false;
  const viewport = track.parentElement;
  viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
  viewport.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) (delta < 0 ? nextProd : prevProd)();
  });

  // --- Contenido de cada slide según el estilo activo ---
  function renderStyle() {
    const styleName = STYLES[style];
    slides.forEach((slide) => {
      const product = slide.dataset.product;
      const info = PRODUCT_INFO[product];
      const fileName = `${product}-${style}.png`;
      const media = slide.querySelector(".panel-media");
      const imgEl = slide.querySelector(".prod-img");

      media.classList.remove("is-missing");
      imgEl.src = `assets/${fileName}`;
      imgEl.alt = `${PRODUCTS[product]} con el colibrí ${styleName} de Anaivi's`;
      slide.querySelector(".prod-file").textContent = `assets/${fileName}`;
      slide.querySelector(".prod-title").textContent = `${PRODUCTS[product]} · ${styleName}`;
      slide.querySelector(".prod-desc").textContent = info.desc(styleName);
      slide.querySelector(".prod-prompt").textContent = info.prompt;
    });
  }

  // --- Selector de estilo ---
  styleTabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      style = tab.dataset.style;
      styleTabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      renderStyle();
    });
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const nextTab = styleTabs[(i + dir + styleTabs.length) % styleTabs.length];
      nextTab.focus();
      nextTab.click();
    });
  });

  renderStyle();
  updateCarousel();
})();
