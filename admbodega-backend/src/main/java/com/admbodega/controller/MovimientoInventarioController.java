package com.admbodega.controller;

import java.util.List;

import com.admbodega.model.MovimientoInventario;
import com.admbodega.repository.MovimientoInventarioRepository;

import io.javalin.http.Context;

public class MovimientoInventarioController {

    public static void obtenerHistorial(Context ctx) {
        
        MovimientoInventarioRepository repo = new MovimientoInventarioRepository();
        List<MovimientoInventario> listaMovimientos = repo.obtenerHistorial();
        
        ctx.json(listaMovimientos);
    }
}