package com.admbodega.model;

public class Categoria {
    
    // 1. Los atributos exactos de la base de datos
    private int idCategoria;
    private String nombre;
    private String descripcion;

    // 2. Constructor vacío
    public Categoria() {
    }

    // 3. Constructor con todos los datos
    public Categoria(int idCategoria, String nombre, String descripcion) {
        this.idCategoria = idCategoria;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // 4. Getters y Setters
    public int getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}