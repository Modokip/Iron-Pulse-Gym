// ===== ENTRENADOR: mis miembros, rutinas, nutrición, catálogo de ejercicios =====
const misMiembros=()=>DB.miembros.filter(m=>m.idEntrenador==U.id); // solo ve a sus miembros (A.5)
VISTAS.mismiem=()=>pintar("Mis miembros",tabla(["Miembro","Nivel","Teléfono","Membresía","Rutina activa"],misMiembros().map(m=>{const r=DB.rutinas.find(r=>r.idMiembro==m.id&&r.activa);
 return[miembroNom(m),nivelDe(m).nombre,esc(m.telefono),badge(estado(ultima(m.id))),r?esc(r.nombre):"Sin rutina"]})),"Aquí solo aparecen los miembros que tiene asignados.");

VISTAS.rutinas=()=>{const ms=misMiembros(),ej=DB.ejercicios.filter(e=>e.activo);
 const cards=ms.map(m=>{const r=DB.rutinas.find(r=>r.idMiembro==m.id&&r.activa);if(!r)return"";
 return`<div class="card"><b>${miembroNom(m)}</b> · ${esc(r.nombre)} <small>${esc(r.objetivo)}</small>`+
 tabla(["Día","Ejercicio","Series","Reps","Notas"],r.items.slice().sort((a,b)=>a.dia-b.dia).map(i=>[i.dia,esc(DB.ejercicios.find(e=>e.id==i.idEj).nombre),i.series,esc(i.reps),esc(i.notas)]))+
 `<form class="grid" onsubmit="addItem(event,${r.id})"><label>Ejercicio<select name="ej">${opts(ej,e=>`<option value="${e.id}">${esc(e.nombre)}</option>`)}</select></label>
 <label>Día<input name="dia" type="number" min="1" value="1"></label><label>Series<input name="series" type="number" min="1" value="3"></label>
 <label>Repeticiones<input name="reps" value="12"></label><label>Notas<input name="notas"></label><button class="pri">Agregar ejercicio</button></form></div>`}).join("");
 pintar("Rutinas",`<form class="card grid" onsubmit="nuevaRutina(event)"><label>Miembro<select name="m" required>${opts(ms,m=>`<option value="${m.id}">${miembroNom(m)}</option>`)}</select></label>
 <label>Nombre<input name="nombre" required placeholder="Rutina de fuerza, semana 1"></label><label>Objetivo<input name="obj"></label>
 <button class="pri">Crear y asignar rutina</button></form>`+cards,"Cree una rutina para un miembro y agréguele ejercicios del catálogo. La rutina anterior queda como histórica.");};
function nuevaRutina(e){const f=datos(e);DB.rutinas.filter(r=>r.idMiembro==f.m).forEach(r=>r.activa=0);
 DB.rutinas.push({id:sig("rutinas"),idMiembro:+f.m,nombre:f.nombre,objetivo:f.obj,fecha:hoy(),activa:1,items:[]});guardar();aviso("Rutina asignada.");VISTAS.rutinas();}
function addItem(e,id){const f=datos(e);DB.rutinas.find(r=>r.id==id).items.push({idEj:+f.ej,dia:+f.dia,series:+f.series,reps:f.reps,notas:f.notas});guardar();VISTAS.rutinas();}

VISTAS.nutri=()=>{const av=misMiembros().filter(m=>nivelDe(m).nutricion);
 pintar("Plan de nutrición",(av.length?`<form class="card" onsubmit="nuevoPlan(event)"><label>Miembro (nivel avanzado)<select name="m">${opts(av,m=>`<option value="${m.id}">${miembroNom(m)}</option>`)}</select></label><br>
 <label>Plan de alimentación<textarea name="d" rows="4" required></textarea></label><br><button class="pri">Guardar plan</button></form>`:`<p class="card">No tiene miembros de nivel avanzado.</p>`)+
 tabla(["Miembro","Fecha","Plan","Estado"],DB.nutricion.filter(n=>av.some(m=>m.id==n.idMiembro)).map(n=>[miembroNom(DB.miembros.find(m=>m.id==n.idMiembro)),n.fecha,esc(n.desc),n.activo?"Vigente":"Anterior"])),
 "El plan de nutrición solo se crea para miembros del nivel Avanzado.");};
function nuevoPlan(e){const f=datos(e),m=DB.miembros.find(m=>m.id==f.m);if(!nivelDe(m).nutricion)return aviso("Su nivel no incluye nutrición.");
 DB.nutricion.filter(n=>n.idMiembro==m.id).forEach(n=>n.activo=0);DB.nutricion.push({id:sig("nutricion"),idMiembro:m.id,desc:f.d,fecha:hoy(),activo:1});guardar();aviso("Plan guardado.");VISTAS.nutri();}

VISTAS.ejer=()=>pintar("Catálogo de ejercicios",`<form class="card grid" onsubmit="nuevoEj(event)"><label>Nombre<input name="n" required></label><label>Grupo muscular<input name="g"></label><label>Descripción<input name="d"></label><button class="pri">Agregar</button></form>`+
 tabla(["Ejercicio","Grupo","Descripción","Estado",""],DB.ejercicios.map(e=>[esc(e.nombre),esc(e.grupo),esc(e.desc),e.activo?"Disponible":"Oculto",`<button onclick="togEj(${e.id})">${e.activo?"Ocultar":"Mostrar"}</button>`])),"Los ejercicios no se borran: se ocultan.");
function nuevoEj(e){const f=datos(e);if(DB.ejercicios.some(x=>x.nombre.toLowerCase()==f.n.toLowerCase()))return aviso("Ya existe.");DB.ejercicios.push({id:sig("ejercicios"),nombre:f.n,grupo:f.g,desc:f.d,activo:1});guardar();VISTAS.ejer();}
function togEj(id){const e=DB.ejercicios.find(e=>e.id==id);e.activo=e.activo?0:1;guardar();VISTAS.ejer();}
