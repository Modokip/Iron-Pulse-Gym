// ===== GERENTE / DUEÑO: planes, usuarios y roles, reportes =====
VISTAS.planes=()=>pintar("Planes y precios",`<form class="card grid" onsubmit="nuevoPlanM(event)"><label>Nombre<input name="n" required></label><label>Duración (meses)<input name="m" type="number" min="1" required></label><label>Precio (RD$)<input name="p" type="number" min="1" required></label><button class="pri">Crear plan</button></form>`+
 tabla(["Plan","Meses","Precio (RD$)","Estado",""],DB.planes.map(p=>[esc(p.nombre),p.meses,`<input id="pr${p.id}" type="number" min="1" value="${p.precio}" style="width:110px"> <button onclick="guardarPrecio(${p.id})">Guardar</button>`,p.activo?"Se vende":"No se ofrece",`<button onclick="togPlan(${p.id})">${p.activo?"Desactivar":"Activar"}</button>`]))+
 `<div class="card"><label>Días para considerar "Por vencer"<input id="dv" type="number" min="1" value="${DB.cfg.diasAviso}" style="width:100px"></label><br><button onclick="DB.cfg.diasAviso=+dv.value;guardar();aviso('Guardado.')">Guardar</button></div>`,"Los precios de ejemplo (1,500 / 4,000 / 14,000) los define el gimnasio.");
function nuevoPlanM(e){const f=datos(e);DB.planes.push({id:sig("planes"),nombre:f.n,meses:+f.m,precio:+f.p,activo:1});guardar();VISTAS.planes();}
function guardarPrecio(id){const v=+$("#pr"+id).value;if(!(v>0))return aviso("Precio inválido.");DB.planes.find(p=>p.id==id).precio=v;guardar();aviso("Precio actualizado.");}
function togPlan(id){const p=DB.planes.find(p=>p.id==id);p.activo=p.activo?0:1;guardar();VISTAS.planes();}

VISTAS.usuarios=()=>pintar("Usuarios y roles",`<form class="card grid" onsubmit="nuevoUsu(event)"><label>Rol<select name="r">${["Entrenador","Recepcionista","Gerente","Dueño"].map(r=>`<option>${r}</option>`).join("")}</select></label>
 <label>Nombre<input name="n" required></label><label>Apellido<input name="a" required></label><label>Correo<input name="c" type="email" required></label><label>Contraseña<input name="k" required minlength="4"></label><button class="pri">Crear usuario</button></form>`+
 tabla(["Usuario","Correo","Rol","Estado",""],DB.usuarios.map(u=>[nom(u),esc(u.correo),u.rol,u.activo?"Activo":"Deshabilitado",u.id==U.id?"(usted)":`<button onclick="togUsu(${u.id})">${u.activo?"Deshabilitar":"Habilitar"}</button>`])),
 "Los usuarios no se borran, se deshabilitan. Los miembros se registran desde Recepción.");
function nuevoUsu(e){const f=datos(e);if(DB.usuarios.some(u=>u.correo==f.c))return aviso("Correo repetido.");DB.usuarios.push({id:sig("usuarios"),rol:f.r,nombre:f.n,apellido:f.a,correo:f.c,clave:f.k,activo:1});guardar();VISTAS.usuarios();}
function togUsu(id){const u=usuario(id);u.activo=u.activo?0:1;guardar();VISTAS.usuarios();}

VISTAS.reportes=()=>{const mes=hoy().slice(0,7),met=["efectivo","tarjeta","transferencia"];
 const ests=DB.miembros.map(m=>({m,x:ultima(m.id),e:estado(ultima(m.id))})),n=t=>ests.filter(o=>o.e.t==t).length;
 pintar("Reportes",`<div class="stats"><div class="stat">Ingresos totales<b>${rd(tot(DB.pagos))}</b></div><div class="stat">Ingresos del mes<b>${rd(tot(DB.pagos.filter(p=>p.fecha.startsWith(mes))))}</b></div>
 <div class="stat">Miembros activos<b>${n("Activa")}</b></div><div class="stat">Por vencer<b>${n("Por vencer")}</b></div><div class="stat">Vencidas<b>${n("Vencida")}</b></div></div>
 <h3>Ingresos por método</h3>`+tabla(["Método","Pagos","Total"],met.map(m=>{const a=DB.pagos.filter(p=>p.metodo==m);return[m,a.length,rd(tot(a))]}))+
 `<h3>Ingresos por plan</h3>`+tabla(["Plan","Pagos","Total"],DB.planes.map(pl=>{const a=DB.pagos.filter(p=>planDe(DB.membresias.find(x=>x.id==p.idMembresia)).id==pl.id);return[esc(pl.nombre),a.length,rd(tot(a))]}))+
 `<h3>Membresías por vencer o vencidas</h3>`+tabla(["Miembro","Teléfono","Vence","Estado"],ests.filter(o=>o.e.t=="Por vencer"||o.e.t=="Vencida").map(o=>[miembroNom(o.m),esc(o.m.telefono),o.x.venc,badge(o.e)]))+
 `<button onclick="print()">🖨️ Imprimir reporte</button>`,"Los reportes se calculan en vivo con los pagos y las membresías; no se guardan aparte.");};
