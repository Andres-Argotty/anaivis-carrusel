# Anaivi's — Guardianes de Colombia · Propuesta de Carrusel

Página web de presentación (estática) para el emprendimiento **Anaivi's — Hecho a mano**.

Muestra un **carrusel** donde una misma plantilla de diseño (el colibrí guardián, en
acuarela con detalles tricolor) se adapta con IA a diferentes productos, manteniendo el
animal, la posición y el estilo artesanal.

## Estructura

```
.
├── index.html      # La página
├── styles.css      # Diseño con la identidad de Anaivi's
├── script.js       # Lógica del carrusel (flechas, puntos, teclado, táctil)
└── assets/         # Imágenes del carrusel (ver assets/LEEME.txt)
```

## Imágenes

Las imágenes se generan con IA y se colocan en `assets/` con estos nombres exactos:

| Archivo | Contenido |
|---|---|
| `plantilla-colibri.jpg` | El diseño base del colibrí |
| `producto-cuaderno.jpg` | Colibrí aplicado al cuaderno |
| `producto-reloj.jpg` | Colibrí aplicado al reloj |
| `producto-separador.jpg` | Colibrí aplicado al separador |

Mientras no existan, el carrusel muestra un marcador en cada slide, así que la página
funciona igual.

## Publicar con GitHub Pages

1. En GitHub: **Settings → Pages**.
2. En *Source*, elige la rama `main` y la carpeta `/ (root)`.
3. Guarda. En unos minutos la página queda publicada en la URL que indique GitHub.

## Desarrollo local

Es una web estática: abre `index.html` en el navegador, o sirve la carpeta con
`python3 -m http.server`.
