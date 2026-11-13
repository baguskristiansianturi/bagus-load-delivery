# Offline Services

**Status:** target service boundary; offline behavior remains with its current feature/page owners.

Owns reusable local persistence, outbox retry and connectivity coordination. Current behavior includes the DM outbox/contact cache in `src/pages/messages/` and private Blog drafts in Blog Studio.

Keep per-user data isolated, make retries idempotent, define expiry/clear behavior, and never treat local drafts as published server records.
