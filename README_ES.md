# 5660 Collins — Resident Notices (fase 1, pública)

**Objetivo:** tener hoy una aplicación pública para residentes, instalable desde GitHub Pages, sin Firebase, claves ni Management Dashboard.

La web contiene avisos, estado de proyectos, preguntas frecuentes, buscador, inglés/español y un servicio de actualización PWA. Los textos parten de los últimos estados de proyecto compartidos al 27 de octubre de 2026. **Todos los avisos se entregan en modo borrador, sujetos a aprobación de la Administración antes de publicarlos a residentes.**

## Lo que sí y lo que todavía no hace

**Funciona al publicarla:**
- Abre como web normal y puede agregarse a la pantalla de inicio de iPhone o Android.
- Lee avisos de `data/notices.json`, separados del diseño (`index.html`).
- Comprueba cambios al abrir, al volver a primer plano, al pulsar «Actualizar» y aproximadamente cada **90 segundos** mientras esté abierta y tenga internet. Una actualización del archivo en GitHub Pages se refleja sin reinstalar la PWA, después de que GitHub termine el despliegue.
- Mantiene una copia local para consultar la última información cargada **sin conexión**, claramente identificada como copia guardada (no como actualización nueva).
- Incluye logo del edificio, icono, webmanifest, service worker, buscador, categorías y FAQ EN/ES.

**Se deja para la fase 2:**
- Lectura/sincronización automática de los tres Google Docs privados del KB a GitHub. Esos Docs tienen datos internos; jamás se deben exponer íntegros en GitHub Pages.
- Login, Management Dashboard, roles, Firestore y notificaciones push cuando la app está cerrada.
- Notificaciones de sistema: que el teléfono reciba **contenido actualizado cuando se abre la app** no equivale a una push notification.

## Publicarlo hoy en GitHub Pages

### Si ya tienes una app instalada desde un repositorio

1. **Respalda el `index.html` actual** (por ejemplo, `index_backup_2026-10-27.html`) y tu carpeta de íconos/logo; idealmente crea una rama o descarga un ZIP del repositorio antes de sobrescribirlo.
2. Abre tu repositorio en GitHub y usa **Add file → Upload files** (puedes arrastrar todos los archivos y carpetas descomprimidos). Asegúrate de que `index.html` quede en la **raíz**, junto a `manifest.webmanifest` y `sw.js` (no dentro de una carpeta adicional).
3. Confirma el commit. Si Pages ya estaba activo, espera a que termine de publicar y abre la **URL HTTPS original que usan los residentes**. Si cambias la URL, habrá que instalarla de nuevo.
4. Prueba que aparezcan cinco avisos, once proyectos y seis preguntas frecuentes; prueba ES/EN y «Actualizar».
5. Solicita revisión de textos por Management. Cuando los aprueben, edita `data/notices.json` y cambia el campo `"approvalStatus": "draft"` a `"approvalStatus": "approved"`; guarda con un nuevo commit. **No borres la advertencia antes de tener la aprobación.**

**Advertencia:** no pude inspeccionar directamente tu repositorio GitHub desde esta sesión. Este ZIP es una versión pública autónoma lista para subir; **no sustituye una fusión revisada contra el `index.html` que está ahora en producción**. Si quieres conservar exactamente la interfaz existente, comparte aquí el ZIP del repo y lo fusionamos antes de publicarlo.

### Si se usa un repositorio nuevo

1. Crea un repositorio público para los avisos.
2. Carga los archivos del ZIP en su raíz.
3. En **Settings → Pages**, selecciona **Deploy from a branch**, rama `main`, carpeta `/(root)` y guarda.
4. Espera la URL HTTPS que te muestre GitHub Pages y ábrela en el navegador del teléfono.

## Instalar en teléfonos

**iPhone (Safari):** abre la URL `https://...`, pulsa **Share** (compartir) → **Add to Home Screen / Añadir a pantalla de inicio** → **Add / Añadir**. Después, abre el ícono `5660 Notices`.

**Android (Chrome):** abre la URL `https://...`, menú de tres puntos → **Install app / Instalar aplicación** o **Add to Home screen**. Confirma.

La URL debe ser **HTTPS**. Abrir un `index.html` directamente desde WhatsApp o la app Archivos no instala la PWA correctamente y puede impedir que el JSON cargue.

## Actualizar avisos sin editar HTML

Abre `data/notices.json` en GitHub y pulsa el lápiz **Edit**. Modifica `notices`, `projects` o `faq`. Mantén la estructura JSON correcta (dobles comillas, comas y llaves). Cambia `version` y `publishedAt` para dejar trazabilidad. Por ejemplo:

```json
"version": "2026-10-28-public-v2",
"publishedAt": "2026-10-28T14:00:00-04:00",
"approvalStatus": "approved"
```

**Antes de guardar:** distingue siempre `Initial/Applied/Under Review` de `Issued`. No publiques borradores, información del surety, costos privados, datos bancarios, contratos, emails internos ni contenidos sensibles de los Docs LIVE.

**Prueba rápida:** abre la app en iPhone, modifica una frase de un aviso en `data/notices.json`, haz commit, espera a que Pages termine y pulsa **Actualizar**. Si los datos nuevos no aparecen, comprueba el archivo publicado directamente en `https://TU-DOMINIO/RUTA/data/notices.json` y vuelve a entrar en la app. GitHub Pages puede tardar minutos en desplegar y CDN en actualizar.

## Prueba antes de publicar (computador)

Dentro de la carpeta del proyecto ejecuta:

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080`. Esto prueba la web y el feed local; **la instalación de PWA se debe comprobar desde GitHub Pages con HTTPS**.

La URL de tu repositorio (si el original usa GitHub Pages bajo `/nombre-repo/`) funciona porque todos los recursos usan rutas relativas como `./data/notices.json`.

## Seguridad y privacidad

- Todo lo que se suba a un repositorio **público** o a Pages debe considerarse **público**, incluido `data/notices.json`, los iconos y el HTML.
- Esta etapa **no pide contraseñas**, credenciales de Gmail, archivos secretos ni tokens de GitHub dentro del HTML.
- Avisos de residentes son informativos; no sustituyen indicaciones de emergencia, planos aprobados, inspecciones o autorización de trabajos.
- El mecanismo de caché usa network-first para HTML y JSON, y mantiene copia local de datos públicos con indicador *Sin conexión*; no afirmamos conexión en tiempo real sin red.

## Próxima fase — cuando esta ya funcione en teléfonos

- Crear fuente de **avisos aprobados** separada de los Docs internos, con un ciclo de aprobación y GitHub Actions que convierta automáticamente ese contenido a `data/notices.json`.
- Añadir un Management Dashboard con Firebase Authentication + reglas de acceso comprobadas.
- Considerar push notifications con consentimiento y backend, si el edificio desea notificaciones automáticas aunque la app esté cerrada.

## Archivos del paquete

```
index.html
manifest.webmanifest
sw.js
START_HERE.txt
README_ES.md
assets/app.css
assets/app.js
assets/condo-logo.png
icons/icon-192.png
icons/icon-512.png
icons/apple-touch-icon.png
data/notices.json
```
