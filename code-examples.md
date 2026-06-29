# Code Examples

This page provides practical code examples for integrating with the CommunityNotificationsAPI from various platforms.

## JavaScript (Browser/Frontend)

### Register a Device (Android)

```javascript
// Step 1: Get a nonce
const nonceResponse = await fetch('https://your-server.com/api/nonce/', {
  method: 'POST'
});
const { nonce } = await nonceResponse.json();

// Step 2: Request Play Integrity attestation token
const attestationToken = await requestPlayIntegrityToken(nonce);

// Step 3: Register the device
const registerResponse = await fetch('https://your-server.com/api/token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nonce: nonce,
    device_id: deviceId,  // e.g., from Firebase Installations API
    platform: 'android',
    attestation: attestationToken,
    assertion: ''
  })
});

const { access, refresh } = await registerResponse.json();
// Store tokens securely!
```

### Update FCM Token

```javascript
async function updateFCMToken(fcmToken, accessToken) {
  const response = await fetch('https://your-server.com/api/fcm/token-update/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ fcm_token: fcmToken })
  });

  return await response.json();
}
```

### Refresh Access Token

```javascript
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://your-server.com/api/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken })
  });

  return await response.json();
}
```

### Update User ID

```javascript
async function updateUserUid(uid, accessToken) {
  const response = await fetch('https://your-server.com/api/user/uid-update/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ user_id: uid })
  });

  return await response.json();
}
```

---

## Python (Backend/Server)

### Send a Notification

```python
import requests

API_URL = "https://your-server.com/api/fcm/send-notification/"
API_KEY = "your-api-key-here"

def send_notification(user_id: str, title: str, body: str):
    """Send a push notification to all devices for a user."""
    response = requests.post(
        API_URL,
        headers={"X-API-Key": API_KEY},
        json={
            "user_id": user_id,
            "title": title,
            "body": body
        }
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"Notification sent: {result['success_count']} succeeded, {result['failure_count']} failed")
        return result
    else:
        print(f"Failed: {response.json()}")
        return None

# Example usage
send_notification(
    user_id="wallet-0xabc123...",
    title="New Message",
    body="You have a new message from Alice!"
)
```

### Register Device (Python Client)

```python
import requests

def register_device(device_id: str, attestation_token: str, nonce: str):
    """Register a device and get JWT tokens."""
    response = requests.post(
        "https://your-server.com/api/token/",
        json={
            "nonce": nonce,
            "device_id": device_id,
            "platform": "android",
            "attestation": attestation_token,
            "assertion": ""
        }
    )
    
    if response.status_code == 200:
        return response.json()  # {access, refresh}
    else:
        raise Exception(f"Registration failed: {response.json()}")

# Usage
nonce_response = requests.post("https://your-server.com/api/nonce/")
nonce = nonce_response.json()["nonce"]
tokens = register_device("device-123", "attestation-token", nonce)
```

---

## Kotlin/Android (Native)

```kotlin
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class NotificationClient(
    private val baseUrl: String,
    private var accessToken: String? = null,
    private var refreshToken: String? = null
) {
    private val client = OkHttpClient()
    private val apiKey = "your-api-key-here"

    // Step 1: Request nonce
    suspend fun requestNonce(): String {
        val request = Request.Builder()
            .url("$baseUrl/api/nonce/")
            .post(RequestBody.create(null, "".toByteArray()))
            .build()
            
        return with(client.newCall(request).execute()) {
            val json = JSONObject(body!!.string())
            json.getString("nonce")
        }
    }

    // Step 2: Register device
    suspend fun registerDevice(
        deviceId: String,
        attestationToken: String,
        nonce: String
    ) {
        val json = JSONObject().apply {
            put("nonce", nonce)
            put("device_id", deviceId)
            put("platform", "android")
            put("attestation", attestationToken)
        }
        
        val request = Request.Builder()
            .url("$baseUrl/api/token/")
            .post(RequestBody.create(
                MediaType.parse("application/json"),
                json.toString()
            ))
            .build()
            
        with(client.newCall(request).execute()) {
            val result = JSONObject(body!!.string())
            accessToken = result.getString("access")
            refreshToken = result.getString("refresh")
        }
    }

    // Step 3: Update FCM token
    suspend fun updateFCMToken(fcmToken: String) {
        val json = JSONObject().apply {
            put("fcm_token", fcmToken)
        }
        
        val request = Request.Builder()
            .url("$baseUrl/api/fcm/token-update/")
            .post(RequestBody.create(
                MediaType.parse("application/json"),
                json.toString()
            ))
            .addHeader("Authorization", "Bearer $accessToken")
            .build()
            
        client.newCall(request).execute().body?.close()
    }

    // Step 4: Refresh token
    suspend fun refreshAccessToken() {
        val json = JSONObject().apply {
            put("refresh", refreshToken)
        }
        
        val request = Request.Builder()
            .url("$baseUrl/api/token/refresh/")
            .post(RequestBody.create(
                MediaType.parse("application/json"),
                json.toString()
            ))
            .build()
            
        with(client.newCall(request).execute()) {
            val result = JSONObject(body!!.string())
            accessToken = result.getString("access")
        }
    }
}
```

