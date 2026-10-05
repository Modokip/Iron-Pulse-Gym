-- =====================================================================
-- IPMS - Iron Pulse Management System
-- Base de datos: ipms_db  (MySQL / MariaDB - XAMPP)
-- Basado en el Anexo A del Documento Vision (Grupo 6)
-- 11 tablas + 1 vista (v_membresias_estado)
-- =====================================================================

DROP DATABASE IF EXISTS ipms_db;
CREATE DATABASE ipms_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE ipms_db;

-- ---------------------------------------------------------------------
-- 1. roles: tipos de usuario del sistema
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    id_rol  TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre  VARCHAR(30)      NOT NULL,
    PRIMARY KEY (id_rol),
    UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. usuarios: todas las personas que inician sesion
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario       INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_rol           TINYINT UNSIGNED NOT NULL,
    nombre           VARCHAR(60)      NOT NULL,
    apellido         VARCHAR(60)      NOT NULL,
    correo           VARCHAR(120)     NOT NULL,
    contrasena_hash  VARCHAR(255)     NOT NULL,   -- password_hash() de PHP
    activo           TINYINT(1)       NOT NULL DEFAULT 1,
    fecha_creacion   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuarios_correo (correo),
    CONSTRAINT fk_usuarios_rol
        FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. niveles_tutoria: basico, intermedio y avanzado
