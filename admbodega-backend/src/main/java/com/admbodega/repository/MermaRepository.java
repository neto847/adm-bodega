package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.Merma;

public class MermaRepository {

    public boolean registrarMerma(Merma nuevaMerma) {
        
        // El orden de las columnas debe ser exacto a tu base de datos
        String sql = "INSERT INTO mermas (id_producto, id_usuario, id_motivo, cantidad) VALUES (?, ?, ?, ?)";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            
            // Sustituimos los signos de interrogación con los números de la cajita
            consulta.setInt(1, nuevaMerma.getIdProducto());
            consulta.setInt(2, nuevaMerma.getIdUsuario());
            consulta.setInt(3, nuevaMerma.getIdMotivo());
            consulta.setInt(4, nuevaMerma.getCantidad());
            
            // Ejecutamos la inserción
            int filasAfectadas = consulta.executeUpdate();
            
            consulta.close();
            conexion.close();

            return filasAfectadas > 0;

        } catch (Exception e) {
            // Imprimimos el error exacto en la consola para saber qué falló
            System.out.println("Error CRÍTICO al registrar la merma: " + e.getMessage());
            e.printStackTrace(); // Esto nos dará pistas si vuelve a fallar
            return false;
        }
    }
}