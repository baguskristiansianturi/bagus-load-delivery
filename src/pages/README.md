# PLUITS — Current Page Directory

Dokumen ini hanya mencatat halaman dan route yang benar-benar ditemukan di implementasi saat ini. Ini bukan daftar ide produk dan bukan tempat membuat folder kosong untuk fitur masa depan.

## Istilah status

- **IMPLEMENTED** — route dan renderer/controller ditemukan di source.
- **PARTIAL** — route atau page shell ada, tetapi sebagian alur/fungsi belum lengkap atau belum diterima melalui UAT.
- **LEGACY OWNER** — halaman masih dirender oleh controller bersama/legacy; folder penanda tidak berarti sudah dipisahkan secara fisik.
- **ALIAS** — URL alternatif menuju halaman kanonis; bukan halaman kedua.
- **FEATURE / COMPONENT, NOT PAGE** — bagian UI atau fungsi di dalam halaman, bukan route mandiri.

## Halaman yang saat ini terdaftar di router

| Workspace | Halaman / route kanonis | Runtime owner aktual | Status |
|---|---|---|---|
| Public | Public Home — `#/` | `src/pages/home/index.js` | IMPLEMENTED |
| Social | Social Home / Feed — `#/account/explore` | `src/pages/account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | User Profile — `#/@username` | `src/pages/account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | Profile Edit — `#/account/profile/edit` | `src/pages/account/index.js` | IMPLEMENTED · LEGACY OWNER |
| Social | Followers / Following / Requests | `src/pages/account/index.js` | Route states · LEGACY OWNER |
| Social | Saved Posts — `#/account/saved` | `src/pages/account/index.js` | Route state · LEGACY OWNER |
| Social | Reels — `#/account/reels` | `src/pages/account/index.js` | PARTIAL · LEGACY OWNER |
| Social | Activity / Notifications — `#/account/activity` | `src/pages/account/index.js` | PARTIAL · LEGACY OWNER |
| Social | Composer / Create — `#/account/create` | `src/pages/account/index.js` | Route state · LEGACY OWNER |
| Auth | Login / Register — `#/login`, `#/register` | `src/pages/account/index.js`, `src/features/auth/*` | IMPLEMENTED · PARTIAL EXTRACTION |
| Account | Account Settings — `#/account/settings` | `src/pages/account/index.js`, `src/pages/account/security-settings.js` | PARTIAL EXTRACTION |
| Inbox | Inbox — `#/inbox` | `src/pages/messages/index.js` | IMPLEMENTED |
| Inbox | Inbox Settings — `#/inbox/settings` | `src/pages/messages/settings.js` | IMPLEMENTED |
| Discovery | Search / Jelajah — `#/search` | `src/pages/search/discovery.js` | IMPLEMENTED |
| Directory | Directory / Places — `#/places` | `src/pages/directory/index.js` | IMPLEMENTED |
| Directory | Place Detail — `#/place/:slug` | `src/pages/directory/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Directory | Place Claim — `#/place/:slug/claim` | `src/pages/directory/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Marketplace | Marketplace Home / Catalog — `#/marketplace` | `src/pages/marketplace/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Marketplace | Storefront — `#/shop/:slug` | `src/pages/marketplace/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Marketplace | Product Detail — `#/market-product/:id` | `src/pages/marketplace/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Marketplace | Cart — `#/market-cart` | `src/pages/marketplace/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Marketplace | Checkout — `#/market-checkout` | `src/pages/marketplace/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Marketplace | Orders — `#/market-orders` | `src/pages/marketplace/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Marketplace | Order Detail — `#/market-order/:id` | `src/pages/marketplace/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Trip | Trip Home — `#/trip` | `src/pages/trip/index.js` | IMPLEMENTED |
| Trip | Itinerary Detail — `#/trip/itinerary/:id` | `src/pages/trip/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Inbox / Social | Admin Moderation — `#/admin/moderation` | `src/pages/admin/moderation.js` | IMPLEMENTED |
| Editorial | Blog — `#/blog` | `src/pages/blog/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Editorial | Guides — `#/guides` | `src/pages/blog/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Editorial | Article — `#/article/:slug` | `src/pages/blog/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Help | Help / FAQ — `#/help`, `#/faq` | `src/pages/help/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Legal | Terms / Privacy / Guidelines | `src/pages/help/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Misc | About / Contact / Promo / Reviews / Recent | `src/pages/misc/index.js` | IMPLEMENTED · SHARED CONTROLLER |
| Seller | Seller Center — `#/seller` | `src/pages/seller/index.js` | PARTIAL |

**Catatan Marketplace:** repository saat ini sudah memiliki controller dan route untuk katalog, storefront, detail produk, cart, checkout, orders, dan order detail. Ini tidak berarti seluruh pengalaman Marketplace sudah lengkap atau sudah lulus UAT. Jangan membuat ulang route tersebut. Pecah controller hanya sebagai pekerjaan migrasi terpisah yang disetujui.

## Bukan halaman mandiri

Hal berikut adalah feature/component/section, kecuali router kelak mendaftarkan route kanonis tersendiri:

- Post Card, Post Actions, Story Card, Story Rail, Story Viewer.
- Profile Header / Profile Hero.
- People Recommendations dan People Card.
- Reel Card dan Vertical Reel Feed.
- Inbox Contact Strip, Contact List, Conversation List, Message Composer.
- Marketplace Product Card, Product Gallery, Cart Line, Checkout Form.
- Sidebar, header, tab bar, toolbar, modal, icon dan avatar.

Jangan membuat folder di `src/pages/` hanya karena komponen atau feature tersebut ada.

## Alias route — bukan halaman tambahan

- `#/home`, `#/feed`, `#/beranda`, `#/guest` → Public Home.
- `#/messages` → Inbox.
- `#/cart` → Cart.
- `#/checkout` → Checkout.
- `#/orders` → Orders.
- `#/order/:id` → Order Detail.
- `#/materials`, `#/material`, `#/logistik`, `#/delivery` → Marketplace.
- `#/provider`, `#/suppliers`, `#/jasa` → Directory.
- `#/faq` → Help / FAQ.

## Aturan penambahan halaman

1. Folder Page baru dibuat ketika route/halaman benar-benar disetujui dan pekerjaan implementasinya dimulai.
2. Jangan membuat folder kosong untuk ide, roadmap, atau kemungkinan fitur di masa depan.
3. Catat ide masa depan di Idea Backlog atau Project Roadmap, bukan di pohon source page.
4. Jika satu controller menangani beberapa route state, petakan route-state tersebut di registry; jangan mengklaim sudah ada controller/folder terpisah.
5. Feature/component tidak boleh diberi folder Page kecuali benar-benar mempunyai route dan pengalaman halaman mandiri.
6. Setiap route kanonis hanya boleh memiliki satu runtime owner.
7. Sebelum menghapus halaman atau route, telusuri link, router, import, dynamic import, CSS, test dan alur pengguna. Alias tidak boleh disalahartikan sebagai halaman duplikat.

## Peta teknis

- [Page, Route and Section Registry](../../docs/pluits/PAGE-ROUTE-AND-SECTION-REGISTRY.md)
- [Complete Source Structure and Component Map](../../docs/pluits/PLUITS-COMPLETE-SOURCE-STRUCTURE-AND-COMPONENT-MAP.md)
- [Technical Terminology and Runtime Map](../../docs/pluits/PLUITS-TECHNICAL-TERMINOLOGY-AND-RUNTIME-MAP.md)
- [Design System and Component Inventory](../../docs/pluits/PLUITS-DESIGN-SYSTEM-AND-COMPONENT-INVENTORY.md)
