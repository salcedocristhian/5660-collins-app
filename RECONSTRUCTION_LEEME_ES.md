# 5660 Collins · Simulador de reconstrucción de pasillos (borrador)

**Estado:** borrador para revisión del PM. No aprobado por Administración para residentes.

## Contenido
- `reconstruction.html` (v2): página autónoma (Three.js r128 desde cdnjs/jsDelivr, datos de planta y planos Relats en formato blueprint incluidos).

## Fuente de la geometría
- Relats Engineering, hojas A-1.0 a A-1.3 «5660 Collins – Elevator Smoke Enclosure», selladas por Pedro P. Amin, PE, 30/10/2026 (enviadas por David Perez, HDC Miami, 30/10/2026 6:08 PM ET).
- Muros extraídos de los vectores del PDF a escala 3/32" = 1'-0". Los planos indican «no escalar»: el modelo no sirve para medir ni fabricar.
- Puertas D: ubicación y dimensiones según el plano. Drywall, alfombra, Ram Board, rociadores y alarma: esquemáticos.

## Para subir al repositorio (cuando se apruebe)
1. Copiar `reconstruction.html` a la raíz de `salcedocristhian/5660-collins-app`, rama `main`.
2. No reemplaza ningún archivo existente. El enlace desde `index.html` (pestaña Progress) queda pendiente: no se modificó.
3. El repositorio es público vía GitHub Pages: no publicar hasta que Administración apruebe la distribución a residentes.

## Pendientes conocidos
- Probado en Chromium headless (390 px y 900 px, claro y oscuro). Falta prueba en iPhone/Android físico.
- Agrupación de pisos de los planos (2–15 / 16–20 / 21) difiere del ELSS (2–14, 16/17/19–21, 15/18/22): confirmar con Juan Carlos Hernandez.
- Permiso de puertas no radicado; BC2628687 no emitido; FP0826-7612 en corrección; alarma sin número de permiso.

## v3 (pestaña Plano Relats)
- «Lista de planos»: planta del piso seleccionado, hojas completas A-1.0 a A-1.3 de Relats y hoja SD-1 de Superior Doors (elevaciones y herrajes, 21/03/2026).
- Logos de Relats Engineering y Superior Door Contractors tomados de sus propias hojas. No se incluyen sellos ni firmas.
- La hoja de Superior aparece con aviso: muestra 90 min y tipos A/B; los planos sellados de Relats (30/10/2026) especifican tipo D, 20 min UL 1784 «S».

## assessment.html (presupuesto revisado, 31/10/2026)
- Presupuestos según revisión de Evelyn D'An (DFS Resources) del 30/10/2026: total $7,500,000.00 exacto.
- Eliminado «Other Projects»; creado «Contingency Reserve» ($1,132,039) con Mold Remediation y demás partidas.
- «SIRS» renombrado a «Elevator Shoring and Structural Repairs» ($230,600). Dewatering corregido a $372,000.
- «2028 Exterior Restoration» ($1,057,563) con sus 6 partidas; 5 proyectos aprobados agregados como líneas individuales ($498,298).
- «Cash Paid» queda pendiente hasta conciliar con los libros HOA.
