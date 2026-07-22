package com.admbodega.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import io.github.cdimascio.dotenv.Dotenv;

public class DatabaseConfig {

    public static Connection getConnection() throws SQLException {
        Dotenv dotenv = Dotenv.load();

        String host = dotenv.get("DB_HOST", "localhost");
        String port = dotenv.get("DB_PORT", "3306");
        String name = dotenv.get("DB_NAME", "sistema_inventario");
        String user = dotenv.get("DB_USER", "root");
        String password = dotenv.get("DB_PASSWORD", "");

        String url = dotenv.get("DB_URL", "jdbc:mysql://" + host + ":" + port + "/" + name
                + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");

        return DriverManager.getConnection(url, user, password);
    }
}