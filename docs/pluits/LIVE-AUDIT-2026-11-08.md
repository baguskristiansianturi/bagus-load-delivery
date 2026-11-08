# PLUITS — LIVE REPOSITORY & SUPABASE AUDIT
Date: 8 November 2026
Repository: https://github.com/baguskristiansianturi/pluits
Supabase project: `pluits` / `ytndswhqxayqpftszwfh`

## 1. Scope and evidence
Inspected the GitHub main branch, Vite frontend source, live Supabase project metadata, public-schema tables, migration history, RLS policies, storage access, function definitions/grants and Supabase security/performance/health advisors. Ran read-only anonymous tests and rollback-only authenticated authorization probes. This is not a full penetration test or final production certification.

## 2. Application structure
- Vite application with vanilla JavaScript modules.
- Social homepage: `src/pages/home/index.js`.
- Account/social application: `src/pages/account/index.js` and `src/pages/account/user-account.css`.
- Marketplace and Seller Center: `src/pages/seller/index.js` and related catalog/product/cart modules.
- Frontend uses a publishable Supabase key; no service-role key was observed in inspected frontend files.
- GitHub Pages workflow builds with Node 22 and `npm ci`.

## 3. Social feature audit
| Capability | Current status |
|---|---|
| Registration/login | Supabase Auth flow exists; real email confirmation and founder UAT still pending |
| Profile and privacy | Baseline implemented |
| Text/photo/video posts | Implemented |
| Photo/video upload | Implemented; 50 MB cap; private bucket |
| Account Explore feed | Implemented |
| Likes and counts | Implemented in signed-in account feed |
| Comments and counts | Implemented as flat comments; no threaded replies |
| Share/save/tag | Implemented baseline |
| Public homepage feed | Read-only public feed |
| Public homepage interaction metrics/actions | Not implemented; links lead to Explore rather than recording likes/comments |
| Stories | Explore strip, photo/video composer, audience control and viewer implemented; real-account UAT pending |
| Reels | Dedicated vertical video feed from video posts implemented; full-screen swipe/autoplay not implemented; UAT pending |
| Follow/friends graph | Not implemented |
| Direct/group messaging | Not implemented |
| Notifications | Not implemented |
| Block/report/appeal/moderation | Not implemented as a complete workflow |
| Communities/events | Not implemented |
| Collaborative posts/polls/Q&A | Not implemented |

### Media integrity
- Account feed media uses intrinsic proportions; profile-grid thumbnails remain square previews by design.
- Public homepage had mobile CSS overrides forcing `object-fit: cover`; this was corrected to intrinsic height and `object-fit: contain` so photos/videos are not destructively cropped.
- GitHub Pages workflow run 369 succeeded for the media-ratio fix.
- Stories viewer and dedicated Reels feed also use contain/intrinsic media sizing.
- Real handset testing on Android remains outstanding.

## 4. Supabase live state
- Project status: ACTIVE_HEALTHY.
- Region: `ap-southeast-1` (Singapore).
- PostgreSQL 17.
- 28 tables in `public`; all 28 have RLS enabled.
- 19 live migration history records.
- 0 Edge Functions deployed.
- One draft, unverified store and one draft product exist; neither is a public active listing.

## 5. Migration history — reconciled
The active `supabase/migrations/` directory contains 19 files and the live database has 19 migration history records. Version/name comparison confirms an exact match: zero missing records and zero extra active files.

Five missing SQL definitions were recovered from authoritative `supabase_migrations.schema_migrations.statements`. Four early filenames were corrected; five divergent drafts were replaced with exact applied SQL and preserved under `supabase/archive/`. The unapplied legacy `202611070001_initial_marketplace.sql` was also archived outside the active migration directory because it is absent from live history and conflicts with the later applied seller workspace migration.

Two further hardening migrations are applied and committed:
- `20261108011806_enforce_social_media_owner_paths`
- `20261108011838_optimize_story_and_wallet_rls_policies`

No production reset or migration replay was performed.

