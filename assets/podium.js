/* 5660 Collins · podium (pool deck, lobby-level parking) and lower garage.
   Geometry from RJM 25-009 (P-001, P-101) vectors; scene units = ft, tower plan origin (CX,CZ). */
window.CollinsPodium=(function(){
function build(THREE,SD,BLD,o){o=o||{};
 const CX=o.CX||78,CZ=o.CZ||88,YB=o.YB!=null?o.YB:-7,YD=0,YSB=-0.85;
 const M=(c,p={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8,metalness:0},p));
 const shapeOf=pts=>new THREE.Shape(pts.map(([x,z])=>new THREE.Vector2(x,-z)));
 function extrude(pts,depth,y,mat){const g=new THREE.ExtrudeGeometry(shapeOf(pts),{depth,bevelEnabled:false,curveSegments:8});g.rotateX(-Math.PI/2);g.translate(0,y,0);return new THREE.Mesh(g,mat);}
 function inPoly(x,z,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const[xi,zi]=poly[i],[xj,zj]=poly[j];if(((zi>z)!==(zj>z))&&(x<(xj-xi)*(z-zi)/(zj-zi)+xi))c=!c;}return c;}
 function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}
 let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 const OUT=SD.outline,TOW=BLD['16-20'].outline.map(([x,y])=>[x-CX,y-CZ]);
 const root=new THREE.Group(),gar=new THREE.Group(),deck=new THREE.Group();root.add(gar,deck);
 // ---- lower garage ----
 const concrete=tex(256,256,(g,w,h)=>{g.fillStyle='#8B8F8B';g.fillRect(0,0,w,h);for(let i=0;i<2600;i++){g.fillStyle='rgba('+(rnd()<.5?0:255)+','+(rnd()<.5?0:255)+',0,'+rnd()*.035+')';g.fillRect(rnd()*w,rnd()*h,2,2);}});
 concrete.wrapS=concrete.wrapT=THREE.RepeatWrapping;concrete.repeat.set(1/30,1/30);
 const floorMat=M(0xffffff,{map:concrete,roughness:.95,transparent:true,opacity:1});
 const gFloor=extrude(OUT,0.6,YB-0.6,floorMat);gFloor.receiveShadow=true;gar.add(gFloor);
 const lineMat=new THREE.LineBasicMaterial({color:0xE9ECE6,transparent:true,opacity:.42});
 {const v=SD.floorLines,p=[];for(let i=0;i<v.length;i+=4)p.push(v[i],YB+.03,v[i+1],v[i+2],YB+.03,v[i+3]);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));gar.add(new THREE.LineSegments(g,lineMat));}
 const wallMat=M(0xECEAE3,{side:THREE.DoubleSide,transparent:true,opacity:1});
 {const v=SD.floorLines,pos=[];const H=YSB-YB,th=.28;
  for(let i=0;i<v.length;i+=4){const ax=v[i],az=v[i+1],bx=v[i+2],bz=v[i+3];const L=Math.hypot(bx-ax,bz-az);
   if(L<2.2||!inPoly((ax+bx)/2,(az+bz)/2,TOW))continue;const nx=-(bz-az)/L*th/2,nz=(bx-ax)/L*th/2;
   const q=[[ax+nx,az+nz],[bx+nx,bz+nz],[bx-nx,bz-nz],[ax-nx,az-nz]];const y0=YB,y1=YB+H;
   for(let k=0;k<4;k++){const a=q[k],b=q[(k+1)%4];pos.push(a[0],y0,a[1],b[0],y0,b[1],b[0],y1,b[1],a[0],y0,a[1],b[0],y1,b[1],a[0],y1,a[1]);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,wallMat);m.castShadow=true;gar.add(m);}
 const perimMat=M(0xE7E4DC,{transparent:true,opacity:1});
 {const OUTc=OUT.concat([OUT[0]]);const posts=[];
  for(let i=0;i<OUTc.length-1;i++){const[a0,a1]=OUTc[i],[b0,b1]=OUTc[i+1];const L=Math.hypot(b0-a0,b1-a1);const w=new THREE.Mesh(new THREE.BoxGeometry(L,2.6,.7),perimMat);
   w.position.set((a0+b0)/2,YB+1.3,(a1+b1)/2);w.rotation.y=-Math.atan2(b1-a1,b0-a0);w.castShadow=true;w.receiveShadow=true;gar.add(w);
   const n=Math.floor(L/5);for(let k=1;k<n;k++)posts.push([a0+(b0-a0)*k/n,a1+(b1-a1)*k/n]);}
  const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.22,YSB-YB-2.6,.22),M(0x2E3B42,{roughness:.4}),posts.length);const ob=new THREE.Object3D();
  posts.forEach(([x,z],i)=>{ob.position.set(x,YB+2.6+(YSB-YB-2.6)/2,z);ob.updateMatrix();im.setMatrixAt(i,ob.matrix);});gar.add(im);}
 const colMat=M(0xF0EEE8,{transparent:true,opacity:1});
 {const pts=SD.columns.concat(OUT);const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1.3,YSB-YB,1.9),colMat,pts.length);const ob=new THREE.Object3D();
  pts.forEach(([x,z],i)=>{ob.position.set(x,(YB+YSB)/2,z);ob.updateMatrix();im.setMatrixAt(i,ob.matrix);});im.castShadow=true;gar.add(im);}
 // cars (parking stalls traced from P-001 / P-101)
 const carCols=[0x8A96A0,0xEDEDEA,0x2D3438,0x6B2E2E,0x3F5368,0xBFC4C6,0x1E2326];
 const bodyG=new THREE.BoxGeometry(6,2.4,14.5),cabG=new THREE.BoxGeometry(5.2,1.7,7.2);
 const glassM=M(0x23323A,{roughness:.15,metalness:.5});
 function cars(list,y,parent,occ){const bodies=list.filter(()=>rnd()<occ);const byC={};
  bodies.forEach(s=>{const c=carCols[Math.floor(rnd()*carCols.length)];(byC[c]=byC[c]||[]).push(s);});
  const cab=new THREE.InstancedMesh(cabG,glassM,bodies.length);let ci=0;const ob=new THREE.Object3D();
  Object.entries(byC).forEach(([c,arr])=>{const im=new THREE.InstancedMesh(bodyG,M(+c,{roughness:.35,metalness:.35}),arr.length);
   arr.forEach(([x,z,r],i)=>{const rot=r===0?Math.PI/2:0;ob.rotation.set(0,rot,0);ob.position.set(x,y+1.45,z);ob.updateMatrix();im.setMatrixAt(i,ob.matrix);
    ob.position.set(x,y+3.3,z);ob.updateMatrix();cab.setMatrixAt(ci++,ob.matrix);});im.castShadow=true;parent.add(im);});parent.add(cab);}
 const garCars=new THREE.Group();gar.add(garCars);const garCarsBy={};
 {const all=(SD.stallsG||[]).filter(([x,z])=>!inPoly(x,z,TOW));if(o.carKey){const by={};all.forEach(s=>{const k=o.carKey(s[0],s[1]);(by[k]=by[k]||[]).push(s);});Object.keys(by).sort().forEach(k=>{const gg=new THREE.Group();garCars.add(gg);garCarsBy[k]=gg;cars(by[k],YB,gg,.72);});}else cars(all,YB,garCars,.72);}
 // ---- podium / pool deck ----
 const paver=tex(256,256,(g,w,h)=>{g.fillStyle='#E4D2B6';g.fillRect(0,0,w,h);g.strokeStyle='rgba(150,118,80,.30)';g.lineWidth=2;
  for(let i=0;i<=w;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}
  for(let i=0;i<500;i++){g.fillStyle='rgba(0,0,0,'+rnd()*.03+')';g.fillRect(rnd()*w,rnd()*h,2,2);}});
 paver.wrapS=paver.wrapT=THREE.RepeatWrapping;paver.repeat.set(1/5,1/5);
 const deckMat=M(0xffffff,{map:paver,roughness:.85,transparent:true,opacity:1});
 const deckSlab=extrude(OUT,-YSB,YSB,deckMat);deckSlab.receiveShadow=true;deckSlab.castShadow=true;deck.add(deckSlab);
 const deckEdge=new THREE.LineSegments(new THREE.EdgesGeometry(deckSlab.geometry,30),new THREE.LineBasicMaterial({color:0x6E7D78}));deckEdge.visible=false;deck.add(deckEdge);
 const asphM=M(0x6D7277,{roughness:.95,transparent:true,opacity:1});const deckAsph=[];
 SD.asphalt.forEach(p=>{const a=extrude(p,0.05,YD,asphM);a.receiveShadow=true;deck.add(a);deckAsph.push(a);});
 const stripeM=new THREE.LineBasicMaterial({color:0xF4F2EA,transparent:true,opacity:1});
 {const v=SD.linesL||[],p=[];for(let i=0;i<v.length;i+=4){const mx=(v[i]+v[i+2])/2,mz=(v[i+1]+v[i+3])/2;if(!SD.asphalt.some(a=>inPoly(mx,mz,a)))continue;p.push(v[i],YD+.08,v[i+1],v[i+2],YD+.08,v[i+3]);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));const ls=new THREE.LineSegments(g,stripeM);deck.add(ls);deckAsph.push(ls);}
 const deckCars=new THREE.Group();deck.add(deckCars);
 cars((SD.stallsL||[]).filter(([x,z])=>SD.asphalt.some(a=>inPoly(x,z,a))&&!inPoly(x,z,TOW)),YD,deckCars,.7);deckAsph.push(deckCars);
 const poolM=new THREE.MeshStandardMaterial({color:0x37C9D3,roughness:.08,metalness:.15,transparent:true,opacity:.92});
 const pool=extrude(SD.pool,0.06,YD+0.02,poolM);deck.add(pool);const poolParts=[pool];
 {const ring=SD.pool.concat([SD.pool[0]]).map(([x,z])=>new THREE.Vector3(x,YD+.2,z));{const pl=new THREE.Line(new THREE.BufferGeometry().setFromPoints(ring),new THREE.LineBasicMaterial({color:0xFFFFFF}));deck.add(pl);poolParts.push(pl);}}
 const deckFurn=[];
 // ---- pool deck details (from owner photos: brick round planters with fan palms, hedge planters, cabana, loungers, black fence, globe lamps) ----
 const brickM=M(0xA4583A,{roughness:.85}),gravelM=M(0x2F2F2E,{roughness:1}),hedgeM=M(0x3F6B34,{roughness:.95}),frondM=M(0x5E8C46,{roughness:.8,side:THREE.DoubleSide}),trunkM=M(0x8A7660,{roughness:.9}),
  whiteM=M(0xFAFAF7,{roughness:.6}),blackM=M(0x1E2224,{roughness:.5,metalness:.4}),copeM=M(0xC98E5E,{roughness:.8}),tileM=new THREE.LineBasicMaterial({color:0x1D3D8C}),globeM=new THREE.MeshStandardMaterial({color:0xFFFFFF,emissive:0xFFF4D8,emissiveIntensity:.35,roughness:.3});
 const keep=(...o)=>{o.forEach(x=>{deck.add(x);deckFurn.push(x);});};
 function palm(x,z,y,h){const g=new THREE.Group();const tk=new THREE.Mesh(new THREE.CylinderGeometry(.35,.55,h,8),trunkM);tk.position.y=h/2;g.add(tk);
  for(let i=0;i<11;i++){const a=i/11*Math.PI*2+rnd()*.3;const f=new THREE.Mesh(new THREE.PlaneGeometry(5.2,1.3),frondM);f.position.set(Math.cos(a)*2.3,h-.4-rnd()*.3,Math.sin(a)*2.3);f.rotation.set(0,-a,0);f.rotateZ(-.35-rnd()*.25);g.add(f);}
  g.position.set(x,y,z);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
 const pillShape=(hw,hd)=>{const r=Math.min(hw,hd);const s=new THREE.Shape();s.moveTo(-hw+r,-hd);s.lineTo(hw-r,-hd);s.absarc(hw-r,-hd+r,r,-Math.PI/2,0);s.lineTo(hw,hd-r);s.absarc(hw-r,hd-r,r,0,Math.PI/2);s.lineTo(-hw+r,hd);s.absarc(-hw+r,hd-r,r,Math.PI/2,Math.PI);s.lineTo(-hw,-hd+r);s.absarc(-hw+r,-hd+r,r,Math.PI,Math.PI*1.5);return s;};
 SD.pods.forEach(pd=>{if(pd.t==='circ'){const r=Math.min(pd.r,4.2);const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,1.6,32),brickM);c.position.set(pd.c[0],YD+.8,pd.c[1]);c.castShadow=true;
   const top=new THREE.Mesh(new THREE.CylinderGeometry(r-.45,r-.45,.1,32),gravelM);top.position.set(pd.c[0],YD+1.62,pd.c[1]);keep(c,top,palm(pd.c[0],pd.c[1],YD+1.6,6.5));}
  else{const[x0,z0]=pd.a,[x1,z1]=pd.b;const w=Math.abs(x1-x0),d=Math.abs(z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2;
   const g=new THREE.ExtrudeGeometry(pillShape(w/2,d/2),{depth:1.6,bevelEnabled:false,curveSegments:10});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,brickM);m.position.set(cx,YD,cz);m.castShadow=true;
   const g2=new THREE.ExtrudeGeometry(pillShape(w/2-.5,d/2-.5),{depth:1.9,bevelEnabled:false,curveSegments:10});g2.rotateX(-Math.PI/2);const m2=new THREE.Mesh(g2,hedgeM);m2.position.set(cx,YD+.2,cz);m2.castShadow=true;keep(m,m2);
   const long=w>d,n=Math.max(1,Math.round(Math.max(w,d)/14));for(let k=0;k<n;k++){const f=(k+.5)/n;keep(palm(long?x0+(x1-x0)*f:cx,long?cz:z0+(z1-z0)*f,YD+1.8,5));}}});
 // pool coping + tile line
 {const cx=SD.pool.reduce((a,q)=>a+q[0],0)/SD.pool.length,cz=SD.pool.reduce((a,q)=>a+q[1],0)/SD.pool.length;
  const outer=SD.pool.map(([x,z])=>{const dx=x-cx,dz=z-cz,l=Math.hypot(dx,dz)||1;return [x+dx/l*1.6,z+dz/l*1.6];});
  const sh=shapeOf(outer);sh.holes.push(new THREE.Path(SD.pool.map(([x,z])=>new THREE.Vector2(x,-z))));const cg=new THREE.ExtrudeGeometry(sh,{depth:.18,bevelEnabled:false});cg.rotateX(-Math.PI/2);
  const cope=new THREE.Mesh(cg,copeM);cope.position.y=YD;deck.add(cope);poolParts.push(cope);
  const inner=SD.pool.map(([x,z])=>{const dx=x-cx,dz=z-cz,l=Math.hypot(dx,dz)||1;return new THREE.Vector3(x-dx/l*.35,YD+.12,z-dz/l*.35);});inner.push(inner[0].clone());
  const tl=new THREE.Line(new THREE.BufferGeometry().setFromPoints(inner),tileM);deck.add(tl);poolParts.push(tl);
  // cabana at the west end of the pool, loungers on the south side
  const px0=Math.min(...SD.pool.map(q=>q[0])),pz0=Math.min(...SD.pool.map(q=>q[1])),pz1=Math.max(...SD.pool.map(q=>q[1])),px1=Math.max(...SD.pool.map(q=>q[0]));
  const cab=new THREE.Group();const roof=new THREE.Mesh(new THREE.BoxGeometry(7.5,1.2,pz1-pz0+2),whiteM);roof.position.y=8.4;cab.add(roof);
  [[-3.4,-1],[3.4,-1],[-3.4,1],[3.4,1]].forEach(([dx,s])=>{const po=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,8,6),whiteM);po.position.set(dx,4,s*(pz1-pz0)/2);cab.add(po);});
  const curtain=new THREE.Mesh(new THREE.BoxGeometry(.2,6.5,pz1-pz0+1),new THREE.MeshStandardMaterial({color:0xF4F3EF,transparent:true,opacity:.75}));curtain.position.set(-3.6,4.6,0);cab.add(curtain);
  for(let k=0;k<3;k++){const so=new THREE.Mesh(new THREE.BoxGeometry(2.4,1.3,5),M(0xEDE7DA));so.position.set(0,.65,(k-1)*6);cab.add(so);}
  cab.position.set(px0-5.6,YD,(pz0+pz1)/2);cab.traverse(o=>{if(o.isMesh)o.castShadow=true;});keep(cab);
  for(let k=0;k<6;k++){const ch=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(2.2,.45,6),whiteM);b.position.y=1.1;const bk=new THREE.Mesh(new THREE.BoxGeometry(2.2,.35,2.2),whiteM);bk.position.set(0,1.8,-2.6);bk.rotation.x=-.7;ch.add(b,bk);
   ch.position.set(px0+3+k*6.2,YD,pz1+6.5);keep(ch);}}
 // north (waterfront) edge: hedges, black picket fence, globe lamps — the other edges keep the glass rail
 const NORTH=[0,1,2];const edgeAt=(i,s,off)=>{const[a0,a1]=OUT[i],[b0,b1]=OUT[i+1];const L=Math.hypot(b0-a0,b1-a1);const dx=(b0-a0)/L,dz=(b1-a1)/L;return [a0+dx*s-dz*off,a1+dz*s+dx*off,Math.atan2(b1-a1,b0-a0),L];};
 {const posts=[];NORTH.forEach(i=>{const[, , ang,L]=edgeAt(i,0,0);
   const rail=new THREE.Mesh(new THREE.BoxGeometry(L,.12,.12),blackM);const[mx,mz]=edgeAt(i,L/2,.3);rail.position.set(mx,YD+3.6,mz);rail.rotation.y=-ang;keep(rail);
   const rail2=rail.clone();rail2.position.y=YD+.5;keep(rail2);
   for(let s=0;s<L;s+=.55)posts.push(edgeAt(i,s,.3));
   for(let s=6;s<L-4;s+=14){const[hx,hz]=edgeAt(i,s,2.6);const h=new THREE.Mesh(new THREE.BoxGeometry(10,2.3,2.6),hedgeM);h.position.set(hx,YD+1.15,hz);h.rotation.y=-ang;h.castShadow=true;keep(h);}
   for(let s=12;s<L-4;s+=24){const[lx,lz]=edgeAt(i,s,4.6);const po=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,8,8),blackM);po.position.set(lx,YD+4,lz);const gl=new THREE.Mesh(new THREE.SphereGeometry(.65,16,12),globeM);gl.position.set(lx,YD+8.5,lz);keep(po,gl);}});
  const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.06,3.3,.06),blackM,posts.length);const ob=new THREE.Object3D();posts.forEach(([x,z],k)=>{ob.position.set(x,YD+1.95,z);ob.updateMatrix();im.setMatrixAt(k,ob.matrix);});keep(im);}
 {const OUTc=OUT.concat([OUT[0]]);const gm=new THREE.MeshStandardMaterial({color:0xBFD8DE,transparent:true,opacity:.28,roughness:.05,side:THREE.DoubleSide,depthWrite:false});
  for(let i=0;i<OUTc.length-1;i++){if(NORTH.includes(i))continue;const[a0,a1]=OUTc[i],[b0,b1]=OUTc[i+1];const L=Math.hypot(b0-a0,b1-a1);const w=new THREE.Mesh(new THREE.PlaneGeometry(L,3.4),gm);
   w.position.set((a0+b0)/2,YD+1.7,(a1+b1)/2);w.rotation.y=-Math.atan2(b1-a1,b0-a0);keep(w);}}
 // ---- marina (building view only): waterline at the podium's north edge, finger piers, pilings, moored boats ----
 const marina=new THREE.Group();root.add(marina);marina.visible=!!o.marina;
 if(o.marina){const YW=YB-2.4,YDK=YB+1.6;
  const wpts=[OUT[0],OUT[1],OUT[2],OUT[3],[OUT[3][0]+40,OUT[3][1]],[OUT[3][0]+40,OUT[3][1]-90],[OUT[0][0]-40,OUT[0][1]-90],[OUT[0][0]-40,OUT[0][1]]];
  const water=extrude(wpts,.05,YW,new THREE.MeshStandardMaterial({color:0x1FA7A0,roughness:.15,metalness:.1,transparent:true,opacity:.92}));marina.add(water);
  const deckM=M(0xC9B79A,{roughness:.9}),pileM=M(0x6F6658,{roughness:.9}),capM=M(0xEDEDE8),hullM=M(0xFBFBFA,{roughness:.35}),navyM=M(0x23345A,{roughness:.4}),glassM=M(0x2B3A44,{roughness:.2,metalness:.4});
  const pile=(x,z)=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,10,10),pileM);p.position.set(x,YW+4.2,z);const c=new THREE.Mesh(new THREE.CylinderGeometry(.46,.46,.5,10),capM);c.position.set(x,YW+9.4,z);p.castShadow=true;marina.add(p,c);};
  const boat=(x,z,ang,L)=>{const W=L*.32;const s=new THREE.Shape([new THREE.Vector2(-L/2,-W/2),new THREE.Vector2(L/2-L*.22,-W/2),new THREE.Vector2(L/2,0),new THREE.Vector2(L/2-L*.22,W/2),new THREE.Vector2(-L/2,W/2)]);
   const g=new THREE.ExtrudeGeometry(s,{depth:2.6,bevelEnabled:true,bevelSize:.3,bevelThickness:.3,bevelSegments:2});g.rotateX(-Math.PI/2);const h=new THREE.Mesh(g,hullM);
   const stripe=new THREE.Mesh(new THREE.BoxGeometry(L*.75,.35,W+.05),navyM);stripe.position.set(-L*.08,1.1,0);const cabin=new THREE.Mesh(new THREE.BoxGeometry(L*.28,1.6,W*.7),hullM);cabin.position.set(-L*.02,3.4,0);
   const ws=new THREE.Mesh(new THREE.BoxGeometry(.2,1.2,W*.66),glassM);ws.position.set(L*.12,3.5,0);ws.rotation.z=.5;const tp=new THREE.Mesh(new THREE.BoxGeometry(L*.34,.18,W*.85),navyM);tp.position.set(-L*.05,5.8,0);
   const bg=new THREE.Group();bg.add(h,stripe,cabin,ws,tp);bg.position.set(x,YW-.4,z);bg.rotation.y=ang;bg.traverse(q=>{if(q.isMesh)q.castShadow=true;});marina.add(bg);};
  let slip=0;NORTH.forEach(i=>{const[, ,ang,L]=edgeAt(i,0,0);
   const walk=new THREE.Mesh(new THREE.BoxGeometry(L,.35,5),deckM);const[wx,wz]=edgeAt(i,L/2,-2.6);walk.position.set(wx,YDK,wz);walk.rotation.y=-ang;marina.add(walk);
   for(let s=10;s<L-6;s+=30){const[fx,fz]=edgeAt(i,s,-17);const f=new THREE.Mesh(new THREE.BoxGeometry(4,.35,24),deckM);f.position.set(fx,YDK,fz);f.rotation.y=-ang;marina.add(f);
    const[p1x,p1z]=edgeAt(i,s+2.6,-29);pile(p1x,p1z);const[p2x,p2z]=edgeAt(i,s-2.6,-29);pile(p2x,p2z);const[p3x,p3z]=edgeAt(i,s+13,-31);pile(p3x,p3z);
    if(slip++%2===0){const[bx,bz]=edgeAt(i,s+9,-18);boat(bx,bz,-ang-Math.PI/2,32);}}});}
 // seawall + ground strip (context)
 const site=new THREE.Group();root.add(site);
 const seawall=new THREE.Mesh(new THREE.BoxGeometry(900,3.4,1.6),M(0xCFCBC0));seawall.position.set(0,YB-1.6,-113.2);seawall.receiveShadow=true;site.add(seawall);
 function setDeckMode(mode){const cut=mode==='cut';poolParts.forEach(x=>x.visible=!cut);deckSlab.visible=!cut;deckEdge.visible=cut;deckAsph.forEach(x=>x.visible=!cut);deckFurn.forEach(x=>x.visible=!cut);}
 return {root,gar,garCars,garCarsBy,deck,site,marina,OUT,TOW,inPoly,floorMat,lineMat,wallMat,perimMat,colMat,deckSlab,deckMat,deckEdge,deckAsph,deckFurn,pool,setDeckMode,YB,YD,YSB};}
return {build};})();
