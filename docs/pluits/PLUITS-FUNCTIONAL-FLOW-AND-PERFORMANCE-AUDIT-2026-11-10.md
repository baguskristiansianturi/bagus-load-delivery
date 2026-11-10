# PLUITS — Functional Flow, Backend and Performance Audit
**Date:** 10 November 2026  
**Baseline commit:** a6933709ce9d69eec8759a7322b6b3f2d27c2882  
**Scope:** Social-first business-model alignment, media upload source/schema inspection, feed hydration performance, and read-only Supabase inspection.

## Business model and delivery order
The active Business Model Master defines Pluits as a social-first ecosystem connected to Local Marketplace, Trip/Travel, and GeoDirectory. Social First Release remains P0 until founder UAT acceptance. This increment hardens shared social feed/media infrastructure; it does not activate unapproved monetization or expand secondary verticals.

## Live backend findings
- Supabase project `ytndswhqxayqpftszwfh` is ACTIVE_HEALTHY on PostgreSQL 17.11 in ap-southeast-1.
- The private `pluits-user-media` bucket allows 50 MB files and includes MP4, QuickTime, WebM, 3GPP and 3GPP2 MIME types. Existing migrations include Android 3GPP2 support and post/gallery media read policies.
- Health Advisor reports zero lints.
- Security Advisor reports two anon-callable SECURITY DEFINER RPCs (`review_professional_profile`, `submit_professional_profile`), 22 authenticated-callable SECURITY DEFINER findings, and leaked-password protection disabled. The two anon-callable functions check auth claims internally, but their EXECUTE grants should still be narrowed after ACL review and a migration/rollback plan.
- Performance Advisor reports 84 unused-index INFO notices (not a deletion list), two RLS init-plan warnings and two multiple-permissive-policy warnings. No indexes or policies were changed.
- No production rows, Auth settings, RLS policies, Storage objects, or migrations were changed in this audit.

## Media upload flow inspected
- Post composer accepts up to 15 mixed image/video files; Reel composer accepts one video. Limit is 50 MB per file.
- MIME detection recognizes MP4, MOV, WebM, 3GP, 3GPP, 3G2 and 3GP2, including generic Android picker MIME when a known extension exists.
- Uploads are sequential to avoid loading multiple large media files into memory/network pressure. Files over 6 MB use resumable TUS when available.
- Reel duration is read from browser video metadata and must be <=60 seconds. Ordinary video posts may retain a null duration if the browser cannot read metadata.
- Storage ownership is scoped to the authenticated user's UUID folder.
- Actual Android gallery upload, video playback and two-account Storage isolation remain NOT TESTED. Source/schema inspection alone does not prove the user's reported issue is fixed.

## Implemented in this increment
- Batch short-lived Storage signed URLs for post media and profile avatars, deduplicate paths and cap batches at 100 objects.
- Fall back to individual signed URL requests only if the batch API fails.
- Pre-index media, tags, likes and comments by post ID instead of repeatedly scanning all returned rows for every post.
- Propagate Supabase query errors rather than silently rendering incomplete/incorrect engagement counts.
- Add Node tests for Android MIME/extension handling, file size validation, signed URL batching, deduplication, bounded chunks, fallback and empty input.
- No UI layout or CSS changes.

## Remaining backend/security work
1. Review and narrow EXECUTE grants for the two anon-callable professional-profile RPCs; audit every SECURITY DEFINER function for owner, fixed search_path, authorization, input validation and grants.
2. Complete SOC-01–SOC-04 and GDT-01 RLS candidate tests in a disposable/staging environment with anonymous, owner, accepted-follower, unrelated-user, blocked-pair and cross-entity scenarios.
3. Verify Android upload, signed URL access, gallery playback and cleanup on failed Post/Story creation using two controlled accounts.
4. Consider aggregate engagement RPC only if measured feed payloads justify it; do not add privileged endpoints pre-emptively.
5. Keep Marketplace local fulfillment, Trip booking, GeoDirectory trust and finance/attribution separate; do not imply those capabilities are fully implemented.

## Performance notes
- Feed hydration previously generated signed URLs per media/avatar object. It now uses bounded batch requests, reducing Storage request fan-out as the feed grows.
- Engagement rows for visible posts are still fetched to calculate counts. An aggregate RPC remains a measured follow-up, not an untested privileged endpoint.
- No browser/device/Lighthouse timing claims are made. Performance measurement still requires realistic runtime and Android UAT.