## 6. Security findings and fixes
### Fixed and verified
- **Social media path ownership:** before the fix, a rollback-only authenticated insert probe proved a public post could reference another UUID's media folder. The validated CHECK constraints on `user_posts` and `user_stories` now require media paths to begin with the matching owner's UUID folder and include a non-empty object name. Foreign-folder paths are rejected; same-user paths pass. All probes were rolled back.
- **Stories audience RLS:** public Stories are readable by anon only when active, marked public, and owned by a public profile. Authenticated users can read their own Stories plus active public Stories. A rollback-only test confirmed anon could read the public Story and could not read the private Story.
- **Wallet RLS evaluation:** wallet policies now use `(select auth.uid())`, removing three RLS init-plan warnings.
- **Stories policy overlap:** role-specific SELECT policies removed the multiple-permissive-policy warning.
- **Store RPC boundary:** anonymous execution is denied. A rollback-only probe confirmed a non-owner call to `public.update_store_profile` is rejected.

### Remaining security work
- **Two SECURITY DEFINER RPC warnings:** `public.create_store` and `public.update_store_profile` remain callable by authenticated users. Both check `auth.uid()`, use a fixed search_path, and anon execution is denied. The non-owner update probe was rejected. Keep these privileged boundaries under test and review store staff/owner permissions before launch.
- **Leaked-password protection disabled:** enable Supabase Auth's leaked-password protection before public launch. This setting was not changed because the connected Supabase actions do not expose Auth security settings.
- **Two-account privacy UAT:** still required for private profiles/posts, media, addresses, Stories, store memberships and revoked staff.

## 7. Performance and health advisors after hardening
- 14 foreign keys without covering indexes.
- 12 unused-index notices; do not remove indexes solely because the new database has low usage.
- Wallet RLS init-plan warnings: 0 (previously 3).
- Multiple-permissive Stories SELECT warning: 0 (previously 1).
- Health advisor returned no lints.

## 8. Commerce and wallet boundaries
- Seller workspace and product catalog exist.
- Current live store/product data remains draft/unverified.
- Checkout remains disabled pending real server-side orders, stock validation, delivery calculation, payment processing, refund handling and UAT.
- Wallet tables and request UI are scaffolding only. No payment provider, verified settlement, withdrawal processing or complete financial ledger is operational. Do not describe it as a live money wallet.

## 9. Stories delivery
- Explore includes a horizontal Stories strip, photo/video composer, caption, audience control and viewer.
- Public visibility is disabled in the composer when the account profile is private.
- Story records are excluded from active reads after 24 hours. Automated permanent deletion/archive of expired media is not implemented.
- GitHub Pages workflow run 423 succeeded, including Vite production build, artifact upload and Deploy to GitHub Pages.
- Public/private Story RLS smoke test passed in a rolled-back transaction.
- Real account upload/view and Android handset UAT remain NOT TESTED.

## 10. Anonymous access smoke test
Executed as the PostgreSQL `anon` role inside rolled-back transactions:
- Public profiles visible: 2.
- Public posts visible: 1.
- Private addresses visible: 0.
- Active Stories visible outside the temporary probe: 0.
- `pluits-user-media` objects visible: 2 of 4 total.
- `pluits-store-media` objects visible: 0 of 1 total.

These are limited smoke tests, not a substitute for signed-in two-account and full Storage upload/delete tests.

## 11. Release priorities
1. Enable leaked-password protection in Supabase Auth settings.
2. Complete real-account registration, email confirmation, profile, post, Story and Android UAT.
3. Run two-account owner/unrelated-user tests for private content, addresses, Stories, store data and wallet requests.
4. Review store staff permissions, audit writes and SECURITY DEFINER RPC grants.
5. UAT Stories and Reels on Android; implement public homepage engagement metrics/actions, follow graph, notifications, messaging, reporting/blocking and moderation.
6. Keep checkout and wallet disabled until server-side transaction/ledger paths and UAT are complete.

## 12. Production readiness
**NOT APPROVED yet.** Repository migration history is reconciled; two backend hardening migrations are applied; Stories UI and media-ratio changes are deployed. Remaining launch gates are Auth leaked-password protection, real-account/Android UAT, two-account privacy tests, and the remaining social safety/commerce work.

## 13. Reels delivery
- Dedicated account route `#/account/reels` lists video posts from the same social post domain.
- Reuses the post interaction controls and signed media delivery.
- Video display preserves intrinsic source ratio; no forced cover crop or stretch.
- Mobile layout is vertically oriented; autoplay/full-screen swipe are intentionally not enabled in this first iteration.
- GitHub Pages workflow run 432 succeeded, including build and deploy.
- Real account video upload/playback and Android UAT remain NOT TESTED.

## Follow graph & private-profile audit — 8 November 2026

