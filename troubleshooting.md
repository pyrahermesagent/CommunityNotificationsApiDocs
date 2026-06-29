# Troubleshooting

Common issues and their solutions when setting up or running the CommunityNotificationsAPI.

## Authentication Errors

### "Nonce is not valid"

**Cause:** The nonce has expired (2 minutes) or was already consumed.

**Solution:**
1. Request a fresh nonce: `POST /api/nonce/`
2. Use the nonce immediately in your registration request
3. Ensure your app clock is synchronized with the server

```bash
# Get a fresh nonce
curl -X POST https://your-server.com/api/nonce/

# Use it immediately
curl -X POST https://your-server.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "nonce": "fresh-nonce-here",
    "device_id": "...",
    "platform": "android",
    "attestation": "...",
    "assertion": ""
  }'
```

### "Invalid API Key"

**Cause:** The API key provided doesn't exist or has been revoked.

**Solution:**
1. Check the Django admin panel for existing API keys
2. Create a new API key: `/admin/` → ApiApp → API Keys → Add
3. Verify you're using the correct key format in the `X-API-Key` header

## Database Issues

### "Connection refused"

**Cause:** PostgreSQL is not running or connection details are incorrect.

**Solution:**
1. Verify your PostgreSQL server is running
2. Check your `.env` file connection string
3. Test the connection:
   ```bash
   psql "postgresql://user:password@host:5432/dbname"
   ```

### "Relation does not exist"

**Cause:** Database migrations haven't been run.

**Solution:**
```bash
python manage.py migrate
```

## Firebase Issues

### "Firebase credentials not found"

**Cause:** The `FIREBASE_CREDENTIALS_JSON` environment variable is not set or malformed.

**Solution:**
1. Verify the JSON is valid:
   ```bash
   echo "$FIREBASE_CREDENTIALS_JSON" | python3 -m json.tool
   ```
2. Check for escape characters in the JSON string
3. Ensure the service account has proper permissions in Firebase Console

### "FCM token registration failed"

**Cause:** The Firebase service account lacks proper permissions.

**Solution:**
1. Verify the service account has "Firebase Admin SDK" privileges
2. Check that your Firebase project has Cloud Messaging enabled
3. Verify the project ID in credentials matches your Firebase project

## Attestation Issues

### "Attestation verification failed" (Android)

**Possible causes:**
- Wrong APK package name in `APK_NAME` setting
- Decryption/verification keys are incorrect or outdated
- App is not signed with the expected key

**Solution:**
1. Verify `APK_NAME` matches your app's package name exactly
2. Check that the signing key hex matches your app's release signing key
3. Regenerate integrity API keys if they've been rotated
4. Test with a debug build in DEBUG mode first

### "Attestation verification failed" (iOS)

**Possible causes:**
- Wrong App ID in `APP_ATTEST_APP_ID`
- App Attest capability not enabled
- Invalid certificate chain

**Solution:**
1. Verify the App ID matches your entitlements
2. Enable App Attest in Apple Developer portal
3. Check that your provisioning profile includes App Attest
4. Ensure the device supports App Attest (iPhone XS and later)

## Deployment Issues

### "Connection refused" after deployment

**Cause:** Gunicorn or the application isn't listening on the expected port.

**Solution:**
1. Check if the process is running:
   ```bash
   ps aux | grep gunicorn
   ```
2. Verify the port binding:
   ```bash
   ss -tlnp | grep 8000
   ```
3. Check logs for errors:
   ```bash
   journalctl -u notifications-api -f
   ```

### Static files not loading

**Cause:** Static files haven't been collected.

**Solution:**
```bash
python manage.py collectstatic --noinput
```

## Performance Issues

### High latency on attestation requests

**Cause:** Network issues with Play Integrity or Apple servers.

**Solution:**
1. Check network connectivity to Google/Apple services
2. Add timeout configuration to your HTTP client
3. Consider caching nonces for a short period (with caution)

### Memory issues with many devices

**Cause:** Too many devices stored in memory or database queries are inefficient.

**Solution:**
1. Add proper indexing to the `uid` field in database
2. Use database partitioning for large datasets
3. Implement pagination for device listing
4. Consider adding a cache layer (Redis) for frequent lookups

## Logging and Debugging

### Enable debug logging

Add to your `.env`:
```env
DEBUG=1
```

### View logs

```bash
# Django logs
tail -f logs/django.log

# Gunicorn logs
journalctl -u notifications-api -f

# Docker logs
docker compose logs -f api
```

### Check database queries

Enable SQL logging in your Django settings:
```python
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
    },
}
```

## Common Error Responses

| Status Code | Message | Solution |
|-------------|---------|----------|
| 400 | "Nonce is not valid." | Request a new nonce and try again immediately |
| 400 | "Nonce does not exist." | The nonce was never created or has expired |
| 400 | "Attestation verification failed." | Check your attestation keys and device setup |
| 401 | Authentication credentials were not provided. | Include valid JWT or API key in request |
| 403 | Invalid API key. | Verify API key in Django admin |
| 404 | No registered devices found for this user. | Register the device first with valid attestation |
| 500 | Internal Server Error | Check server logs for details |