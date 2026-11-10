# PLUITS — Infrastructure, Free Product & Scaling Plan

**Tanggal:** 10 November 2026  
**Status:** DECIDED principles / COST MODEL estimates / IMPLEMENTATION staged  
**Scope:** Social-first release and gradual growth toward 100,000 users. This document does not authorize a paid-plan purchase, production schema change, or migration to another provider.

## 1. Product principle: Free must be a complete product

The current Pluits account is the foundation of the future Free experience. Free is not a crippled trial and must remain useful without a payment method.

Free users should be able to:
- Create and maintain a personal profile, choose public/private visibility, and manage privacy.
- Publish ordinary posts with supported photos/videos, edit and delete their own posts, and manage drafts.
- Browse the public feed and profiles, follow people, and interact through likes/comments/saves where permissions allow.
- Use Stories/Reels and basic messaging/notifications as each feature reaches reliable UAT.
- Discover places and public community content without being forced into a purchase flow.

Do not put core safety, account security, privacy, basic posting, or access to one's own content behind a paid tier. Do not invent artificial limits to force upgrades. Any future fair-use limits must be transparent, measurable, and designed to protect service reliability (for example, upload rate/abuse controls), not to make ordinary use frustrating.

Premium/Business is a future revenue layer, not a prerequisite for a healthy social experience. Candidate value can include professional/business tools, team roles, deeper analytics, advanced storefront/provider workflows, promotion tools with clear sponsored labels, larger operational quotas, and workflow automation. These are hypotheses only; pricing and exact entitlements require founder approval and separate product research. Verification is not a paid badge.

## 2. Architecture direction

Keep the current mobile-first JavaScript ES modules + Vite frontend and Supabase/Postgres backend. Do not rewrite into another framework for scale alone.

| Layer | Primary responsibility | Upgrade/migration trigger |
|---|---|---|
| Vite static frontend / GitHub Pages | App shell, routes, responsive UI and static assets | Keep while static delivery and CI are reliable; move only for concrete needs such as server rendering, custom domain or deployment control |
| Supabase Auth | Identity, sessions and account lifecycle | Pro before production launch; add auth capacity only when measured MAU or email delivery needs it |
| Supabase Postgres | Profiles, posts metadata, relationships, comments, permissions and business records | Upgrade compute only from sustained CPU/RAM/latency/connection evidence |
| Supabase Storage | Existing private user/store media buckets | Keep existing data stable; use an external object store for new high-volume media only after access/signing/cleanup design and migration tests |
| Cloudflare R2 (candidate) | Cost-efficient image/file/audio object storage | Add when storage or egress cost/limits become material; preserve Supabase metadata and authorization |
| Cloudflare Stream (candidate) | Video ingest, encoding, playback and delivery for Reels | Add when real video volume, playback reliability or delivery cost justifies managed video |
| Supabase Realtime | Inbox/activity updates and presence only where privacy-safe | Optimize subscriptions and message fanout before buying more connections/messages |
| FCM / email provider | Push and transactional email | Add only with clear notification consent, deliverability and operational needs |
| Sentry / logs / k6 | Errors, latency, load tests and release observability | Introduce before growth campaigns and before the app becomes operationally critical |

### Media handling rules
1. Keep profile/post/story metadata and ownership in Postgres.
2. Preserve private bucket access and signed-URL behavior until an equivalent external authorization design exists.
3. Never expose service-role credentials in the browser.
4. For R2, use short-lived signed URLs or a controlled Worker/API; never make private user media public merely to reduce cost.
5. For Stream, use upload authorization, webhook verification, ownership mapping, moderation status and deletion lifecycle. Disable unnecessary autoplay/preload to control delivery minutes.
6. Do not bulk-migrate existing media until counts, checksums, visibility, rollback and orphan cleanup are verified.

## 3. Supabase plans and current reference prices

Prices below are vendor list prices checked 10 November 2026; USD-to-IDR examples use an approximate Rp18,100/USD planning rate. Taxes, card conversion, usage patterns, region and future price changes can alter totals.

### Plan levels

