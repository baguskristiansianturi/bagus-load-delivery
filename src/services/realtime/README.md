# Realtime Services

**Status:** target service boundary; lifecycle is not yet extracted.

Owns subscriptions, presence channels, reconnection and cleanup for app-wide realtime behavior. Current runtime owners include `src/main.js`, `src/pages/messages/` and Account notification behavior.

A subscription must have one lifecycle owner, explicit filters, cleanup on route/session changes and tests for reconnect/unsubscribe. Do not create duplicate presence channels.
