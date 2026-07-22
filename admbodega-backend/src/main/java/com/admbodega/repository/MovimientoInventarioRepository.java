package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.MovimientoInventario;

public class MovimientoInventarioRepository {

    public List<MovimientoInventario> obtenerHistorial() {
        
        List<MovimientoInventario> historial = new ArrayList<>();
        // Traemos todos los movimientos ordenados del más nuevo al más viejo
        String sql = "SELECT * FROM movimientos_inventario ORDER BY fecha_movimiento DESC";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            ResultSet resultado = consulta.executeQuery();

            while (resultado.next()) {
                MovimientoInventario mov = new MovimientoInventario();
                
                // Mapeamos los datos de MySQL a Java
                mov.setIdMovimiento(resultado.getInt("id_movimiento"));
                mov.setIdProducto(resultado.getInt("id_producto"));
                mov.setIdUsuario(resultado.getInt("id_usuario"));
                mov.setIdTipoMovimiento(resultado.getInt("id_tipo_movimiento"));
                mov.setCantidad(resultado.getInt("cantidad"));
                mov.setTipoReferencia(resultado.getString("tipo_referencia"));
                mov.setIdReferencia(resultado.getInt("id_referencia"));
                mov.setFechaMovimiento(resultado.getString("fecha_movimiento"));
                
                historial.add(mov);
            }

            resultado.close();
            consulta.close();
            conexion.close();

        } catch (Exception e) {
            System.out.println("Error al leer el Kardex: " + e.getMessage());
        }

        return historial;
    }
}
