package com.admbodega.model;

public class MovimientoInventario {
    
    // Atributos de la tabla movimientos_inventario
    private int idMovimiento;
    private int idProducto;
    private int idUsuario;
    private int idTipoMovimiento; // 1=Entrada, 2=Salida, 3=Ajuste
    private int cantidad;
    private String tipoReferencia; // "COMPRA", "VENTA", "MERMA", o "AJUSTE"
    private int idReferencia; // El número de ticket de la venta o folio de la compra
    private String fechaMovimiento;

    // Constructor vacío
    public MovimientoInventario() {
    }

    // Constructor completo
    public MovimientoInventario(int idMovimiento, int idProducto, int idUsuario, int idTipoMovimiento, int cantidad, String tipoReferencia, int idReferencia, String fechaMovimiento) {
        this.idMovimiento = idMovimiento;
        this.idProducto = idProducto;
        this.idUsuario = idUsuario;
        this.idTipoMovimiento = idTipoMovimiento;
        this.cantidad = cantidad;
        this.tipoReferencia = tipoReferencia;
        this.idReferencia = idReferencia;
        this.fechaMovimiento = fechaMovimiento;
    }

    // Getters y Setters
    public int getIdMovimiento() { return idMovimiento; }
    public void setIdMovimiento(int idMovimiento) { this.idMovimiento = idMovimiento; }

    public int getIdProducto() { return idProducto; }
    public void setIdProducto(int idProducto) { this.idProducto = idProducto; }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public int getIdTipoMovimiento() { return idTipoMovimiento; }
    public void setIdTipoMovimiento(int idTipoMovimiento) { this.idTipoMovimiento = idTipoMovimiento; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public String getTipoReferencia() { return tipoReferencia; }
    public void setTipoReferencia(String tipoReferencia) { this.tipoReferencia = tipoReferencia; }

    public int getIdReferencia() { return idReferencia; }
    public void setIdReferencia(int idReferencia) { this.idReferencia = idReferencia; }

    public String getFechaMovimiento() { return fechaMovimiento; }
    public void setFechaMovimiento(String fechaMovimiento) { this.fechaMovimiento = fechaMovimiento; }
}