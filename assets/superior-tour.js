/* Superior Doors: visualization-only stage for Interior guided tour.
   Does not represent an approved permit, procurement, or construction date. */
(function(){
 if(window.__superiorTourInstalled)return;
 if(typeof computeSchedule!=='function'||typeof contRebuild!=='function'||typeof CONT==='undefined')return;
 window.__superiorTourInstalled=true;
 const original=computeSchedule;
 computeSchedule=function(){
   const sch=original();
   let last=sch.total;
   for(const group of sch.groups){
     for(const level of group.levels){
       const stages=group.trades[level];
       if(!stages||!stages[6]||!stages[7])continue;
       const start=Math.max(stages[6][1],stages[7][1],stages[4]?stages[4][1]:0);
       stages[8]=[start,start+5];
       last=Math.max(last,start+5);
     }
   }
   sch.total=last;
   return sch;
 };
 contRebuild();
 if(typeof contSetLevel==='function'&&CONT.level!=null)contSetLevel(CONT.level,true);
 console.info('Superior Doors 3D installation stage enabled in guided tour (illustrative only).');
})();