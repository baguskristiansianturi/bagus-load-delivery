# PLUITS — PRODUCT ROADMAP & DELIVERY GATES
Version: 1.0 | 2026-11-08
Companion: docs/pluits/MASTER-PRODUCT-VISION.md

## Delivery rule
This roadmap is additive. It does not authorize overwriting existing features, schemas, data, or design decisions. First inventory what exists; mark each item as working, partial, broken, missing, or not applicable. Implement in small, reversible increments with tests.

## Phase 0 — Repository and product baseline (first)
- Identify actual application repository, hosting target, Supabase project and environments.
- Inventory routes, components, dependencies, build/deploy workflow and current release.
- Inventory Supabase tables, RLS policies, functions, buckets, triggers and auth settings.
- Capture mobile screenshots and test critical flows on narrow Android viewport.
- Record known bugs and current feature status.
Exit gate: documented baseline, no secrets exposed, backups/rollback plan identified.

## Phase 1 — Social foundation (highest priority)
- Mobile navigation and home feed.
- Profiles and account settings.
- Compact post composer and drafts.
- Photo/video upload reliability, progress/retry and media integrity.
- Feed post cards, carousel behavior, correct image/video ratio.
- Likes/reactions, comments/replies, share/repost attribution, save.
- Follow/friend behavior and notifications.
- Post-level audience and comment controls.
Exit gate: real-user flows work on mobile; media is not destructively cropped; authorization verified.

## Phase 2 — Trust, safety and account security
- Auth verification, recovery and optional MFA.
- Session/device visibility and revocation.
- RLS audit and negative permission tests for all exposed tables.
- Private storage policies and signed URL lifecycle.
- Block/restrict/report/appeal/moderation.
- Rate limits, anti-spam and audit events.
Exit gate: no critical/high authorization or privacy findings; moderation and recovery tested.

## Phase 3 — Social depth and discovery
- Stories and short video feed.
- Explore and unified search.
- Communities and group roles.
- Direct messaging and group conversations.
- Collaborative posts, polls and Q&A.
- Around You with opt-in location controls.
Exit gate: discovery respects privacy and ranking controls; messaging/reporting safeguards operate.

## Phase 4 — Marketplace integration
- Preserve current marketplace and store-owner model.
- Verified business profiles and scoped staff roles.
- Social product/service links.
- Catalog, cart, checkout, order status and customer support.
- Reviews tied to eligible completed transactions.
- Payment/refund reconciliation and fraud controls.
Exit gate: end-to-end order test; price and order state validated server-side; seller permissions tested.

## Phase 5 — Travel ecosystem
- Moments and travel journal.
- Destinations, activities, stays, rental and transport provider listings.
- Shared itineraries and booking flow.
- Availability, price breakdown, cancellation and provider verification.
- Reviews linked to completed bookings.
Exit gate: end-to-end booking and cancellation tests; provider and customer data isolation verified.

## Phase 6 — Intelligence and scale
- User-controlled recommendation system.
- Trust signals based on verifiable evidence.
- Memories recap and export.
- Performance optimization, caching, media delivery and observability.
- Localization and accessibility improvements.
Exit gate: measurable improvement without degrading safety, performance or user control.

## Release checklist (every phase)
- [ ] Existing feature regression test
- [ ] Mobile viewport and touch-target test
- [ ] Authenticated and anonymous behavior test
- [ ] RLS positive and negative tests
- [ ] Storage access test
- [ ] Upload failure/retry test where applicable
- [ ] Loading, empty, error and offline states
- [ ] Accessibility and contrast review
- [ ] No secrets or private test data in public repository
- [ ] Build/deploy result recorded
- [ ] Commit SHA and rollback path recorded

## Current status
No implementation status is asserted by this planning document. Repository and application audit must be completed before marking any phase item done.


## CP-024 — Social activity inbox and notification backend (8 November 2026)

- Backend: added `public.user_notifications` with recipient ownership, actor, notification type, linked post/profile, created/read timestamps, recipient/time and unread indexes, and RLS.
- Database triggers create notifications for follow requests, accepted follows, post likes, and post comments. Self-actions do not generate notifications.
- Security: clients cannot insert notifications or edit their content/actor/recipient; authenticated users can read only their own rows and update only `read_at`. Trigger function is isolated in the non-exposed `private` schema, uses a fixed `pg_catalog` search path, and is not executable by anon/authenticated roles.
- Frontend: added the Activity entry to the signed-in social navigation, an activity inbox with actor identity, event type, timestamp, unread state, mark-one-read and mark-all-read behavior.
- Verification: notification table RLS enabled; anon has no SELECT; authenticated has SELECT but no table-wide UPDATE; authenticated may update only `read_at`; 4 event triggers exist; anon/authenticated cannot execute the trigger function. Supabase Security Advisor no longer reports this new function; remaining 2 SECURITY DEFINER findings are legacy store RPCs, plus Auth leaked-password protection remains disabled.
- **Status:** backend schema/triggers and frontend inbox implemented; real two-account event-flow and Android visual UAT pending; deployment must be confirmed from the latest Pages workflow.
- **Next Phase 1 work:** media upload progress/retry and preserving original dimensions across every feed surface; then complete threaded comments, sharing/repost attribution, and post audience/comment controls before moving deeper into Phase 2 trust and safety.


