package com.admbodega.model;

public class Producto {
    
    private int idProducto;
    private int idCategoria; // Llave foránea a categorias
    private int idEstado;    // Llave foránea a estados_producto
    private String codigoBarras;
    private String nombre;
    private String descripcion;
    private double precioCompra;
    private double precioVenta;
    private int stockActual;

    public Producto() {
    }

    public Producto(int idProducto, int idCategoria, int idEstado, String codigoBarras, String nombre, String descripcion, double precioCompra, double precioVenta, int stockActual) {
        this.idProducto = idProducto;
        this.idCategoria = idCategoria;
        this.idEstado = idEstado;
        this.codigoBarras = codigoBarras;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioCompra = precioCompra;
        this.precioVenta = precioVenta;
        this.stockActual = stockActual;
    }

    // Getters y Setters
    public int getIdProducto() { return idProducto; }
    public void setIdProducto(int idProducto) { this.idProducto = idProducto; }

    public int getIdCategoria() { return idCategoria; }
    public void setIdCategoria(int idCategoria) { this.idCategoria = idCategoria; }

    public int getIdEstado() { return idEstado; }
    public void setIdEstado(int idEstado) { this.idEstado = idEstado; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public double getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(double precioCompra) { this.precioCompra = precioCompra; }

    public double getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(double precioVenta) { this.precioVenta = precioVenta; }

    public int getStockActual() { return stockActual; }
    public void setStockActual(int stockActual) { this.stockActual = stockActual; }
}