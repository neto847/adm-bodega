# Preparación para AWS

## Variables de entorno recomendadas

### Backend
Crear un archivo .env en la carpeta admbodega-backend con:

```env
PORT=3000
DB_HOST=<RDS_ENDPOINT>
DB_PORT=3306
DB_NAME=sistema_inventario
DB_USER=<RDS_USER>
DB_PASSWORD=<RDS_PASSWORD>
DB_URL=jdbc:mysql://<RDS_ENDPOINT>:3306/sistema_inventario?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

### Frontend
Crear un archivo .env en la carpeta frontend super pro/frontend con:

```env
VITE_API_URL=http://<IP_PUBLICA_EC2>:3000
```

## Recomendación de despliegue
- Backend: correr en una instancia EC2
- Frontend: servirlo con Nginx desde la misma EC2
- Base de datos: usar RDS MySQL

## Notas
- No subir credenciales reales a GitHub
- Mantener el archivo .env solo en la instancia EC2
