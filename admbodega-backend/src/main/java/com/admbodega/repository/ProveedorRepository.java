package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.Proveedor;

public class ProveedorRepository {

    public boolean registrarProveedor(Proveedor nuevoProveedor) {
        
        // Dejamos fuera el id_proveedor porque es AUTO_INCREMENT en tu base de datos
        String sql = "INSERT INTO proveedores (nombre, telefono, email, direccion, activo) VALUES (?, ?, ?, ?, ?)";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            
            // Sustituimos los signos de interrogación
            consulta.setString(1, nuevoProveedor.getNombre());
            consulta.setString(2, nuevoProveedor.getTelefono());
            consulta.setString(3, nuevoProveedor.getEmail());
            consulta.setString(4, nuevoProveedor.getDireccion());
            consulta.setBoolean(5, nuevoProveedor.isActivo());
            
            // Ejecutamos la inserción
            int filasAfectadas = consulta.executeUpdate();
            
            consulta.close();
            conexion.close();

            return filasAfectadas > 0;

        } catch (Exception e) {
            System.out.println(" Error al registrar proveedor: " + e.getMessage());
            e.printStackTrace(); 
            return false;
        }
    }
}