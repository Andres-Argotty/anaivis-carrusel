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
    if (el && el.closest && el.closest("button, .selector")) return;
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

// Proceso por capas de serigrafía — stepper único de 4 pasos.
// Las imágenes dependen del ESTILO (no del producto).
(function () {
  const styleTabs = Array.from(document.querySelectorAll("#styleTabs .tab"));
  const panel = document.getElementById("layerPanel");
  if (!styleTabs.length || !panel) return;

  const stepper = panel.querySelector(".stepper");
  const imgEl = panel.querySelector(".layer-img");
  const media = panel.querySelector(".panel-media");
  const titleEl = panel.querySelector(".layer-title");
  const descEl = panel.querySelector(".layer-desc");
  const countEl = panel.querySelector(".layer-count");
  const prevBtn = panel.querySelector(".layer-prev");
  const nextBtn = panel.querySelector(".layer-next");

  const STYLES = { multicolor: "multicolor", flor: "con flor" };

  // Los 4 pasos del proceso por capas. `file` depende solo del estilo.
  const STEPS = [
    {
      label: "Preparación del soporte",
      file: (s) => `capa-${s}-paso1.png`,
      desc: () => "El textil o superficie listo para recibir la primera capa de serigrafía.",
    },
    {
      label: "Capa base (silueta)",
      file: (s) => `capa-${s}-paso2.png`,
      desc: () => "La silueta del colibrí: la primera capa que define la forma.",
    },
    {
      label: "Primera capa de color",
      file: (s) => `capa-${s}-paso3.png`,
      desc: () => "Sobre la silueta se aplica la primera capa de color del diseño.",
    },
    {
      label: "Capas intermedias",
      file: (s) => `capa-${s}-paso4.png`,
      desc: () => "Se suman las capas intermedias que dan volumen y riqueza de color.",
    },
  ];
  const TOTAL = STEPS.length;

  let style = "multicolor";
  let stepIdx = 0;

  // Construye los puntos del stepper (1-2-3-4) una sola vez.
  STEPS.forEach((st, i) => {
    const li = document.createElement("li");
    li.className = "step-item";
    li.innerHTML = `<span class="step-dot">${i + 1}</span><span class="step-label">${st.label}</span>`;
    li.addEventListener("click", () => { stepIdx = i; render(); });
    stepper.appendChild(li);
  });

  function render() {
    const step = STEPS[stepIdx];
    const fileName = step.file(style);

    media.classList.remove("is-missing");
    imgEl.src = `assets/${fileName}`;
    imgEl.alt = `Colibrí ${STYLES[style]} — capa ${stepIdx + 1}: ${step.label}`;
    panel.querySelector(".layer-file").textContent = `assets/${fileName}`;
    titleEl.textContent = `${step.label} · colibrí ${STYLES[style]}`;
    descEl.textContent = step.desc();
    countEl.textContent = `Capa ${stepIdx + 1} de ${TOTAL}`;

    stepper.querySelectorAll(".step-item").forEach((li, i) => {
      li.classList.toggle("is-active", i === stepIdx);
      li.classList.toggle("is-done", i < stepIdx);
    });
    prevBtn.disabled = stepIdx === 0;
    nextBtn.disabled = stepIdx === TOTAL - 1;
  }

  prevBtn.addEventListener("click", () => { if (stepIdx > 0) { stepIdx--; render(); } });
  nextBtn.addEventListener("click", () => { if (stepIdx < TOTAL - 1) { stepIdx++; render(); } });

  // Gesto táctil para avanzar/retroceder capas en móvil.
  let startX = 0, dragging = false;
  media.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
  media.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) {
      if (delta < 0 && stepIdx < TOTAL - 1) stepIdx++;
      else if (delta > 0 && stepIdx > 0) stepIdx--;
      render();
    }
  });

  // --- Selector de estilo ---
  styleTabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      style = tab.dataset.style;
      styleTabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });
      render();
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

  render();
})();
