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
 const garCars=new THREE.Group();gar.add(garCars);cars((SD.stallsG||[]).filter(([x,z])=>!inPoly(x,z,TOW)),YB,garCars,.72);
 // ---- podium / pool deck ----
 const paver=tex(256,256,(g,w,h)=>{g.fillStyle='#E9E3D6';g.fillRect(0,0,w,h);g.strokeStyle='rgba(120,105,80,.22)';g.lineWidth=2;
  for(let i=0;i<=w;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}
  for(let i=0;i<500;i++){g.fillStyle='rgba(0,0,0,'+rnd()*.03+')';g.fillRect(rnd()*w,rnd()*h,2,2);}});
 paver.wrapS=paver.wrapT=THREE.RepeatWrapping;paver.repeat.set(1/8,1/8);
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
 const poolM=new THREE.MeshStandardMaterial({color:0x3FA9C1,roughness:.08,metalness:.15,transparent:true,opacity:.92});
 const pool=extrude(SD.pool,0.06,YD+0.02,poolM);deck.add(pool);
 {const ring=SD.pool.concat([SD.pool[0]]).map(([x,z])=>new THREE.Vector3(x,YD+.2,z));deck.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ring),new THREE.LineBasicMaterial({color:0xFFFFFF})));}
 const deckFurn=[];const planterM=M(0xF3F0E8),greenM=M(0x6E9A63,{roughness:.9}),treeM=M(0x4F7F4A,{roughness:.9}),trunkM=M(0x7A6450);
 SD.pods.forEach(p=>{if(p.t==='circ'){const c=new THREE.Mesh(new THREE.CylinderGeometry(p.r,p.r,2,28),planterM);c.position.set(p.c[0],YD+1,p.c[1]);c.castShadow=true;
   const tr=new THREE.Mesh(new THREE.SphereGeometry(p.r*.9,16,12),treeM);tr.position.set(p.c[0],YD+5,p.c[1]);tr.castShadow=true;
   const tk=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,3,8),trunkM);tk.position.set(p.c[0],YD+2.8,p.c[1]);deck.add(c,tr,tk);deckFurn.push(c,tr,tk);}
  else{const[x0,z0]=p.a,[x1,z1]=p.b;const w=Math.abs(x1-x0),d=Math.abs(z1-z0),r=Math.min(w,d)/2,cx=(x0+x1)/2,cz=(z0+z1)/2,hw=w/2,hd=d/2;
   const s=new THREE.Shape();s.moveTo(-hw+r,-hd);s.lineTo(hw-r,-hd);s.absarc(hw-r,-hd+r,r,-Math.PI/2,0);s.lineTo(hw,hd-r);s.absarc(hw-r,hd-r,r,0,Math.PI/2);s.lineTo(-hw+r,hd);s.absarc(-hw+r,hd-r,r,Math.PI/2,Math.PI);s.lineTo(-hw,-hd+r);s.absarc(-hw+r,-hd+r,r,Math.PI,Math.PI*1.5);
   const g=new THREE.ExtrudeGeometry(s,{depth:1.8,bevelEnabled:false,curveSegments:10});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,planterM);m.position.set(cx,YD,cz);m.castShadow=true;
   const g2=new THREE.ExtrudeGeometry(s,{depth:.4,bevelEnabled:false,curveSegments:10});g2.rotateX(-Math.PI/2);g2.scale(.86,1,.8);const m2=new THREE.Mesh(g2,greenM);m2.position.set(cx,YD+1.8,cz);deck.add(m,m2);deckFurn.push(m,m2);}});
 {const OUTc=OUT.concat([OUT[0]]);const gm=new THREE.MeshStandardMaterial({color:0xBFD8DE,transparent:true,opacity:.28,roughness:.05,side:THREE.DoubleSide,depthWrite:false});
  for(let i=0;i<OUTc.length-1;i++){const[a0,a1]=OUTc[i],[b0,b1]=OUTc[i+1];const L=Math.hypot(b0-a0,b1-a1);const w=new THREE.Mesh(new THREE.PlaneGeometry(L,3.4),gm);
   w.position.set((a0+b0)/2,YD+1.7,(a1+b1)/2);w.rotation.y=-Math.atan2(b1-a1,b0-a0);deck.add(w);deckFurn.push(w);}}
 // seawall + ground strip (context)
 const site=new THREE.Group();root.add(site);
 const seawall=new THREE.Mesh(new THREE.BoxGeometry(900,3.4,1.6),M(0xCFCBC0));seawall.position.set(0,YB-1.6,-113.2);seawall.receiveShadow=true;site.add(seawall);
 function setDeckMode(mode){const cut=mode==='cut';deckSlab.visible=!cut;deckEdge.visible=cut;deckAsph.forEach(x=>x.visible=!cut);deckFurn.forEach(x=>x.visible=!cut);}
 return {root,gar,garCars,deck,site,OUT,TOW,inPoly,floorMat,lineMat,wallMat,perimMat,colMat,deckSlab,deckMat,deckEdge,deckAsph,deckFurn,pool,setDeckMode,YB,YD,YSB};}
return {build};})();
