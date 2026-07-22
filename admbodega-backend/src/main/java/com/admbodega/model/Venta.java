package com.admbodega.model;

import java.util.List; // Importamos las Listas de Java

public class Venta {
    
    // 1. Atributos de la tabla ventas
    private int idVenta;
    private int idUsuario; // El cajero que hizo la venta
    private double total;
    private String fechaVenta; // Lo dejamos como String para leerlo fácil

    // --- LA MAGIA DE LA RELACIÓN ---
    // 2. Una lista que guardará todos los productos de este ticket
    private List<DetalleVenta> detalles; 

    // 3. Constructor vacío
    public Venta() {
    }

    // 4. Constructor con todos los datos
    public Venta(int idVenta, int idUsuario, double total, String fechaVenta, List<DetalleVenta> detalles) {
        this.idVenta = idVenta;
        this.idUsuario = idUsuario;
        this.total = total;
        this.fechaVenta = fechaVenta;
        this.detalles = detalles;
    }

    // 5. Getters y Setters
    public int getIdVenta() { return idVenta; }
    public void setIdVenta(int idVenta) { this.idVenta = idVenta; }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(String fechaVenta) { this.fechaVenta = fechaVenta; }

    public List<DetalleVenta> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVenta> detalles) { this.detalles = detalles; } 
}