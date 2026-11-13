# Realtime Services

**Status:** partially implemented.

- `presence/index.js` owns the single app-wide presence channel, session synchronization, account switching and cleanup.
- `src/main.js` starts the service using the shared Supabase client.
- `tests/services/realtime-presence.test.js` covers duplicate prevention, account changes, sign-out and channel removal.
- Message and notification subscriptions remain in their current page owners and are planned for separate service modules.

A subscription must have one lifecycle owner, explicit filters and cleanup on route/session changes. Do not create duplicate presence channels.
