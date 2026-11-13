# PLUITS Page Directory

Dokumen ini adalah pintu masuk untuk memahami struktur halaman PLUITS. Baca sebelum membuat, mengubah, memindahkan, atau menghapus page.

## Cara membaca status

- **IMPLEMENTED** — route dan implementasi aktif sudah ada. Folder target tidak boleh dianggap sebagai implementasi kedua.
- **PARTIAL** — route/controller ada, tetapi sebagian section atau state belum lengkap.
- **RESERVED** — folder roadmap disiapkan; belum ada page runtime dan belum didaftarkan ke router.
- **LEGACY OWNER** — implementasi masih berada di controller lama; folder target hanya menandai tujuan migrasi.
- **ALIAS** — URL alternatif yang menuju route kanonis; bukan halaman kedua.
- **FEATURE, NOT PAGE** — bagian/overlay di dalam halaman, bukan route mandiri.

## Workspace dan halaman

| Workspace | Page / route | Current owner | Status |
|---|---|---|---|
| Public | Public Home `#/` | `home/index.js` | IMPLEMENTED |
| Social | Signed-in Home / Feed `#/account/explore` | `account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | Profile `#/@username`, `#/account/profile` | `account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | Profile Edit `#/account/profile/edit` | `account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | Followers / Following / Requests | `account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | Saved Posts `#/account/saved` | `account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | Reels `#/account/reels` | `account/index.js` | PARTIAL · LEGACY OWNER |
| Social | Activity / Notifications `#/account/activity` | `account/index.js` | PARTIAL · LEGACY OWNER |
| Social | Post Detail / Composer / Circle | `account/index.js` and feature modules | Verify exact route/state; do not create duplicate route |
| Auth | Login / Register | `account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Inbox | Personal Inbox `#/inbox` | `messages/index.js` | IMPLEMENTED |
| Inbox | Inbox Settings `#/inbox/settings` | `messages/settings.js` | IMPLEMENTED |
| Inbox | Store Inbox | no separate canonical route confirmed | RESERVED |
| Marketplace | Marketplace Home `#/marketplace` | `marketplace/index.js` | IMPLEMENTED |
| Marketplace | Storefront `#/shop/:slug` | `marketplace/index.js` | IMPLEMENTED · LEGACY OWNER |
| Marketplace | Product Detail `#/market-product/:id` | `marketplace/index.js` | IMPLEMENTED · LEGACY OWNER |
| Marketplace | Cart `#/market-cart` | `marketplace/index.js` | IMPLEMENTED · LEGACY OWNER |
| Marketplace | Checkout `#/market-checkout` | `marketplace/index.js` | IMPLEMENTED · LEGACY OWNER |
| Marketplace | Orders `#/market-orders` | `marketplace/index.js` | IMPLEMENTED · LEGACY OWNER |
| Marketplace | Order Detail `#/market-order/:id` | `marketplace/index.js` | IMPLEMENTED · LEGACY OWNER |
| Directory | Directory Home `#/places` | `directory/index.js` | IMPLEMENTED |
| Directory | Place Detail `#/place/:slug` | `directory/index.js` | IMPLEMENTED · LEGACY OWNER |
| Directory | Place Claim `#/place/:slug/claim` | `directory/index.js` | IMPLEMENTED · LEGACY OWNER |
| Trip | Trip Home `#/trip` | `trip/index.js` | IMPLEMENTED |
| Trip | Itinerary Detail `#/trip/itinerary/:id` | `trip/index.js` | IMPLEMENTED · LEGACY OWNER |
| Seller | Seller Center `#/seller` | `seller/index.js` | PARTIAL |
| Search | Jelajah `#/search` | `search/discovery.js` | IMPLEMENTED |
| Blog | Blog / Guides / Article | `blog/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Help / Legal | Help, FAQ, Terms, Privacy, Guidelines | `help/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Admin | Moderation `#/admin/moderation` | `admin/moderation.js` | IMPLEMENTED |
| Misc | About, Contact, Promo, Reviews, Recent | `misc/index.js` | IMPLEMENTED · SHARED CONTROLLER |

## Important: features that are not separate pages

Story Rail, Story Viewer, Post Card, Post Actions, People Recommendations, Reel Card, Circle sections, and other feed modules are features/components unless a canonical route is explicitly registered. Do not create page folders or routes just because a component exists.

## Rules for new page folders

1. Every canonical page gets one folder and one documented owner.
2. Every folder has a `README.md` page contract, including RESERVED folders.
3. A RESERVED folder is not imported by the router and must not render a fake page.
4. If a page is currently implemented inside a legacy controller, the placeholder records that controller as the current owner. It does not create a second implementation.
5. Route aliases remain documented as aliases and never receive duplicate page folders.
6. Before deleting a page, trace router branches, direct links, navigation, dynamic links, imports, CSS, tests, workflows and docs. Remove or redirect the route only after confirming the canonical replacement.
7. Keep page layout/styles scoped. A page-only change must not alter sibling pages. Shared component changes require a consumer audit.

## Related maps

- [Page Directory, Workspace Structure & Roadmap](../../docs/pluits/PLUITS-PAGE-DIRECTORY-AND-ROADMAP.md)

- [Page, Route and Section Registry](../../docs/pluits/PAGE-ROUTE-AND-SECTION-REGISTRY.md)
- [Page & Component Ownership Audit](../../docs/pluits/PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md)
- [Complete Source Structure and Component Map](../../docs/pluits/PLUITS-COMPLETE-SOURCE-STRUCTURE-AND-COMPONENT-MAP.md)
- [Application Architecture](../../docs/pluits/PLUITS-APPLICATION-ARCHITECTURE.md)
