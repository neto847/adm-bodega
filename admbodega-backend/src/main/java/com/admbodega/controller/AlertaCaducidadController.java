package com.admbodega.controller;

import com.admbodega.repository.AlertaCaducidadRepository;

import io.javalin.http.Context;

public class AlertaCaducidadController {

    public static void obtenerAlertasCaducidad(Context ctx) {
        try {
            AlertaCaducidadRepository repo = new AlertaCaducidadRepository();
            java.util.Map<String, Object> payload = repo.obtenerAlertasCaducidad();
            ctx.status(200);
            ctx.json(payload);
        } catch (Exception e) {
            ctx.status(500);
            ctx.result("Error al obtener alertas de caducidad.");
        }
    }
}
