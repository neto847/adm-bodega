package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.DetalleVenta;
import com.admbodega.model.Venta;

public class VentaRepository {

    public boolean registrarVenta(Venta nuevaVenta) {
        Connection conexion = null;

        if (nuevaVenta == null || nuevaVenta.getDetalles() == null || nuevaVenta.getDetalles().isEmpty()) {
            return false;
        }

        try {
            conexion = DatabaseConfig.getConnection();
            conexion.setAutoCommit(false);

            String sqlVenta = "INSERT INTO ventas (id_usuario) VALUES (?)";
            PreparedStatement consultaVenta = conexion.prepareStatement(sqlVenta, Statement.RETURN_GENERATED_KEYS);
            consultaVenta.setInt(1, nuevaVenta.getIdUsuario());
            consultaVenta.executeUpdate();

            ResultSet llavesGeneradas = consultaVenta.getGeneratedKeys();
            int idVentaGenerado = 0;
            if (llavesGeneradas.next()) {
                idVentaGenerado = llavesGeneradas.getInt(1);
            }

            String sqlDetalle = "INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)";
            PreparedStatement consultaDetalle = conexion.prepareStatement(sqlDetalle);

            for (DetalleVenta detalle : nuevaVenta.getDetalles()) {
                if (detalle == null || detalle.getCantidad() <= 0 || detalle.getIdProducto() <= 0) {
                    throw new IllegalArgumentException("Detalle de venta inválido");
                }

                consultaDetalle.setInt(1, idVentaGenerado);
                consultaDetalle.setInt(2, detalle.getIdProducto());
                consultaDetalle.setInt(3, detalle.getCantidad());
                consultaDetalle.setDouble(4, detalle.getPrecioUnitario());
                consultaDetalle.executeUpdate();
            }

            conexion.commit();

            llavesGeneradas.close();
            consultaVenta.close();
            consultaDetalle.close();
            conexion.close();

            return true;

        } catch (Exception e) {
            System.out.println("Error en la venta, cancelando transacción: " + e.getMessage());
            try {
                if (conexion != null) {
                    conexion.rollback();
                    conexion.close();
                }
            } catch (Exception ex) {
                System.out.println("Error al intentar cancelar: " + ex.getMessage());
            }
            return false;
        }
    }
    // Método para obtener el historial general de tickets
    public List<Venta> obtenerHistorial() {
        
        // 1. Preparamos una lista vacía para guardar los tickets
        List<Venta> historial = new ArrayList<>();
        
        // 2. Traemos las ventas ordenadas desde la más nueva a la más vieja
        String sql = "SELECT * FROM ventas ORDER BY fecha_venta DESC";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            ResultSet resultado = consulta.executeQuery();

            // 3. Recorremos los tickets uno por uno
            while (resultado.next()) {
                Venta ticket = new Venta();
                ticket.setIdVenta(resultado.getInt("id_venta"));
                ticket.setIdUsuario(resultado.getInt("id_usuario"));
                ticket.setTotal(resultado.getDouble("total"));
                ticket.setFechaVenta(resultado.getString("fecha_venta"));
                
                // Metemos el ticket a la lista
                historial.add(ticket);
            }

            // 4. Limpiamos las herramientas
            resultado.close();
            consulta.close();
            conexion.close();

        } catch (Exception e) {
            System.out.println(" Error al obtener el historial de ventas: " + e.getMessage());
        }

        // 5. Devolvemos la lista al mesero
        return historial;
    }
}