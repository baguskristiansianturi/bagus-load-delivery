# PLUITS — Circle & Jelajah Experience
Date: 12 November 2026
Status: Circle/Jelajah frontend IMPLEMENTED and DEPLOYED; Android UAT NOT TESTED; ACCEPTANCE PENDING.

## Product contract
Circle is the signed-in personal space. It combines followed people, active Stories from followed accounts, people recommendations, posts, nearby/local discovery, local products/services, articles/blogs and interests.
Jelajah is public discovery. It combines published public posts from personal and professional/business contexts. It does not require following the author.
Both use canonical content records; their candidate selection and ranking are separate.

## Circle composition
Order:
1. Circle Anda heading and short description.
2. Story circles from followed accounts with active public Stories.
3. Orang yang Mungkin Anda Kenal.
4. Postingan feed.
5. Nearby/local directory, discovery links, and local product/service collections below the feed.

The feed toolbar stays sticky while posts scroll. Controls are Semua, Terbaru, Acak and Kategori.
The Circle carousel does not show the viewer's own Story or a create-Story action. Story creation remains in the existing Buat flow.

### Story privacy and limitations
- Query only active public Stories (visibility public and expires_at later than current time).
- Only authors in the viewer's accepted following list are included.
- Existing RLS remains authoritative; blocked relationships are additionally excluded.
- Story media and profile images use short-lived signed URLs.
- Viewer counts, read receipts, comments/replies, reactions, Story notifications and cross-device seen-state are NOT implemented in this increment.
- Private Stories are not shown under the current public-only schema/policy.

## Jelajah public feed
Jelajah renders text-only posts and photo/video posts in one feed. It links authors to public profiles, signs media in a bounded batch, excludes blocked authors for signed-in viewers, and renders only published public posts with public author profiles.
Categories are derived from actual post tags. Sorting offers Sedang populer, Terbaru and Acak.
The current popularity heuristic uses actual like/comment counts within a bounded candidate window plus freshness. It is not a validated viral recommender, verified-news ranking, or disaster/event-priority ranking. No AI moderation service was activated by this change.

## Integrity and social proof
The existing Top 10 renderer contains demo-only content and is not shown as live trending in Circle.
A real area-based Top 10 requires a trusted data source, region definition, eligibility rules, ranking, abuse resistance and observability.
Social-proof labels such as “Ratna pernah berkunjung”, “teman membeli produk ini” or “teman menggunakan layanan ini” are approved product direction but NOT IMPLEMENTED. They require canonical evidence, explicit sharing consent, RLS-safe aggregates and separate visit/purchase/service rules. GPS presence alone is not proof.

## Architecture and ownership
- Circle route: #/account/explore; owner: src/pages/account/index.js.
- Jelajah route: #/search; owner: src/pages/search/discovery.js.
- Shared navigation owner: src/components/social/navigation.js.
- Story carousel reuses the existing user_stories table and media bucket. No schema migration or production data mutation was made.
- Circle ranking, Jelajah ranking, directory ranking and future important-event ranking must remain separate strategies.
- The Account controller remains a large legacy composition; this increment does not claim the whole app is fully modular.

## Deferred work
Not included: Story receipts/counts/reactions/comments/replies and deep-link notifications; profile-owned Story management; Inbox Story presentation; social-proof labels; real area Top 10 and important-event ranking; AI moderation pipelines and human-review operations; Business request workspace; user feedback/criticism/suggestion center.

## Acceptance criteria
- Circle/Jelajah labels are consistent on desktop and mobile.
- Circle order is heading, followed Story circles, people recommendations, posts.
- Circle does not show a create-your-own Story circle.
- Only active public Stories from followed, non-blocked accounts appear.
- Story viewer supports sequence previous/next/close.
- Sticky Circle filters remain usable during scrolling.
- Semua/Terbaru/Acak/Kategori work on the Circle candidate set.
- Jelajah combines text-only and media posts, excludes private/non-published content and blocked authors, and supports trending/latest/random/category.
- Existing Profile, Inbox, Marketplace, Directory and Trip routes remain unchanged.

## Deployment evidence
Circle/navigation/filter commits: 421a07f6b222f80c28008f03b0f6a5e508a12c1e, 734234b581bc85160abdecc63671d32b58e05ed0, ea0c63a0a480ca92c9c9ae091cfa18aaa9a76a87, 82b49c4c16dfa3c3a12c82a801234f3bf0b62a6e.
Jelajah mixed-feed commit: 24800259c62483f84454576a139e727a2ab405b2.
Syntax correction: 9ccd13050541bd1fb5bd423a1f6479f898d0e118.
GitHub Actions run 43243601266 (run 1642) succeeded on commit 9ccd13050541bd1fb5bd423a1f6479f898d0e118. Production verification, automated tests, Vite build, build-output verification, Pages artifact upload and deployment all succeeded.
Android founder UAT: NOT TESTED. Founder acceptance: PENDING.


## Story Ring Rail — approved visual contract (14 November 2026)

The Story carousel is a **full-bleed horizontal Story Ring Rail**, not a card carousel.
- It spans the full Circle content width; no inset white card, border, rounded card container or shadow.
- Heading/description align to the normal page text gutter; the horizontal rail itself uses the full width.
- Mobile: exactly three large rings visible, 2px gap, ring diameter `clamp(88px, 28vw, 112px)`, each item takes one third of the track after the two gaps.
- Desktop: 140px rings, 156px item width, 14px gap.
- Horizontal touch scrolling and start snap remain. Preserve Story data eligibility/order, ring seen/unseen states, click/focus behavior and existing Story Viewer controls.
- Source ownership: renderer `src/pages/account/index.js`; CSS `src/pages/account/circle-experience.css`. No duplicate Story renderer or separate carousel behavior is to be introduced.
- Acceptance: on a 360px-wide phone, three large circles fit across the full rail with only 2px between items; rail begins at the viewport content edge rather than inside an inset card; swipe moves horizontally; tapping a Story opens the existing viewer unchanged.


### Carousel interaction parity (14 November 2026)
The Story Ring Rail uses the same native horizontal carousel interaction pattern as `Orang yang Mungkin Anda Kenal`: flex row without wrapping, horizontal overflow, momentum scrolling on touch, hidden scrollbar, and mandatory start snapping. Story-specific sizing remains independent: three visible rings on mobile with 2px spacing. Swiping Story must feel the same as swiping the People Recommendations cards; tapping a Story still opens the Story Viewer and must not be repurposed as carousel navigation.