---

## Swift/iOS (Native)

```swift
import Foundation

class NotificationClient {
    private let baseURL: String
    private var accessToken: String?
    private var refreshToken: String?
    private let apiKey: String
    
    init(baseURL: String, apiKey: String) {
        self.baseURL = baseURL
        self.apiKey = apiKey
    }
    
    func requestNonce(completion: @escaping (Result<String, Error>) -> Void) {
        var request = URLRequest(url: URL(string: "\(baseURL)/api/nonce/")!)
        request.httpMethod = "POST"
        
        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let nonce = json["nonce"] as? String else {
                completion(.failure(NSError(domain: "Invalid response", code: -1)))
                return
            }
            
            completion(.success(nonce))
        }.resume()
    }
    
    func registerDevice(deviceId: String, attestation: String, nonce: String, completion: @escaping (Result<Void, Error>) -> Void) {
        let payload: [String: Any] = [
            "nonce": nonce,
            "device_id": deviceId,
            "platform": "ios",
            "attestation": attestation,
            "assertion": ""
        ]
        
        var request = URLRequest(url: URL(string: "\(baseURL)/api/token/")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: payload)
        
        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: String],
                  let access = json["access"],
                  let refresh = json["refresh"] else {
                return
            }
            
            self.accessToken = access
            self.refreshToken = refresh
            completion(.success(()))
        }.resume()
    }
}
```

---

## Testing with curl

### Get Nonce

```bash
curl -X POST https://your-server.com/api/nonce/
# Response: {"nonce": "random-string"}
```

### Register Device

```bash
curl -X POST https://your-server.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "nonce": "your-nonce",
    "device_id": "com.example.app:device123",
    "platform": "android",
    "attestation": "jwt-attestation-token",
    "assertion": ""
  }'
# Response: {"access": "eyJ...", "refresh": "eyJ..."}
```

### Send Notification (Server-side)

```bash
curl -X POST https://your-server.com/api/fcm/send-notification/ \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "user_id": "wallet-0xabc123",
    "title": "Breaking News",
    "body": "Something important happened!"
  }'
# Response: {"message": "Notification process completed.", "success_count": 2, "failure_count": 0}
```

---

## Complete Registration Flow

Here's the complete flow in pseudocode:

```
1. App starts → Request nonce from server
2. App receives nonce (expires in 2 minutes)
3. App requests platform-specific attestation:
   - Android: Google Play Integrity API
   - iOS: Apple App Attest (first time) or assertion
4. App sends nonce + attestation + device_id to server
5. Server verifies attestation:
   - Android: Verifies Play Integrity token
   - iOS: Verifies App Attest certificate and extracts public key
6. Server creates/updates device record
7. Server returns JWT access + refresh tokens
8. App stores tokens securely:
   - Android: EncryptedSharedPreferences / Keystore
   - iOS: Keychain
9. On subsequent app starts:
   a. Use existing JWT to update FCM token
   b. Use existing JWT to update user ID
   c. Request new nonce + attestation for fresh registration
   d. Server recognizes existing device and skips full attestation
```