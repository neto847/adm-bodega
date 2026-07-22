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
}