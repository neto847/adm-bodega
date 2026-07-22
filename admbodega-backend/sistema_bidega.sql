-- DROP DATABASE IF EXISTS sistema_inventario <--aunto destruccion neto que se te onvide aca lo dejo cuiiidadoo
CREATE DATABASE IF NOT EXISTS sistema_inventario
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sistema_inventario;

CREATE TABLE roles (
    id_rol INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;
-- 1. Llenamos los 2 roles necesarios para el sistema
INSERT IGNORE INTO roles (id_rol, nombre) VALUES 
(1, 'Dueño'),
(2, 'Encargado/Cajero');
 

CREATE TABLE usuarios (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_rol INT UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Solo almacenar hashes (bcrypt/argon2)',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_usuarios_password CHECK (CHAR_LENGTH(password) >= 60)
) ENGINE=InnoDB;
-- 2. Creamos al usuario (Dueño) con una contraseña que sí cumple la regla estricta de los 60 caracteres
INSERT IGNORE INTO usuarios (id_usuario, id_rol, nombre, email, password, activo) 
VALUES (1, 1, 'Administrador Principal', 'admin@admbodega.com', 'aqui_va_un_hash_falso_muy_largo_para_cumplir_con_la_regla_de_los_sesenta_caracteres_minimos_exactamente', TRUE);

CREATE TABLE categorias (
    id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
) ENGINE=InnoDB;
INSERT INTO categorias (nombre, descripcion) VALUES 
('Lácteos y embutidos', 'Productos derivados de la leche y carnes frías'),
('Limpieza/Hogar', 'Artículos para el aseo general del hogar');

CREATE TABLE estados_producto (
    id_estado INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;
INSERT IGNORE INTO estados_producto (id_estado, nombre) VALUES 
(1, 'Activo'),
(2, 'Descontinuado'),
(3, 'Agotado');

CREATE TABLE proveedores (
    id_proveedor INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE productos (
    id_producto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT UNSIGNED NOT NULL,
    id_estado INT UNSIGNED NOT NULL,
    codigo_barras VARCHAR(50) UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(10,2) NOT NULL CHECK (precio_compra >= 0),
    precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta >= 0),
    stock_actual INT UNSIGNED NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_productos_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_productos_estados FOREIGN KEY (id_estado) REFERENCES estados_producto(id_estado) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;
INSERT INTO productos (id_categoria, id_estado, codigo_barras, nombre, precio_compra, precio_venta, stock_actual) 
VALUES (1, 1, '12345', 'Coca Cola 600ml', 10.00, 18.00, 50);
SELECT * FROM productos; -- aca para ver la tabla o stock del inventario para que funci es ctrl+enter


CREATE TABLE compras (
    id_compra INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    id_proveedor INT UNSIGNED NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_compras_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_compras_proveedores FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE detalle_compras (
    id_detalle_compra INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_compra INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    CONSTRAINT uq_detalle_compras_compra_producto UNIQUE (id_compra, id_producto),
    CONSTRAINT fk_detalle_compras_compras FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detalle_compras_productos FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE ventas (
    id_venta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNSIGNED NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ventas_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;
SELECT * FROM ventas; -- aca el ticket- total calculado crtl+enter 

CREATE TABLE detalle_ventas (
    id_detalle_venta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_venta INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    CONSTRAINT uq_detalle_ventas_venta_producto UNIQUE (id_venta, id_producto),
    CONSTRAINT fk_detalle_ventas_ventas FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detalle_ventas_productos FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tipos_movimiento (
    id_tipo_movimiento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE motivos_merma (
    id_motivo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;
-- Llenamos el catálogo de motivos para que el sistema permita registrar mermas
INSERT IGNORE INTO motivos_merma (id_motivo, nombre) VALUES 
(1, 'Caducado'),
(2, 'Empaque roto'),
(3, 'Defecto de fábrica');

CREATE TABLE mermas (
    id_merma INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_producto INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    id_motivo INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL CHECK (cantidad > 0),
    fecha_merma TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mermas_productos FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_mermas_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_mermas_motivos FOREIGN KEY (id_motivo) REFERENCES motivos_merma(id_motivo) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE movimientos_inventario (
    id_movimiento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_producto INT UNSIGNED NOT NULL,
    id_usuario INT UNSIGNED NOT NULL,
    id_tipo_movimiento INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL CHECK (cantidad > 0),
    tipo_referencia ENUM('COMPRA','VENTA','MERMA','AJUSTE') NOT NULL,
    id_referencia INT UNSIGNED NULL COMMENT 'Integridad referencial polimórfica gestionada por aplicación/trigger',
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movimientos_productos FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_movimientos_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_movimientos_tipos FOREIGN KEY (id_tipo_movimiento) REFERENCES tipos_movimiento(id_tipo_movimiento) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;
SELECT * FROM movimientos_inventario;
INSERT IGNORE INTO tipos_movimiento (nombre) VALUES ('ENTRADA'), ('SALIDA'), ('AJUSTE');

DELIMITER //

CREATE TRIGGER trg_detalle_compras_ai AFTER INSERT ON detalle_compras
FOR EACH ROW
BEGIN
    UPDATE productos SET stock_actual = stock_actual + NEW.cantidad WHERE id_producto = NEW.id_producto;
    UPDATE compras SET total = total + NEW.subtotal WHERE id_compra = NEW.id_compra;
    
    INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
    VALUES (NEW.id_producto, (SELECT id_usuario FROM compras WHERE id_compra = NEW.id_compra), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'ENTRADA'), NEW.cantidad, 'COMPRA', NEW.id_compra);
END;
//

CREATE TRIGGER trg_detalle_compras_au AFTER UPDATE ON detalle_compras
FOR EACH ROW
BEGIN
    IF OLD.id_producto = NEW.id_producto THEN
        UPDATE productos SET stock_actual = stock_actual - OLD.cantidad + NEW.cantidad WHERE id_producto = NEW.id_producto;
        
        IF NEW.cantidad != OLD.cantidad THEN
            INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
            VALUES (NEW.id_producto, (SELECT id_usuario FROM compras WHERE id_compra = NEW.id_compra), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), ABS(CAST(NEW.cantidad AS SIGNED) - CAST(OLD.cantidad AS SIGNED)), 'COMPRA', NEW.id_compra);
        END IF;
    ELSE
        UPDATE productos SET stock_actual = stock_actual - OLD.cantidad WHERE id_producto = OLD.id_producto;
        INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
        VALUES (OLD.id_producto, (SELECT id_usuario FROM compras WHERE id_compra = OLD.id_compra), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), OLD.cantidad, 'COMPRA', OLD.id_compra);
        
        UPDATE productos SET stock_actual = stock_actual + NEW.cantidad WHERE id_producto = NEW.id_producto;
        INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
        VALUES (NEW.id_producto, (SELECT id_usuario FROM compras WHERE id_compra = NEW.id_compra), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), NEW.cantidad, 'COMPRA', NEW.id_compra);
    END IF;

    IF OLD.id_compra = NEW.id_compra THEN
        UPDATE compras SET total = total - OLD.subtotal + NEW.subtotal WHERE id_compra = NEW.id_compra;
    ELSE
        UPDATE compras SET total = total - OLD.subtotal WHERE id_compra = OLD.id_compra;
        UPDATE compras SET total = total + NEW.subtotal WHERE id_compra = NEW.id_compra;
    END IF;
END;
//

CREATE TRIGGER trg_detalle_compras_ad AFTER DELETE ON detalle_compras
FOR EACH ROW
BEGIN
    UPDATE productos SET stock_actual = stock_actual - OLD.cantidad WHERE id_producto = OLD.id_producto;
    UPDATE compras SET total = total - OLD.subtotal WHERE id_compra = OLD.id_compra;
    
    INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
    VALUES (OLD.id_producto, (SELECT id_usuario FROM compras WHERE id_compra = OLD.id_compra), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), OLD.cantidad, 'COMPRA', OLD.id_compra);
END;
//

CREATE TRIGGER trg_detalle_ventas_ai AFTER INSERT ON detalle_ventas
FOR EACH ROW
BEGIN
    UPDATE productos SET stock_actual = stock_actual - NEW.cantidad WHERE id_producto = NEW.id_producto;
    UPDATE ventas SET total = total + NEW.subtotal WHERE id_venta = NEW.id_venta;
    
    INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
    VALUES (NEW.id_producto, (SELECT id_usuario FROM ventas WHERE id_venta = NEW.id_venta), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'SALIDA'), NEW.cantidad, 'VENTA', NEW.id_venta);
END;
//

CREATE TRIGGER trg_detalle_ventas_au AFTER UPDATE ON detalle_ventas
FOR EACH ROW
BEGIN
    IF OLD.id_producto = NEW.id_producto THEN
        UPDATE productos SET stock_actual = stock_actual + OLD.cantidad - NEW.cantidad WHERE id_producto = NEW.id_producto;
        
        IF NEW.cantidad != OLD.cantidad THEN
            INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
            VALUES (NEW.id_producto, (SELECT id_usuario FROM ventas WHERE id_venta = NEW.id_venta), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), ABS(CAST(NEW.cantidad AS SIGNED) - CAST(OLD.cantidad AS SIGNED)), 'VENTA', NEW.id_venta);
        END IF;
    ELSE
        UPDATE productos SET stock_actual = stock_actual + OLD.cantidad WHERE id_producto = OLD.id_producto;
        INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
        VALUES (OLD.id_producto, (SELECT id_usuario FROM ventas WHERE id_venta = OLD.id_venta), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), OLD.cantidad, 'VENTA', OLD.id_venta);
        
        UPDATE productos SET stock_actual = stock_actual - NEW.cantidad WHERE id_producto = NEW.id_producto;
        INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
        VALUES (NEW.id_producto, (SELECT id_usuario FROM ventas WHERE id_venta = NEW.id_venta), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), NEW.cantidad, 'VENTA', NEW.id_venta);
    END IF;

    IF OLD.id_venta = NEW.id_venta THEN
        UPDATE ventas SET total = total - OLD.subtotal + NEW.subtotal WHERE id_venta = NEW.id_venta;
    ELSE
        UPDATE ventas SET total = total - OLD.subtotal WHERE id_venta = OLD.id_venta;
        UPDATE ventas SET total = total + NEW.subtotal WHERE id_venta = NEW.id_venta;
    END IF;
END;
//

CREATE TRIGGER trg_detalle_ventas_ad AFTER DELETE ON detalle_ventas
FOR EACH ROW
BEGIN
    UPDATE productos SET stock_actual = stock_actual + OLD.cantidad WHERE id_producto = OLD.id_producto;
    UPDATE ventas SET total = total - OLD.subtotal WHERE id_venta = OLD.id_venta;
    
    INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
    VALUES (OLD.id_producto, (SELECT id_usuario FROM ventas WHERE id_venta = OLD.id_venta), (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), OLD.cantidad, 'VENTA', OLD.id_venta);
END;
//

CREATE TRIGGER trg_mermas_ai AFTER INSERT ON mermas
FOR EACH ROW
BEGIN
    UPDATE productos SET stock_actual = stock_actual - NEW.cantidad WHERE id_producto = NEW.id_producto;
    
    INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
    VALUES (NEW.id_producto, NEW.id_usuario, (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'SALIDA'), NEW.cantidad, 'MERMA', NEW.id_merma);
END;
//

CREATE TRIGGER trg_mermas_au AFTER UPDATE ON mermas
FOR EACH ROW
BEGIN
    IF OLD.id_producto = NEW.id_producto THEN
        UPDATE productos SET stock_actual = stock_actual + OLD.cantidad - NEW.cantidad WHERE id_producto = NEW.id_producto;
        
        IF NEW.cantidad != OLD.cantidad THEN
            INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
            VALUES (NEW.id_producto, NEW.id_usuario, (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), ABS(CAST(NEW.cantidad AS SIGNED) - CAST(OLD.cantidad AS SIGNED)), 'MERMA', NEW.id_merma);
        END IF;
    ELSE
        UPDATE productos SET stock_actual = stock_actual + OLD.cantidad WHERE id_producto = OLD.id_producto;
        INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
        VALUES (OLD.id_producto, OLD.id_usuario, (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), OLD.cantidad, 'MERMA', OLD.id_merma);
        
        UPDATE productos SET stock_actual = stock_actual - NEW.cantidad WHERE id_producto = NEW.id_producto;
        INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
        VALUES (NEW.id_producto, NEW.id_usuario, (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), NEW.cantidad, 'MERMA', NEW.id_merma);
    END IF;
END;
//

CREATE TRIGGER trg_mermas_ad AFTER DELETE ON mermas
FOR EACH ROW
BEGIN
    UPDATE productos SET stock_actual = stock_actual + OLD.cantidad WHERE id_producto = OLD.id_producto;
    
    INSERT INTO movimientos_inventario (id_producto, id_usuario, id_tipo_movimiento, cantidad, tipo_referencia, id_referencia)
    VALUES (OLD.id_producto, OLD.id_usuario, (SELECT id_tipo_movimiento FROM tipos_movimiento WHERE nombre = 'AJUSTE'), OLD.cantidad, 'MERMA', OLD.id_merma);
END;
//

DELIMITER ;

CREATE INDEX idx_movimientos_producto_fecha ON movimientos_inventario(id_producto, fecha_movimiento);