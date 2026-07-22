package com.admbodega.controller;

import com.admbodega.model.Compra;
import com.admbodega.repository.CompraRepository;

import io.javalin.http.Context;

public class CompraController {

    public static void registrarCompra(Context ctx) {
        try {
            Compra compraRecibida = ctx.bodyAsClass(Compra.class);
            CompraRepository repo = new CompraRepository();
            
            boolean exito = repo.registrarCompra(compraRecibida);

            if (exito) {
                ctx.status(201);
                ctx.result("Compra registrada con éxito. El inventario ha aumentado.");
            } else {
                ctx.status(500);
                ctx.result("Error 500 al procesar la compra en la base de datos.");
            }
        } catch (Exception e) {
            System.out.println(" Error de formato en CompraController: " + e.getMessage());
            ctx.status(400);
            ctx.result("Error 400: Revisa el formato JSON del pedido.");
        }
    }
}