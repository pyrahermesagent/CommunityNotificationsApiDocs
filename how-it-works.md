# How It Works

This REST API provides a complete notification system for mobile applications. It handles device registration with strong attestation, JWT-based authentication, and push notification delivery via Firebase Cloud Messaging (FCM).

## Architecture Overview

```
[Mobile App] → [CommunityNotificationsAPI] → [Firebase Cloud Messaging]
     ↑                                      ↓
     └── [PostgreSQL Database] ←── [JWT Tokens]
```

### Components

1. **Django REST Framework** - The core API built on Django 5.2 with DRF 3.16
2. **Firebase Cloud Messaging** - Handles actual push notification delivery to devices
3. **JWT Authentication** - Provides secure device registration and token-based access
4. **Device Attestation** - Verifies device integrity using platform-specific mechanisms
5. **PostgreSQL** - Stores device registrations, tokens, and user identifiers

## How Device Registration Works

The device registration process involves several security steps:

### Step 1: Request a Nonce

The mobile app first requests a nonce (number used once) from the server:

```
POST /api/nonce/
```

The server generates a cryptographically secure random nonce and stores it in the database with an expiration time (2 minutes by default).

### Step 2: Device Attestation

The app then registers the device with attestation:

```
POST /api/token/
{
  "nonce": "...",
  "device_id": "...",
  "platform": "android",  // or "ios"
  "attestation": "...",
  "assertion": "..."  // iOS only, for subsequent registrations
}
```

**For Android:**
- The app uses Google Play Integrity API to generate an attestation token
- The server verifies this token using the configured decryption and verification keys
- This ensures the app is running on a genuine Android device with the correct app signature

**For iOS:**
- First registration: Uses Apple App Attest to generate an attestation
- The server verifies the attestation and stores the device's public key
- Subsequent registrations: Uses the stored public key for assertion verification (faster)

### Step 3: Receive JWT Tokens

Upon successful registration, the server returns:

```json
{
  "access": "<jwt_access_token>",
  "refresh": "<jwt_refresh_token>"
}
```

- **Access token**: Expires in 5 minutes, used for authenticated requests
- **Refresh token**: Expires in 20 days, used to obtain new access tokens

## How Notifications Are Sent

### Workflow

1. Backend service calls the notification endpoint with an API key:
   ```
   POST /api/fcm/send-notification/
   X-API-Key: <your_api_key>
   {
     "user_id": "user123",
     "title": "New Message",
     "body": "You have a new message!"
   }
   ```

2. The server queries the database for all devices associated with that `user_id`

3. For each device with a valid FCM token, the server sends a notification via FCM

4. The server returns a summary:
   ```json
   {
     "message": "Notification process completed.",
     "success_count": 3,
     "failure_count": 0
   }
   ```

### Device-User Relationship

Each registered device is associated with a `uid` (user identifier). This could be:
- A wallet address (for blockchain apps)
- A database user ID
- Any unique identifier you choose

This allows you to send notifications to all devices belonging to a user without needing to know Firebase device IDs.

## Token Refresh

When an access token expires, the app can refresh it:

```
POST /api/token/refresh/
{
  "refresh": "<your_refresh_token>"
}
```

This returns a new access token without requiring the user to re-register.

## Security Features

- **Nonce-based registration**: Prevents replay attacks during device registration
- **Platform attestation**: Verifies device integrity on both Android and iOS
- **JWT tokens**: Short-lived access tokens minimize damage from token compromise
- **API key authentication**: Server-side notifications require a valid API key
- **Automatic device cleanup**: Inactive FCM tokens are automatically removed