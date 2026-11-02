// ===== NAVEGACIÓN POR ROL (carga al final, después de las vistas) =====
const U=DB.usuarios.find(u=>u.id==sessionStorage.getItem("ipms_ses"));
if(!U)location="index.html";
const REC=[["regmiem","👤 Registrar miembro"],["membresias","🪪 Membresías"],["pagos","💳 Pagos"],["venc","⏰ Vencimientos"]];
const MENU={
 Miembro:[["mimem","🪪 Mi membresía y pagos"],["mirut","🏋️ Mi rutina y nutrición"]],
 Entrenador:[["mismiem","👥 Mis miembros"],["rutinas","📋 Rutinas"],["nutri","🥗 Nutrición"],["ejer","📚 Ejercicios"]],
 Recepcionista:REC,
 Gerente:[...REC,["planes","💲 Planes y precios"],["usuarios","🔐 Usuarios y roles"],["reportes","📊 Reportes"]],
 Dueño:[["reportes","📊 Reportes"]]};
function pintar(t,h,a=""){$("#contenido").innerHTML=`<h2>${t} <details class="ayuda"><summary>?</summary>${a}</details></h2>${h}`;}
function aviso(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),2600);}
function ir(v){VISTAS[v]();document.querySelectorAll("#menu button").forEach(b=>b.classList.toggle("on",b.dataset.v==v));}
if(U){$("#quien").textContent=U.nombre+" · "+U.rol;
 $("#menu").innerHTML=MENU[U.rol].map(([v,t])=>`<button data-v="${v}" onclick="ir('${v}')">${t}</button>`).join("");
 ir(MENU[U.rol][0][0]);}
