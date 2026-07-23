package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.Categoria;

public class CategoriaRepository {

    // Método para traer todas las categorías de la base de datos
    public List<Categoria> obtenerTodas() {
        
        
        // 1. Preparamos una lista vacía donde iremos guardando las cajitas de categorías
        List<Categoria> listaCategorias = new ArrayList<>();
        
        // 2. El comando SQL exacto que usaría tu amigo en MySQL
        String sql = "SELECT * FROM categorias";

        try {
            // 3. Abrimos el puente
            Connection conexion = DatabaseConfig.getConnection();
            
            // 4. Preparamos el vehículo con nuestro SQL
            PreparedStatement consulta = conexion.prepareStatement(sql);
            
            // 5. Ejecutamos el viaje y guardamos lo que nos responde MySQL en el ResultSet
            ResultSet resultado = consulta.executeQuery();

            // 6. Recorremos fila por fila la respuesta de MySQL
            while (resultado.next()) {
                // Creamos una cajita vacía de Java
                Categoria categoria = new Categoria();
                
                // La llenamos con los datos de esta fila específica
                categoria.setIdCategoria(resultado.getInt("id_categoria"));
                categoria.setNombre(resultado.getString("nombre"));
                categoria.setDescripcion(resultado.getString("descripcion"));

                // Metemos la cajita llena a nuestra lista principal
                listaCategorias.add(categoria);
             
            }
            

            // 7. Limpiamos y cerramos las herramientas (muy importante para no saturar la memoria)
            resultado.close();
            consulta.close();
            conexion.close();

        } catch (Exception e) {
            System.out.println("❌ Error al obtener las categorías: " + e.getMessage());
        }

        // 8. Devolvemos la lista final (puede estar llena o vacía si no hay nada en la BD)
        return listaCategorias;
    }
    // Método para GUARDAR una nueva categoría
    public boolean guardar(Categoria nuevaCategoria) {
        
        // 1. El comando SQL con signos de interrogación (para evitar hackeos)
        String sql = "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)";

        try {
            // 2. Abrimos el puente
            Connection conexion = DatabaseConfig.getConnection();
            
            // 3. Preparamos el vehículo
            PreparedStatement consulta = conexion.prepareStatement(sql);
            
            // 4. Cambiamos los signos de interrogación por los datos reales de la cajita
            consulta.setString(1, nuevaCategoria.getNombre());
            consulta.setString(2, nuevaCategoria.getDescripcion());
            
            // 5. Ejecutamos el guardado (executeUpdate se usa para INSERT, UPDATE o DELETE)
            int filasAfectadas = consulta.executeUpdate();
            
            // 6. Limpiamos y cerramos
            consulta.close();
            conexion.close();

            // Si filasAfectadas es mayor a 0, significa que sí se guardó
            return filasAfectadas > 0;

        } catch (Exception e) {
            System.out.println("❌ Error al guardar la categoría: " + e.getMessage());
            return false;
        }
    }

    public boolean eliminarPorId(int idCategoria) {
        String sql = "DELETE FROM categorias WHERE id_categoria = ?";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            consulta.setInt(1, idCategoria);

            int filasAfectadas = consulta.executeUpdate();

            consulta.close();
            conexion.close();

            return filasAfectadas > 0;
        } catch (Exception e) {
            System.out.println("Error al eliminar categoría: " + e.getMessage());
            return false;
        }
    }
}