-- ---------------------------------------------------------------------
CREATE TABLE niveles_tutoria (
    id_nivel           TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre             VARCHAR(30)      NOT NULL,
    incluye_nutricion  TINYINT(1)       NOT NULL DEFAULT 0,
    PRIMARY KEY (id_nivel),
    UNIQUE KEY uq_niveles_nombre (nombre)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. miembros: datos del gimnasio de cada miembro
--    (la cuenta de acceso esta en usuarios, relacion 1 a 1)
-- ---------------------------------------------------------------------
CREATE TABLE miembros (
    id_miembro        INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_usuario        INT UNSIGNED     NOT NULL,
    id_entrenador     INT UNSIGNED     NULL,       -- usuario con rol Entrenador
    id_nivel          TINYINT UNSIGNED NULL,
    telefono          VARCHAR(20)      NULL,
    fecha_nacimiento  DATE             NULL,
    fecha_ingreso     DATE             NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (id_miembro),
    UNIQUE KEY uq_miembros_usuario (id_usuario),
    CONSTRAINT fk_miembros_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_miembros_entrenador
        FOREIGN KEY (id_entrenador) REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_miembros_nivel
        FOREIGN KEY (id_nivel) REFERENCES niveles_tutoria (id_nivel)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. planes_membresia: planes que vende el gimnasio
-- ---------------------------------------------------------------------
CREATE TABLE planes_membresia (
    id_plan         TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(40)      NOT NULL,
    duracion_meses  TINYINT UNSIGNED NOT NULL,
    precio          DECIMAL(10,2)    NOT NULL,
    activo          TINYINT(1)       NOT NULL DEFAULT 1,
    PRIMARY KEY (id_plan),
    UNIQUE KEY uq_planes_nombre (nombre),
    CONSTRAINT ck_planes_duracion CHECK (duracion_meses > 0),
    CONSTRAINT ck_planes_precio   CHECK (precio >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. membresias: cada contratacion o renovacion (conserva historial)
-- ---------------------------------------------------------------------
CREATE TABLE membresias (
    id_membresia       INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_miembro         INT UNSIGNED     NOT NULL,
    id_plan            TINYINT UNSIGNED NOT NULL,
    fecha_inicio       DATE             NOT NULL,
    fecha_vencimiento  DATE             NOT NULL,
    PRIMARY KEY (id_membresia),
    KEY idx_membresias_vencimiento (fecha_vencimiento),
    CONSTRAINT fk_membresias_miembro
        FOREIGN KEY (id_miembro) REFERENCES miembros (id_miembro)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_membresias_plan
        FOREIGN KEY (id_plan) REFERENCES planes_membresia (id_plan)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_membresias_fechas CHECK (fecha_vencimiento >= fecha_inicio)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. pagos: pagos registrados por recepcion (en persona)
-- ---------------------------------------------------------------------
CREATE TABLE pagos (
    id_pago         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    id_membresia    INT UNSIGNED  NOT NULL,
    registrado_por  INT UNSIGNED  NOT NULL,        -- recepcionista que cobro
    numero_recibo   VARCHAR(20)   NOT NULL,
    monto           DECIMAL(10,2) NOT NULL,
    metodo_pago     ENUM('efectivo','tarjeta','transferencia') NOT NULL,
    fecha_pago      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_pago),
    UNIQUE KEY uq_pagos_recibo (numero_recibo),
    KEY idx_pagos_fecha (fecha_pago),
    CONSTRAINT fk_pagos_membresia
        FOREIGN KEY (id_membresia) REFERENCES membresias (id_membresia)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pagos_registrador
        FOREIGN KEY (registrado_por) REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_pagos_monto CHECK (monto > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. ejercicios: catalogo usado por los entrenadores
-- ---------------------------------------------------------------------
CREATE TABLE ejercicios (
    id_ejercicio    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(80)  NOT NULL,
    grupo_muscular  VARCHAR(40)  NOT NULL,
    descripcion     TEXT         NULL,
    activo          TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id_ejercicio),
    UNIQUE KEY uq_ejercicios_nombre (nombre)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. rutinas: rutina asignada a un miembro
--    (el entrenador responsable es el asignado al miembro)
-- ---------------------------------------------------------------------
CREATE TABLE rutinas (
    id_rutina         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_miembro        INT UNSIGNED NOT NULL,
    nombre            VARCHAR(80)  NOT NULL,
    objetivo          VARCHAR(120) NULL,
    fecha_asignacion  DATE         NOT NULL DEFAULT (CURRENT_DATE),
    activa            TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id_rutina),
    CONSTRAINT fk_rutinas_miembro
        FOREIGN KEY (id_miembro) REFERENCES miembros (id_miembro)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. rutina_ejercicios: tabla intermedia rutinas <-> ejercicios
-- ---------------------------------------------------------------------
CREATE TABLE rutina_ejercicios (
    id_rutina_ejercicio  INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    id_rutina            INT UNSIGNED     NOT NULL,
    id_ejercicio         INT UNSIGNED     NOT NULL,
    dia                  TINYINT UNSIGNED NOT NULL,
    orden                TINYINT UNSIGNED NOT NULL,
    series               TINYINT UNSIGNED NOT NULL,
    repeticiones         VARCHAR(20)      NOT NULL,   -- "12" o "10-12"
    notas                VARCHAR(200)     NULL,
    PRIMARY KEY (id_rutina_ejercicio),
    CONSTRAINT fk_re_rutina
        FOREIGN KEY (id_rutina) REFERENCES rutinas (id_rutina)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_re_ejercicio
        FOREIGN KEY (id_ejercicio) REFERENCES ejercicios (id_ejercicio)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_re_valores CHECK (dia > 0 AND orden > 0 AND series > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. planes_nutricion: solo para miembros de nivel avanzado
--     (la validacion incluye_nutricion = 1 la hace PHP)
-- ---------------------------------------------------------------------
CREATE TABLE planes_nutricion (
    id_plan_nutricion  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_miembro         INT UNSIGNED NOT NULL,
    descripcion        TEXT         NOT NULL,
    fecha_creacion     DATE         NOT NULL DEFAULT (CURRENT_DATE),
    activo             TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id_plan_nutricion),
    CONSTRAINT fk_nutricion_miembro
        FOREIGN KEY (id_miembro) REFERENCES miembros (id_miembro)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- VISTA: estado de la membresia calculado por fecha (no se guarda)
--   Activa     = vence en mas de 7 dias
--   Por vencer = vence en 7 dias o menos
--   Vencida    = la fecha de vencimiento ya paso
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW v_membresias_estado AS
SELECT
    ms.id_membresia,
    ms.id_miembro,
    ms.id_plan,
    ms.fecha_inicio,
    ms.fecha_vencimiento,
    DATEDIFF(ms.fecha_vencimiento, CURDATE()) AS dias_restantes,
    CASE
        WHEN ms.fecha_vencimiento < CURDATE()                      THEN 'Vencida'
        WHEN DATEDIFF(ms.fecha_vencimiento, CURDATE()) <= 7        THEN 'Por vencer'
        ELSE 'Activa'
    END AS estado
FROM membresias ms;

-- =====================================================================
-- DATOS INICIALES (catalogos)
-- =====================================================================
INSERT INTO roles (nombre) VALUES
    ('Miembro'), ('Entrenador'), ('Recepcionista'), ('Gerente'), ('Dueño');

INSERT INTO niveles_tutoria (nombre, incluye_nutricion) VALUES
    ('Básico', 0), ('Intermedio', 0), ('Avanzado', 1);

-- Precios de ejemplo: el gimnasio define los reales
INSERT INTO planes_membresia (nombre, duracion_meses, precio) VALUES
    ('Mensual', 1, 1500.00),
    ('Trimestral', 3, 4000.00),
    ('Anual', 12, 14000.00);

INSERT INTO ejercicios (nombre, grupo_muscular, descripcion) VALUES
    ('Press de banca', 'Pecho', 'Empuje horizontal con barra en banco plano.'),
    ('Sentadilla', 'Pierna', 'Flexión de cadera y rodillas con barra sobre la espalda.'),
    ('Peso muerto', 'Espalda', 'Levantamiento de barra desde el suelo con espalda recta.'),
    ('Remo con barra', 'Espalda', NULL),
    ('Press militar', 'Hombro', NULL),
    ('Curl de bíceps', 'Brazo', NULL),
    ('Extensión de tríceps', 'Brazo', NULL),
    ('Plancha abdominal', 'Core', NULL);