| Option | Approximate base price | What it is for | When to use |
|---|---:|---|---|
| Free | $0 | Development, internal testing, small early experiments; limited project resources and no production-grade backup guarantees | Keep for non-critical development only |
| Pro | $25/month | Production baseline, 100k MAU included, daily backups and higher quotas | Recommended before a public production launch with real users |
| Team | $599/month | Organization-level collaboration, compliance and operational controls | Only when the organization genuinely needs these controls |
| Micro compute | about $10/month | 1 GB RAM, shared CPU | Lowest paid compute tier; Pro credit may cover the primary Micro compute |
| Small compute | about $15/month | 2 GB RAM, shared CPU | First measured step up from Micro |
| Medium compute | about $60/month | 4 GB RAM, shared CPU | Sustained resource pressure after query/index/connection optimization |
| Large compute | about $111/month | 2 dedicated vCPU, 8 GB RAM | Higher sustained workload and predictable compute need |

Compute is separate from the plan. Pro includes a $10 monthly compute credit for the primary project. Indicative Pro + compute totals for one project are about $25 with Micro, $30 with Small, $75 with Medium and $126 with Large. Verify the dashboard quote before purchase.

### Included Pro usage and overage references

- 100,000 MAU included; additional MAU about $0.00325 each.
- 8 GB database disk included; extra about $0.125/GB.
- 250 GB egress included; extra uncached about $0.09/GB and cached about $0.03/GB.
- 100 GB object storage included; extra about $0.021/GB.
- 2 million Edge Function invocations included; extra about $2/million.
- 5 million Realtime messages included; extra about $2.50/million.
- 500 peak Realtime connections included; extra about $10 per additional 1,000 peak connections.

Quotas may be shared across projects in the organization. A project add-on is not the same as upgrading the entire plan.

### Optional resilience and read scaling

- Point-in-Time Recovery (PITR): indicative $100/month for 7 days, $200 for 14 days, $400 for 28 days. Pro daily backups are the starting point; add PITR only when recovery-point requirements justify it.
- Read replicas: additional compute/disk/IOPS costs. Add only when read load is demonstrably dominant and query optimization is insufficient.
- Connection pooling: use the Supabase pooler for short-lived/serverless connections; do not solve connection spikes by indiscriminately increasing compute.
- Upgrade compute during a planned low-traffic window. Supabase notes upgrades can cause brief downtime.

## 4. Media service cost model

### R2 object storage

Reference price: about $0.015/GB-month, Class A operations $4.50/million, Class B $0.36/million; direct egress is free. A free tier includes 10 GB-month storage, 1 million Class A and 10 million Class B operations.

Planning examples after the free tier, approximate:
- 100 GB stored: about $1.35/month.
- 500 GB: about $7.35/month.
- 1 TB: about $15/month.
- 5 TB: about $75/month.

R2 is suitable for photos, attachments, documents and audio files. Request volume and operations also matter; storage size alone is not the full bill.

### Cloudflare Stream video

Reference price:
- Stored video: $5 per 1,000 minutes stored per month.
- Delivered video: $1 per 1,000 minutes watched/delivered.
- Ingest and encoding are included; no separate bandwidth charge.

Illustrations:
- 10,000 stored minutes: about $50/month.
- 100,000 stored minutes: about $500/month.
- 600,000 delivered minutes: about $600/month.
- 1,000,000 delivered minutes: about $1,000/month.

Example: 20,000 monthly viewers watching an average 30 minutes each means roughly 600,000 delivered minutes and around $600/month. This is why video playback minutes—not only registered accounts—must be measured. Preloading and autoplay can increase delivery usage.

## 5. Staged budget scenarios

These are planning envelopes, not provider quotations or a forecast. They include a mix of database, media, monitoring and operational headroom; actual use can be much lower or higher depending on video watch time, upload size, cache hit ratio, database workload and email/push volume.

| Stage | What it means | Planning envelope |
|---|---|---:|
| Private test / early Free validation | Small cohort, limited media, no growth campaign | Rp0–500 ribu/month |
| First production launch | Pro + modest compute/monitoring and low media usage | Rp500 ribu–1.5 juta/month |
| 10k registered accounts | Gradual growth, modest active usage; measure MAU and media | Rp1.5–5 juta/month |
| 50k registered accounts | Higher activity and media; tune delivery and storage | Rp4–15 juta/month |
| 100k registered accounts | Production scale with measured media architecture and operational support | Rp8–30 juta+/month |

Registered accounts are not MAU, and neither is concurrent users. These bands are only planning ranges. A video-heavy product can exceed them even with fewer accounts; a text/photo-light service can cost much less.

