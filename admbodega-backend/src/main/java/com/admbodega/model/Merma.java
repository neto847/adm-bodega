package com.admbodega.model;

public class Merma {
    
    // Atributos exactos que requiere tu tabla 'mermas'
    private int idMerma;
    private int idProducto;
    private int idUsuario;
    private int idMotivo; // Usamos idMotivo (número) en lugar de texto
    private int cantidad;
    private String fechaMerma;

    // Constructor vacío
    public Merma() {
    }

    // Constructor completo
    public Merma(int idMerma, int idProducto, int idUsuario, int idMotivo, int cantidad, String fechaMerma) {
        this.idMerma = idMerma;
        this.idProducto = idProducto;
        this.idUsuario = idUsuario;
        this.idMotivo = idMotivo;
        this.cantidad = cantidad;
        this.fechaMerma = fechaMerma;
    }

    // Getters y Setters
    public int getIdMerma() { return idMerma; }
    public void setIdMerma(int idMerma) { this.idMerma = idMerma; }

    public int getIdProducto() { return idProducto; }
    public void setIdProducto(int idProducto) { this.idProducto = idProducto; }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public int getIdMotivo() { return idMotivo; }
    public void setIdMotivo(int idMotivo) { this.idMotivo = idMotivo; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public String getFechaMerma() { return fechaMerma; }
    public void setFechaMerma(String fechaMerma) { this.fechaMerma = fechaMerma; }
}