# Anaivi's — Guardianes de Colombia · Propuesta de Carrusel

Página web de presentación (estática) para el emprendimiento **Anaivi's — Hecho a mano**.

Muestra un **carrusel** donde una misma plantilla de diseño (el colibrí guardián, en
acuarela con cinta tricolor) se reinterpreta en distintas paletas, y el **proceso de
serigrafía por capas**, manteniendo el animal, la posición y el estilo artesanal.

## Estructura

```
.
├── index.html      # La página
├── styles.css      # Diseño con la identidad de Anaivi's
├── script.js       # Lógica del carrusel (flechas, puntos, teclado, táctil)
└── assets/         # Imágenes del carrusel (ver assets/LEEME.txt)
```

## Imágenes

Las imágenes se colocan en `assets/` con estos nombres exactos:

| Archivo | Contenido |
|---|---|
| `colibri-tricolor.png` | Colibrí verde con cinta tricolor (plantilla base) |
| `colibri-multicolor.png` | Colibrí en púrpura/azul/magenta |
| `colibri-flor.png` | Colibrí azul y naranja con flor de hibisco |

Mientras no existan, el carrusel muestra un marcador en cada slide, así que la página
funciona igual.

## Publicar con GitHub Pages

1. En GitHub: **Settings → Pages**.
2. En *Source*, elige la rama `main` y la carpeta `/ (root)`.
3. Guarda. En unos minutos la página queda publicada en la URL que indique GitHub.

## Desarrollo local

Es una web estática: abre `index.html` en el navegador, o sirve la carpeta con
`python3 -m http.server`.
