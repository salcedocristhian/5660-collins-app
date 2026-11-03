/* Superior Doors — illustrative 3D installation sequence only.
   Planning visualization, NOT an issued door permit or confirmed construction schedule.
   Stage index 8 drives the actual door geometry and Superior crew in apply(). */
(function () {
  if (window.__superiorTourInstalled) return;
  if (typeof computeSchedule !== 'function' || typeof contRebuild !== 'function' ||
      typeof CONT === 'undefined') {
    console.warn('Superior Doors: tour engine not ready');
    return;
  }
  window.__superiorTourInstalled = true;
  const baseSchedule = computeSchedule;
  computeSchedule = function () {
    const schedule = baseSchedule();
    let last = schedule.total;
    for (const group of schedule.groups) {
      for (const level of group.levels) {
        const stages = group.trades && group.trades[level];
        if (!stages || !stages[5] || !stages[6]) continue;
        // Floor 2: Week 6, days 1–5. Other floors follow their simulated
        // finish stage and are staggered to avoid showing doors before walls.
        const finish = stages[6][1];
        const start = Number(level) === 2 ? 25 :
          Math.ceil(finish / 5) * 5;
        stages[8] = [start, start + 5];
        last = Math.max(last, start + 5);
      }
    }
    schedule.total = last;
    schedule.workEnd = Math.max(schedule.workEnd || 0, last);
    return schedule;
  };
  contRebuild();
  if (typeof contSetLevel === 'function' && CONT.level != null) contSetLevel(CONT.level, true);
  if (typeof apply === 'function') apply(performance.now());
  // Re-apply when scrubbing or changing floor/week: the scene reads stage 8.
  window.__superiorDoorsQA = function () {
    const T = typeof masterT === 'function' ? masterT(2) : null;
    return {floor2DoorWindow:T && T[8],floor2Week6Progress:T && Math.max(0,Math.min(1,(27-T[8][0])/(T[8][1]-T[8][0]))),currentFloor:CONT.level,currentDay:CONT.day};
  };
  console.info('Superior Doors: stage 8 scheduled and door meshes enabled in 3D tour');
})();