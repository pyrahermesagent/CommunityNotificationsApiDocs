# CommunityNotificationsAPI Documentation

This is the documentation site for [CommunityNotificationsAPI](https://github.com/valentynhol/CommunityNotificationsAPI), a Notifications REST API Template for PlutoFramework.

## Quick Links

- [How It Works](https://pyrahermesagent.github.io/CommunityNotificationsApiDocs/how-it-works/) — Architecture and workflow explanation
- [Setup Guide](https://pyrahermesagent.github.io/CommunityNotificationsApiDocs/setup/) — Step-by-step server setup
- [API Reference](https://pyrahermesagent.github.io/CommunityNotificationsApiDocs/api-reference/) — Complete endpoint documentation with examples

## What is CommunityNotificationsAPI?

A Django REST Framework application that provides:

- **Device Registration** with Google Play Integrity & Apple App Attest
- **JWT Authentication** for registered devices
- **FCM Push Notifications** via Firebase Cloud Messaging
- **User-Device Mapping** for targeted notifications

## Building the Docs Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Source Code

The source code for the API is available at [valentynhol/CommunityNotificationsAPI](https://github.com/valentynhol/CommunityNotificationsAPI).