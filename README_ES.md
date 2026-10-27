# 5660 Collins — Modelo 3D original + Resident Updates (v3)

## Importante
Esta versión tiene como BASE el archivo original que entregaste: `5660_Collins_Board_Interactive_3D(1).html`.
Sus 3D (exterior, interior y planos), logos, controles, simulación, Gantt y datos ilustrativos no se han reescrito. Solo agregamos navegación, estado público y la pestaña de avisos.

**Advertencia de publicación:** el 3D original fue creado para la presentación al Board y contiene escenarios, cotizaciones/lead times y referencias de proveedores que pueden no estar aprobados para residentes. Antes de compartir una aplicación PUBLICA, revisa el contenido de la pestaña 3D y consigue aprobación de Management. No es un informe de avance real ni un BIM levantado en campo.

## Subir a GitHub Pages
1. Primero descarga la versión actual desde GitHub o guárdala como respaldo.
2. Descomprime este ZIP y arrastra **todos los archivos y carpetas de su contenido** a `salcedocristhian/5660-collins-app` -> Add file -> Upload files.
3. En la raíz deben quedar `index.html`, `resident-updates.html`, `sw.js`, `manifest.webmanifest`, `assets/`, `data/`, `icons/`, etc. **No crees una carpeta v3 anidada**.
4. Commit to `main`. Espera GitHub Pages -> deployment.
5. Abre `https://salcedocristhian.github.io/5660-collins-app/` y selecciona **Resident Updates / Avisos**; también puedes abrir directamente `/resident-updates.html`.
6. En iPhone, recarga Safari y abre la app ya instalada. Si se guarda caché anterior, cierra la app, vuelve a abrirla y usa la URL de GitHub Pages para refrescar. No suele requerirse reinstalar.

## Cómo actualizar los avisos
Editar `data/notices.json` en GitHub es suficiente para cambiar tarjetas, permisos y FAQ. La pestaña de noticias y el pequeño resumen de estado sobre el modelo 3D leen el mismo archivo y consultan nuevos datos cada ~90 segundos mientras la app esté visible; GitHub Pages puede tardar un poco en publicarlos.

**No está conectado aún a los Google Docs LIVE automáticamente.** Esta etapa es manual JSON; la sincronización desde KB y la aprobación automática quedan para una fase posterior.

`approvalStatus: draft` muestra una alerta de contenido preliminar. Solo asigna `approved` después de la autorización de Management. Si los avisos todavía son borradores, **no envíes la URL públicamente**.

## ¿El KB modifica geometría 3D?
No. El feed cambia tarjetas informativas y el resumen publicado encima de la simulación; la geometría, el recorrido, las fechas y las fases del 3D original siguen siendo **una simulación no vinculada** a datos de campo. Las actualizaciones físicas del modelo exigen revisión de ingeniería/modelado y validación antes de publicarlas.

## Pruebas mínimas
- Abrir página principal: aparece la maqueta 3D original.
- Exterior / Interior / Actual plans funcionan como antes.
- Abrir Resident Updates: aparecen 5 avisos, 11 proyectos, 6 FAQ, selector ES/EN y botón Refresh.
- Cambiar `data/notices.json`, guardar/commit y recargar: el portal y el resumen del 3D muestran la información nueva.
- En móvil, comprobar desplazamiento dentro de la pestaña de avisos y controles táctiles del modelo.

## Archivos
`index.html`: HTML original con menú y barra de estado nueva.
`resident-updates.html`: app bilingüe de noticias, aislada en una vista para no romper el Three.js.
`assets/app.js` y `assets/app.css`: lógica y estilo exclusivos del portal de noticias.
`assets/condo-logo.png`, `icons/`: branding.
`data/notices.json`: avisos, proyectos y FAQ públicos.
`sw.js`: caché PWA, versión v3; fetch de noticias preferentemente online.
`manifest.webmanifest`: instalación en Home Screen.
