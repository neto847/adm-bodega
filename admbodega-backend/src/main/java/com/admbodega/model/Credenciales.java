package com.admbodega.model;

public class Credenciales {
    private String email;
    private String usuario;
    private String password;

    public Credenciales() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}