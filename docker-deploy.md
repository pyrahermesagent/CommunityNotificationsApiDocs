# Docker Deployment Guide

This guide shows how to deploy the CommunityNotificationsAPI using Docker for consistent, reproducible deployments.

## Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Run with gunicorn
CMD ["gunicorn", "ApiCore.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120"]
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - static-data:/app/static
    depends_on:
      - db
    networks:
      - api-network

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: notifications_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${PG_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - api-network

volumes:
  postgres-data:
  static-data:

networks:
  api-network:
    driver: bridge
```

## Running with Docker

### Start the services

```bash
docker compose up -d
```

### Run migrations

```bash
docker compose exec api python manage.py migrate
```

### Create superuser

```bash
docker compose exec api python manage.py createsuperuser
```

### Collect static files

```bash
docker compose exec api python manage.py collectstatic --noinput
```

### Restart the API

```bash
docker compose restart api
```

## Nginx Configuration (Optional)

For production, use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/static/files/;
        expires 30d;
    }
}
```

## Docker Compose with Nginx

```yaml
version: '3.8'

services:
  api:
    build: .
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      - static-data:/app/static
    depends_on:
      - db
    networks:
      - api-network

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: notifications_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${PG_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - api-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - static-data:/app/static
    depends_on:
      - api
    networks:
      - api-network

volumes:
  postgres-data:
  static-data:

networks:
  api-network:
    driver: bridge
```

## Environment Variables for Docker

Create a `.env` file:

```env
# App
DEBUG=0
DJANGO_ALLOWED_HOSTS="your-domain.com"
SECRET_KEY="your-secret-key"
FIREBASE_CREDENTIALS_JSON="..."

# Attestation
APK_NAME="com.companyname.appname"
APP_ATTEST_APP_ID="your-app-id"
GOOGLE_PLAY_INTEGRITY_DECRYPTION_KEY="..."
GOOGLE_PLAY_INTEGRITY_VERIFICATION_KEY="..."
GOOGLE_PLAY_INTEGRITY_APP_SIGNING_KEY="..."

# Database
PG_URL=postgresql://admin:${PG_PASSWORD}@db:5432/notifications_db
PG_HOST=db
PG_PORT=5432
PG_USER=admin
PG_PASSWORD=your-strong-password
```

## Health Check

Add health checks to your docker-compose.yml:

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/nonce/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Monitoring Docker Logs

```bash
# View logs
docker compose logs -f api

# View specific service logs
docker compose logs -f db

# Check container status
docker compose ps
```