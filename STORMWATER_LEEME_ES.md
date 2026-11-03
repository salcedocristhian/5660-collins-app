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

## v16-ct1 · Interior: plan de contención por semanas (rolling 3 semanas)
- Respaldo previo: /backups/repo-v15-ph1-* (no incluido en el ZIP).
- Progress › Interior abre en "Plan por semanas"; "Secuencia por oficio" conserva la secuencia de 9 etapas.
- Grupos de 3 pisos (2–4, 5–7, 8–10, 11/12/14, 15–17, 18–20, 21/PH) × 2 alas (A: oeste + norte; B: este) × 3 semanas.
- Semana 1: SERVPRO instala contención (polietileno ~2 ft, cremalleras rojas, cinta azul), demolición selectiva, limpieza HEPA, visita AirMD PRV.
- Semana 2: con PRV aprobado y verificación Fire/AHJ (independiente) la cuadrilla de drywall reconstruye el ala A mientras SERVPRO trabaja el ala B (dos cuadrillas simultáneas).
- Semana 3: ala B reconstruida, inspecciones, acabados, limpieza, retiro autorizado de contención y liberación del grupo; solo entonces inicia el siguiente grupo.
- PRV es una compuerta explícita: la visita no es PASS. Opción "Falla → retrabajo" por grupo y ala: HOLD, retrabajo, re-limpieza y re-prueba; el cronograma se recorre.
- Todo resultado positivo aparece como "SIMULADO — NO ES UNA APROBACIÓN OFICIAL". El estado real del permiso no cambia.
- Ruta libre propuesta de 3 ft (línea verde punteada) con avisos naranjas donde el ancho libre del modelo es < 3 ft; no se afirma cumplimiento de código.
- Controles: reproducir/pausar, anterior/siguiente, línea de tiempo, 1×/1.5×/2×, piso, semana, fase y ala; bilingüe ES/EN.
- Supuestos a validar: asignación de alas, lado de la contención (lado con más paneles afectados), duraciones de actividades.

## v16-ct2 · Building coherente con Interior + secuencia por oficio en el mismo piso
- Building usa el mismo cronograma del plan por semanas de Interior (grupos de 3 pisos, 2 alas, compuertas PRV y Fire/AHJ, HOLD si se simula falla de PRV). La línea de tiempo llega hasta la última semana del plan (21 nominal, más si hay HOLD). Colores: Servpro, AirMD PRV, drywall, inspecciones/liberación, pintura, HOLD (rojo) y grupo liberado.
- La ficha del piso en Building indica las semanas del grupo y la actividad de cada ala.
- Plan por semanas: por defecto se queda en el piso elegido; la opción "Seguir los grupos al reproducir" vuelve a saltar de grupo.
- Secuencia por oficio: selector de piso que se mantiene al reproducir, lista "qué sigue" con la semana de cada trade según el plan (rociadores, alarma y puertas: permisos aparte, sin fecha) y cámara que sigue cada trade (se desactiva si el usuario mueve la cámara).

## v16-ms1 · Un solo cronograma maestro (Building, Plan por semanas y Secuencia por oficio)
- Respaldos: /backups/reconstruction_ct2.html, index_ct2.html (fuera del ZIP).
- Cronograma maestro por piso con los 9 trades en el mismo reloj:
  - 1–4 y 6–7 (moho, alfombra, Ram Board, AirMD, drywall, pintura): ventanas del plan por semanas (contención por alas, grupos de 3 pisos).
  - 5 Rociadores (tramo de pasillo): entre el PRV aprobado y el drywall, sujeto a permiso FP0826-7612.
  - 8 Alarma: un piso a la vez (propuesta de Sciens), 44 semanas ÷ 20 pisos ≈ 11 días hábiles por piso (tarifa de la pestaña Schedule), después de la liberación del grupo; sujeto a permiso.
  - 9 Puertas: 2 pisos por semana (pestaña Schedule), después de la alarma del piso; sujeto a permiso.
- Mientras Servpro sube por los grupos, los pisos ya liberados siguen con rociadores, alarma y puertas al mismo tiempo; Building muestra todos los pisos activos a la vez.
- Interior: un reproductor compartido (semana, piso) para ambas vistas; el piso elegido se mantiene al reproducir. La secuencia por oficio muestra varios trades activos a la vez y la lista con semanas de cada uno.
- La pantalla de drywall en la secuencia por oficio usa los mismos paneles afectados que la contención.
- Pestaña Schedule: Hallway Remediation / Drywall pasa de 10 a ~21 semanas para coincidir con el modelo.
- Duración total del escenario: ~48 semanas (dominada por la alarma, un piso a la vez).

