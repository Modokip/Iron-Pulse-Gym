
<?php
// Iron Pulse Gym - Modulo de Gerencia
// Persona 3: Automatizacion y Reportes

$fecha_actual = date('Y-m-d');

$estados = [
    'Activa' => 0,
    'Por vencer' => 0,
    'Vencida' => 0
];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerencia | Iron Pulse Gym</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background: #111827;
            color: #f3f4f6;
        }

        header {
            background: #1f2937;
            padding: 20px;
            border-bottom: 3px solid #ef4444;
        }

        header h1 {
            color: #ef4444;
            font-size: 24px;
        }

        header p {
            margin-top: 6px;
            color: #9ca3af;
        }

        main {
            padding: 20px;
            max-width: 1100px;
            margin: auto;
        }

        .bienvenida {
            margin-bottom: 25px;
        }

        .bienvenida h2 {
            margin-bottom: 8px;
        }

        .tarjetas {
            display: grid;
            grid-template-columns:
                repeat(auto-fit, minmax(220px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .tarjeta {
            background: #1f2937;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #ef4444;
        }

        .tarjeta h3 {
            font-size: 15px;
            color: #9ca3af;
            margin-bottom: 12px;
        }

        .tarjeta p {
            font-size: 28px;
            font-weight: bold;
        }

        .seccion {
            background: #1f2937;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }

        .seccion h2 {
            margin-bottom: 18px;
            font-size: 20px;
        }

        .estado {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #374151;
        }

        .activo {
            color: #22c55e;
        }

        .por-vencer {
            color: #facc15;
        }

        .vencido {
            color: #f87171;
        }

        .botones {
            display: grid;
            grid-template-columns:
                repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
        }

        .boton {
            display: block;
            text-align: center;
            background: #ef4444;
            color: white;
            text-decoration: none;
            padding: 14px;
            border-radius: 8px;
            font-weight: bold;
        }

        .boton:hover {
            background: #dc2626;
        }

        footer {
            text-align: center;
            padding: 20px;
            color: #9ca3af;
            font-size: 13px;
        }
    </style>
</head>

<body>

<header>
    <h1>IRON PULSE GYM</h1>
    <p>Panel de Gerencia y Administración</p>
</header>

<main>

    <section class="bienvenida">
        <h2>Panel de control</h2>
        <p>Resumen general del gimnasio</p>
    </section>

    <section class="tarjetas">

        <div class="tarjeta">
            <h3>Ingresos totales</h3>
            <p>RD$ 0.00</p>
        </div>

        <div class="tarjeta">
            <h3>Miembros activos</h3>
            <p>0</p>
        </div>

        <div class="tarjeta">
            <h3>Por vencer</h3>
            <p>0</p>
        </div>

        <div class="tarjeta">
            <h3>Membresías vencidas</h3>
            <p>0</p>
        </div>

    </section>

    <section class="seccion">
        <h2>Estado de membresías</h2>

        <div class="estado">
            <span>Activas</span>
            <strong class="activo">0</strong>
        </div>

        <div class="estado">
            <span>Próximas a vencer</span>
            <strong class="por-vencer">0</strong>
        </div>

        <div class="estado">
            <span>Vencidas</span>
            <strong class="vencido">0</strong>
        </div>
    </section>

    <section class="seccion">
        <h2>Administración</h2>

        <div class="botones">
            <a href="#" class="boton">Gestionar planes</a>
            <a href="#" class="boton">Ver reportes</a>
            <a href="#" class="boton">Consultar membresías</a>
        </div>
    </section>

</main>

<footer>
    Iron Pulse Gym - Sistema de Gestión
    <br>
    <?php echo date('d/m/Y'); ?>
</footer>

</body>
</html>
