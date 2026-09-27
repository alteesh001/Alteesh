---
name: Local clinic authentication
description: Scope and limitation of the current doctor and manager login flow.
---

The clinic currently uses device-scoped local authentication: manager and doctor password hashes are stored in the browser's local storage, and the active session is local to that browser.

**Why:** The existing clinic was intentionally offline-first and stored appointments, patients, and team data locally. Doctor-specific passwords were added without introducing a backend or breaking that operating model.

**How to apply:** Treat this as suitable for a single trusted device or prototype. For a real multi-device clinic, move users, sessions, permissions, and clinic data to the API/database before relying on it for shared production access.