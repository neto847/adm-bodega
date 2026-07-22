package com.admbodega.model;

import java.util.List;

public class DashboardResumen {
    
    private double ventasDeHoy;
    private List<Producto> productosBajoStock; // Reutilizamos tu molde de Producto

    public DashboardResumen() {
    }

    public DashboardResumen(double ventasDeHoy, List<Producto> productosBajoStock) {
        this.ventasDeHoy = ventasDeHoy;
        this.productosBajoStock = productosBajoStock;
    }

    public double getVentasDeHoy() { return ventasDeHoy; }
    public void setVentasDeHoy(double ventasDeHoy) { this.ventasDeHoy = ventasDeHoy; }

    public List<Producto> getProductosBajoStock() { return productosBajoStock; }
    public void setProductosBajoStock(List<Producto> productosBajoStock) { this.productosBajoStock = productosBajoStock; }
}