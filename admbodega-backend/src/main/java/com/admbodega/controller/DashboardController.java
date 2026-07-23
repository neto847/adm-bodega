package com.admbodega.controller;

import com.admbodega.model.DashboardResumen;
import com.admbodega.repository.DashboardRepository;

import io.javalin.http.Context;

public class DashboardController {

    public static void obtenerResumen(Context ctx) {
        DashboardRepository repo = new DashboardRepository();
        DashboardResumen resumen = repo.obtenerDatosDashboard();
        
        // Entregamos el paquete completo al frontend
        ctx.status(200);
        ctx.json(resumen);
    }

    public static void obtenerResumenDueno(Context ctx) {
        DashboardRepository repo = new DashboardRepository();
        java.util.Map<String, Object> resumen = repo.obtenerDatosDashboardDueno();
        ctx.status(200);
        ctx.json(resumen);
    }
}