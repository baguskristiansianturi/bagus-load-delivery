# Supabase Edge Functions

**Status:** no Edge Functions are currently deployed.

Use this directory only for trusted server-side operations that require secrets, webhooks, scheduled work, trusted outbound integrations or long-running server execution. Ordinary CRUD and authorization belong in PostgreSQL/RLS/RPC, not an Edge Function created without a need.

Every function must document caller, authentication, authorization, input/output, secret names (never values), idempotency, failure behavior, logging, tests and deployment environment.
