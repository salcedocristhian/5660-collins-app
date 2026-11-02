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

## v17-fa1 · Alarma contra incendio según planos Freijo (emitidos para revisión 30/10/26)
- Dispositivos de pasillo de la etapa Alarma tomados de FA-5 (planta típica pisos 2–16), FA-20 (piso 19, típica 17–21) y FA-21 (piso 21/PH), proyectados sobre las líneas de pasillo de Relats (escala 1/8" = 1'-0", alineados en el cruce del lobby).
- Por piso: 2–16 → 7 SD, 3 S/V, 3 V, 3 F, 5 FJ, 1 MM; 17–21 → 9 SD, 4 S/V, 2 V, 3 F, 5 FJ, 1 MM; PH → 7 SD, 4 S/V, 2 F, 2 FJ, 1 MM.
- Nuevos tipos: FJ (jack de teléfono de bomberos FJ-303) y MM (módulo de monitoreo de flujo/válvula en la escalera #3).
- No incluidos en el modelo: dispositivos dentro de las unidades, detectores en el tope de los ductos de ascensor, PAD-5 y relés del cuarto de máquinas (techo).
- Faltan hojas FA-6–FA-19, FA-22–FA-28 (risers y cálculos de baterías); por ser plantas típicas no cambian la ubicación de pasillo.

## v17-fa2 · Dispositivos EST existentes solo durante la etapa de alarma
- Los dispositivos grises (sistema EST existente) ya no se dibujan desde la semana 1; aparecen solo mientras la cuadrilla de alarma los reemplaza en ese piso, y desaparecen al terminar. Las posiciones nuevas siguen siendo las de FA-5/FA-20/FA-21.

## v17-rs1 · Riser de alarma interactivo en Building (FA-22 a FA-26)
- Nueva capa "Riser de alarma": riser vertical (SLC/NAC en rojo, red CI en gris) desde el lobby hasta el techo, un nodo por piso con su ramal al pasillo, y barras de color por lazo: 1 sótano–3, 2 pisos 4–7, 3 pisos 8–11, 4 pisos 12, 14 y 15, 5 pisos 16–19, 6 pisos 20, 21, PH y techo.
- Paneles: M1 (CAB-3, Cerberus Pro Modular) en el cuarto de seguridad del lobby; R1 (CAB-2, transpondedor) en el cuarto de conserjería del piso 16; PAD-5 por piso en el cuarto eléctrico.
- Ligado al cronograma: cada nodo pasa de gris (EST existente) a naranja pulsante (en transferencia, la semana de alarma de ese piso) y a rojo (transferido, simulado). M1 y R1 se marcan en instalación/programación la semana previa a la primera transferencia.
- Tocar un nodo o panel abre el detalle: lazo, PAD-5, estado y nota de que la prueba integrada y la aceptación no se asumen.
- La ubicación del riser en la torre es esquemática (junto al JAN del núcleo, según FA-5).
