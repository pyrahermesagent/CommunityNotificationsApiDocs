---
layout: home

hero:
  name: CommunityNotificationsAPI
  text: Documentation
  tagline: A Notifications REST API Template for PlutoFramework with Firebase Cloud Messaging and device attestation
  image:
    src: /logo-lines-rounded-white.svg
    alt: PlutoFramework Logo
    dark: /logo-lines-rounded-black.svg
  actions:
    - theme: brand
      text: Get Started
      link: /setup
    - theme: alt
      text: View on GitHub
      link: https://github.com/valentynhol/CommunityNotificationsAPI

features:
  - title: Firebase Cloud Messaging
    details: Built on top of fcm-django and firebase_admin for reliable push notifications
    icon: ☁️
  - title: JWT Authentication
    details: Secure device registration with short-lived access tokens and long-lived refresh tokens
    icon: 🔑
  - title: Device Attestation
    details: Google Play Integrity for Android and Apple App Attest for iOS to verify device integrity
    icon: 🛡️
  - title: REST API
    details: Simple REST API built with Django REST Framework, easy to integrate with any platform
    icon: 🔌
  - title: Multi-Platform
    details: Supports both Android and iOS devices with platform-specific attestation
    icon: 📱
  - title: Deploy Ready
    details: Production-ready with Gunicorn, Whitenoise, and automated GitHub Actions deployment
    icon: 🚀
---