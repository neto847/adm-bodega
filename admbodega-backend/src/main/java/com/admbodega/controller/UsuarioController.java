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
}