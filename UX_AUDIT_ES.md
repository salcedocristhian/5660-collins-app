# Auditoría previa al paquete — 5660 Collins

## Corregido y comprobado
- Logo original: inversión de color conserva contraste y detalle; revisión visual en navegador.
- Navegación: cinco accesos probados con servidor HTTP local, feed e iframe.
- Contactos: jerarquía y estilos uniformes; revisión visual móvil.
- Interior: controles fuera del lienzo, sin Zone A/B; etapas y detalles desplegables.
- Pantalla completa: Play/Pause y semana sincronizados con el escenario. Slider W05 y reproducción hasta W06 comprobados.
- Sin errores JavaScript en el recorrido ejecutado.
- Documento sin desbordamiento horizontal a 320, 390, 430 y 1280 px. Gantt conserva su scroll propio.
- Tipografía de sistema, movimiento reducido y controles del dock de 44 px.
- Renderizado omite trabajo cuando el modelo está fuera de vista o la pestaña está oculta; reproducción se pausa al ocultar la página. Resolución y sombras reducidas en móvil.

## Pendientes antes de lanzamiento comercial
- Safari/iPhone físico: gestos, teclado, instalación PWA, safe areas y consumo de batería.
- Modo oscuro: no implementado; interfaz declarada clara.
- Persistencia de sesión: aún sin recuperación de piso, semana y cámara al cerrar.
- Offline y actualizaciones: existe service worker con versión nueva; falta prueba end-to-end sin red y migración desde versiones publicadas.
- Accesibilidad: falta lector de pantalla y auditoría completa de contraste/foco en todas las vistas.
- Rendimiento: se omiten renders fuera de vista, pero siguen programándose callbacks; no es todavía renderizado totalmente bajo demanda.
- No publicado en GitHub durante esta revisión.

Validación realizada en Chromium headless sobre servidor local; no equivale a certificación nativa iOS.

## v12-progress (27/10/2026)
- Comprobado en Chromium headless a 390 y 1280 px: navegación de 5 pestañas, apertura directa con `#permits`, filtros y detalle de permisos, y ausencia de errores JavaScript (salvo las fuentes externas sin red).
- Sin desbordamiento horizontal.
- Pendiente: Safari/iPhone físico y revisión con lector de pantalla del nuevo panel de permisos.
