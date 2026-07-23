package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.Proveedor;

public class ProveedorRepository {

    public List<Proveedor> listarProveedores() {
        List<Proveedor> proveedores = new ArrayList<>();
        String sql = "SELECT id_proveedor, nombre, telefono, email, direccion, activo FROM proveedores ORDER BY id_proveedor DESC";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            ResultSet resultado = consulta.executeQuery();

            while (resultado.next()) {
                Proveedor proveedor = new Proveedor();
                proveedor.setIdProveedor(resultado.getInt("id_proveedor"));
                proveedor.setNombre(resultado.getString("nombre"));
                proveedor.setTelefono(resultado.getString("telefono"));
                proveedor.setEmail(resultado.getString("email"));
                proveedor.setDireccion(resultado.getString("direccion"));
                proveedor.setActivo(resultado.getBoolean("activo"));
                proveedores.add(proveedor);
            }

            resultado.close();
            consulta.close();
            conexion.close();
        } catch (Exception e) {
            System.out.println("Error al listar proveedores: " + e.getMessage());
        }

        return proveedores;
    }

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

    public boolean eliminarProveedor(int idProveedor) {
        String sql = "DELETE FROM proveedores WHERE id_proveedor = ?";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            consulta.setInt(1, idProveedor);

            int filasAfectadas = consulta.executeUpdate();

            consulta.close();
            conexion.close();

            return filasAfectadas > 0;
        } catch (Exception e) {
            System.out.println("Error al eliminar proveedor: " + e.getMessage());
            return false;
        }
    }
}