
<?php
require_once __DIR__ . '/../includes/db.php';

// Consultar los estados de las membresias
$sql = "SELECT estado, COUNT(*) AS total
        FROM v_membresias_estado
        GROUP BY estado";

$stmt = $conexion->query($sql);
$resultados = $stmt->fetchAll();

// Valores iniciales
$estados = [
    'Activa' => 0,
    'Por vencer' => 0,
    'Vencida' => 0
];

// Organizar los resultados
foreach ($resultados as $fila) {
    $estados[$fila['estado']] = (int) $fila['total'];
}

// Mostrar los resultados
?>

<section>
    <h2>Estado de membresias</h2>

    <p>
        Membresias activas:
        <strong><?php echo $estados['Activa']; ?></strong>
    </p>

    <p>
        Membresias por vencer:
        <strong><?php echo $estados['Por vencer']; ?></strong>
    </p>

    <p>
        Membresias vencidas:
        <strong><?php echo $estados['Vencida']; ?></strong>
    </p>
</section>
