package com.admbodega.controller;

import com.admbodega.model.Merma;
import com.admbodega.repository.MermaRepository;

import io.javalin.http.Context;

public class MermaController {

    public static void registrarMerma(Context ctx) {
        try {
            // 1. Convertimos el JSON entrante al objeto Java
            Merma mermaRecibida = ctx.bodyAsClass(Merma.class);
            
            // 2. Llamamos al trabajador
            MermaRepository repo = new MermaRepository();
            boolean exito = repo.registrarMerma(mermaRecibida);
            
            // 3. Evaluamos el resultado
            if (exito) {
                ctx.status(201);
                ctx.result("Merma registrada correctamente. Inventario actualizado.");
            } else {
                ctx.status(500);
                ctx.result("Error 500: Falló al guardar en la base de datos.");
            }
        } catch (Exception e) {
            System.out.println("Error en el Controlador de Mermas: " + e.getMessage());
            ctx.status(400);
            ctx.result("Error 400: El formato del JSON enviado es incorrecto.");
        }
    }
}