## CP-025 — Help Center, Terms, Privacy & Policy Blueprint (8 November 2026)

- Founder clarification: bantuan, syarat penggunaan, privasi, pedoman komunitas, dan aturan tiap fitur harus berkembang seiring sharing, keputusan produk, dan pengujian; bukan pekerjaan dokumentasi yang ditunda sampai akhir.
- Blueprint dibuat di `docs/pluits/HELP-CENTER-LEGAL-CONTENT-BLUEPRINT.md`.
- Struktur mencakup Pusat Bantuan; Keamanan & Kepercayaan; Ketentuan & Kebijakan; Tentang & Kontak; artikel bantuan per domain; dokumen Terms, Privacy, Community Guidelines, Marketplace, Trip, Location/Directory, dan Verification.
- Setiap masukan wajib menjadi Decision Record dan dipetakan ke Master Business Model, Product Roadmap, PRD/architecture, UI copy, Help Center, Terms, Privacy, Guidelines, serta test cases.
- Status dipisah: PROPOSED, DECIDED, IMPLEMENTED, DEPLOYED, TESTED, PUBLISHED, LEGAL REVIEW REQUIRED, SUPERSEDED. Keputusan founder tidak otomatis menjadi kebijakan aktif.
- Privacy Policy harus mengikuti data inventory dan kontrol backend yang nyata. Dilarang menjanjikan fitur keamanan, retensi, penghapusan, enkripsi, atau perlindungan transaksi yang belum dibuktikan.
- **Status:** BLUEPRINT CREATED / COMMITTED. Belum ada halaman Help/Legal publik dan belum ada Terms/Privacy final yang diterbitkan. Draft legal memerlukan inventaris data dan review profesional sebelum diberlakukan.
- **Delivery gates:** H0 blueprint; H1 data map + account/social help and community baseline; H2 GeoDirectory/location; H3 Marketplace; H4 Trip; H5 Trust/Safety/Operations.
- **Aturan kerja ke depan:** setiap checkpoint fitur harus mengecek dampak ke bantuan, disclosure, Terms, Privacy, dan Guidelines. Konten yang menjelaskan perilaku pengguna harus diperbarui sebelum/bersamaan dengan rilis fitur terkait.

## CP-026 — Account Settings Hub (8 November 2026)

- Pusat Pengaturan Pluits disusun sebagai hub mobile-first dengan kelompok Akun & Identitas; Privasi & Keamanan; Layanan Pluits; Bantuan & Informasi.
- Hub menautkan kemampuan/rute yang tersedia. Kontrol keamanan lanjutan yang belum dibangun tidak ditampilkan sebagai toggle aktif.
- `#/account/settings` menjadi pusat pengaturan; `#/account/content-settings` mempertahankan form preferensi konten yang tersimpan ke `account_content_preferences`.
- Panduan pengguna: `docs/pluits/help/ACCOUNT-SETTINGS.md`.
- Status UAT Android: menunggu pengujian pengguna.

## CP-027 — Responsive experience across phone, tablet and desktop (8 November 2026)

- Founder direction: Pluits is a social platform, not a phone-only app stretched to desktop. Mobile is the primary design target, while tablet and laptop/desktop need intentional layouts for users who prefer a larger screen.
- **Product rule:** one account, one feature set, and consistent data/permissions across devices; layout, navigation density, columns, and interaction affordances adapt to viewport and input mode.
- **Phone (primary):** single-column feed and settings, bottom navigation, compact top bar, touch-first controls, media keeps its natural aspect ratio, horizontal content rails become swipeable carousels.
- **Tablet:** adaptive navigation with more visible destinations, two-column settings/discovery where content benefits, feed remains readable and media is not stretched.
- **Desktop/laptop:** persistent top/side navigation as appropriate, centered readable feed with optional contextual side rail, multi-column account/settings workspace, hover/focus states plus keyboard navigation; do not simply scale the mobile screen.
- **Responsive QA viewports:** 360×800 and 390×844 phone; 768×1024 tablet portrait; 1024×768 tablet landscape/small laptop; 1366×768 and 1440×900 desktop. Also test zoom 200%, long Indonesian labels, empty/loading/error states, and keyboard-only navigation.
- **Current implementation delta:** Account Center CSS now uses a one-column phone layout and two-column tablet/desktop layout, with width and spacing adjustments at 380px, 760px, 1024px, and 1200px breakpoints. This is a targeted first pass, not proof that every Pluits screen is fully responsive.
- **Status:** DESIGN DECIDED; Account Center responsive CSS IMPLEMENTED; deploy and device QA NOT YET VERIFIED. Other screens remain subject to the same responsive audit.
- **Acceptance:** no horizontal overflow at supported widths; all controls reachable; no content clipped; readable line lengths; touch targets comfortable on mobile; keyboard and focus usable on desktop; same backend state across device classes.


