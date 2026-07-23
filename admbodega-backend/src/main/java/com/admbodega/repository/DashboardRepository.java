package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    public Map<String, Object> obtenerDatosDashboardDueno() {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("ingresosTotales", 0.0);
        payload.put("ventasDeHoy", 0.0);
        payload.put("ticketPromedio", 0.0);
        payload.put("topProductos", new ArrayList<Map<String, Object>>());
        payload.put("ingresosPorCategoria", new ArrayList<Map<String, Object>>());

        try {
            Connection conexion = DatabaseConfig.getConnection();

            String sqlIngresos = "SELECT IFNULL(SUM(total), 0) AS ingresos_totales, IFNULL(AVG(total), 0) AS ticket_promedio FROM ventas";
            PreparedStatement consultaIngresos = conexion.prepareStatement(sqlIngresos);
            ResultSet resultadoIngresos = consultaIngresos.executeQuery();
            if (resultadoIngresos.next()) {
                payload.put("ingresosTotales", resultadoIngresos.getDouble("ingresos_totales"));
                payload.put("ticketPromedio", resultadoIngresos.getDouble("ticket_promedio"));
            }
            resultadoIngresos.close();
            consultaIngresos.close();

            String sqlVentasHoy = "SELECT IFNULL(SUM(total), 0) AS ventas_hoy FROM ventas WHERE DATE(fecha_venta) = CURDATE()";
            PreparedStatement consultaVentasHoy = conexion.prepareStatement(sqlVentasHoy);
            ResultSet resultadoVentasHoy = consultaVentasHoy.executeQuery();
            if (resultadoVentasHoy.next()) {
                payload.put("ventasDeHoy", resultadoVentasHoy.getDouble("ventas_hoy"));
            }
            resultadoVentasHoy.close();
            consultaVentasHoy.close();

            String sqlTopProductos = "SELECT p.id_producto, p.nombre, IFNULL(SUM(dv.cantidad), 0) AS unidades, IFNULL(SUM(dv.subtotal), 0) AS total "
                    + "FROM detalle_ventas dv "
                    + "INNER JOIN productos p ON p.id_producto = dv.id_producto "
                    + "GROUP BY p.id_producto, p.nombre "
                    + "ORDER BY total DESC, unidades DESC "
                    + "LIMIT 10";
            PreparedStatement consultaTop = conexion.prepareStatement(sqlTopProductos);
            ResultSet resultadoTop = consultaTop.executeQuery();
            List<Map<String, Object>> topProductos = new ArrayList<>();
            while (resultadoTop.next()) {
                Map<String, Object> fila = new LinkedHashMap<>();
                fila.put("idProducto", resultadoTop.getInt("id_producto"));
                fila.put("nombre", resultadoTop.getString("nombre"));
                fila.put("unidades", resultadoTop.getInt("unidades"));
                fila.put("total", resultadoTop.getDouble("total"));
                topProductos.add(fila);
            }
            payload.put("topProductos", topProductos);
            resultadoTop.close();
            consultaTop.close();

            String sqlIngresosCategoria = "SELECT c.id_categoria, c.nombre, IFNULL(SUM(dv.subtotal), 0) AS total "
                    + "FROM categorias c "
                    + "LEFT JOIN productos p ON p.id_categoria = c.id_categoria "
                    + "LEFT JOIN detalle_ventas dv ON dv.id_producto = p.id_producto "
                    + "GROUP BY c.id_categoria, c.nombre "
                    + "ORDER BY total DESC";
            PreparedStatement consultaCategorias = conexion.prepareStatement(sqlIngresosCategoria);
            ResultSet resultadoCategorias = consultaCategorias.executeQuery();
            List<Map<String, Object>> ingresosPorCategoria = new ArrayList<>();
            while (resultadoCategorias.next()) {
                Map<String, Object> fila = new LinkedHashMap<>();
                fila.put("idCategoria", resultadoCategorias.getInt("id_categoria"));
                fila.put("nombre", resultadoCategorias.getString("nombre"));
                fila.put("total", resultadoCategorias.getDouble("total"));
                ingresosPorCategoria.add(fila);
            }
            payload.put("ingresosPorCategoria", ingresosPorCategoria);
            resultadoCategorias.close();
            consultaCategorias.close();

            conexion.close();
        } catch (Exception e) {
            System.out.println("Error al generar dashboard de dueño: " + e.getMessage());
        }

        return payload;
    }
}