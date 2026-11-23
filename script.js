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

  // Teclado: flechas izquierda/derecha
  document.addEventListener("keydown", (e) => {
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
  const productTabs = Array.from(document.querySelectorAll("#productTabs .tab"));
  const img = document.getElementById("comboImg");
  const file = document.getElementById("comboFile");
  const title = document.getElementById("comboTitle");
  const desc = document.getElementById("comboDesc");
  const prompt = document.getElementById("comboPrompt");
  const panel = document.getElementById("comboPanel");
  if (!styleTabs.length || !productTabs.length || !img) return;

  // Nombres legibles por producto y estilo
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
  let product = "cuaderno";

  function render() {
    const fileName = `${product}-${style}.png`;
    const info = PRODUCT_INFO[product];
    const styleName = STYLES[style];

    // Reanima el panel en cada cambio
    panel.classList.remove("fade");
    void panel.offsetWidth; // fuerza reflow para reiniciar la animación
    panel.classList.add("fade");

    img.closest(".panel-media").classList.remove("is-missing");
    img.src = `assets/${fileName}`;
    img.alt = `${PRODUCTS[product]} con el colibrí ${styleName} de Anaivi's`;
    file.textContent = `assets/${fileName}`;
    title.textContent = `${PRODUCTS[product]} · ${styleName}`;
    desc.textContent = info.desc(styleName);
    prompt.textContent = info.prompt;
  }

  function wire(tabs, onSelect) {
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        onSelect(tab);
      });
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const nextTab = tabs[(i + dir + tabs.length) % tabs.length];
        nextTab.focus();
        nextTab.click();
      });
    });
  }

  wire(styleTabs, (tab) => { style = tab.dataset.style; render(); });
  wire(productTabs, (tab) => { product = tab.dataset.product; render(); });

  render();
})();
