# Consumo GOB — Rediseño Web v2

Prototipo funcional del árbol de páginas de **Consumo** dentro del sitio del Ministerio de Derechos Sociales, Consumo y Agenda 2030 (`dsca.gob.es`).

**Estado:** 🚧 En desarrollo  
**Demo:** [csdelbarrio.github.io/consumogob](https://csdelbarrio.github.io/consumogob)  
**Entorno destino:** Drupal (`dsca.gob.es`) — tema `pinst_theme`

---

## Estructura del árbol

```
/consumo  ← Landing visual principal
├── dg-consumo/           ← DG Consumo (interna) ⏳ estructura pendiente
├── → ordenacionjuego.es  ← Enlace externo (DGOJ)
└── → aesan.gob.es        ← Enlace externo (AESAN)
```

## Estructura de archivos

```
/
├── index.html                    ← Landing principal de Consumo
├── dg-consumo/
│   └── index.html                ← Landing DG Consumo (placeholder)
├── css/
│   ├── tokens.css                ← Variables CSS del sistema de diseño
│   ├── base.css                  ← Reset + header + footer + layout
│   ├── components.css            ← Componentes reutilizables
│   └── pages/
│       └── landing.css           ← Estilos específicos landing
├── js/
│   └── main.js                   ← Menú móvil, acordeones, contadores
└── README.md
```

## Stack técnico

- HTML5 semántico · CSS puro · JS vanilla (sin frameworks, sin build)
- Variables CSS centralizadas en `css/tokens.css`
- Sin dependencias CDN externas en producción (RedSARA)
- Google Fonts solo en demo (GitHub Pages)

## Habilitar GitHub Pages

1. Ir a **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` / Root `/`
4. Guardar — la URL estará disponible en unos minutos

## Bloqueantes pendientes

| Ítem | Estado |
|---|---|
| Estructura de subdirecciones de DG Consumo | ⏳ Pendiente |
| Textos y contenido de subdirecciones | ⏳ Pendiente |
| Logotipos oficiales DGOJ y AESAN en SVG | ⏳ Pendiente |
| Imagen hero de la landing | ⏳ Pendiente |

## Sistema de diseño

Tokens CSS en `css/tokens.css`. Colores institucionales:

- `--color-primary: #043263` (azul institucional)
- `--color-accent: #ffdb00` (amarillo)
- Tipografía: Open Sans

Nomenclatura BEM con prefijo `.consumo-` para componentes de sección.

## Accesibilidad

WCAG 2.1 AA (obligatorio ENS):
- Skip links, `aria-*` completos, contraste 4.5:1, foco visible
- Imágenes con `alt` descriptivo
- Iconos decorativos con `aria-hidden="true"`
- Enlaces externos con aviso en `aria-label`

---

*Secretaría General de Consumo y Juego · DSCA*