## v16-ms2 · Corrección: cada ala se termina completa (ambos muros)
- Causa: la contención y el drywall solo cubrían el muro del lado de la contención; el muro opuesto de cada pasillo quedaba con el drywall viejo y la secuencia por oficio también lo excluía.
- Ahora cada ala tiene dos pasos de contención: muro 1 (instalación, demolición, limpieza), traslado de la contención al muro 2 (demolición, limpieza) y luego PRV. La reconstrucción cubre ambos muros; el muro 2 se reconstruye dentro de su contención y el muro 1 ya liberado por PRV.
- La ruta libre de 3 ft cambia de lado según el muro contenido; los avisos de estrechez se muestran solo para la contención instalada.
- Se incluyen también los paneles cercanos al cruce. Las duraciones de demolición y limpieza se repartieron entre los dos muros: el ritmo de 3 semanas por grupo no cambia.

## v16-gd1 · Guía: recorrido por el edificio (opción A)
- Botón "▶ Guía" en Interior y en Building. Empieza en el piso 2, semana 1, en la secuencia por oficio con la cámara siguiendo cada trade.
- Cuando el piso termina TODOS sus trades (incluye alarma y puertas), la guía pasa a la vista Building: el piso terminado destella, un marcador tipo ascensor sube por la fachada y se detiene brevemente en cada piso intermedio mostrando lo que ocurre ahí en esa semana; termina en el frente de trabajo nuevo (el grupo donde trabaja Servpro, o el próximo grupo por empezar) y entra a ese pasillo.
- Mientras el piso de la guía no tiene ningún trade activo (por ejemplo, esperando la alarma, que va un piso a la vez), el reloj avanza 6× hasta el siguiente trade.
- Cualquier acción del usuario (pausa, cambiar piso o vista) detiene la guía.

## v16-gd2 · Guía exterior y guía interior
- Building: "▶ Guía exterior". Se queda en la vista del edificio; el marcador acompaña el piso de la guía (empieza en el piso 2) y, cuando termina todos sus trades, sube por la fachada deteniéndose en cada piso intermedio hasta el frente de trabajo nuevo.
- Interior: "▶ Guía interior". Usa el Plan por semanas (contención muro por muro, cuadrillas simultáneas, ruta de 3 ft, compuertas PRV/Fire simuladas); la cámara va sola al ala y muro con actividad; al liberar el grupo siguen alarma y puertas en el mismo piso. Entre pisos, transición corta sin salir de Interior: la planta baja, una barra de pisos a la derecha recorre los pisos intermedios con su estado y entra la planta del frente de trabajo.
- Avance rápido 6× cuando el piso de la guía no tiene trades activos. Mover la cámara la deja libre; pausar o cambiar de piso/vista detiene la guía.

## v16-s24 · Cronograma de 24 semanas
- Alarma en pasillos: 1 piso por semana (5 días hábiles), detrás de cada grupo liberado; antes 11 días por piso. Ritmo sujeto a confirmación de Sciens.
- Resultado: remediación y drywall ~21 semanas, alarma semanas 4–23, puertas semanas 5–24; total ~24 semanas desde la emisión de BC2628687 (reemplaza las ~48 semanas anteriores). Un HOLD de PRV alarga el total.
- Pestaña Schedule: Fire Alarm · ELSS pasa a ~20 semanas (inicio semana 7 del calendario, 3 semanas después del inicio del pasillo); Smoke Enclosure Doors a ~20 semanas (inicio semana 8), al paso de la alarma; Fire Sprinkler mantiene el contrato de 10 meses con el tramo de pasillo dentro de cada grupo.

## v16-s24b · Contenciones más visibles
- Polietileno con opacidad 0.86 (antes 0.55), tono blanco lechoso y contorno gris en las caras frontal y superior, para que la contención se lea en todas las vistas sin ocultar del todo a las cuadrillas.

## v17-sq1 · Procedimiento por alas y secuencia progresiva de rociadores y alarma
- Remediación por alas, sin traslado de muro a muro: semana 1 contenciones del ala A (ambos muros afectados, profundidad ajustada para dejar 3 ft libres donde el ancho lo permite; avisos donde no), demolición, limpieza y visita AirMD; laboratorio con el resultado al inicio de la semana 2. Semana 2: PRV aprobado y reconstrucción del ala A mientras Servpro hace el ala B. Semana 3: PRV del ala B, reconstrucción y liberación. Semana 4: Servpro empieza el siguiente grupo.
- Rociadores y alarma con cuadrillas y estados propios, un piso por semana cada uno, desde la semana siguiente a la liberación del grupo. Escenarios: en paralelo (~23 semanas), alarma una semana detrás (~24, predeterminado) y asignación de planificación (28). El último grupo solo tiene 2 pisos (21 y PH), por eso cada escenario termina una semana antes que una cuenta con grupos de 3.
- En paralelo se avisa que dos trades en el mismo piso requieren coordinación en campo y autorización del Fire Marshal. Instalación terminada ≠ inspección, prueba integrada ni aceptación.
- Presurización de escaleras, comisionamiento y aceptación final del ELSS quedan como dependencias aparte (sin programar). Las puertas de cerramiento de humo aparecen solo como una semana ilustrativa por piso (ver abajo).
- Alarma: primero verificación y terminación del cableado existente (cable rojo progresivo), luego los dispositivos.
- Pestaña Schedule alineada: rociadores semanas 7–26 del calendario, alarma 8–27. Puertas: el permiso no está radicado; en el modelo 3D se muestran como una semana ilustrativa por piso (una por semana, después de la pintura), sin fecha real.

