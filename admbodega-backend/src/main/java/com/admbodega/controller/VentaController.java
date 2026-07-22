package com.admbodega.controller;

import com.admbodega.model.Venta;
import com.admbodega.repository.VentaRepository;

import io.javalin.http.Context;

public class VentaController {

    public static void crearVenta(Context ctx) {
        try {
            // 1. Javalin lee el JSON (el carrito completo) y lo convierte en el objeto Venta
            Venta ventaRecibida = ctx.bodyAsClass(Venta.class);

            // 2. Llamamos al trabajador experto en ventas
            VentaRepository repo = new VentaRepository();

            // 3. Ejecutamos la transacción
            boolean exito = repo.registrarVenta(ventaRecibida);

            // 4. Le avisamos al frontend cómo nos fue
            if (exito) {
                ctx.status(201);
                ctx.result("¡Venta registrada con éxito! El inventario se ha actualizado.");
            } else {
                ctx.status(500);
                ctx.result("Hubo un error al procesar la venta. Se canceló la transacción.");
            }
        } catch (Exception e) {
            ctx.status(400);
            ctx.result("Error en el formato de los datos del carrito.");
        }
    }
    // ME auto dejo comtario Método que devuelve todos los tickets generados
    public static void obtenerHistorial(Context ctx) {
        
        // 1. Llamamos a nuestro trabajador experto en ventas
        VentaRepository repo = new VentaRepository();
        
        // 2. Le pedimos la lista de tickets
        java.util.List<Venta> listaVentas = repo.obtenerHistorial();
        
        // 3. Devolvemos el historial convertido en JSON para el frontend
        ctx.json(listaVentas);
    }
}