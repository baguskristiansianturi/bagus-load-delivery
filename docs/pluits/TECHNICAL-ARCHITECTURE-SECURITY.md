# PLUITS — TECHNICAL ARCHITECTURE & SECURITY CHECKLIST
Version: 1.0 | 2026-11-08

## Architecture direction
Use a modular monolith/domain-oriented architecture initially unless measured scale or team boundaries justify services. Shared identity and authorization; isolated domain modules and clear interfaces. Avoid premature microservices.

## Logical domains
- Core identity and account settings
- Social graph and content
- Media processing and delivery
- Discovery and search
- Communities
- Messaging
- Business and marketplace
- Travel and bookings
- Trust, safety and moderation
- Notifications and audit

## Supabase implementation guidance
1. Treat the browser as untrusted. RLS and server-side validation are authoritative.
2. Enable RLS for every table exposed through the API.
3. Use least-privilege grants and policies; do not use broad authenticated=true policies for sensitive rows.
4. Keep service-role keys and provider secrets exclusively server-side.
5. Use private storage buckets for non-public media; authorize access based on the associated content's audience.
6. Use Edge Functions or trusted backend for privileged state transitions (verification, payment, refund, moderation, booking).
7. Validate ownership and membership on every mutation.
8. Rate-limit expensive or abuse-prone operations.
9. Keep audit events append-only where feasible and restrict access.
10. Test policy behavior with separate accounts and anonymous sessions.

## Media pipeline
Original upload -> server-side validation -> metadata extraction -> safe derivative generation -> storage -> authorized delivery.
Preserve original aspect ratio and orientation. Derivatives may resize/compress for device/network but must not silently crop. Remove GPS EXIF unless the user explicitly chooses to share location. Define limits and supported formats in product UI.

## Security test matrix
| Actor | Own private content | Other private content | Public content | Admin controls |
|---|---|---|---|---|
| Anonymous | Deny | Deny | Read only if public | Deny |
| Member | Allowed by policy | Deny | Read | Deny |
| Blocked member | Deny according to block rules | Deny | Limited per block rules | Deny |
| Business staff | Only assigned business data | Deny | Public read | Deny |
| Moderator | Only assigned moderation scope | No blanket access | Read for moderation | Scoped |
| Administrator | Audited, least privilege | Audited | Read | Explicit and audited |

## High-risk areas to inspect in existing implementation
- Public storage buckets containing private media
- Client-side-only checks for owner/admin
- Exposed service-role keys or secrets in frontend/history
- RLS disabled or permissive policies
- User-controlled order/payment/verification status
- Unvalidated upload MIME/size and SVG/script payloads
- Predictable object paths and permanent public URLs
- Search or notification leaks across blocked/private accounts
- Location data included in public metadata/EXIF
- Missing rate limits and audit trails

## Operational requirements
- Separate development/staging/production credentials.
- Backups and tested restore process.
- Dependency and vulnerability review.
- Structured logs without secrets/private message bodies.
- Error monitoring and alerting.
- Documented incident response and account recovery.
- Schema migrations are reviewed, reversible where possible, and tested against a backup.
