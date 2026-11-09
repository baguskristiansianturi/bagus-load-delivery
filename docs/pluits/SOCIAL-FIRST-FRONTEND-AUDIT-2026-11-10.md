# PLUITS — Social First Frontend & Live Backend Audit
**Tanggal:** 10 November 2026  
**Repository:** baguskristiansianturi/pluits · branch main  
**Commit frontend:** f28b44ff576d8699d8d873f11ae1d634facc13c9  
**Deployment:** GitHub Actions run 42669706122 · SUCCESS  
**Status:** Frontend increment DEPLOYED; mobile UAT NOT TESTED; backend trust/safety NOT IMPLEMENTED.

## 1. Scope and method
Read-only source inspection, repository documentation review, GitHub Actions evidence, and read-only Supabase inspection. No production rows, Auth settings, RLS policies, Storage objects, migrations, or Edge Functions were changed.

## 2. Frontend findings and changes
### Implemented in this increment
- Profile Hero now defaults to a clean identity-led presentation without a mandatory cover background.
- A Drafts menu/route is available only inside the signed-in owner profile.
- Draft caption and selected media blobs are stored in browser IndexedDB, partitioned by the signed-in user id in application access.
- Drafts can be listed, resumed, deleted, and removed after successful publication.
- Help Center now explains local-only draft storage and its limitations.

### Important limitations
- Drafts are stored only on the current browser/device. They do not sync to cloud or another device.
- IndexedDB is local browser storage, not a server-side security boundary. Users should not keep private drafts on shared/untrusted devices.
- The clean Hero is the default; selectable Hero/feed layout presets are not yet implemented.
- Cover fields remain in the existing profile data model; this change only removes the mandatory cover from the visible Hero baseline.

### Existing behavior confirmed by source
- Double-tap like/unlike and distinct animation hooks already exist in the social feed implementation.
- Reels playback already observes video visibility and mutes/pause behavior in the dedicated Reels feed.
- Public profile/post rendering and media access continue to depend on current Supabase policies.

### Still not implemented
- Immersive/focus media viewer with vertical post scrolling and horizontal gallery navigation.
- Autoplay for videos throughout Explore (Reels-only observer is not equivalent).
- Global Top 10 country/category ranking and historical achievement markers.
- Server-side AI synthetic-video detection and contextual moderation.
- Duplicate video fingerprinting, copyright claim/counter-notice operations.
- Music rights by territory and audio replacement/muting pipeline.
- Server-rendered watermark/fingerprint and secure media delivery.
- Online presence, active contacts carousel, and final mutual-friend DM definition.
- Cloud-synced drafts and selectable feed/profile layout preferences.

## 3. Live Supabase snapshot
Read-only inspection of project `ytndswhqxayqpftszwfh`:
- Project ACTIVE_HEALTHY; PostgreSQL 17.11.0.018; region ap-southeast-1.
- 62 public base tables; 62/62 have RLS enabled.
- 146 public policies.
- 81 live migration history entries.
- 2 Storage buckets.
- 0 deployed Edge Functions.
- Security Advisor: 20 authenticated-callable SECURITY DEFINER findings and 1 leaked-password-protection warning.
- Performance Advisor: 83 unused-index INFO notices; do not remove without workload evidence.
- Health Advisor: 0 lints.
- 21 public SECURITY DEFINER functions were counted by catalog query; Advisor count is 20 callable authenticated findings. These counts are not identical metrics.

## 4. Social privacy findings still open
Live `pg_policies` inspection confirms:
- SOC-01: comments/likes child-row SELECT policies can reveal rows when a parent post exists, without a canonical viewer-access predicate.
- SOC-02: comment/like insert policies do not consistently enforce access to the parent post.
- SOC-03: authenticated post-read policy does not consistently exclude blocked pairs.
- SOC-04: media access rules are not fully aligned with parent-post visibility and accepted-follower semantics.
- GDT-01 remains separately recorded: directory media membership policy row binding must be revalidated.

Reviewed SQL candidate exists in `docs/pluits/RLS-REMEDIATION-PLAN-AND-SQL-2026-11-09.md`, but no staging branch is available and the candidate has not passed two-account/anonymous negative tests. Therefore no production DDL was applied.

## 5. Release and UAT evidence
- Commit: `f28b44ff576d8699d8d873f11ae1d634facc13c9`.
- Build and production-surface guard: SUCCESS.
- Build output verification: SUCCESS.
- GitHub Pages deployment: SUCCESS for the exact commit.
- Android runtime, real media upload/restore, two-account isolation, and founder UAT: NOT TESTED.
- Founder acceptance: NOT ACCEPTED.

## 6. Next actions
1. Founder Android UAT for clean profile Hero and local Drafts.
2. Prepare/confirm a staging environment before RLS remediation; review cost and rollback requirements.
3. Execute anonymous, owner, accepted follower, unrelated user, and blocked-pair negative tests on staging.
4. Only after passing tests and explicit production change approval, apply a new migration and rerun advisors.
5. Continue frontend-first: immersive media viewer, profile/feed layout choices, Explore autoplay states, inbox UX, and report/appeal surfaces with honest availability labels.
6. Do not publish final Privacy Policy/Terms/Community Guidelines until data inventory, actual system behavior, operational SLA, and legal review are complete.