### Illustrative 100k MAU / video scenario

Assumptions: 20,000 monthly video viewers × 30 minutes = 600,000 delivered minutes; 10,000 video minutes stored; 1 TB of R2 files; Pro + Small compute. Approximate monthly components:
- Supabase Pro + Small: $30 (~Rp543k).
- R2 1 TB: $15 (~Rp272k).
- Stream storage 10k minutes: $50 (~Rp905k).
- Stream delivery 600k minutes: $600 (~Rp10.86m).
- Subtotal: around Rp12.6m/month.

This excludes Realtime overages, additional database disk, email, push, monitoring, taxes and support. It demonstrates that video delivery can dominate cost.

## 6. Operational thresholds for PLUITS

These are proposed alert thresholds, not vendor hard limits. Trigger investigation and capacity review when sustained for 10–15 minutes or repeatedly across peak periods:

| Signal | Warning threshold | First response |
|---|---:|---|
| Database CPU | >70% sustained | Find slow queries and missing/ineffective indexes; inspect workload before compute upgrade |
| Database memory | >75% sustained | Inspect query plans, connection count, large sorts and extensions |
| API P95 latency | >500 ms | Break down frontend/network/database; inspect slow RPCs and query plans |
| API error rate | >1% | Group by endpoint/error; stop retries that amplify load |
| Peak Realtime connections | 70–80% of quota | Review channel lifecycle, duplicate subscriptions and connection pooling |
| Realtime messages | 70–80% of included quota | Reduce fanout, unnecessary events and polling |
| Storage / egress | 70–80% of quota | Identify large files, caching, derivatives and retention policy |
| Upload failures | >2% of attempts | Inspect MIME, signed upload, network/TUS and Storage logs |

Never automatically upgrade based on account count alone. Optimize first: query plans, indexes based on real workload, pagination, image derivatives, caching, subscription cleanup and upload retry/idempotency.

## 7. Release and growth gates

### Before public production launch
- Confirm backup and restore procedure; test restore.
- Review all SECURITY DEFINER functions, grants, search_path and ownership checks.
- Resolve high-severity RLS findings in a tested migration with rollback.
- Enable leaked-password protection after checking Auth UX and configuration.
- Add error monitoring and privacy-safe logs.
- Test Android upload, multi-photo post, video playback, retry, private-media isolation and two-account interactions.
- Load-test realistic feed/profile/inbox paths; do not test production with uncontrolled traffic.

### Before 10k accounts
- Measure MAU, DAU, peak concurrent sessions, uploads, storage GB, egress GB, video minutes stored/delivered, Realtime messages/connections, API P50/P95/P99, errors and database CPU/RAM.
- Add media lifecycle cleanup and thumbnail strategy.
- Validate backup restoration and incident contact path.
- Run k6 load tests on a representative environment.

### Before 50k–100k accounts
- Separate video delivery from general object storage if usage supports it.
- Introduce background jobs for thumbnails, media checks and cleanup.
- Evaluate read replicas only with read-heavy evidence.
- Establish operational dashboards, alerting, abuse/rate limits and support procedures.
- Review costs monthly by feature and cohort; avoid unlimited autoplay/preload.

## 8. Immediate action list

1. Keep current Free infrastructure while the product is being validated; do not upgrade merely because 100k is a future target.
2. Decide Pro production start date after core social UAT and security gate; no purchase is made by this document.
3. Preserve current Supabase media bucket and all existing user data.
4. Prepare R2/Stream integration behind a staged adapter only when usage/cost metrics justify it.
5. Implement measurement first; no production data migration in this phase.
6. Keep Free experience complete and define Premium/Business entitlements only after usage research and founder approval.

## 9. Official price references

Checked 10 November 2026:
- Supabase plans and quotas: https://supabase.com/pricing
- Supabase billing and usage: https://supabase.com/docs/guides/platform/billing-on-supabase
- Supabase compute pricing: https://supabase.com/docs/guides/platform/compute-and-disk
- Supabase Realtime pricing: https://supabase.com/docs/guides/realtime/pricing
- Supabase backups/PITR: https://supabase.com/docs/guides/platform/backups
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare Stream pricing: https://developers.cloudflare.com/stream/pricing/
- Supabase connection pooling: https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
