# Guía de despliegue en AWS Academy

Esta guía prepara el proyecto para desplegarse en una arquitectura simple y estable:
- 1 instancia EC2 para backend + frontend
- 1 base de datos RDS MySQL

## Arquitectura recomendada
- Frontend: servido por Nginx en EC2
- Backend: ejecutado con Java + Javalin en EC2
- Base de datos: MySQL en RDS

## 1. Preparar la base de datos en RDS
1. En AWS Console, crea una instancia RDS MySQL.
2. Usa un nombre de base de datos como `sistema_inventario`.
3. Crea un usuario maestro.
4. Anota:
   - endpoint del RDS
   - puerto 3306
   - nombre de base de datos
   - usuario
   - contraseña
5. Abre el Security Group del RDS para permitir tráfico desde la instancia EC2 en el puerto 3306.

## 2. Crear la instancia EC2
1. Crear una instancia Ubuntu en EC2.
2. En el Security Group, abrir:
   - 22 TCP desde tu IP
   - 80 TCP desde 0.0.0.0/0.0.0.0
   - 443 TCP desde 0.0.0.0/0.0.0.0
   - 3000 TCP desde 0.0.0.0/0.0.0.0
3. Conectar por SSH.

## 3. Instalar dependencias en la EC2
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk maven nginx git unzip curl
```

## 4. Clonar el proyecto
```bash
cd /home/ubuntu
git clone <URL_DEL_REPOSITORIO> adm-bodega
cd adm-bodega
```

## 5. Configurar variables de entorno del backend
Crea el archivo `.env` en la carpeta del backend:
```bash
cd /home/ubuntu/adm-bodega/admbodega-backend
cp .env.example .env
```
Edita `.env` con tus valores reales:
```env
PORT=3000
DB_HOST=<RDS_ENDPOINT>
DB_PORT=3306
DB_NAME=sistema_inventario
DB_USER=<RDS_USER>
DB_PASSWORD=<RDS_PASSWORD>
DB_URL=jdbc:mysql://<RDS_ENDPOINT>:3306/sistema_inventario?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

## 6. Compilar el backend
```bash
cd /home/ubuntu/adm-bodega/admbodega-backend
mvn -q -DskipTests package
```

## 7. Configurar el frontend
```bash
cd /home/ubuntu/adm-bodega/frontend\ super\ pro/frontend
cp .env.example .env
```
Edita `.env` solo si quieres forzar una URL externa. Si Nginx hará proxy al backend, puedes omitir este archivo o dejarlo vacío para usar rutas relativas `/api`:
```env
VITE_API_URL=
```
Compila:
```bash
npm install
npm run build
```

## 8. Subir la base de datos al RDS
Desde tu máquina o desde la EC2, importa el script SQL:
```bash
mysql -h <RDS_ENDPOINT> -u <RDS_USER> -p < base\ de\ dat/sistema_bidega.sql
```

## 9. Ejecutar el backend como servicio
Crea un servicio de systemd:
```bash
sudo tee /etc/systemd/system/admbodega-backend.service > /dev/null <<'EOF'
[Unit]
Description=AdmBodega Backend
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/adm-bodega/admbodega-backend
ExecStart=/usr/bin/java -jar /home/ubuntu/adm-bodega/admbodega-backend/target/backend-1.0-SNAPSHOT-jar-with-dependencies.jar
Restart=always
User=ubuntu
Environment=PATH=/usr/bin:/usr/local/bin
Environment=JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

[Install]
WantedBy=multi-user.target
EOF
```

Activa y levanta el servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable admbodega-backend
sudo systemctl start admbodega-backend
sudo systemctl status admbodega-backend
```

## 10. Configurar Nginx para frontend y proxy al backend
```bash
sudo tee /etc/nginx/sites-available/admbodega > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/admbodega /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

Con esta configuración de Nginx, el frontend puede usar `/api` sin depender de una IP pública fija. Eso evita que la aplicación se rompa cuando la EC2 cambia de IP tras un reinicio o stop/start.

Antes de reiniciar Nginx, copia el build del frontend a `/var/www/html`:
```bash
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
```

## 11. Probar la aplicación
Abre en el navegador:
```text
http://<EC2_PUBLIC_IP>
```
Prueba:
- login
- productos
- ventas
- dashboard

## 12. Recomendación para varios dispositivos
Para que funcione desde muchos dispositivos, usa:
- la IP pública o DNS público de la EC2
- un dominio si lo tienes
- HTTPS con ACM + CloudFront si quieres un entorno más profesional

## Recomendación final para AWS Academy
Si quieres algo estable y simple, usa:
- 1 EC2
- 1 RDS MySQL
- Nginx para frontend
- backend en Java en la misma EC2

Eso evita complicarte con demasiadas instancias y sigue siendo una arquitectura válida para mostrar en clase.
