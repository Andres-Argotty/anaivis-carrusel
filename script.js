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
  const tabs = Array.from(document.querySelectorAll("#productTabs .tab"));
  const panels = Array.from(document.querySelectorAll("#productPanels .panel"));
  if (!tabs.length || !panels.length) return;

  function select(product) {
    tabs.forEach((t) => {
      const active = t.dataset.product === product;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((p) => {
      const active = p.dataset.product === product;
      p.classList.toggle("is-active", active);
      p.hidden = !active;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => select(tab.dataset.product));
  });

  // Navegación con teclado entre los botones (flechas)
  tabs.forEach((tab, i) => {
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      select(next.dataset.product);
    });
  });
})();
