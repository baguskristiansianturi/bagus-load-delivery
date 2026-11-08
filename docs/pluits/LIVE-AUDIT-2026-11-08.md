# PLUITS — LIVE REPOSITORY & SUPABASE AUDIT
Date: 8 November 2026
Repository: https://github.com/baguskristiansianturi/bagus-load-delivery
Supabase project: `pluits` / `ytndswhqxayqpftszwfh`

## 1. Scope and evidence
Inspected the GitHub main branch tree and key frontend files, live Supabase project metadata, public-schema table inventory, live migration history, RLS policies, security/performance/health advisors, function definitions/grants and triggers. This is a technical snapshot, not a penetration test or production certification.

## 2. Application structure
- Vite application with vanilla JavaScript modules.
- Social homepage: `src/pages/home/index.js`.
- Account/social application: `src/pages/account/index.js` and `src/pages/account/user-account.css`.
- Marketplace and Seller Center: `src/pages/seller/index.js`, catalog, product, cart and checkout modules.
- Supabase client uses a publishable key in the frontend; no service-role key was observed in inspected source files.
- GitHub Pages deploy workflow builds with Node 22 and `npm ci`.

## 3. Social feature audit
| Capability | Observed status |
|---|---|
| Registration/login with Supabase Auth | Implemented in frontend; email delivery and real account UAT still required |
| Personal profile and privacy | Implemented baseline |
| Text/photo/video post | Implemented baseline |
| Photo/video upload | Implemented, 50 MB cap, private bucket |
| Account Explore feed | Implemented |
| Likes and count | Implemented in signed-in account feed |
| Comments and count | Implemented as flat comments; no threaded replies |
| Share/save/tag | Implemented baseline |
| Public homepage social feed | Implemented read-only |
| Public homepage like/comment/share actions | Links only; not real actions or live counts |
| Stories | Database and RLS exist; full UI/UX not implemented |
| Follow/friends graph | Not implemented in inspected routes/schema |
| Direct messages/group chat | Not implemented |
| Notification center | Not implemented |
| Block/report/appeal/moderation | Not implemented as a complete flow |
| Communities/events | Not implemented |
| Collaborative posts/polls/Q&A | Not implemented |

### Media ratio
- Account feed uses intrinsic media proportions; profile grid thumbnails are square by design.
- Public homepage feed had later mobile rules forcing `object-fit: cover`, which could crop uploaded images/videos.
- Fixed by commit `07d81f76b8c46c9e81f53104263b1d91320daa5a`: public feed media now uses intrinsic height and `object-fit: contain`. Deployment workflow run 369 completed successfully. A later full Pages workflow run 374 also completed successfully, including Vite production build, artifact upload and Deploy to GitHub Pages.

## 4. Supabase live state
- Project status: ACTIVE_HEALTHY.
- Region: `ap-southeast-1` (Singapore).
- PostgreSQL 17.
- 28 tables in `public`; all 28 have RLS enabled.
- 17 migration history records.
- 0 Edge Functions deployed.
- One draft, unverified store and one draft product exist. They are not public active listings.

## 5. Migration drift — blocker
The repository contains 13 migration files, while the live database records 17 applied migrations. Five applied migration files are missing from GitHub:
- `20261107160447_allow_text_only_social_posts`
- `20261107161245_secure_pluits_user_media_owner_upload_and_public_post_read`
- `20261107163224_allow_legacy_photo_media_type`
- `20261107165743_add_pluits_24h_user_stories`
- `20261107170245_add_pluits_wallet_accounts_and_requests`

The repository also contains `202611070001_initial_marketplace.sql`, which is not listed in live migration history. Do not reset, clone, replay or make further schema changes until the exact migration history is reconciled. The current live schema cannot be recreated reliably from the tracked migration directory alone.

## 6. Security findings
### Positive
- RLS is enabled on all 28 public tables.
- Private user addresses are owner-only.
- User media bucket is private and access is policy-scoped.
- Store owner and staff roles are represented separately.
- Anonymous public social reads are limited by public visibility and published status.

### Needs remediation or adversarial tests
- Supabase security advisor reports two SECURITY DEFINER functions callable by authenticated users: `public.create_store` and `public.update_store_profile`. Both check `auth.uid()`, use fixed search_path, and anonymous execution is denied. Verify exact grants and test unrelated-user/owner boundaries before production; do not blindly change the security mode.
- Leaked-password protection is disabled.
- Social post RLS does not visibly enforce that a referenced media object path belongs to the posting user. Test whether one user can attach another user's private object path to a public post; add a database-level ownership invariant if absent.
- Story SELECT has overlapping permissive policies for authenticated users; simplify after privacy regression tests.
- RLS being enabled is not equivalent to policy correctness. Run anonymous, owner, unrelated user, staff and revoked-staff tests.

## 7. Performance advisor
- 14 foreign keys without covering indexes.
- 3 auth RLS init-plan warnings on wallet policies.
- 14 unused-index notices (do not remove them just because the database is new).
- 1 multiple-permissive-policy warning on Stories.
- Health advisor returned no lints.

## 8. Commerce and wallet boundaries
- Existing seller workspace and product catalog are present.
- Current live store/product data remains draft/unverified.
- The prior project checkpoint records cart/order demo behavior as local-only and checkout as deliberately disabled until real backend order, stock, delivery and payment handling exists.
- Wallet tables and a user request screen exist, but no payment provider, verified settlement, withdrawal processing or complete financial ledger is operational. Do not describe it as a live money wallet.

## 9. Delivery priorities
1. Reconcile migration history without resetting production.
2. Enable leaked-password protection.
3. Test storage object ownership, private content and store RPC boundaries with multiple accounts.
4. Review store staff permissions, audit write path and RPC grants.
5. Complete Stories UI and public feed metrics/actions.
6. Build follow graph, notifications, report/block/moderation and messaging with privacy controls.
7. Keep commerce checkout and wallet disabled until server-side transaction/ledger paths and UAT are complete.

## 10. Verification status
- Repository and database audit: completed for this snapshot.
- Media-ratio correction: committed; deployment pending workflow 369 at report time.
- Security fixes: not applied in this audit; require settings or migration workflow plus verification.
- Android UAT and two-account privacy tests: not performed.
- Production readiness: NOT APPROVED by this report.

## 11. Additional verification completed after the initial snapshot
- GitHub Pages workflow run 374: **SUCCESS**. Confirmed all steps passed: `npm ci`, `npm run build`, `test -f dist/index.html`, artifact upload and Deploy to GitHub Pages.
- Anonymous database test (transaction rolled back): 2 public profiles visible; 1 public post visible; 0 private address rows visible; 0 active story rows visible.
- Anonymous Storage test (transaction rolled back): 2 objects in `pluits-user-media` visible under current public-media policies, versus 4 total objects; 0 `pluits-store-media` objects visible, versus 1 total object.
- Current data consistency query: 2 user posts; 0 posts currently reference a media path whose first folder differs from the post owner's UUID. This is a snapshot, not proof the policy prevents future attempts.
- Stories table currently contains 0 rows.
- Android device UAT and signed-in two-account tests remain NOT TESTED.

## 12. Migration reconciliation verification
- Active migration files: 17.
- Live migration history entries: 17.
- Exact version/name match: yes.
- Missing or extra active migrations: none.
- Superseded/unapplied drafts: preserved outside `supabase/migrations/`.
