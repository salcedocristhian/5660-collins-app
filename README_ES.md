# 5660 Collins · Progress (v12)

## Qué cambia en esta versión
- **Progress** (antes «Sequence»): el modelo 3D va primero. Las notas, avisos, métricas ilustrativas y la información técnica del modelo se movieron a **«Details and disclosures»**, debajo de la secuencia, en acordeones. «This is a planning scenario» queda abierto por defecto.
- **Nuevo menú**: Updates, Progress, **Permits**, Schedule y Contact, con iconos de trazo fino rediseñados. «Projects» sigue disponible dentro de Updates.
- **Permits (nuevo)**: resumen de estados, fechas clave, filtros (en revisión, emitidos, sin someter, por verificar, casos de código) y detalle desplegable con fianza, duración, finalización y, cuando existe, la ruta de revisión (por ejemplo, BC2628687).
- **Estilo**: fondo porcelana, tinta casi negra, petróleo profundo y bronce solo para «en revisión». Tipografía Instrument Sans (Google Fonts) con respaldo de fuentes del sistema.
- Service worker **v12-progress** (fuerza la actualización del caché) y manifest actualizado.

## Datos de permisos
`data/permits.json` se generó a partir de *5660_Collins_Master_Permit_Exhibit_UPDATED_2026-10-27.xlsx* (23 registros y 4 fechas clave).
- `approvalStatus: "draft"` muestra la etiqueta «Draft, pending Management approval». Cámbialo a `"approved"` cuando Administración lo apruebe.
- `display.showCodeCases`: en `true` se muestran los casos de código (BVE, BVM, BVC, ELSS) y sus fechas. **Ponlo en `false` antes de compartir la app con residentes** si la Junta prefiere no publicarlos.
- Para actualizar un permiso basta con editar el JSON; no hace falta tocar el HTML.

## Archivos nuevos o modificados
- Nuevos: `assets/luxe.css`, `assets/resident-luxe.css`, `assets/flow.js`, `data/permits.json`, `CHANGELOG.md`.
- Modificados: `index.html` (se cargan los estilos y el script nuevos, se agrega el panel `#permitsPane` y se ajusta el menú), `resident-updates.html` (estilos), `sw.js` y `manifest.webmanifest`.
- Los scripts originales del modelo 3D (Three.js, interior y planos) no se modificaron.

## Instalar en GitHub Pages
1. Descomprimir el ZIP.
2. Subir **todo** su contenido a la raíz de `salcedocristhian/5660-collins-app`, rama `main`, reemplazando los archivos existentes. No subir solo `index.html`.
3. Esperar el despliegue y recargar la app dos veces (la primera carga instala el nuevo service worker).

Este paquete no fue publicado automáticamente.

## Validación realizada
Chromium headless con servidor HTTP local, a 390 px y 1280 px:
- Los cinco botones del menú funcionan, y `#permits` abre directamente la pestaña.
- Filtros y detalle desplegable de permisos comprobados.
- Sin errores de JavaScript. Las únicas fallas son las de Google Fonts, porque el entorno de prueba no tiene red.
- Sin desbordamiento horizontal del documento.

## Pendiente
- Prueba en Safari / iPhone físico (blur del menú, safe areas, instalación PWA).
- Confirmar con Administración la visibilidad de los casos de código para residentes.
- Modo oscuro no implementado.
- La vista de detalle de etapa por piso (qué notarás, qué viene) del mockup aún no está conectada a los datos del simulador.
