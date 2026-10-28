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
