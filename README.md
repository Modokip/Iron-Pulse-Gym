# IPMS · Módulo de Recepción (Persona 2)

Miembros, membresías y pagos en persona. PHP 8 + MySQL (PDO), HTML/CSS/JS sin librerías.

## Instalación (XAMPP)
1. Copia la carpeta `ipms` a `C:\xampp\htdocs\ipms`.
2. Inicia Apache y MySQL; importa `ipms_schema.sql` desde phpMyAdmin (crea `ipms_db`, las 11 tablas, la vista y datos de prueba).
3. Revisa `config/config.php` (usuario y clave de MySQL, `BASE_URL`).
4. Entra a `http://localhost/ipms/login.php` con `recepcion@ironpulse.do` / `Hierro2026!` (usuarios de prueba creados por el script SQL). `dev_login.php` ya no hace falta: bórralo.
5. Entra a `http://localhost/ipms/recepcion/index.php`.

## Contrato con el login (Persona 1)
Al iniciar sesión: `$_SESSION['id_usuario']`, `$_SESSION['rol']` (texto de `roles.nombre`) y `$_SESSION['nombre']`.
Este módulo también espera `/login.php` y `/logout.php` en la raíz de `ipms`.

## Pantallas
| Archivo | Qué hace |
|---|---|
| `recepcion/index.php` | Panel: activas, por vencer, vencidas, cobrado hoy, buscador |
| `recepcion/miembros.php` | Lista con búsqueda y filtro por estado (lista de vencimientos) |
| `recepcion/miembro_nuevo.php` | Crea usuario + miembro + primera membresía + pago en una sola transacción |
| `recepcion/cobro.php` | Renueva/asigna plan y cobra (efectivo, tarjeta, transferencia) |
| `recepcion/caja.php` | Control diario de caja por método y por cajero; imprimible |
| `recepcion/recibo.php` | Recibo imprimible con número único |

## Reglas que cumple
- Estado de la membresía calculado por fecha (Activa / Por vencer ≤ 7 días / Vencida); nunca se guarda.
- Renovar crea una fila nueva en `membresias`; si aún está vigente, empieza al día siguiente del vencimiento.
- Recibo único `IP-AAAA-000001`, ligado a la membresía y a la recepcionista (`registrado_por`). Si dos cobros chocan, se reintenta.
- El monto sale del plan en la base de datos, no del formulario. Un pago es completo (sin abonos).
- Contraseñas con `password_hash()`, consultas con PDO preparado, CSRF en todos los formularios, salida escapada.
- No se guarda cédula, dirección ni datos de salud (Ley 172-13).

## Notas / pendientes de confirmar con el grupo
- La contraseña temporal del miembro se muestra una sola vez en el recibo. Si el login exige cambio de clave, coordinarlo con Persona 1.
- La tabla `pagos` no tiene campo de referencia para tarjeta/transferencia; si lo quieren, agregar la columna.
- El "efectivo recibido" solo calcula el cambio en pantalla; no se guarda.
