/* 5660 Collins / Superior Doors — guided-tour runtime fix.
   Illustrative schedule only; does not imply approved shop drawings or installation. */
(function () {
  if (window.__superiorTourInstalled) return;
  if (typeof CONT === 'undefined' || typeof computeSchedule !== 'function' ||
      typeof contRebuild !== 'function' || typeof apply !== 'function') {
    console.error('[Superior Doors] reconstruction tour engine unavailable');
    return;
  }
  window.__superiorTourInstalled = true;
  // The original reconstruction already defines stage 8, its door meshes and
  // Superior workers. Never append a second stage or replace the floor geometry.
  const originalSchedule = computeSchedule;
  computeSchedule = function () {
    const schedule = originalSchedule();
    for (const group of schedule.groups) {
      for (const level of group.levels) {
        const trades = group.trades && group.trades[level];
        if (!trades || !trades[8]) continue;
        if (Number(level) === 2) trades[8] = [25, 30];
      }
    }
    return schedule;
  };
  const originalApply = apply;
  function showDoors() {
    if (typeof items === 'undefined' || !items || !items.doors || !items.doorCrew) return;
    if (CONT.level == null || typeof masterT !== 'function') return;
    const T = masterT(CONT.level), span = T && T[8];
    if (!span) return;
    const p = Math.max(0, Math.min(1, (CONT.day - span[0]) / (span[1] - span[0])));
    const active = p > 0 && p < 1;
    items.doors.forEach((door, i) => {
      const start = door.t || i * .45;
      const e = Math.max(0, Math.min(1, (p - start) / .5));
      door.g.visible = e > .001;
      const rise = Math.max(.001, Math.min(1, e / .45));
      door.parts.forEach(part => { part.scale.y = rise; });
      const closeT = Math.max(0, Math.min(1, (e - .45) / .55));
      const smooth = closeT * closeT * (3 - 2 * closeT);
      door.a.visible = door.b.visible = e > .4;
      door.a.rotation.y = -(1 - smooth) * 1.35;
      door.b.rotation.y = (1 - smooth) * 1.35;
    });
    items.doorCrew.forEach((crew, i) => {
      const start = crew.t || i * .45;
      const e = Math.max(0, Math.min(1, (p - start) / .5));
      crew.w.visible = active && e < 1 && p >= start;
      if (crew.w.visible && crew.w.userData.a1 && crew.w.userData.a2) {
        const wave = Math.sin(performance.now() * .01 + i);
        crew.w.userData.a1.rotation.x = -1.2 + wave * .3;
        crew.w.userData.a2.rotation.x = -.9 - wave * .3;
      }
    });
  }
  // Called on every existing render/update. This also fixes manual week
  // selection and scrub; previous patch only rebuilt the schedule once.
  apply = function (time) { originalApply(time); showDoors(); };
  contRebuild();
  if (CONT.level != null && typeof contSetLevel === 'function') contSetLevel(CONT.level, true);
  apply(0);
  window.__superiorDoorsQA = function () {
    const T = masterT(2);
    return {stage8:T && T[8],day:CONT.day,level:CONT.level,
      meshes:typeof items !== 'undefined' && items ? items.doors.length : 0,
      visible:typeof items !== 'undefined' && items ? items.doors.filter(x=>x.g.visible).length : 0,
      workers:typeof items !== 'undefined' && items ? items.doorCrew.filter(x=>x.w.visible).length : 0};
  };
  console.info('[Superior Doors] Stage 8 animation bound to tour render loop',window.__superiorDoorsQA());
})();