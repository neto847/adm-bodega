package com.admbodega.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.admbodega.config.DatabaseConfig;
import com.admbodega.model.Producto;

public class ProductoRepository {

    public List<Producto> listarProductos() {
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT * FROM productos ORDER BY id_producto DESC";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            ResultSet resultado = consulta.executeQuery();

            while (resultado.next()) {
                Producto producto = new Producto();
                producto.setIdProducto(resultado.getInt("id_producto"));
                producto.setIdCategoria(resultado.getInt("id_categoria"));
                producto.setIdEstado(resultado.getInt("id_estado"));
                producto.setCodigoBarras(resultado.getString("codigo_barras"));
                producto.setNombre(resultado.getString("nombre"));
                producto.setDescripcion(resultado.getString("descripcion"));
                producto.setPrecioCompra(resultado.getDouble("precio_compra"));
                producto.setPrecioVenta(resultado.getDouble("precio_venta"));
                producto.setStockActual(resultado.getInt("stock_actual"));
                productos.add(producto);
            }

            resultado.close();
            consulta.close();
            conexion.close();
        } catch (Exception e) {
            System.out.println("Error al listar productos: " + e.getMessage());
        }

        return productos;
    }

    public boolean registrarProducto(Producto nuevoProducto) {
        
        // Dejamos fuera el id_producto porque es autoincrementable, las fechas se ponen solas
        String sql = "INSERT INTO productos (id_categoria, id_estado, codigo_barras, nombre, descripcion, precio_compra, precio_venta, stock_actual) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            
            // Sustituimos valores en el orden exacto
            consulta.setInt(1, nuevoProducto.getIdCategoria());
            consulta.setInt(2, nuevoProducto.getIdEstado());
            consulta.setString(3, nuevoProducto.getCodigoBarras());
            consulta.setString(4, nuevoProducto.getNombre());
            consulta.setString(5, nuevoProducto.getDescripcion());
            consulta.setDouble(6, nuevoProducto.getPrecioCompra());
            consulta.setDouble(7, nuevoProducto.getPrecioVenta());
            consulta.setInt(8, nuevoProducto.getStockActual());
            
            int filasAfectadas = consulta.executeUpdate();
            
            consulta.close();
            conexion.close();

            return filasAfectadas > 0;

        } catch (Exception e) {
            System.out.println("Error al registrar el producto: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    // Método recuperado para buscar un producto por su código de barras
    public Producto buscarPorCodigo(String codigoBarras) {
        Producto productoEncontrado = null;
        String sql = "SELECT * FROM productos WHERE codigo_barras = ?";

        try {
            Connection conexion = DatabaseConfig.getConnection();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            
            consulta.setString(1, codigoBarras); // Ponemos el código en el WHERE
            
            ResultSet resultado = consulta.executeQuery();

            // Si MySQL encuentra el producto, llenamos el molde
            if (resultado.next()) {
                productoEncontrado = new Producto();
                productoEncontrado.setIdProducto(resultado.getInt("id_producto"));
                productoEncontrado.setIdCategoria(resultado.getInt("id_categoria"));
                productoEncontrado.setIdEstado(resultado.getInt("id_estado"));
                productoEncontrado.setCodigoBarras(resultado.getString("codigo_barras"));
                productoEncontrado.setNombre(resultado.getString("nombre"));
                productoEncontrado.setDescripcion(resultado.getString("descripcion"));
                productoEncontrado.setPrecioCompra(resultado.getDouble("precio_compra"));
                productoEncontrado.setPrecioVenta(resultado.getDouble("precio_venta"));
                productoEncontrado.setStockActual(resultado.getInt("stock_actual"));
            }

            resultado.close();
            consulta.close();
            conexion.close();

        } catch (Exception e) {
            System.out.println("Error al buscar producto por código: " + e.getMessage());
        }

        return productoEncontrado; // Si no lo encuentra, devuelve 'null'
    }
}