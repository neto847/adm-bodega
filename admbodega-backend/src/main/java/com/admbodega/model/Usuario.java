package com.admbodega.model;

public class Usuario {
    
    // Solo los datos seguros de la tabla usuarios
    private int idUsuario;
    private int idRol;
    private String nombre;
    private String email;

    public Usuario() {}

    public Usuario(int idUsuario, int idRol, String nombre, String email) {
        this.idUsuario = idUsuario;
        this.idRol = idRol;
        this.nombre = nombre;
        this.email = email;
    }

    public int getIdUsuario() { return idUsuario; }
    public void setIdUsuario(int idUsuario) { this.idUsuario = idUsuario; }

    public int getIdRol() { return idRol; }
    public void setIdRol(int idRol) { this.idRol = idRol; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}