## CP-028 — Functional social feed, threaded comments and profile navigation (8 November 2026)

- Founder UAT feedback: video/post flows, Explore, Feed, comments, and profile navigation must work as a connected social product; decorative controls or links that merely lead to unrelated screens are not acceptable.
- Home feed: signed-in users can like/unlike and save/unsave directly; Share uses the native share sheet or copies a post link. Comment opens the post detail where the comment thread is available. Public author avatar and name open that user's profile.
- Explore/Reels/post detail: post likes and comments remain available to the post owner as well as other signed-in users. Self-like was already permitted by the post-likes policy; the comment insert policy now explicitly permits the post owner to comment on their own post even if the audience preference disables comments from others.
- Threaded comments: post_comments.parent_comment_id supports replies within the same post, enforced by a composite self-reference foreign key. post_comment_likes supports like/unlike on individual comments with authenticated-only RLS policies and per-user uniqueness.
- Comment UI renders author links, reply controls, like counts, and nested reply forms. Profile avatars in post cards are links to the user's profile.
- Account shell now keeps desktop navigation, mobile bottom navigation, and a visible profile destination on profile pages instead of removing navigation on the profile route.
- Migration: supabase/migrations/20261108051829_pluits_post_comment_replies_and_likes.sql; applied to Supabase project ytndswhqxayqpftszwfh. Schema verification confirms parent_comment_id, post_comment_likes, and authenticated RLS policies exist.
- **Status:** DB schema/policies APPLIED; frontend interactions IMPLEMENTED; production build/deploy status must be checked against the newest GitHub Actions run; Android UAT NOT YET TESTED.
- **Not yet accepted as complete:** video upload/playback on a real Android device, two-account interactions, comment/reply/like counters after refresh, private-profile visibility, moderation and report flows, and cross-device responsive checks. Existing video upload implementation accepts MP4/WebM up to 50 MB; that code path is not proof of successful real-device upload.
- **Acceptance tests:** (1) owner likes own post; (2) owner comments on own post; (3) another user likes/comments; (4) reply to a comment and reply to a reply; (5) like/unlike a comment; (6) refresh preserves counts and thread; (7) author avatar/name opens correct profile; (8) Home, Explore, Reels, post detail and Profile navigation work on phone/tablet/desktop.
- **Next:** complete real-device media upload test and two-account interaction test; then finish Explore discovery controls, report/block/moderation affordances, and story/reel viewing interactions before marking the social core UAT-ready.


## CP-029 — Media upload reliability pass (8 November 2026)

- Perbaikan lanjutan setelah review kode upload sosial: Story composer sebelumnya menggunakan variabel `storyInserted` tanpa deklarasi lokal. Setelah insert Story berhasil, strict-mode JavaScript dapat melempar ReferenceError dan masuk ke jalur error. Variabel kini dideklarasikan pada scope submit yang benar.
- Upload Story dan postingan kini menentukan MIME dari ekstensi file hanya bila browser Android tidak mengirim `file.type`; MIME yang terisi tetapi tidak diizinkan tetap ditolak. Format yang didukung: JPG, JPEG, PNG, WebP, GIF, MP4, WebM.
- URL pratinjau lokal direvoke saat file diganti dan setelah berhasil diterbitkan, untuk mengurangi penggunaan memori pada perangkat dengan RAM terbatas.
- Jika upload media berhasil tetapi penyimpanan record postingan/Story gagal, aplikasi mencoba menghapus file sementara agar tidak meninggalkan objek yatim di Storage.
- Batas ukuran tetap 50 MB untuk postingan dan Story. Belum dilakukan tes upload/playback Android; founder melakukan UAT perangkat nyata. Progress UI masih indikator tahap, bukan persentase byte upload yang akurat.
- Status: CODE UPDATED; BUILD/DEPLOY MENUNGGU workflow commit; ANDROID UAT MENUNGGU founder.
- Acceptance test founder: upload JPG/PNG/WebP, MP4, dan WebM; ganti file saat preview aktif; batalkan/gagal submit; cek postingan dan Story tampil setelah refresh; cek playback; lakukan pada jaringan seluler dan Wi-Fi.
