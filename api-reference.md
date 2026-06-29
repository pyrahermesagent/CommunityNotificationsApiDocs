# API Reference

Complete reference for all API endpoints.

## Base URL

All endpoints are relative to your server's base URL:

```
https://your-server.com
```

## Authentication

The API uses three authentication methods:

| Method | Endpoints | Header |
|--------|-----------|--------|
| None | `/api/nonce/`, `/api/token/` | — |
| JWT Bearer | `/api/token/refresh/`, `/api/fcm/token-update/`, `/api/user/uid-update/` | `Authorization: Bearer <access_token>` |
| API Key | `/api/fcm/send-notification/` | `X-API-Key: <api_key>` |

---

## 1. Generate Nonce

Requests a one-time nonce for device attestation.

**Endpoint:** `POST /api/nonce/`

**Authentication:** None required

**Request Body:** Empty

**Response:**

```json
{
  "nonce": "random-string-value"
}
```

**cURL Example:**

```bash
curl -X POST https://your-server.com/api/nonce/
```

> [!NOTE]
> The nonce expires after 2 minutes (configurable via `ATTESTATION_NONCE_EXPIRY_SECONDS`).
> Old nonces are automatically cleaned up after 5 minutes.

---

## 2. Register Device

Registers a device and obtains JWT tokens.

**Endpoint:** `POST /api/token/`

**Authentication:** None required

**Request Body:**

```json
{
  "nonce": "the-nonce-from-step-1",
  "device_id": "unique-device-identifier",
  "platform": "android",
  "attestation": "attestation-token-jwt",
  "assertion": ""
}
```

**Parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `nonce` | Yes | Nonce obtained from `/api/nonce/` |
| `device_id` | Yes | Unique device identifier (e.g., Android device ID, iOS identifierForVendor) |
| `platform` | Yes | `"android"` or `"ios"` |
| `attestation` | Yes (Android), Yes (iOS first time) | Attestation token from Play Integrity or App Attest |
| `assertion` | No (Android), Optional (iOS) | iOS assertion token for re-attestation (when device has been registered before) |

**Android Response:**

```json
{
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

**iOS Response (first registration):**

```json
{
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

**iOS Response (subsequent registration):**

```json
{
  "access": "<jwt-access-token>",
  "refresh": "<jwt-refresh-token>"
}
```

**cURL Example (Android):**

```bash
curl -X POST https://your-server.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "nonce": "abc123nonce",
    "device_id": "com.example.app:ABCDEF",
    "platform": "android",
    "attestation": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "assertion": ""
  }'
```

**cURL Example (iOS):**

```bash
# First registration (with attestation)
curl -X POST https://your-server.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "nonce": "abc123nonce",
    "device_id": "com.example.app:XYZ789",
    "platform": "ios",
    "attestation": "base64-encoded-attestation",
    "assertion": ""
  }'

# Subsequent registration (with assertion only)
curl -X POST https://your-server.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "nonce": "abc123nonce2",
    "device_id": "com.example.app:XYZ789",
    "platform": "ios",
    "attestation": "",
    "assertion": "base64-encoded-assertion"
  }'
```

---

## 3. Refresh Token

Obtains a new access token using the refresh token.

**Endpoint:** `POST /api/token/refresh/`

**Authentication:** None required

**Request Body:**

```json
{
  "refresh": "<your-refresh-token>"
}
```

**Response:**

```json
{
  "access": "<new-jwt-access-token>"
}
```

**cURL Example:**

```bash
curl -X POST https://your-server.com/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

> [!NOTE]
> Access tokens expire after 5 minutes. Refresh tokens expire after 20 days.

---

## 4. Update FCM Token

Updates the Firebase Cloud Messaging registration token for a registered device.

**Endpoint:** `POST /api/fcm/token-update/`

**Authentication:** JWT Bearer token required

**Request Body:**

```json
{
  "fcm_token": "new-fcm-registration-token"
}
```

**Response:**

```json
{
  "message": "Token updated successfully."
}
```

**cURL Example:**

```bash
curl -X POST https://your-server.com/api/fcm/token-update/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "fcm_token": "dQw4w9WgXcQ:APA91bFQ..."
  }'
```

> [!NOTE]
> Upon successful update, the device is automatically subscribed to the following FCM topics:
> - `global` — Global notifications
> - `<device-type>` — Platform-specific notifications (e.g., `"android"`, `"ios"`)

---

## 5. Update User Identifier

Associates a user identifier with a registered device.

**Endpoint:** `POST /api/user/uid-update/`

**Authentication:** JWT Bearer token required

**Request Body:**

```json
{
  "user_id": "user123"
}
```

**Response:**

```json
{
  "message": "User identifier updated successfully."
}
```

**cURL Example:**

```bash
curl -X POST https://your-server.com/api/user/uid-update/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "user_id": "wallet-0xabc123..."
  }'
```

> [!NOTE]
> The `user_id` can be any identifier you choose — wallet addresses, database user IDs, etc.
> This is used when sending notifications to a user.

---

## 6. Send Notification

Sends a push notification to all devices associated with a user.

**Endpoint:** `POST /api/fcm/send-notification/`

**Authentication:** API Key required

**Request Body:**

```json
{
  "user_id": "user123",
  "title": "New Message",
  "body": "You have a new message!"
}
```

**Parameters:**

| Parameter | Required | Max Length | Description |
|-----------|----------|------------|-------------|
| `user_id` | Yes | 255 | The user identifier associated with devices |
| `title` | Yes | 150 | Notification title |
| `body` | Yes | 500 | Notification body text |

**Response (Success):**

```json
{
  "message": "Notification process completed.",
  "success_count": 3,
  "failure_count": 0
}
```

**Response (No devices found):**

```json
{
  "detail": "No registered devices found for this user."
}
```

**cURL Example:**

```bash
curl -X POST https://your-server.com/api/fcm/send-notification/ \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "user_id": "user123",
    "title": "Breaking News",
    "body": "Something important happened!"
  }'
```

> [!NOTE]
> The API key must be created in the Django admin panel under **ApiApp** → **API Keys**.

---

## Error Responses

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request — Invalid input, invalid nonce, attestation failure |
| 401 | Unauthorized — Missing or invalid authentication |
| 403 | Forbidden — Invalid API key |
| 404 | Not Found — No devices found for the specified user |

**Error Response Format:**

```json
{
  "detail": "Error description",
  "nonce": ["Nonce is not valid."]
}
```

---

## Django Admin

Access the admin panel at:

```
https://your-server.com/admin/
```

Login with the superuser credentials created during setup. From here you can:
- View all registered devices
- Manage API keys
- Monitor nonces
- View FCM device data