# Changelog

## v12-progress (2026-10-27)
- Sequence renamed **Progress**; model-first layout; disclosures moved below the sequence.
- New **Permits** tab driven by `data/permits.json` (23 records from the Oct 27 Master Permit Exhibit).
- New navigation icons and floating glass bar; luxe visual layer (`assets/luxe.css`, `assets/resident-luxe.css`).
- Service worker v12 with network-first caching for `notices.json` and `permits.json`.

## v12.1 (2026-10-28)
- Fix: Updates hero text was white on a light background (ivory.css removed the dark gradient but app.css text colors stayed white). Hero and "Latest information" card now use dark ink on light surfaces. Automated contrast check at 390 px: no text below 3:1.

## v13 (2026-10-28)
- Original Stone Building Solutions and MTD logos, transparent background (Stone wordmark set in navy for light surfaces).
- Header reduced to one row of logos; camera and balconies moved into a "View options" menu; stage title shown in large type under the model; interior stage chips moved out of the 3D view.
- Updates: inside the app, the resident page hides its own header and bottom menu.

## v13.1 (2026-10-28)
- Phones, Interior: the 3D view is 420 px tall and the controls sit below it in full (no clipped area or empty block).
- Phones, Plans: taller view; drawing caption on a light surface instead of the dark band; toolbar restyled.
- Model re-measures itself after switching Building / Interior / Plans.

## v14 (2026-10-28)
- Plans view removed; Progress now has Building and Interior.
- Interior 3D: opaque matte-white walls, solid floor slab with the drawing as a faint reference, two-light setup, sharper rendering on high-density screens, no fog, closer default Overview camera; engineering label removed from the model.
- New app icon (MTD over the building) for home screen, PWA and favicon.

## v17-bd1 · Budget reconciliado con la hoja de la Junta (F. Diez-Rivas)
- Amount Budgeted for Projects $6,460,481.00 + Contingency $1,039,519.00 = $7,500,000.00.
- Contingencia: $1,132,039 → $1,039,519 (−$92,520). Proyectos: $6,367,961 → $6,460,481 (+$92,520).
- Los 10 proyectos detallados suman $6,367,961.00; la diferencia de $92,520.00 aparece como "Project Budget · Breakdown Pending" hasta que la Junta entregue el desglose por proyecto en noviembre. No se asignó a ningún proyecto.
- Costos reportados sin cambios. Truist Closing Fees ($2,450) y Truist Commitment Letter ($5,000) no se incorporaron: falta confirmar si son costos del proyecto o del financiamiento.

## November 2, 2026 — Gym inspections & conditional encapsulation
- Resident-safe Gym project snapshot updated to the Nov 2 coordination call: Electrical, Mechanical and Plumbing inspections planned for Tuesday Nov 3; City bookings and inspection passes are **not verified**.
- Schedule and the new Gym upcoming-events card track each trade inspection separately, then tentative Nov 4 encapsulation and Nov 6 custom desiccant box target. The desiccant machine itself remains **unscheduled**; no gym reopening date is confirmed.
- Updated bilingual Gym project detail, FAQ, resident feed, quick updates, embedded offline snapshot and PWA cache. Did not change 3D models, budgets, permit status, or publish a push notification.

## November 2, 2026 — Latest / Recent chronological feed fix
- Fixed resident Updates hero incorrectly pinned to the first corridor notice, ignoring newer gym notices.
- Latest now selects the newest dated resident-safe notice; Recent shows the four next latest distinct projects sorted by date, excluding the featured project.
- Updated static fallback markup for offline/slow-load, both ES/EN dynamic content, cache-busting script URL, and service-worker cache. Project data, verified permit states and user-facing notices unchanged.

## Fix: animación de puertas de Superior Door (etapa 9)
- Causa 1: `assets/superior-tour.js` se inyectaba desde index.html, pero el motor de reconstruction.html está dentro de un IIFE, así que el addon no veía `CONT`, `computeSchedule` ni `apply` y salía sin hacer nada.
- Causa 2: `computeSchedule()` dejaba la etapa 9 en `null`, así que `mPS(8)` valía siempre 0 y el bloque de animación de `apply()` nunca corría.
- Ahora las puertas se programan dentro de `computeSchedule()`: una semana ilustrativa por piso, después de la pintura, una por semana (opción A). El total no cambia (120 / 115 / 140 días).
- La guía interior vuela a la vista del vestíbulo cuando las puertas están activas y marca la etapa como "(ilustrativo)"; la lista de trades dice "· ilustrativa".
- Se eliminó el addon (index.html y assets/superior-tour.js). Textos aclaran que el permiso de puertas no está radicado.

