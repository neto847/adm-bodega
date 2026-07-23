package com.admbodega.controller;

import com.admbodega.model.Credenciales;
import com.admbodega.model.Usuario;
import com.admbodega.repository.UsuarioRepository;

import io.javalin.http.Context;

public class UsuarioController {

    public static void login(Context ctx) {
        try {
            // 1. Recibimos el intento de login
            Credenciales creds = ctx.bodyAsClass(Credenciales.class);
            String loginValue = creds.getEmail();
            if (loginValue == null || loginValue.isBlank()) {
                loginValue = creds.getUsuario();
            }
            
            // 2. Pasamos los datos al repositorio
            UsuarioRepository repo = new UsuarioRepository();
            Usuario usuario = repo.autenticar(loginValue, creds.getPassword());

            // 3. Evaluamos la respuesta de la base de datos
            if (usuario != null) {
                // Éxito: Le mandamos a React el molde seguro (sin contraseña)
                ctx.status(200);
                ctx.json(usuario); 
            } else {
                // Fallo: Las credenciales no coinciden o el usuario fue despedido
                ctx.status(401); 
                ctx.result("Acceso denegado: Correo o contraseña incorrectos, o cuenta inactiva.");
            }
        } catch (Exception e) {
            ctx.status(400);
            ctx.result("Error 400: El formato de los datos es incorrecto.");
        }
    }

    public static void listarUsuarios(Context ctx) {
        try {
            UsuarioRepository repo = new UsuarioRepository();
            java.util.List<Usuario> usuarios = repo.listarUsuarios();
            ctx.status(200);
            ctx.json(usuarios);
        } catch (Exception e) {
            ctx.status(500);
            ctx.result("Error al listar usuarios.");
        }
    }

    public static void crearUsuario(Context ctx) {
        try {
            java.util.Map<String, Object> body = ctx.bodyAsClass(java.util.Map.class);
            String nombre = body.get("nombre") == null ? "" : String.valueOf(body.get("nombre")).trim();
            String email = body.get("email") == null ? String.valueOf(body.getOrDefault("correo", "")).trim()
                    : String.valueOf(body.get("email")).trim();
            String password = body.get("password") == null ? "" : String.valueOf(body.get("password"));
            String rolTexto = String.valueOf(body.getOrDefault("rol", "Encargado"));

            if (nombre.isEmpty() || email.isEmpty() || password.isEmpty()) {
                ctx.status(400);
                ctx.result("Nombre, email/correo y password son obligatorios.");
                return;
            }

            int idRol = "Dueño".equalsIgnoreCase(rolTexto) || "Dueno".equalsIgnoreCase(rolTexto) ? 1 : 2;

            UsuarioRepository repo = new UsuarioRepository();
            boolean exito = repo.crearUsuario(nombre, email, password, idRol);
            if (exito) {
                ctx.status(201);
                ctx.result("Usuario creado correctamente.");
            } else {
                ctx.status(409);
                ctx.result("No se pudo crear el usuario (correo duplicado o datos inválidos).");
            }
        } catch (Exception e) {
            ctx.status(400);
            ctx.result("Error 400: El formato de los datos es incorrecto.");
        }
    }

    public static void eliminarUsuario(Context ctx) {
        try {
            int idUsuario = Integer.parseInt(ctx.pathParam("id"));
            UsuarioRepository repo = new UsuarioRepository();
            boolean exito = repo.desactivarUsuario(idUsuario);

            if (exito) {
                ctx.status(200);
                ctx.result("Usuario desactivado correctamente.");
            } else {
                ctx.status(404);
                ctx.result("No se encontró el usuario a desactivar.");
            }
        } catch (NumberFormatException e) {
            ctx.status(400);
            ctx.result("El id de usuario es inválido.");
        } catch (Exception e) {
            ctx.status(500);
            ctx.result("Error interno al desactivar usuario.");
        }
    }
}