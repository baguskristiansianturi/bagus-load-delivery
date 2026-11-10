# PLUITS Frontend, Backend and VPS Boundaries

Status: Active technical boundary guide.  
Scope: Code ownership, API communication, Supabase, deployment and future VPS operation.

## 1. Frontend responsibility

Frontend owns:
- route and page rendering;
- layouts, sections, components and design tokens;
- local UI state and user interaction;
- client-side input hints and presentation validation;
- calling backend/API contracts;
- presenting loading, empty, success and error states.

Frontend does not own security decisions. Hiding a button or route is not authorization.

## 2. Backend responsibility

Backend owns:
- authentication verification and authorization;
- authoritative validation;
- business rules and state transitions;
- database writes and protected reads;
- secure file/storage operations;
- notifications, scheduled jobs and trusted integrations;
- audit trails and server-side rate limits.

For Supabase, the backend boundary can be implemented through Postgres constraints/RLS, SQL functions/RPC, Storage policies and Edge Functions. These are backend responsibilities even when the frontend SDK invokes them.

## 3. Data flow

Example message flow:

1. User types in Inbox UI.
2. Feature module sends a request using the agreed API/service method.
3. Authentication context identifies the user.
4. Backend checks membership, block status and permissions.
5. Backend validates and persists the message.
6. Backend returns a defined response or realtime event.
7. Feature updates its state and renders the new message.

Do not put privileged service-role credentials in browser code. Keep public client configuration separate from private secrets.

## 4. API contract template

For each endpoint/RPC document:

| Field | Required description |
|---|---|
| Name | Stable operation name |
| Owner | Backend module |
| Consumer | Frontend page/feature |
| Method / RPC | HTTP method and endpoint or RPC name |
| Authentication | Required identity/session |
| Authorization | Which actor may perform it |
| Request | Fields, types, constraints |
| Response | Fields, types and nullability |
| Errors | Stable error codes and meaning |
| Data owner | Tables/views/storage touched |
| Side effects | Realtime, notification, audit or job |
| Tests | Allowed and denied cases |

Use OpenAPI for HTTP APIs when appropriate. For Supabase RPC/database contracts, document function signature, grants, RLS assumptions and migration reference.

## 5. Current PLUITS backend footprint

The repository currently contains:
- `supabase/migrations/` — ordered SQL schema/policy/function changes;
- `src/lib/supabase/client.js` — shared Supabase client module;
- Supabase usage in some page modules that still needs incremental service extraction;
- `src/services/storage/` — storage-related service code;
- `src/features/media/` — media validation/upload feature logic.

This is not yet a fully separated standalone backend server. Current PLUITS is a Vite frontend integrated with Supabase services. Do not describe it as a separate Node/Go backend unless one is actually introduced and deployed.

## 6. VPS target topology (future, not currently deployed)

A possible future topology, subject to actual VPS/provider selection:

- Nginx/Caddy: HTTPS termination and reverse proxy.
- Frontend: static Vite build output served by web server.
- Backend API/worker: separate process/container only if/when PLUITS introduces a custom server.
- Supabase: may remain managed externally, or be separately evaluated for self-hosting. Do not assume moving frontend to a VPS means the database must move too.
- Storage: managed object storage or a documented self-hosted alternative.
- Operations: environment secrets, backups, migrations, logs, health checks, monitoring, TLS renewal and rollback.

## 7. Source of truth and deployment

Git repository is the source of truth. Production VPS should receive a known commit/build artifact through a repeatable deployment process. Avoid editing live files over SSH without committing the corresponding source change.

Required release record:
- source commit SHA;
- build/test result;
- artifact/release identifier;
- migration status (if applicable);
- deployment timestamp/environment;
- health check;
- rollback target;
- outstanding physical-device QA.

## 8. Environment configuration

Use separate development/staging/production configuration. Never commit private keys, passwords, service-role secrets or production credentials. Validate required environment variables at startup/build. Keep a safe example file containing names/placeholders only.

## 9. VPS readiness checklist

- [ ] Hosting/provider and OS selected.
- [ ] DNS and TLS plan.
- [ ] Frontend build/deploy procedure.
- [ ] Backend process plan (only if custom backend exists).
- [ ] Database hosting and backup plan.
- [ ] Storage/media hosting and backup plan.
- [ ] Environment secret management.
- [ ] Migration and rollback procedure.
- [ ] Logs, monitoring and alerting.
- [ ] Restore drill and documented access control.

This checklist is preparation, not a claim that a VPS has been purchased or configured.