## Additional backend security fix — applied and verified
- Live migration `20261110123935_revoke_anon_professional_profile_rpcs` was applied to Supabase project `ytndswhqxayqpftszwfh`.
- Revoked `EXECUTE` from `PUBLIC` and `anon` for `public.review_professional_profile(uuid,text,text)` and `public.submit_professional_profile(uuid)`; explicitly retained `EXECUTE` for `authenticated`.
- Before migration, anonymous execution was enabled for both functions. After migration, catalog verification returned `anon=false` and `authenticated=true` for both functions.
- Security Advisor no longer reports anon-callable SECURITY DEFINER RPCs. It still reports 22 authenticated-callable SECURITY DEFINER functions and leaked-password protection disabled; these require function-by-function review and Auth configuration review, not blanket revocation.
- Health Advisor remains at zero lints.
- Rollback is intentionally not automatic. If a legitimate anonymous use case is discovered, review that use case first and grant only the required function to the narrowest role.

## Release evidence
- Frontend commit: `1838f0b2ad8086c4ceeddb3bd1c0888abf9bdccb`.
- GitHub Actions run: `42817405183` — build, `npm test` (7 passed, 0 failed), production build, artifact upload, and GitHub Pages deployment all succeeded.
- Live URL: `https://baguskristiansianturi.github.io/pluits/?v=1838f0b`.
- Android gallery upload/playback, two-account end-to-end UAT, and visual UI review remain NOT TESTED / founder-owned.


## Final route-loading and production-data audit — 10 November 2026
**Current deployed code:** `ea983f83fb6ae17147c6048ffbc6f3886350bd81`  
**GitHub Actions:** [Run 42818616779](https://github.com/baguskristiansianturi/pluits/actions/runs/42818616779) — SUCCESS

### Route-level code splitting
- Router page modules are now loaded on demand. The signed-in account workspace is also deferred; a public visitor does not download the account bundle until an authenticated account route is needed.
- A navigation sequence guard prevents a late route import from overwriting a newer page after rapid navigation.
- The latest production build emits separate chunks for account, discovery, help, messages, seller, Trip, Marketplace, moderation and other route modules.
- Initial JS entry: **49.18 kB (14.97 kB gzip)**. Account JS chunk: **130.12 kB (37.16 kB gzip)**, loaded only when the account workspace is requested. Account CSS is also emitted as a separate lazy chunk: **112.80 kB (19.54 kB gzip)**. Initial CSS: **273.53 kB (46.59 kB gzip)**.
- Previous pre-splitting app JS was one 304.81 kB (85.77 kB gzip) bundle. The 49.18 kB figure is the new initial entry chunk, not the sum of all route chunks.
- This is measured build output and request-scope reduction, not a physical-device latency benchmark.

### Production data readiness snapshot (counts only; no personal data retrieved)
- 2 Auth users; 5 posts; 4 gallery media rows; 0 video media rows; 0 stories; 0 follow relationships; 0 conversations; 0 messages; 0 notifications.
- 1 store and 1 product; 0 marketplace orders; 4 GeoDirectory entities; 0 Trip service requests.
- 4 post media paths resolve to Storage objects; 0 gallery records point to missing objects. There are 7 objects in `pluits-user-media`; one object is not referenced by the currently checked post/story/profile tables. It is a possible orphan, not automatically deleted; other legacy references and ownership must be checked first.
- Since there are currently no video objects or real follow/message relationships in production, the Android video upload, two-account social graph, and DM journeys cannot be honestly marked end-to-end tested from production data.

### Live security and health status after migration
- The two anonymous professional-profile RPC grants remain revoked; catalog verification shows anon=false and authenticated=true for both.
- Security Advisor no longer reports anon-callable SECURITY DEFINER functions. It reports 22 authenticated-callable SECURITY DEFINER functions plus leaked-password protection disabled. Source review shows these functions are owned by postgres and have a fixed search_path; all user-facing functions except the auth-user trigger function reference `auth.uid()`. They still need role/ownership/negative tests; do not blanket-revoke legitimate business RPCs.
- Health Advisor: zero lints.
- The SOC-01–SOC-04 social privacy and GDT-01 GeoDirectory RLS remediation candidate remains un-applied. No staging branch exists. Creating a Supabase development branch requires cost confirmation; production policies were not changed to bypass that gate.

### Functional verification scope
- `npm test`: **8 passed, 0 failed** (production-surface contracts, Android media MIME/size handling, signed URL batching and route lazy-loading contracts).
- Vite production build, output verification, artifact upload and GitHub Pages deployment: SUCCESS.
- Automated source/contract tests are not equivalent to Android gallery testing, authenticated two-account UAT, or the full RLS matrix.
