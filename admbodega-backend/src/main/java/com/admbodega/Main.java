package com.admbodega;

import com.admbodega.controller.CategoriaController;
import com.admbodega.controller.CompraController;
import com.admbodega.controller.DashboardController;
import com.admbodega.controller.MermaController;
import com.admbodega.controller.MovimientoInventarioController;
import com.admbodega.controller.ProductoController;
import com.admbodega.controller.ProveedorController;
import com.admbodega.controller.UsuarioController;
import com.admbodega.controller.VentaController;

import io.github.cdimascio.dotenv.Dotenv;
import io.javalin.Javalin;

public class Main {
    public static void main(String[] args) {
        
        Dotenv dotenv = Dotenv.load();
        int port = Integer.parseInt(dotenv.get("PORT", "3000"));
        
        // Inicializamos el servidor
        Javalin app = Javalin.create(config -> {
            // Esto es vital: Permite que el frontend de React de nuestra amiguita dani 
            // se conecte sin que el navegador la bloquee por seguridad (CORS).
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> it.anyHost());
            });
        }).start(port);

        //EL MENÚ DE RUTAS (ENDPOINTS)
        
        // Ruta base de prueba
        app.get("/", ctx -> {
            ctx.result("Backend de AdmBodega listo y conectado");
        });
        // NUESTRA PRIMERA RUTA REAL: 
        // Cuando alguien entre a /api/categorias, el controlador hace su trabajo
        app.get("/api/categorias", CategoriaController::traerCategorias);
        // NUEVA RUTA: Recibe datos para guardar una categoría
        app.post("/api/categorias", CategoriaController::crearCategoria);
        //si llegara a paasar alguna falla recuerda neto que aca puede ser la cuasa
        // RUTA EXISTENTE: Para buscar un producto específico por su código de barras
        app.get("/api/productos/{codigo}", ProductoController::buscarPorCodigo);

        // NUEVA RUTA: Lista productos del catálogo
        app.get("/api/productos", ProductoController::listarProductos);
        // NUEVA RUTA: Recibe datos para guardar un nuevo producto en el catálogo
        app.post("/api/productos", ProductoController::crearProducto);
        // NUEVA RUTA: Recibe un carrito de compras completo para procesar la venta
        app.post("/api/ventas", VentaController::crearVenta);
        // NUEVA RUTA: Para que el frontend consulte el historial de ventas
        app.get("/api/ventas", VentaController::obtenerHistorial);
        // NUEVA RUTA: Registrar producto dañado o caducado
        app.post("/api/mermas", MermaController::registrarMerma);
        // NUEVA RUTA: Registrar a un proveedor
        app.post("/api/proveedores", ProveedorController::registrarProveedor);
        // NUEVA RUTA: Recibir mercancía de proveedores
        app.post("/api/compras", CompraController::registrarCompra);
        // NUEVA RUTA: Leer el Kardex (Historial de movimientos de la bodega)
        app.get("/api/movimientos", MovimientoInventarioController::obtenerHistorial);
        // NUEVA RUTA: Punto de acceso al sistema (Login)
        app.post("/api/login", UsuarioController::login);
        // NUEVA RUTA: El cerebro del sistema (Ventas de hoy y alertas de stock)
        app.get("/api/dashboard", DashboardController::obtenerResumen);
    
        System.out.println(" Servidor corriendo dinámicamente en el puerto: " + port);
    }
}