// ===== MIEMBRO: mi membresía/pagos y mi rutina/nutrición =====
const yo=()=>DB.miembros.find(m=>m.idUsuario==U.id);
VISTAS.mimem=()=>{const m=yo(),x=m&&ultima(m.id),e=estado(x);
 pintar("Mi membresía y pagos",m&&x?`<div class="card"><h3>${esc(planDe(x).nombre)} ${badge(e)}</h3><p>Desde <b>${x.inicio}</b> hasta <b>${x.venc}</b> ${e.d>=0?`(faltan ${e.d} días)`:`(venció hace ${-e.d} días)`}</p><p>Nivel de tutoría: <b>${nivelDe(m).nombre}</b> · Entrenador: <b>${nom(usuario(m.idEntrenador))}</b></p></div>
 <h3>Mi historial de pagos</h3>`+tabla(["Recibo","Plan","Monto","Método","Fecha"],DB.pagos.filter(p=>miembroDe(DB.membresias.find(x=>x.id==p.idMembresia)).id==m.id).map(p=>[p.recibo,esc(planDe(DB.membresias.find(x=>x.id==p.idMembresia)).nombre),rd(p.monto),p.metodo,p.fecha.replace("T"," ")])):`<p class="card">Aún no tiene membresía. Pase por recepción.</p>`,"Aquí ve el estado y vencimiento de su membresía y sus pagos.");};
VISTAS.mirut=()=>{const m=yo(),r=m&&DB.rutinas.find(r=>r.idMiembro==m.id&&r.activa),np=m&&DB.nutricion.find(n=>n.idMiembro==m.id&&n.activo);
 const dd=r?[...new Set(r.items.map(i=>i.dia))].sort((a,b)=>a-b):[];
 pintar("Mi rutina y nutrición",(r?`<div class="card"><h3>${esc(r.nombre)}</h3><p>${esc(r.objetivo)}</p></div>`+dd.map(d=>`<h3>Día ${d}</h3>`+tabla(["Ejercicio","Series","Repeticiones","Notas"],r.items.filter(i=>i.dia==d).map(i=>[esc(DB.ejercicios.find(e=>e.id==i.idEj).nombre),i.series,esc(i.reps),esc(i.notas)]))).join(""):`<p class="card">Su entrenador aún no le asigna una rutina.</p>`)+
 (m&&nivelDe(m).nutricion?`<h3>Plan de nutrición</h3><div class="card">${np?esc(np.desc):"Su entrenador aún no lo prepara."}</div>`:""),"Su rutina y su plan de nutrición (solo nivel Avanzado).");};
