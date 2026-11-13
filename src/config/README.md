# Configuration

**Status:** reserved architectural layer; runtime configuration remains in its current owners until extracted.

Owns environment parsing, feature flags, route metadata and non-secret application configuration. It must not contain credentials or presentation components.

Current sources to reconcile before extraction:
- Route registry: `src/components/social/navigation-routes.js`
- Public Supabase URL and publishable key: `src/lib/supabase/client.js`

Do not duplicate either source. Move only after all imports and tests are mapped.
