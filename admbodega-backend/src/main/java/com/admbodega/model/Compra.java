package com.admbodega.model;

import java.util.List;

public class Compra {
    
    private int idCompra;
    private int idUsuario; // El encargado que recibe el camión
    private int idProveedor; // Qué empresa nos trajo esto
    private double total;
    private String fechaCompra;

    // La lista que guardará todas las cajas/productos que llegaron
    private List<DetalleCompra> detalles; 

    public Compra() {
    }

    public Compra(int idCompra, int idUsuario, int idProveedor, double total, String fechaCompra, List<DetalleCompra> detalles) {
        this.idCompra = idCompra;
        this.idUsuario = idUsuario;
        this.idProveedor = idProveedor;
        this.total = total;
        this.fechaCompra = fechaCompra;
        this.detalles = detalles;
    }

    // Getters y Setters
    public int getIdCompra() { return idCompra; }
    public void setIdCompra(int idCompra) { this.idCompra = idCompra; }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public int getIdProveedor() { return idProveedor; }
    public void setIdProveedor(int idProveedor) { this.idProveedor = idProveedor; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getFechaCompra() { return fechaCompra; }
    public void setFechaCompra(String fechaCompra) { this.fechaCompra = fechaCompra; }

    public List<DetalleCompra> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleCompra> detalles) { this.detalles = detalles; }
}