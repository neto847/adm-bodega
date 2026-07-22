package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.DashboardResumen;
import com.admbodega.model.Producto;

public class DashboardRepository {

    public DashboardResumen obtenerDatosDashboard() {
        DashboardResumen resumen = new DashboardResumen();
        
        try {
            Connection conexion = DatabaseConfig.getConnection();
            
            // --- MISIÓN 1: CALCULAR LAS VENTAS DE HOY ---
            String sqlVentas = "SELECT SUM(total) AS total_hoy FROM ventas WHERE DATE(fecha_venta) = CURDATE()";
            PreparedStatement consultaVentas = conexion.prepareStatement(sqlVentas);
            ResultSet resultadoVentas = consultaVentas.executeQuery();
            
            if (resultadoVentas.next()) {
                // Si hoy no hay ventas, MySQL devuelve NULL, JDBC lo convierte a 0.0 automáticamente
                resumen.setVentasDeHoy(resultadoVentas.getDouble("total_hoy"));
            }
            resultadoVentas.close();
            consultaVentas.close();

            // --- MISIÓN 2: BUSCAR PRODUCTOS CON STOCK CRÍTICO (10 piezas o menos) ---
            List<Producto> listaBajoStock = new ArrayList<>();
            String sqlStock = "SELECT * FROM productos WHERE stock_actual <= 10";
            PreparedStatement consultaStock = conexion.prepareStatement(sqlStock);
            ResultSet resultadoStock = consultaStock.executeQuery();
            
            while (resultadoStock.next()) {
                Producto p = new Producto();
                p.setIdProducto(resultadoStock.getInt("id_producto"));
                p.setCodigoBarras(resultadoStock.getString("codigo_barras"));
                p.setNombre(resultadoStock.getString("nombre"));
                p.setStockActual(resultadoStock.getInt("stock_actual"));
                p.setPrecioVenta(resultadoStock.getDouble("precio_venta"));
                // (Omitimos campos no urgentes para el dashboard para ahorrar memoria)
                
                listaBajoStock.add(p);
            }
            resumen.setProductosBajoStock(listaBajoStock);
            resultadoStock.close();
            consultaStock.close();

            // Cerramos la conexión
            conexion.close();

        } catch (Exception e) {
            System.out.println("Error al generar el Dashboard: " + e.getMessage());
        }

        return resumen;
    }
}