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

  // Etiquetas cortas del producto para redactar cada paso.
  const PRODUCT_NOUN = {
    cuaderno: "el cuaderno",
    camisa: "la camiseta",
    reloj: "el reloj",
    separador: "el separador",
  };

  // Los 3 pasos del paso a paso. `file` devuelve el nombre del archivo
  // según producto y estilo; `desc` el texto del paso.
  // Paso 1 reutiliza el colibrí base (colibri-<estilo>.png).
  const STEPS = [
    {
      label: "Plantilla",
      file: (p, s) => `colibri-${s}.png`,
      desc: (p, s) => `El diseño base: el colibrí ${STYLES[s]}, en acuarela hecho a mano.`,
    },
    {
      label: "Adaptación",
      file: (p, s) => `${p}-${s}-paso2.png`,
      desc: (p, s) => `El colibrí se ajusta y posiciona para ${PRODUCT_NOUN[p]}, tomando detalles.`,
    },
    {
      label: "Producto final",
      file: (p, s) => `${p}-${s}-paso3.png`,
      desc: (p, s) => `El resultado: ${PRODUCT_NOUN[p]} con el colibrí ${STYLES[s]} aplicado.`,
    },
  ];
  const TOTAL_STEPS = STEPS.length;

  let style = "multicolor";
  let index = 0;
  // Paso actual de cada slide (independiente por producto).
  const stepOf = slides.map(() => 0);

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

  // Construye los puntos del stepper (1-2-3) una sola vez por slide.
  slides.forEach((slide, si) => {
    const stepper = slide.querySelector(".stepper");
    STEPS.forEach((st, i) => {
      const li = document.createElement("li");
      li.className = "step-item";
      li.innerHTML = `<span class="step-dot">${i + 1}</span><span class="step-label">${st.label}</span>`;
      li.addEventListener("click", () => { stepOf[si] = i; renderSlide(si); });
      stepper.appendChild(li);
    });
  });

  // Dibuja un slide según su producto, el estilo activo y su paso actual.
  function renderSlide(si) {
    const slide = slides[si];
    const product = slide.dataset.product;
    const stepIdx = stepOf[si];
    const step = STEPS[stepIdx];
    const fileName = step.file(product, style);
    const media = slide.querySelector(".panel-media");
    const imgEl = slide.querySelector(".prod-img");

    media.classList.remove("is-missing");
    imgEl.src = `assets/${fileName}`;
    imgEl.alt = `${PRODUCTS[product]} — paso ${stepIdx + 1}: ${step.label}`;
    slide.querySelector(".prod-file").textContent = `assets/${fileName}`;
    slide.querySelector(".prod-title").textContent = `${PRODUCTS[product]} · ${STYLES[style]}`;
    slide.querySelector(".prod-desc").textContent = step.desc(product, style);
    slide.querySelector(".prod-count").textContent = `Paso ${stepIdx + 1} de ${TOTAL_STEPS}`;

    // Estado del stepper (activo / completado)
    slide.querySelectorAll(".step-item").forEach((li, i) => {
      li.classList.toggle("is-active", i === stepIdx);
      li.classList.toggle("is-done", i < stepIdx);
    });
    // Habilitar/deshabilitar botones de paso
    slide.querySelector(".prod-prev").disabled = stepIdx === 0;
    slide.querySelector(".prod-next").disabled = stepIdx === TOTAL_STEPS - 1;
  }

  // Conecta los botones de paso de cada slide.
  slides.forEach((slide, si) => {
    slide.querySelector(".prod-prev").addEventListener("click", () => {
      if (stepOf[si] > 0) { stepOf[si]--; renderSlide(si); }
    });
    slide.querySelector(".prod-next").addEventListener("click", () => {
      if (stepOf[si] < TOTAL_STEPS - 1) { stepOf[si]++; renderSlide(si); }
    });
  });

  // Redibuja todos los slides (p. ej. al cambiar de estilo).
  function renderStyle() {
    slides.forEach((_, si) => renderSlide(si));
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
