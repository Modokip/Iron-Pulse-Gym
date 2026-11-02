-- IPMS · Iron Pulse Gym · Base de datos ipms_db (Anexo A). MySQL 8 / MariaDB 10.4+ (XAMPP)
CREATE DATABASE IF NOT EXISTS ipms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ipms_db;

CREATE TABLE roles (
  id_rol TINYINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  id_rol TINYINT NOT NULL,
  nombre VARCHAR(60) NOT NULL,
  apellido VARCHAR(60) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
) ENGINE=InnoDB;

CREATE TABLE niveles_tutoria (
  id_nivel TINYINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL UNIQUE,
  incluye_nutricion TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE miembros (
  id_miembro INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL UNIQUE,
  id_entrenador INT NOT NULL,
  id_nivel TINYINT NULL,
  telefono VARCHAR(20) NULL,
  fecha_nacimiento DATE NULL,
  fecha_ingreso DATE NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_entrenador) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_nivel) REFERENCES niveles_tutoria(id_nivel)
) ENGINE=InnoDB;

CREATE TABLE planes_membresia (
  id_plan TINYINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(40) NOT NULL UNIQUE,
  duracion_meses TINYINT NOT NULL,
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  activo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE membresias (
  id_membresia INT PRIMARY KEY AUTO_INCREMENT,
  id_miembro INT NOT NULL,
  id_plan TINYINT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  FOREIGN KEY (id_miembro) REFERENCES miembros(id_miembro),
  FOREIGN KEY (id_plan) REFERENCES planes_membresia(id_plan)
) ENGINE=InnoDB;

CREATE TABLE pagos (
  id_pago INT PRIMARY KEY AUTO_INCREMENT,
  id_membresia INT NOT NULL,
  registrado_por INT NOT NULL,
  numero_recibo VARCHAR(20) NOT NULL UNIQUE,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  metodo_pago ENUM('efectivo','tarjeta','transferencia') NOT NULL,
  fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_membresia) REFERENCES membresias(id_membresia),
  FOREIGN KEY (registrado_por) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE ejercicios (
  id_ejercicio INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL UNIQUE,
  grupo_muscular VARCHAR(40) NULL,
  descripcion TEXT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE rutinas (
  id_rutina INT PRIMARY KEY AUTO_INCREMENT,
  id_miembro INT NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  objetivo VARCHAR(120) NULL,
  fecha_asignacion DATE NOT NULL,
  activa TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (id_miembro) REFERENCES miembros(id_miembro)
) ENGINE=InnoDB;

CREATE TABLE rutina_ejercicios (
  id_rutina_ejercicio INT PRIMARY KEY AUTO_INCREMENT,
  id_rutina INT NOT NULL,
  id_ejercicio INT NOT NULL,
  dia TINYINT NOT NULL,
  orden TINYINT NOT NULL,
  series TINYINT NOT NULL,
  repeticiones VARCHAR(20) NOT NULL,
  notas VARCHAR(200) NULL,
  FOREIGN KEY (id_rutina) REFERENCES rutinas(id_rutina),
  FOREIGN KEY (id_ejercicio) REFERENCES ejercicios(id_ejercicio)
) ENGINE=InnoDB;

CREATE TABLE planes_nutricion (
  id_plan_nutricion INT PRIMARY KEY AUTO_INCREMENT,
  id_miembro INT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_creacion DATE NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (id_miembro) REFERENCES miembros(id_miembro)
) ENGINE=InnoDB;

-- Estado calculado por fecha (nunca se guarda). Por vencer = 7 días o menos.
CREATE OR REPLACE VIEW v_membresias_estado AS
SELECT ms.*, DATEDIFF(ms.fecha_vencimiento, CURDATE()) AS dias_restantes,
  CASE WHEN ms.fecha_vencimiento < CURDATE() THEN 'Vencida'
       WHEN DATEDIFF(ms.fecha_vencimiento, CURDATE()) <= 7 THEN 'Por vencer'
       ELSE 'Activa' END AS estado
FROM membresias ms;

-- ================= DATOS DE EJEMPLO =================
INSERT INTO roles (nombre) VALUES ('Miembro'),('Entrenador'),('Recepcionista'),('Gerente'),('Dueño');
INSERT INTO niveles_tutoria (nombre, incluye_nutricion) VALUES ('Básico',0),('Intermedio',0),('Avanzado',1);
INSERT INTO planes_membresia (nombre, duracion_meses, precio) VALUES ('Mensual',1,1500),('Trimestral',3,4000),('Anual',12,14000);
INSERT INTO ejercicios (nombre, grupo_muscular) VALUES ('Press de banca','Pecho'),('Sentadilla','Pierna'),('Peso muerto','Espalda'),('Plancha','Core');

-- Usuarios de prueba. Contraseña de todos: Hierro2026!
INSERT INTO usuarios (id_rol, nombre, apellido, correo, contrasena_hash) VALUES
 (3,'Rosa','Gómez','recepcion@ironpulse.do','$2y$10$mszcfYpP24OXx1/91KNq8uqLvFGYXlbxYGxqxcAHDWto3lSTwduDS'),
 (2,'Carlos','Mena','carlos@ironpulse.do','$2y$10$mszcfYpP24OXx1/91KNq8uqLvFGYXlbxYGxqxcAHDWto3lSTwduDS'),
 (2,'Sofía','Peña','sofia@ironpulse.do','$2y$10$mszcfYpP24OXx1/91KNq8uqLvFGYXlbxYGxqxcAHDWto3lSTwduDS'),
 (4,'Gerente','Iron Pulse','gerente@ironpulse.do','$2y$10$mszcfYpP24OXx1/91KNq8uqLvFGYXlbxYGxqxcAHDWto3lSTwduDS'),
 (5,'Dueño','Iron Pulse','dueno@ironpulse.do','$2y$10$mszcfYpP24OXx1/91KNq8uqLvFGYXlbxYGxqxcAHDWto3lSTwduDS');