## November 3, 2026 — HVAC Trane Next Payment Upcoming
- Added prominently displayed **Next Payment Upcoming – Trane $120,434.50**, the anticipated final 10% milestone of the $1,204,345 chiller replacement contract.
- Trane confirmed Oct 29 that the final invoice had not been issued. The feature states invoice and due date pending; it is **not** a confirmed payable, booked expense, or cash payment.
- Mirrored this status within the Central HVAC contract breakdown, and refreshed budget navigation and service-worker cache. **No project budgets, recorded costs, or expense calculations changed.** CO #1 permit fees were not added again pending accounting/contract verification.

## November 3, 2026 — Sciens ELSS Fire Alarm Application Reference
- Confirmed Sciens coordinator Jany Martinez communicated **FP1126-7824**, replacing the stale 'Not assigned' entry for building-wide ELSS fire alarm.
- Updated Permits register, JS fallback, bilingual resident KB and FAQ, project news status, schedule reference, offline KB backup, cache versions and main navigation. Added a concise in-app informational notice; **no push notification sent**.
- City receipt, plan-review stage, master permit relationship, issuance and work authorization remain unverified. Do not confuse with sprinkler FP0826-7612 or gym/Genset fire alarm.
- No budgets or costs modified.

## pilot1 · Hallway Remediation: piloto del piso 2 dentro del modelo real
- La secuencia del piloto reemplaza el plan de 24 semanas en Interior y Building, sin cambiar la torre real (podio, piscina, plantas, marina), la geometría de Relats ni el drywall con moho existente.
- Zonas por lado de pared y tramo: A1 (fucsia, lado derecho del tramo norte en la imagen marcada), B1 (morado, enfrente), A2 (fucsia, borde superior de ambos brazos y tramo central), B2 (morado, bordes inferiores). Barrera de 2 ft y paso previsto de 3 ft del lado libre.
- Recorrido guiado de 16 pasos estilo DERM (lunes 9 a domingo 15 de noviembre de 2026): edificio, zonas, recorrido inicial, caja GFCI, barrera A1, retiro del drywall con moho, limpieza y preparación de A2, relevo de las 5, noche con fire watch, AirMD, espera del clearance escrito, reconstrucción, cruce A1→B1, alfombra y Ram Board, cierre del viernes y fin de semana.
- Personajes con logo (MTD, ANGEL Electrical, SERVPRO, AirMD, Drywall, inspección simulada, logística) y fire watch como bombero; caja GFCI y air scrubber según fotos.
- Luces del pasillo según las fotos (luminarias bajas junto al zócalo, EXIT y colgante al fondo; sin cuadros). Día, atardecer, noche y amanecer.
- Escenarios: AirMD pasa / correcciones / reporte demorado; miércoles trabaja o libre; alfombra jueves, miércoles o no; A2 simultánea o solo preparación.
- Building muestra el estado del piloto (piso 2), piso 3 como próxima fase y el resto en espera.
- Incluye stormwater.html con las correcciones de Treatment / DERM.

## pilot3 · Hallway Remediation: tour guiado cinematográfico (permiso BC2628687 emitido 06/11/2026)
- Progress con una sola pestaña "Hallway Remediation" (edificio exterior + pasillo en un mismo recorrido) y "Storm drains". Solo una escena 3D activa a la vez: Storm drains se carga al abrirse y se descarga al salir; el modelo del edificio se pausa.
- Tour de 21 pasos: entrada desde el edificio con corte del piso 2; piloto del piso 2 por lados (lado A completo semana 1, prueba AirMD lunes 16, clearance y cambio al lado B, drywall con inspecciones 1180/1150 como programadas, prueba del lado B, drywall B con pausa de Thanksgiving, pintura blanca, Superior Doors, Sciens rociadores y alarma); interludio exterior de la semana 3 y plan completo semanas 5–13 en zigzag por grupos de 4 pisos (3–6, 7–10, 11/12/14/15, 16–19, 20/21/PH), máximo 4 pisos con barreras (barreras del grupo nuevo después del clearance del martes).
- Barreras de 2 ft desde la cara del panel con moho hacia el centro del pasillo; paso de 3 ft del otro lado; línea verde solo con barreras.
- Personajes: máximo 3 por equipo (ala norte, oeste y este); logos sin fondo sobre la cabeza; etiquetas con la acción solo de cerca; AirMD recorre todo el lado por el pasillo.
- Tiempo sin horas: reloj, sol/luna, días y semana; noches rápidas; fire watch breve.
- Cámara aérea con encuadre del lado completo y movimiento lateral lento; títulos de capítulo; vista exterior translúcida con pisos coloreados por oficio, etiquetas por piso, leyenda, contador de pisos con barreras y mini gráfico del zigzag.
- Interfaz a pantalla completa: franja superior con íconos (edificio, pasillo, planos, pantalla completa), tarjeta compacta deslizable, botón "Volver al modelo" en los planos.
- data/permits.json: BC2628687 emitido el 06/11/2026 con las inspecciones de la tarjeta. Fechas del tour tentativas; no representan trabajo ejecutado.
