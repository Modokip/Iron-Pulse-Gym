
<?php
require_once __DIR__ . '/../includes/db.php';

// Fechas del reporte
$fecha_desde = $_GET['desde'] ?? date('Y-m-01');
$fecha_hasta = $_GET['hasta'] ?? date('Y-m-d');

// Validar fechas
if (
    !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha_desde) ||
    !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha_hasta) ||
    $fecha_desde > $fecha_hasta
) {
    $fecha_desde = date('Y-m-01');
    $fecha_hasta = date('Y-m-d');
}

// Consultar ingresos
$sql = "SELECT
            COUNT(*) AS cantidad_pagos,
            COALESCE(SUM(monto), 0) AS ingresos
        FROM pagos
        WHERE fecha_pago >= ?
          AND fecha_pago < DATE_ADD(?, INTERVAL 1 DAY)";

$stmt = $conexion->prepare($sql);
$stmt->execute([$fecha_desde, $fecha_hasta]);
$resumen = $stmt->fetch();

// Consultar ingresos por metodo de pago
$sql_metodos = "SELECT
                    metodo_pago,
                    COUNT(*) AS cantidad,
                    SUM(monto) AS total
                FROM pagos
                WHERE fecha_pago >= ?
                  AND fecha_pago < DATE_ADD(?, INTERVAL 1 DAY)
                GROUP BY metodo_pago";

$stmt_metodos = $conexion->prepare($sql_metodos);
$stmt_metodos->execute([$fecha_desde, $fecha_hasta]);
$metodos = $stmt_metodos->fetchAll();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Reportes financieros | Iron Pulse Gym</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #111827;
            color: #f3f4f6;
            margin: 0;
            padding: 20px;
        }

        .contenedor {
            max-width: 900px;
            margin: auto;
        }

        h1 {
            color: #ef4444;
        }

        .tarjeta {
            background: #1f2937;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
        }

        input, button {
            padding: 12px;
            border-radius: 6px;
            border: none;
            margin-bottom: 12px;
        }

        input {
            width: 100%;
            background: #374151;
            color: white;
        }

        button {
            background: #ef4444;
            color: white;
            font-weight: bold;
            cursor: pointer;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #374151;
        }

        th {
            color: #ef4444;
        }

        .total {
            font-size: 28px;
            font-weight: bold;
        }

        a {
            color: #f87171;
        }
    </style>
</head>

<body>

<div class="contenedor">

    <h1>IRON PULSE GYM</h1>
    <h2>Reporte financiero</h2>

    <section class="tarjeta">
        <h3>Seleccionar período</h3>

        <form method="GET">

            <label for="desde">Fecha desde:</label>
            <input
                type="date"
                id="desde"
                name="desde"
                value="<?php echo htmlspecialchars($fecha_desde); ?>"
                required
            >

            <label for="hasta">Fecha hasta:</label>
            <input
                type="date"
                id="hasta"
                name="hasta"
                value="<?php echo htmlspecialchars($fecha_hasta); ?>"
                required
            >

            <button type="submit">Consultar reporte</button>

        </form>
    </section>

    <section class="tarjeta">

        <h3>Ingresos del período</h3>

        <p class="total">
            RD$ <?php echo number_format(
                $resumen['ingresos'],
                2
            ); ?>
        </p>

        <p>
            Cantidad de pagos:
            <?php echo $resumen['cantidad_pagos']; ?>
        </p>

    </section>

    <section class="tarjeta">

        <h3>Ingresos por método de pago</h3>

        <table>
            <thead>
                <tr>
                    <th>Método</th>
                    <th>Cantidad</th>
                    <th>Ingresos</th>
                </tr>
            </thead>

            <tbody>

                <?php foreach ($metodos as $metodo): ?>

                    <tr>
                        <td>
                            <?php echo ucfirst(
                                htmlspecialchars(
                                    $metodo['metodo_pago']
                                )
                            ); ?>
                        </td>

                        <td>
                            <?php echo $metodo['cantidad']; ?>
                        </td>

                        <td>
                            RD$ <?php echo number_format(
                                $metodo['total'],
                                2
                            ); ?>
                        </td>
                    </tr>

                <?php endforeach; ?>

                <?php if (empty($metodos)): ?>

                    <tr>
                        <td colspan="3">
                            No hay pagos registrados
                            en este período.
                        </td>
                    </tr>

                <?php endif; ?>

            </tbody>
        </table>

    </section>

    <a href="index.php">Volver al panel de Gerencia</a>

</div>

</body>
</html>
