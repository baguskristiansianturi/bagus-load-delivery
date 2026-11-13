# Presence Service

**Status:** implemented and unit-tested.

Owns the single app-wide Supabase Realtime presence channel, account switching, initial session synchronization and channel cleanup.

- Runtime: `index.js`.
- Consumer: `src/main.js`.
- Client: injected shared instance from `src/lib/supabase/client.js`.
- Channel: `pluits-online-v1`.
- Tests: `tests/services/realtime-presence.test.js`.

This service owns presence lifecycle only. Inbox message subscriptions and notification subscriptions remain separate services and must not reuse this channel.
