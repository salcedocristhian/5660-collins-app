# 5660 Collins — Corredor en Y: referencia compartida

## Cambio
El recorrido en Y ahora aparece al seleccionar cualquier piso (2–21 y PH). Se conserva el polígono continuo y las paredes segmentadas del plano residencial de referencia; no se superpone ese polígono sobre las plantas de otra configuración. El lobby central y ambas alas permanecen conectados, con aperturas originales.

Por indicación del PM ("La idea es la misma"), Interior 3D usa el plano Relats 16–20 como **referencia visual común**. No afirma que todos los pisos tengan dimensiones o distribuciones idénticas. Actual plans conserva las láminas específicas del proyecto. Los estados de obra siguen siendo hipotéticos.

Se mantienen Exterior 3D, Resident Updates, controles Floor/Week y Gantt. Se actualizó la versión del caché offline.

## Publicación
Reemplazar los archivos del paquete en salcedocristhian/5660-collins-app, rama main, conservando las carpetas incluidas. Este paquete no publica cambios por sí solo.

## Revisión visual
En Interior 3D, seleccionar Floor 2, 18, 21 o PH y Top/Overview. El corredor debe conservar su alineación con el mismo plano de referencia. Actual plans → Hallway guide permite revisar el contorno.

## Validación de esta revisión
147 combinaciones de piso/fase generaron geometría finita y resaltado de paredes (41 segmentos). JavaScript compiló sin errores; el polígono no tiene cruces entre bordes. Datos de residentes y recursos comparados byte a byte con el paquete original. No se pudo ejecutar una revisión visual WebGL: el navegador de pruebas no estaba disponible y su descarga falló. Publicación en GitHub pendiente.
