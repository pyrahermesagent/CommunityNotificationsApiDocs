# Setup Guide

This guide walks you through setting up the CommunityNotificationsAPI on your own server.

## Prerequisites

- Python 3.11+
- PostgreSQL database
- Firebase project (for FCM)
- Google Cloud project (for Play Integrity API — Android only)
- Apple Developer account (for App Attest — iOS only)

## Step 1: Database Setup

Set up a PostgreSQL database and note the connection details. You'll need:

- Database name
- Username
- Password
- Host
- Port (default: 5432)

## Step 2: Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select or create your project
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key** and confirm
5. Securely store the downloaded JSON file — it contains sensitive credentials

## Step 3: Google Play Integrity API (Android)

1. Set up a project in the [Google Cloud Console](https://console.cloud.google.com/)
2. Link it to your Play Console account
3. Enable the **Play Integrity API** in the Console settings
4. Change the response encryption to **Manual**
5. Copy the **Decryption Key** and **Verification Key**

## Step 4: Apple App Attest (iOS)

For iOS support, you need:
- An Apple Developer account
- App Attest capability enabled for your app bundle ID
- The App Attest App ID (found in Apple Developer portal)

## Step 5: Environment Variables

Create a `.env` file in the project root with the following structure:

```dotenv
# App setup
DEBUG=0
DJANGO_ALLOWED_HOSTS=".yourdomain.com,0.0.0.0"
SECRET_KEY="your-secret-key-here"
FIREBASE_CREDENTIALS_JSON='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/...","universe_domain":"googleapis.com"}'

# App attestation
APK_NAME="com.companyname.appname"
APP_ATTEST_APP_ID="your-app-id"
GOOGLE_PLAY_INTEGRITY_DECRYPTION_KEY="your-decryption-key"
GOOGLE_PLAY_INTEGRITY_VERIFICATION_KEY="your-verification-key"
GOOGLE_PLAY_INTEGRITY_APP_SIGNING_KEY="XX:XX:XX:XX:XX:XX..."

# Database setup
PG_URL="postgresql://user:password@host:5432/dbname"
PG_DATABASE="db_name"
PG_HOST="some.url.com"
PG_PASSWORD="your-password"
PG_PORT="5432"
PG_USER="admin"
```

> [!WARNING] Security Notice
> Never commit your `.env` file to version control. Add it to `.gitignore` and store secrets securely.

## Step 6: Install Dependencies

```bash
pip install -r requirements.txt
```

The key dependencies are:
- **Django 5.2** — Web framework
- **Django REST Framework 3.16** — REST API framework
- **fcm-django 2.3** — Firebase Cloud Messaging integration
- **firebase_admin 7.1** — Firebase Admin SDK
- **djangorestframework-simplejwt 5.5** — JWT authentication
- **djangorestframework-api-key 3** — API key authentication
- **pyattest 1.0** — Device attestation (Android Play Integrity + iOS App Attest)
- **gunicorn 23** — Production WSGI server
- **whitenoise 6.9** — Static file serving

## Step 7: Database Migration

```bash
python manage.py migrate
```

This creates the required database tables:
- `ApiApp_attestedfcmdevice` — Registered devices with FCM tokens
- `ApiApp_nonce` — Temporary nonces for attestation

## Step 8: Create Superuser (Optional)

To access the Django admin panel:

```bash
python manage.py createsuperuser
```

## Step 9: Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

## Step 10: Production Deployment

### Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### Start with Gunicorn

```bash
gunicorn ApiCore.wsgi:application --bind 0.0.0.0:$PORT
```

> [!NOTE] `$PORT` environment variable should be supplied by your hosting platform (Render, Heroku, etc.)

### Systemd Service (Linux)

Create `/etc/systemd/system/notifications-api.service`:

```ini
[Unit]
Description=CommunityNotificationsAPI
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/notifications-api
ExecStart=/path/to/notifications-api/venv/bin/gunicorn ApiCore.wsgi:application --bind 0.0.0.0:$PORT
Environment=PATH=/path/to/notifications-api/venv/bin
EnvironmentFile=/path/to/notifications-api/.env
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable notifications-api
sudo systemctl start notifications-api
```

## Automated Deployment

This repository includes a GitHub Actions workflow for automated deployment to a Hetzner server. See `.github/workflows/deploy.yml` in the source repository for the full configuration.

The workflow:
1. Triggers on push to `main`
2. Rsyncs the code to the server
3. Copies secrets, sets up virtual environment, runs migrations
4. Restarts the systemd service

Required GitHub secrets:
- `SSH_PRIVATE_KEY` — SSH key for server access
- `SERVER_IP` — Server IP address
- `SERVER_USER` — SSH username

## API Key Setup

To send notifications, you need an API key. Create one from the Django admin:

1. Visit `/admin/`
2. Log in with your superuser credentials
3. Navigate to **ApiApp** → **API Keys** → **Add API Key**
4. Copy the generated key — you'll need it for the `/api/fcm/send-notification/` endpoint