- Live schema: `user_follows` ditambahkan dengan primary key follower/following, self-follow CHECK, status pending/accepted, dua indeks relasi, dan RLS.
- Insert follow tidak menerima status dari client sebagai otoritas; trigger menetapkan accepted untuk profil publik dan pending untuk profil privat.
- Update status dibatasi pada kolom `status` dan policy hanya mengizinkan target menerima request pending. Kedua pihak dapat menghapus relasi.
- Private profile directory memakai RPC yang hanya mengungkap username/display name/visibility sebelum persetujuan. Bio/avatar/cover/wilayah dikembalikan hanya untuk profil publik, pemilik, atau relasi accepted.
- RLS untuk profile/posts/stories/storage menerapkan accepted follow. Storage tetap memeriksa object yang benar-benar direferensikan konten yang diizinkan.
- Pengujian rollback lintas dua akun database berhasil: public follow, private request, acceptance, private media boundary, self-follow rejection, dan akses post oleh follower accepted.
- RLS recursion sempat terdeteksi saat uji awal dan sudah diperbaiki memakai helper private yang tidak terekspos melalui Data API.
- Sepuluh migration CP-023 dibandingkan dengan statement live; seluruh file ada dan SQL cocok. Total live history sekarang 29 migration.
- Frontend: public profile by username, follower/following/request list, accept/decline/cancel/unfollow/remove, guest public profile/post view, dan mobile CSS. Real account/device UAT masih pending.
- Belum ada notification inbox/push/email, report/block/mute/moderation/appeal, DM, atau anti-spam workflow.
- GitHub Pages run #465 (42435951991) pada commit `fc2314e81f21d5edd55d99108da8777198d7d6f4` sukses build dan deploy. Bundle: JS 172.94 kB (gzip 49.59 kB), CSS 258.32 kB (gzip 44.57 kB), HTML 1.09 kB.
- Ukuran bundle merupakan indikator awal saja; belum ada Lighthouse/Core Web Vitals, pengukuran kecepatan jaringan mobile, atau pengujian Android langsung.


## GeoDirectory implementation update — 8 November 2026
- Supabase migrations 20261108040323 through 20261108041053 applied for PostGIS, directory core, starter Bali entities, claims, grants/RLS hardening, domain links, media policy, and explicit deny policy for source provenance.
- 27 categories; 4 published places; 4 public locations.
- Nearby RPC tested under anon: 15 km = 2 results, 50 km = 4 results; beach category = 1; invalid latitude = 0.
- RLS check: 0 of 16 new public tables missing RLS. Anon cannot read entity sources, claims, or personal discovery preferences. The private claim trigger cannot be executed directly by anon/authenticated.
- GeoDirectory frontend pages and home preview added; list/map, filters, area/radius, opt-in GPS, place detail/claim, interest controls, recommendation feedback, saved/recent are implemented.
- GitHub Pages run #506 succeeded on commit 2432e4a. Latest SQL/docs-only commits require a final workflow status check.
- Remaining: four-place seed only; admin claim/media review, licensed import/dedup/correction workflow, media Storage upload, store/social authoring integration, Trip link, commerce cart migration, Android UAT and performance/load tests.
- Security Advisor still flags two legacy SECURITY DEFINER store RPCs and disabled leaked-password protection. Function definitions include auth.uid checks; update_store_profile also checks private.is_store_owner. These were not rewritten without seller regression tests.

- Migration terakhir pada audit ini: `20261108041216_pluits_directory_fk_indexes`; FK GeoDirectory telah diberi indeks pendukung.
- Performance Advisor tersisa 14 temuan unindexed FK yang semuanya pada tabel legacy Social/Marketplace; 43 unused-index advisory masih perlu diamati setelah trafik. Tidak ada indeks GeoDirectory yang dihapus.
- Security Advisor kini hanya menampilkan dua RPC toko lama SECURITY DEFINER dan leaked-password protection disabled; RLS no-policy warning untuk source provenance telah ditutup dengan explicit deny policy dan revoke grants.

- Recommendation ranking diberi recency decay dan cap skor 90 hari; event yang saat ini tercatat dari UI terutama view/click/save/hide. Follow/share/check-in/report masih menunggu integrasi lintas modul.
- Bottom navigation mobile kini memiliki pintasan langsung ke GeoDirectory.

- Migration live `20261108041421_pluits_directory_claim_revocation` mengikat membership ke source claim dan mencabut akses yang berasal dari claim bila approval kemudian dicabut/ditolak/disengketakan/ditarik. Fungsi trigger private tidak dapat dieksekusi langsung oleh role API.
