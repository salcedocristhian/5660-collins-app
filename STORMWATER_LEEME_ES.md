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

## v15-r1 · Diseño responsive (teléfono, tableta, escritorio)
- Teléfono (<768 px): sin cambios.
- Tableta (768–1099 px): la app se amplía hasta 960 px, con márgenes mayores; se mantiene la barra inferior.
- Escritorio (≥1100 px): navegación lateral fija a la izquierda (sustituye la barra inferior) y contenido hasta 1480 px.
- Cuando el visor 3D mide ≥980 px de ancho (Building, Interior y Storm drains), pasa a dos columnas: modelo a la izquierda (hasta 76 % de la altura de la pantalla) y controles, etapas y tarjetas a la derecha.
- Los modelos siguen renderizando a la densidad de la pantalla (hasta 2x). No se cambió ningún color, tipografía ni componente.
- Archivos: `index.html` (bloque `#responsiveLayout`), `reconstruction.html` (bloque `#responsiveLayout`), `stormwater.html`.

## v15-fa1 · Alarma contra incendio en Interior + ajustes de Storm drains
- Interior pasa de 8 a 9 etapas: 5 «Rociadores: tubería y cabezas» (antes del drywall) y 8 «Alarma contra incendio» (después de pintura).
- Etapa 8: los dispositivos EST (gris) se reemplazan por Siemens Cerberus Pro en las mismas posiciones mientras el técnico de Sciens recorre cada ala: detectores de humo, speaker-strobes, strobe del lobby, estaciones manuales y módulo de relés. Al final, prueba automática: strobes sincronizados, ondas de sonido, LED de detectores y mensaje de voz de ejemplo.
- Botón «Simular alarma» en el visor desde la etapa 8.
- Posiciones ilustrativas según espaciamiento NFPA 72; las reales salen de los planos de permiso de Sciens. Dispositivos dibujados a 1.7x para que se lean.
- Storm drains: vista inicial desde el lado norte; la piscina y los drenajes del deck se ocultan cuando el deck está en corte.

## v15-fa2 · Alarma en rojo con nomenclatura + pool deck según fotos
- Dispositivos nuevos de alarma en rojo, con etiqueta de nomenclatura de planos (NFPA 170, referenciada por FBC 2023 vía NFPA 72): SD detector de humo, S/V altavoz-strobe, V strobe, F estación manual, CR relé de control. Leyenda en la etapa 8. Los EST existentes siguen en gris para que se vea el reemplazo.
- Pool deck según las 3 fotos del propietario: adoquín beige, borde de piscina terracota con línea de azulejo azul, cabana blanca al extremo oeste, tumbonas, jardineras redondas de ladrillo con grava negra y palmas, jardineras con seto, cerca negra, setos y faroles de globo en el borde del agua.
- Vista Building: marina en el borde norte (agua, muelle, espigones, pilotes y botes). En Storm drains no se muestra (sin fondo).
- Posiciones de espigones, botes y faroles: aproximadas a partir de las fotos; no hay plano de muelles en el proyecto.

## v15-ph1 · Fases de construcción (RJM CP-100) en Storm drains
- El recorrido pasa a 36 pasos: sitio, alcance con las 3 fases, condición existente, desagüe interino, luego Fase I (ala este), Fase II (franja norte central) y Fase III (ala oeste), lluvia, prueba de flujo y cierre.
- Cada fase: vista superior con el área trazada de CP-100 (trama y borde de color: I rojo, II naranja, III azul), barricadas, rampa cerrada o en uso, escalera "no bloquear egreso" y salida de vehículos; luego, paso a paso con cámara: retiro de hierro fundido, PVC nuevo, drenajes, CCTV/CIPP, estación(es) de bombeo, grietas y juntas, impermeabilización y rayado, trench drain (I y III) y reapertura en verde.
- Asignación de trabajos por ubicación dentro de cada área de CP-100 (estación #1 en Fase I; #2 y #3 en Fase II; #4 en Fase III). Las bombas de alquiler se retiran cuando se reemplaza su estación.
- Estructura e impermeabilización (BID-100): grietas con inyección epoxi, juntas de expansión e impermeabilización de tráfico con rayado nuevo. Ubicaciones ESQUEMÁTICAS: las hojas S-100, S-400 y S-407 a S-412 no están en el expediente. La losa que recibe la membrana (38,675 ft²) debe confirmarse.