## v17-sq2 · Contenciones también en la Secuencia por oficio
- La pestaña Secuencia por oficio muestra el mismo procedimiento de contención que el Plan por semanas: contenciones por ala, cremalleras y cinta, demolición dentro de la contención, limpieza HEPA, visita AirMD/laboratorio, HOLD si falla la PRV, reconstrucción, retiro de la contención, ruta libre de 3 ft y cuadrillas. Encima siguen los demás trades (rociadores, alarma) con sus propias animaciones.
- El texto de la etapa "Remediación de moho" describe el procedimiento por alas.

## v17-sq3 · Contenciones en tramos alternos (nunca una frente a otra)
- Cada pasillo se divide en tramos de ~11 ft. Paso 1: se contienen los tramos impares de un muro y los pares del muro opuesto; paso 2: se trasladan a los tramos libres. En ninguna sección hay dos contenciones enfrentadas.
- Profundidad de contención 2 ft; la ruta verde de 3 ft se desplaza por tramo al lado libre del pasillo. Avisos naranjas solo si el ancho libre del tramo contenido es < 3 ft.
- La semana del ala se mantiene: paso 1 (instalación, demolición, limpieza), traslado, paso 2, visita AirMD y laboratorio; PRV al inicio de la semana siguiente.

## v17-sq4 · Building: dónde va cada cuadrilla
- La tarjeta del visor muestra, mientras corre la línea de tiempo, la semana y los pisos de cada cuadrilla: Servpro, drywall, rociadores y alarma (con su color).
- Etiquetas de color junto a los números de piso en la torre indican el trade activo en cada piso.
- Al reproducir, la cámara sube sola siguiendo el frente de trabajo; si el usuario mueve la cámara, deja de seguirlo hasta el siguiente Play.

## v17-sq5 · Resumen "Al mismo tiempo"
- En Interior (con o sin guía), en la guía exterior y en la tarjeta de Building al reproducir aparece un resumen de todo lo que ocurre a la vez en el edificio: grupo en remediación con la actividad de cada ala (Servpro, drywall, AirMD, inspección), piso de rociadores, piso de alarma y aviso si coinciden en el mismo piso.

## v17-pl1 · Pestaña "Planos" en Storm drains
- Nuevo selector "Recorrido 3D | Planos" arriba del visor pluvial.
- 15 hojas: Edificio RJM 2502-009 (COVER, CP-100, BID-100) y Plomería RJM 25-009 (P-000, P-001.1, P-001D, P-001, P-100D, P-100, P-100.1, P-101, P-102, P-200, P-300, P-400), con título, firma y fecha; zoom −/+/ajustar.
- Cada paso del recorrido que cita una hoja muestra "Ver plano …" y abre esa hoja directamente.
- Imágenes en assets/sheets/*.jpg (1900 px). En el archivo único se incrustan una sola vez.

## v17-ux1 · El modelo 3D es el protagonista
- Se retiraron las tarjetas grandes sobre el visor (guías, resumen y tarjeta de piso en Building). En su lugar, una línea discreta abajo: "Piso 2 · Instalación de drywall ala A · Semana 4" (en Building al reproducir: "Semana 17 · Servpro 18–20 · Rociadores 16 · Alarma 15").
- Tocar o deslizar hacia arriba la línea abre el detalle completo (trades del piso, "Al mismo tiempo", estados de permisos y dependencias, plano de origen); deslizar hacia abajo o Esc lo cierra.
- Storm drains: la pestaña Planos ya no aparece vacía bajo el Recorrido 3D (corrección del atributo hidden).
- Geometría, pisos, planos y secuencias sin cambios.

## v17-ux2 · Transiciones de cámara del recorrido pluvial
- Las transiciones entre pasos ya no van en línea recta (cruzando el modelo o volteándose sobre la vista superior): la cámara gira en un arco alrededor del objetivo, con aceleración suave, y en los saltos grandes se aleja un poco a mitad del recorrido y vuelve a acercarse.
- La duración se ajusta a la distancia y al giro (1.6–3.6 s); las etiquetas se ocultan durante el vuelo y aparecen al llegar.
- Todas las vistas superiores comparten la misma orientación, así el plano no gira de un paso a otro. Pasos, geometría y secuencia sin cambios.

## v17-ux3 · Ritmo más pausado
- Interior y guías: un día hábil dura 2.4 s a 1× (una semana ≈ 12 s); velocidad inicial 1×. El avance rápido en días sin trabajo baja de 6× a 3×.
- Viaje entre pisos de la guía interior y recorrido de la guía exterior más lentos (≈1.5–2 s por piso, 2.6–3 s en el frente de trabajo).
- Building al reproducir: una semana cada ≈6 s.
