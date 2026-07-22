package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.Compra;
import com.admbodega.model.DetalleCompra;

public class CompraRepository {

    public boolean registrarCompra(Compra nuevaCompra) {
        Connection conexion = null;

        try {
            conexion = DatabaseConfig.getConnection();
            
            // 1. INICIAMOS LA TRANSACCIÓN
            conexion.setAutoCommit(false);

            // 2. CREAMOS LA FACTURA PRINCIPAL
            // Solo mandamos el usuario (quien recibe) y el proveedor. El total lo calcula MySQL.
            String sqlCompra = "INSERT INTO compras (id_usuario, id_proveedor) VALUES (?, ?)";
            
            PreparedStatement consultaCompra = conexion.prepareStatement(sqlCompra, Statement.RETURN_GENERATED_KEYS);
            consultaCompra.setInt(1, nuevaCompra.getIdUsuario());
            consultaCompra.setInt(2, nuevaCompra.getIdProveedor());
            consultaCompra.executeUpdate();

            // 3. RECUPERAMOS EL NÚMERO DE COMPRA GENERADO
            ResultSet llavesGeneradas = consultaCompra.getGeneratedKeys();
            int idCompraGenerado = 0;
            if (llavesGeneradas.next()) {
                idCompraGenerado = llavesGeneradas.getInt(1); 
            }

            // 4. GUARDAMOS LOS PRODUCTOS RECIBIDOS UNO POR UNO
            String sqlDetalle = "INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)";
            PreparedStatement consultaDetalle = conexion.prepareStatement(sqlDetalle);

            for (DetalleCompra detalle : nuevaCompra.getDetalles()) {
                consultaDetalle.setInt(1, idCompraGenerado); // Los amarramos a la factura
                consultaDetalle.setInt(2, detalle.getIdProducto());
                consultaDetalle.setInt(3, detalle.getCantidad());
                consultaDetalle.setDouble(4, detalle.getPrecioUnitario()); // Costo de compra
                
                consultaDetalle.executeUpdate(); 
            }

            // 5. CONFIRMAMOS EL GUARDADO (Esto despierta a los triggers de MySQL)
            conexion.commit();

            // 6. Limpiamos
            llavesGeneradas.close();
            consultaCompra.close();
            consultaDetalle.close();
            conexion.close();

            return true;

        } catch (Exception e) {
            System.out.println("Error en la compra, cancelando transacción: " + e.getMessage());
            e.printStackTrace();
            try {
                if (conexion != null) {
                    conexion.rollback(); // Deshacemos todo si hay error
                    conexion.close();
                }
            } catch (Exception ex) {
                System.out.println("Error al cancelar: " + ex.getMessage());
            }
            return false;
        }
    }
}