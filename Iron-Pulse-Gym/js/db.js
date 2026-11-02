// ===== DATOS Y UTILIDADES COMPARTIDAS (reflejan las tablas del Anexo A) =====
const $=s=>document.querySelector(s);
const hoy=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const sumaDias=(f,d)=>{const x=new Date(f);x.setUTCDate(x.getUTCDate()+d);return x.toISOString().slice(0,10)};
const sumaMeses=(f,m)=>{const x=new Date(f);x.setUTCMonth(x.getUTCMonth()+m);return x.toISOString().slice(0,10)};
const dias=f=>Math.round((new Date(f)-new Date(hoy()))/864e5);
const rd=n=>"RD$ "+Number(n).toLocaleString("es-DO",{minimumFractionDigits:2});
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function semilla(){const h=hoy(),u=(id,rol,n,a,c)=>({id,rol,nombre:n,apellido:a,correo:c,clave:"1234",activo:1});
return{cfg:{diasAviso:7},
 niveles:[{id:1,nombre:"Básico",nutricion:0},{id:2,nombre:"Intermedio",nutricion:0},{id:3,nombre:"Avanzado",nutricion:1}],
 planes:[{id:1,nombre:"Mensual",meses:1,precio:1500,activo:1},{id:2,nombre:"Trimestral",meses:3,precio:4000,activo:1},{id:3,nombre:"Anual",meses:12,precio:14000,activo:1}],
 usuarios:[u(1,"Dueño","Carlos","Dueño","dueno@ironpulse.com"),u(2,"Gerente","Ana","Gerente","gerente@ironpulse.com"),u(3,"Recepcionista","Rosa","Pérez","recepcion@ironpulse.com"),u(4,"Entrenador","Luis","Mena","entrenador@ironpulse.com"),u(5,"Miembro","Juan","Gómez","miembro@ironpulse.com"),u(6,"Miembro","María","Soto","maria@ironpulse.com")],
 miembros:[{id:1,idUsuario:5,idEntrenador:4,idNivel:1,telefono:"809-555-0101",ingreso:sumaDias(h,-40)},{id:2,idUsuario:6,idEntrenador:4,idNivel:3,telefono:"809-555-0102",ingreso:sumaDias(h,-20)}],
 membresias:[{id:1,idMiembro:1,idPlan:1,inicio:sumaDias(h,-27),venc:sumaDias(h,3)},{id:2,idMiembro:2,idPlan:2,inicio:sumaDias(h,-20),venc:sumaDias(h,70)}],
 pagos:[{id:1,idMembresia:1,por:3,recibo:"R-0001",monto:1500,metodo:"efectivo",fecha:sumaDias(h,-27)+"T09:00"},{id:2,idMembresia:2,por:3,recibo:"R-0002",monto:4000,metodo:"tarjeta",fecha:h+"T08:30"}],
 ejercicios:[{id:1,nombre:"Press de banca",grupo:"Pecho",desc:"",activo:1},{id:2,nombre:"Sentadilla",grupo:"Pierna",desc:"",activo:1},{id:3,nombre:"Remo con barra",grupo:"Espalda",desc:"",activo:1}],
 rutinas:[{id:1,idMiembro:1,nombre:"Rutina de fuerza, semana 1",objetivo:"Ganar fuerza",fecha:h,activa:1,items:[{idEj:1,dia:1,series:4,reps:"10-12",notas:""},{idEj:2,dia:2,series:4,reps:"12",notas:"Bajar controlado"}]}],
 nutricion:[{id:1,idMiembro:2,desc:"Desayuno: avena con fruta. Almuerzo: pollo con arroz y ensalada. Cena: pescado con vegetales.",fecha:h,activo:1}]};}
let DB=JSON.parse(localStorage.getItem("ipms_db")||"null");
if(!DB){DB=semilla();guardar();}
function guardar(){localStorage.setItem("ipms_db",JSON.stringify(DB));}
const sig=t=>Math.max(0,...DB[t].map(x=>x.id))+1;
const usuario=id=>DB.usuarios.find(u=>u.id==id);
const nom=u=>u?esc(u.nombre+" "+u.apellido):"—";
const miembroNom=m=>nom(usuario(m.idUsuario));
const miembroDe=x=>DB.miembros.find(m=>m.id==x.idMiembro);
const planDe=x=>DB.planes.find(p=>p.id==x.idPlan);
const nivelDe=m=>DB.niveles.find(n=>n.id==m.idNivel)||{nombre:"—",nutricion:0};
const ultima=idM=>DB.membresias.filter(x=>x.idMiembro==idM).sort((a,b)=>a.venc<b.venc?1:-1)[0];
// Regla A.5: Activa si vence en más de 7 días, Por vencer si <=7, Vencida si ya pasó
const estado=x=>{if(!x)return{t:"Sin membresía",c:"gris",d:0};const d=dias(x.venc);
 return d<0?{t:"Vencida",c:"rojo",d}:d<=DB.cfg.diasAviso?{t:"Por vencer",c:"amar",d}:{t:"Activa",c:"verde",d}};
const badge=e=>`<span class="b ${e.c}">${e.t}</span>`;
const tot=a=>a.reduce((s,p)=>s+p.monto,0);
const opts=(a,f)=>a.map(f).join("");
const datos=e=>{e.preventDefault();return Object.fromEntries(new FormData(e.target))};
const tabla=(h,f)=>f.length?`<div class="tw"><table><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${f.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`:`<p class="vacio">Sin registros.</p>`;
