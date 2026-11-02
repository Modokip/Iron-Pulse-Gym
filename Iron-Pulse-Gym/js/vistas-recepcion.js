// ===== RECEPCIÓN (y Gerente): miembros, membresías, pagos, vencimientos =====
VISTAS={};
VISTAS.regmiem=()=>{const ents=DB.usuarios.filter(u=>u.rol=="Entrenador"&&u.activo);
 pintar("Registrar miembro",`<form class="card grid" onsubmit="regMiembro(event)">
 <label>Nombre<input name="nombre" required></label><label>Apellido<input name="apellido" required></label>
 <label>Correo<input type="email" name="correo" required></label><label>Teléfono<input name="telefono"></label>
 <label>Fecha de nacimiento<input type="date" name="nac"></label>
 <label>Entrenador<select name="ent" required>${opts(ents,u=>`<option value="${u.id}">${nom(u)}</option>`)}</select></label>
 <label>Nivel de tutoría<select name="nivel">${opts(DB.niveles,n=>`<option value="${n.id}">${n.nombre}</option>`)}</select></label>
 <button class="pri">Registrar miembro</button></form><h3>Miembros registrados</h3>`+
 tabla(["Miembro","Correo","Teléfono","Entrenador","Nivel","Ingreso"],DB.miembros.map(m=>[miembroNom(m),esc(usuario(m.idUsuario).correo),esc(m.telefono),nom(usuario(m.idEntrenador)),nivelDe(m).nombre,m.ingreso])),
 "Llene los datos y presione Registrar. La contraseña inicial del miembro es 1234. El correo no se puede repetir.");};
function regMiembro(e){const f=datos(e);
 if(DB.usuarios.some(u=>u.correo==f.correo))return aviso("Ese correo ya está registrado.");
 const id=sig("usuarios");DB.usuarios.push({id,rol:"Miembro",nombre:f.nombre,apellido:f.apellido,correo:f.correo,clave:"1234",activo:1});
 DB.miembros.push({id:sig("miembros"),idUsuario:id,idEntrenador:+f.ent,idNivel:+f.nivel,telefono:f.telefono,nac:f.nac,ingreso:hoy()});
 guardar();aviso("Miembro registrado.");VISTAS.regmiem();}

VISTAS.membresias=()=>{
 pintar("Asignar y renovar membresías",`<form class="card grid" onsubmit="asignarMem(event)">
 <label>Miembro<select name="m">${opts(DB.miembros,m=>`<option value="${m.id}">${miembroNom(m)}</option>`)}</select></label>
 <label>Plan<select name="p">${opts(DB.planes.filter(p=>p.activo),p=>`<option value="${p.id}">${esc(p.nombre)} · ${rd(p.precio)}</option>`)}</select></label>
 <button class="pri">Asignar / renovar</button></form><h3>Historial de membresías</h3>`+
 tabla(["Miembro","Plan","Inicio","Vence","Estado"],DB.membresias.slice().reverse().map(x=>[miembroNom(miembroDe(x)),esc(planDe(x).nombre),x.inicio,x.venc,badge(estado(x))])),
 "Renovar crea una membresía nueva; el historial nunca se borra. Luego registre el pago en la pantalla Pagos.");};
function asignarMem(e){const f=datos(e),p=DB.planes.find(p=>p.id==f.p),i=hoy();
 DB.membresias.push({id:sig("membresias"),idMiembro:+f.m,idPlan:p.id,inicio:i,venc:sumaMeses(i,p.meses)});
 guardar();aviso("Membresía asignada. Falta registrar el pago.");VISTAS.membresias();}

VISTAS.pagos=()=>{const met=["efectivo","tarjeta","transferencia"];
 const libres=DB.membresias.filter(x=>!DB.pagos.some(p=>p.idMembresia==x.id));
 const hp=DB.pagos.filter(p=>p.fecha.slice(0,10)==hoy()&&(U.rol!="Recepcionista"||p.por==U.id));
 pintar("Registrar pagos",(libres.length?`<form class="card grid" onsubmit="regPago(event)">
 <label>Membresía por cobrar<select name="mem" onchange="this.form.monto.value=this.selectedOptions[0].dataset.p">${opts(libres,x=>`<option value="${x.id}" data-p="${planDe(x).precio}">${miembroNom(miembroDe(x))} · ${esc(planDe(x).nombre)}</option>`)}</select></label>
 <label>Monto (RD$)<input name="monto" type="number" min="1" step="0.01" required value="${planDe(libres[0]).precio}"></label>
 <label>Método<select name="metodo">${met.map(m=>`<option>${m}</option>`).join("")}</select></label>
 <button class="pri">Cobrar y generar recibo</button></form>`:`<p class="card">No hay membresías pendientes de pago.</p>`)+
 `<h3>Cierre del día (${hoy()})</h3><div class="stats">${met.map(m=>`<div class="stat">${m}<b>${rd(tot(hp.filter(p=>p.metodo==m)))}</b></div>`).join("")}<div class="stat">Total<b>${rd(tot(hp))}</b></div></div><h3>Pagos registrados</h3>`+
 tabla(["Recibo","Miembro","Plan","Monto","Método","Fecha","Cobró"],DB.pagos.slice().reverse().map(p=>{const x=DB.membresias.find(x=>x.id==p.idMembresia);return[p.recibo,miembroNom(miembroDe(x)),esc(planDe(x).nombre),rd(p.monto),p.metodo,p.fecha.replace("T"," "),nom(usuario(p.por))]})),
 "Cada pago corresponde completo a una membresía (sin abonos) y queda ligado a su recibo único. El cierre del día suma los pagos de hoy.");};
function regPago(e){const f=datos(e),m=+f.monto;if(!(m>0))return aviso("El monto debe ser mayor que cero.");
 const r="R-"+String(sig("pagos")).padStart(4,"0");
 DB.pagos.push({id:sig("pagos"),idMembresia:+f.mem,por:U.id,recibo:r,monto:m,metodo:f.metodo,fecha:hoy()+"T"+new Date().toTimeString().slice(0,5)});
 guardar();aviso("Pago registrado. Recibo "+r);VISTAS.pagos();}

VISTAS.venc=(fil="todas")=>{
 const filas=DB.miembros.map(m=>({m,x:ultima(m.id)})).map(o=>({...o,e:estado(o.x)})).filter(o=>fil=="todas"||o.e.t==fil).sort((a,b)=>(a.x?dias(a.x.venc):-999)-(b.x?dias(b.x.venc):-999));
 pintar("Vencimientos",`<p>${["todas","Por vencer","Vencida"].map(f=>`<button onclick="VISTAS.venc('${f}')">${f=="Vencida"?"Vencidas":f=="todas"?"Todas":f}</button>`).join(" ")}</p>`+
 tabla(["Miembro","Teléfono","Plan","Vence","Días","Estado"],filas.map(o=>[miembroNom(o.m),esc(o.m.telefono),o.x?esc(planDe(o.x).nombre):"—",o.x?o.x.venc:"—",o.x?o.e.d:"—",badge(o.e)])),
 "El estado se calcula con la fecha de vencimiento: Por vencer = faltan 7 días o menos (el gerente puede cambiar ese número).");};
