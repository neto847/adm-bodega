package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.admbodega.config.DatabaseConfig;

public class AlertaCaducidadRepository {

    public Map<String, Object> obtenerAlertasCaducidad() {
        Map<String, Object> payload = new LinkedHashMap<>();
        List<Map<String, Object>> lotes = new ArrayList<>();

        // El esquema actual no guarda fecha de vencimiento por lote; usamos mermas por caducidad
        // como señal operativa mientras se modela la tabla de lotes/vencimientos.
        String sql = "SELECT m.id_merma, p.nombre AS producto, c.nombre AS categoria, m.cantidad, m.fecha_merma "
                + "FROM mermas m "
                + "INNER JOIN motivos_merma mm ON mm.id_motivo = m.id_motivo "
                + "INNER JOIN productos p ON p.id_producto = m.id_producto "
                + "LEFT JOIN categorias c ON c.id_categoria = p.id_categoria "
                + "WHERE LOWER(mm.nombre) = 'caducado' "
                + "ORDER BY m.fecha_merma DESC "
                + "LIMIT 100";

        try (Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            ResultSet resultado = consulta.executeQuery()) {

            while (resultado.next()) {
                Map<String, Object> fila = new LinkedHashMap<>();
                fila.put("id", resultado.getInt("id_merma"));
                fila.put("producto", resultado.getString("producto"));
                fila.put("categoria", resultado.getString("categoria"));
                fila.put("cantidad", resultado.getInt("cantidad"));
                fila.put("fechaReferencia", resultado.getTimestamp("fecha_merma"));
                fila.put("estado", "vencido");
                lotes.add(fila);
            }

        } catch (SQLException e) {
            System.out.println("Error al obtener alertas de caducidad: " + e.getMessage());
        }

        payload.put("lotes", lotes);
        payload.put("nota", "No existe tabla de lotes con fecha_vencimiento en este esquema. Este endpoint usa mermas por motivo Caducado como aproximacion.");
        return payload;
    }
}
