# Inbox

**Status:** Partially implemented; conversation sidebar is extracted; data/state remain in Messages page.

**Current runtime owner:** `src/pages/messages/` and `src/features/inbox/`.

**Target responsibility:** Conversation list, active chat, composer, contacts, requests and inbox-specific navigation.

**Implementation boundary:** Global social navigation stays in components/social; backend enforces membership and block rules.

This README records the planned module boundary only. It does not imply runtime implementation or a new route. Keep current working behavior in its existing owner until extraction has consumer mapping, regression tests and review.
