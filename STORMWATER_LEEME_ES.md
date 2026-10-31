# 5660 Collins · Simulación pluvial del garaje (v15-storm2, borrador)

**Estado:** borrador para revisión del PM. No aprobado por Administración para residentes.

## Qué cambia
- Nueva vista **Storm drains / Pluvial** en Progress (tercer botón junto a Building e Interior).
- `stormwater.html` (nuevo, autónomo, Three.js r128 desde cdnjs/jsDelivr): torre (plantas Relats), podio con pool deck y garaje inferior, más la animación del SOW de RJM 25-009 en 9 fases sin fechas.
- `index.html`: botón nuevo, estilos y cableado del iframe `#stormFrame`. `resident-ios.js`: traducciones `storm`. `sw.js`: caché `…-storm1` y precarga de `stormwater.html`.

## Fuentes de la geometría
- RJM Consultants 25-009 (Reymundo J. Miranda P.E. 35579, firmado 2/12/2025): P-000, P-001.1, P-001D, P-001, P-100D, P-100, P-101, P-102, P-200.
- Contorno del garaje, tuberías, drenajes y estaciones de bombeo extraídos de los vectores del PDF a 3/32" = 1'-0". Los cortes por rótulos en las líneas se unieron.
- Torre ubicada sobre el podio por el arco del lobby y el bloque de amenidades (±5 ft).
- Sótano EL +4.0 / lobby EL +11.0 (7'-0") leído de las elevaciones originales escaneadas: **verificar**.
- Columnas de las alas no dibujadas en las hojas de plomería: omitidas.

## Pendientes
- Confirmar la cota del sótano y la posición de la torre con el arquitecto.
- Prueba en iPhone/Android físico.
- BC2526722 sigue en revisión municipal (no emitido); Class V no solicitado. No publicar a residentes sin aprobación.

## v15-storm2
- **Building**: `reconstruction.html` ahora incluye el podio completo (pool deck, parqueo del nivel lobby con carros en los puestos trazados de P-101, y garaje inferior con puestos de P-001). Interior sin cambios.
- **Storm drains**: recorrido guiado de 14 pasos que inicia en vista superior. Se eliminaron los botones de cámara/torre/deck: solo quedan anterior, reproducir/pausar, siguiente y la barra de pasos. Cada paso mueve la cámara y muestra etiquetas ancladas al modelo.
- Modo fantasma automático (torre, deck y losa) en los pasos subterráneos: CIPP, estaciones de bombeo y prueba de flujo.
- Animación del drenaje: lluvia sobre el deck que entra por los drenajes, y garaje inundado que se vacía, con flujo por el PVC aéreo, los bajantes y las líneas subterráneas hasta las estaciones (que ciclan por flotador) y el desagüe.
- Estación de bombeo modelada según P-102/P-200: tanque Liberty D3648 de fibra de vidrio Ø36½″ × 48″, tapa Ø42½″, 2 bombas trituradoras de 2 HP sobre rieles GR20, 3 flotadores, válvulas de retención y de bola con salida de 2″, entrada de 4″, panel NEMA 4X con baliza y abertura de losa de 6′×6′.
- `assets/podium.js` es el módulo compartido (también va incrustado en `reconstruction.html` y `stormwater.html`, que siguen siendo autónomos).

## v15-storm3
- Storm drains: sin carretera, agua ni terreno de fondo; fondo neutro.
- Reproducción a 1.5x.
- Etiquetas en columnas laterales con líneas guía, fuera de la silueta del objeto; en teléfono, una sola columna a la izquierda y el objeto desplazado a la derecha.
- En el detalle de la estación #1 se ocultan los carros y la etiqueta del panel pasa al paso de estaciones #2–#4.
