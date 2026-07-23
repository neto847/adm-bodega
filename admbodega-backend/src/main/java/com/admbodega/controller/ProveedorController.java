package com.admbodega.controller;

import com.admbodega.model.Proveedor;
import com.admbodega.repository.ProveedorRepository;

import io.javalin.http.Context;

public class ProveedorController {

    public static void registrarProveedor(Context ctx) {
        try {
            // 1. Convertimos el JSON entrante al objeto Java
            Proveedor proveedorRecibido = ctx.bodyAsClass(Proveedor.class);
            
            // 2. Llamamos al trabajador
            ProveedorRepository repo = new ProveedorRepository();
            boolean exito = repo.registrarProveedor(proveedorRecibido);
            
            // 3. Evaluamos el resultado
            if (exito) {
                ctx.status(201);
                ctx.result("Proveedor registrado exitosamente en el catálogo.");
            } else {
                ctx.status(500);
                ctx.result("Error 500: No se pudo guardar el proveedor en la base de datos.");
            }
        } catch (Exception e) {
            System.out.println(" Error en ProveedorController: " + e.getMessage());
            ctx.status(400);
            ctx.result("Error 400: El formato del JSON enviado es incorrecto.");
        }
    }

    public static void listarProveedores(Context ctx) {
        try {
            ProveedorRepository repo = new ProveedorRepository();
            java.util.List<Proveedor> proveedores = repo.listarProveedores();
            ctx.status(200);
            ctx.json(proveedores);
        } catch (Exception e) {
            ctx.status(500);
            ctx.result("Error al listar proveedores.");
        }
    }

    public static void eliminarProveedor(Context ctx) {
        try {
            int idProveedor = Integer.parseInt(ctx.pathParam("id"));
            ProveedorRepository repo = new ProveedorRepository();
            boolean exito = repo.eliminarProveedor(idProveedor);

            if (exito) {
                ctx.status(200);
                ctx.result("Proveedor eliminado correctamente.");
            } else {
                ctx.status(409);
                ctx.result("No se pudo eliminar el proveedor (no existe o tiene compras asociadas).");
            }
        } catch (NumberFormatException e) {
            ctx.status(400);
            ctx.result("El id de proveedor es inválido.");
        } catch (Exception e) {
            ctx.status(500);
            ctx.result("Error interno al eliminar proveedor.");
        }
    }
}