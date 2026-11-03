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
