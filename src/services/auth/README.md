# Authentication Services

**Status:** target service boundary; current runtime behavior remains in the application and page controllers.

Owns reusable auth/session operations and account identity lookup. UI forms and route presentation stay in `src/pages/` and `src/features/auth/`. Supabase Auth remains configured through `src/lib/supabase/client.js`.

Extract one operation at a time and preserve redirect, email-confirmation, session-refresh and protected-route behavior with tests.
