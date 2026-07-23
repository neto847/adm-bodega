package com.admbodega.controller;

import java.util.List;

import com.admbodega.model.Categoria;
import com.admbodega.repository.CategoriaRepository;

import io.javalin.http.Context;

public class CategoriaController {
    
    // Este es el método que atenderá la petición del frontend
    public static void traerCategorias(Context ctx) {
        
        // 1. Llamamos al trabajador que construimos en el paso anterior
        CategoriaRepository repo = new CategoriaRepository();
        
        // 2. Le pedimos que vaya a MySQL y nos traiga la lista llena
        List<Categoria> lista = repo.obtenerTodas();
        
        // 3. Le entregamos la lista al cliente (el frontend) traducida a JSON automáticamente
        ctx.json(lista);
    }
    // Este método recibirá los datos del frontend y los guardará
    public static void crearCategoria(Context ctx) {
        
        // 1. Javalin hace magia: toma el JSON de tu amiga y lo convierte en tu "cajita" de Java
        Categoria categoriaRecibida = ctx.bodyAsClass(Categoria.class);
        
        // 2. Llamamos al trabajador
        CategoriaRepository repo = new CategoriaRepository();
        
        // 3. Le pedimos que guarde la cajita
        boolean exito = repo.guardar(categoriaRecibida);
        
        // 4. Le avisamos al frontend cómo nos fue
        if (exito) {
            ctx.status(201); // 201 significa "Creado con éxito"
            ctx.result("Categoría guardada correctamente en AdmBodega");
        } else {
            ctx.status(500); // 500 significa "Error en el servidor"
            ctx.result("Hubo un error al guardar la categoría");
        }
    }

    public static void eliminarCategoria(Context ctx) {
        try {
            int idCategoria = Integer.parseInt(ctx.pathParam("id"));
            CategoriaRepository repo = new CategoriaRepository();
            boolean exito = repo.eliminarPorId(idCategoria);

            if (exito) {
                ctx.status(200);
                ctx.result("Categoría eliminada correctamente.");
            } else {
                ctx.status(409);
                ctx.result("No se pudo eliminar la categoría (no existe o tiene productos asociados).");
            }
        } catch (NumberFormatException e) {
            ctx.status(400);
            ctx.result("El id de categoría es inválido.");
        } catch (Exception e) {
            ctx.status(500);
            ctx.result("Error interno al eliminar la categoría.");
        }
    }
}