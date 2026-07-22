package com.admbodega.controller;

import com.admbodega.model.Producto;
import com.admbodega.repository.ProductoRepository;

import io.javalin.http.Context;

public class ProductoController {

    public static void listarProductos(Context ctx) {
        try {
            ProductoRepository repo = new ProductoRepository();
            java.util.List<Producto> productos = repo.listarProductos();
            ctx.status(200);
            ctx.json(productos);
        } catch (Exception e) {
            ctx.status(500);
            ctx.result("Error al listar productos.");
        }
    }

    public static void crearProducto(Context ctx) {
        try {
            // 1. Convertimos el JSON que manda la página web al molde Java
            Producto productoRecibido = ctx.bodyAsClass(Producto.class);
            
            // 2. Pasamos el producto al trabajador
            ProductoRepository repo = new ProductoRepository();
            boolean exito = repo.registrarProducto(productoRecibido);
            
            // 3. Evaluamos si MySQL lo aceptó
            if (exito) {
                ctx.status(201);
                ctx.result("Producto registrado exitosamente en el catálogo.");
            } else {
                ctx.status(500);
                ctx.result("Error 500: No se pudo guardar el producto en la base de datos.");
            }
        } catch (Exception e) {
            System.out.println("Error de formato en ProductoController: " + e.getMessage());
            ctx.status(400);
            ctx.result("Error 400: Revisa el formato JSON enviado desde el frontend.");
        }
    }
    // Método recuperado para atender la petición del frontend
    public static void buscarPorCodigo(Context ctx) {
        try {
            // 1. Javalin extrae el código directamente de la URL (ej. /api/productos/750123...)
            String codigo = ctx.pathParam("codigo");
            
            // 2. Mandamos al trabajador a buscar en MySQL
            ProductoRepository repo = new ProductoRepository();
            Producto producto = repo.buscarPorCodigo(codigo);
            
            // 3. Evaluamos la respuesta
            if (producto != null) {
                ctx.status(200);
                ctx.json(producto); // Le entregamos el JSON a React
            } else {
                ctx.status(404); // Código universal de "No Encontrado"
                ctx.result("Producto no encontrado en el inventario.");
            }
        } catch (Exception e) {
            System.out.println("Error interno en buscarPorCodigo: " + e.getMessage());
            ctx.status(500);
            ctx.result("Error 500: Fallo en el servidor al buscar el producto.");
        }
    }
}