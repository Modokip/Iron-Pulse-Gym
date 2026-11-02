<?php
// Login mínimo para poder probar el módulo. Persona 1 puede reemplazarlo conservando las 3 variables de sesión.
require_once __DIR__ . '/includes/helpers.php';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_validar();
    $st = db()->prepare("SELECT u.id_usuario, u.nombre, u.contrasena_hash, r.nombre AS rol
                         FROM usuarios u JOIN roles r ON r.id_rol = u.id_rol WHERE u.correo = ? AND u.activo = 1");
    $st->execute([trim($_POST['correo'] ?? '')]);
    $u = $st->fetch();
    if ($u && password_verify($_POST['clave'] ?? '', $u['contrasena_hash'])) {
        session_regenerate_id(true);
        $_SESSION['id_usuario'] = (int)$u['id_usuario'];
        $_SESSION['rol'] = $u['rol'];
        $_SESSION['nombre'] = $u['nombre'];
        header('Location: ' . BASE_URL . '/recepcion/index.php');   // por ahora solo existe el módulo de recepción
        exit;
    }
    $error = 'Correo o contraseña incorrectos.';
}
?><!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Entrar · IPMS</title>
<link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/recepcion.css"></head><body>
<main class="contenido" style="max-width:420px;margin-top:8vh">
<h1>Iron Pulse Gym</h1>
<?php if ($error) echo '<div class="aviso error" role="alert">' . e($error) . '</div>'; ?>
<form method="post" class="caja"><?= csrf_campo() ?>
  <label for="correo">Correo</label><input id="correo" name="correo" type="email" required autofocus>
  <label for="clave">Contraseña</label><input id="clave" name="clave" type="password" required>
  <button class="btn grande">Entrar</button>
</form></main></body></html>
