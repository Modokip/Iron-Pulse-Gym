
<?php
require_once __DIR__ . '/../includes/db.php';

$mensaje = '';

// Crear un nuevo plan
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nombre = trim($_POST['nombre'] ?? '');
    $duracion = (int) ($_POST['duracion'] ?? 0);
    $precio = (float) ($_POST['precio'] ?? 0);

    if ($nombre === '' || $duracion <= 0 || $precio < 0) {
        $mensaje = 'Por favor, introduce datos validos.';
    } else {

        try {
            $sql = "INSERT INTO planes_membresia
                    (nombre, duracion_meses, precio)
                    VALUES (?, ?, ?)";

            $stmt = $conexion->prepare($sql);
            $stmt->execute([$nombre, $duracion, $precio]);

            $mensaje = 'Plan creado correctamente.';

        } catch (PDOException $e) {
            $mensaje = 'No se pudo crear el plan. Verifica si el nombre ya existe.';
        }
    }
}

// Consultar planes
$sql = "SELECT id_plan, nombre, duracion_meses, precio, activo
        FROM planes_membresia
        ORDER BY id_plan";

$planes = $conexion->query($sql)->fetchAll();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Planes | Iron Pulse Gym</title>

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
            margin: 12px 0 6px;
        }

        input {
            width: 100%;
            padding: 12px;
            box-sizing: border-box;
            border: none;
            border-radius: 6px;
            background: #374151;
            color: white;
        }

        button {
            margin-top: 15px;
            padding: 12px 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: bold;
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

        .mensaje {
            color: #22c55e;
            margin-bottom: 15px;
        }

        a {
            color: #f87171;
        }
    </style>
</head>

<body>

<div class="contenedor">

    <h1>IRON PULSE GYM</h1>
    <h2>Gestión de planes de membresía</h2>

    <?php if ($mensaje !== ''): ?>
        <p class="mensaje">
            <?php echo htmlspecialchars($mensaje); ?>
        </p>
    <?php endif; ?>

    <section class="tarjeta">

        <h3>Crear nuevo plan</h3>

        <form method="POST">

            <label for="nombre">Nombre del plan:</label>
            <input
                type="text"
                id="nombre"
                name="nombre"
                maxlength="40"
                required
            >

            <label for="duracion">Duración en meses:</label>
            <input
                type="number"
                id="duracion"
                name="duracion"
                min="1"
                max="255"
                required
            >

            <label for="precio">Precio en RD$:</label>
            <input
                type="number"
                id="precio"
                name="precio"
                min="0"
                step="0.01"
                required
            >

            <button type="submit">Guardar plan</button>

        </form>

    </section>

    <section class="tarjeta">

        <h3>Planes registrados</h3>

        <table>
            <thead>
                <tr>
                    <th>Plan</th>
                    <th>Duración</th>
                    <th>Precio</th>
                    <th>Estado</th>
                </tr>
            </thead>

            <tbody>

                <?php foreach ($planes as $plan): ?>

                    <tr>
                        <td>
                            <?php echo htmlspecialchars($plan['nombre']); ?>
                        </td>

                        <td>
                            <?php echo $plan['duracion_meses']; ?> meses
                        </td>

                        <td>
                            RD$ <?php echo number_format(
                                $plan['precio'],
                                2
                            ); ?>
                        </td>

                        <td>
                            <?php echo $plan['activo'] ? 'Activo' : 'Inactivo'; ?>
                        </td>
                    </tr>

                <?php endforeach; ?>

                <?php if (empty($planes)): ?>
                    <tr>
                        <td colspan="4">No hay planes registrados.</td>
                    </tr>
                <?php endif; ?>

            </tbody>
        </table>

    </section>

    <a href="index.php">Volver al panel de Gerencia</a>

</div>

</body>
</html>
