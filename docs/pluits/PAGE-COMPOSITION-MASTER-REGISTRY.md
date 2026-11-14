# PLUITS Page Composition Master Registry

**Purpose:** one vocabulary and one hierarchy for every page. The order/content of sections may differ; the page geometry and component contracts must not drift.

## Canonical application hierarchy
1. **Application shell** — route host, app-level services, route transition, loading/error boundary.
2. **Experience shell** — public, social, marketplace, trip, inbox, seller, directory, blog or admin chrome.
3. **Page shell** — background, available viewport height, horizontal gutter, scroll ownership and width variant.
4. **Page header** — breadcrumb/context, title, description and page-level actions.
5. **Section** — meaningful page region with consistent vertical spacing.
6. **Content layout** — container, stack, cluster, grid, split panel, list or horizontal rail.
7. **Component** — card, row, button, field, avatar, media, menu, dialog, tabs.
8. **Content and state** — data, empty/loading/error/disabled/permission states.

The application shell and experience shell must not be duplicated inside a page. Feature modules own feature behavior and feature data. The design system owns only data-agnostic visual primitives and tokens.

## Canonical geometry baseline
| Property | Standard |
|---|---|
| Viewport | Fluid CSS viewport; use `100dvh` with fallback |
| Mobile QA widths | 320, 360, 390, 430 CSS px |
| Tablet QA widths | 768, 834, 1024 CSS px |
| Desktop QA widths | 1200, 1440 CSS px |
| Mobile page gutter | 16px; 12px at <=360px |
| Content container | max 1200px |
| Reading container | max 720px |
| Workspace container | max 1440px |
| Full-bleed | explicit variant; no horizontal page gutter |
| Spacing | 4px scale: 4/8/12/16/20/24/32/40/48 |
| Icon artwork | 16/18/20/22/24/28px semantic roles |
| Icon-only touch target | 44px minimum |
| Control heights | 36/44/48px by semantic role |
| Radius | 8/12/16/24px semantic roles |
| Text roles | 11/12/14/15/18/24/28px; responsive display headings may use clamp |

These are target shared tokens, not a claim that every legacy route has already migrated. Existing approved brand colors and experience-specific navigation are preserved. The base font stack is system UI to avoid an unbundled remote font dependency; font files are not currently present in the repository.

## Page and experience registry — route families
| Route family | Page controller / owner | Experience shell | Main section composition (current route intent) | Migration status |
|---|---|---|---|---|
| `#/` public home | `pages/home/index.js` + `features/public-home/*` | Public | Public navbar → hero/search → discovery → nearby → stories/feed → marketplace preview → join → footer | Home JS/CSS deferred; remaining legacy home styles need selector migration |
| `#/account/*`, `#/@username` | `pages/account/index.js` | Social | Social header → context-specific profile/home/feed/settings/content → mobile navigation | Legacy controller and CSS oversized; staged decomposition required |
| Circle / social home | `pages/account/index.js` + `circle-experience.css` | Social | Circle intro → stories → people recommendations → following/filter → feed | CSS still page-owned legacy bundle |
| Reels | `pages/account/index.js` + `features/reels/*` | Immersive social media | search/top controls → vertical media viewer → author/audio/caption → action rail → comments sheet | Playback extracted; CSS and page controller integration still need full ownership audit |
| `#/inbox`, `#/inbox/settings` | `pages/messages/index.js`, `settings.js` | Inbox | Inbox header → contacts → conversation list → active chat → composer | Page stylesheet/controller still substantial |
| `#/marketplace`, `#/shop`, product/cart/checkout/orders | `pages/marketplace/index.js` | Marketplace | Marketplace header → category/search → catalog/product → cart/checkout/order state | Single page controller currently owns multiple route views |
| `#/trip`, itinerary | `pages/trip/index.js` | Trip | Trip header/hero → itineraries → service requests → destination discovery → provider request | One controller with several sections; needs feature extraction |
| `#/places`, `#/place/*` | `pages/directory/index.js` | Directory | Directory header/search/filter/map/list; detail/claim subroutes | Page controller/CSS still substantial |
| `#/seller` | `pages/seller/index.js` | Seller | Seller shell/navigation → dashboard/products/categories/inventory/delivery/profile/settings | Route areas need feature-level extraction |
| `#/blog`, `#/@username/blog/*` | `pages/blog/index.js`, `pages/blog-studio/index.js` | Blog | Public article/profile blog; studio editor/preview/library/settings | Studio controller/CSS substantial |
| `#/search` | `pages/search/discovery.js` | Discovery | Search header/filters → people/content/place results | Separate page shell and local stylesheet |
| `#/help`, legal pages | `pages/help/index.js`, route static content | Help / legal | Header → contents/navigation → article body → related links/footer | Layout needs shared reading container migration |
| `#/login`, `#/register` | `features/auth/*` | Auth | Auth shell → form → validation/status/help | Feature-owned CSS exists; geometry tokens adoption pending |
| `#/admin/moderation` | `pages/admin/moderation.js` | Admin | Admin header/navigation → queue/list/detail/actions | Verify shared shell boundaries and responsive states |
| Material/provider/logistics/misc aliases | `pages/misc/index.js` | Public/business | Route-specific content sections | Legacy multi-route page; split by owner when modified |

## Required page specification
Each page must declare:
- route ID and aliases;
- controller and experience shell;
- page width variant (reading/content/workspace/full-bleed);
- ordered sections;
- component IDs and variants per section;
- content max-width and mobile gutters;
- typography roles and spacing tokens;
- navigation owner and sticky/fixed elements;
- service/data dependencies and state ownership;
- responsive rules at 320/360/390/430, tablet and desktop;
- loading, empty, error, disabled and permission states;
- test routes and sibling consumers.

## Page creation / editing SOP
1. Identify route and exact section/component.
2. Read this registry and the component ownership audit.
3. Search the component, layout, token and asset warehouses.
4. Choose the experience shell and one page width variant.
5. Compose page header, sections and content layouts using `plds-*` primitives.
6. Use typography, spacing, radius, icon and control tokens; do not invent page-only values when a semantic token exists.
7. Keep page-specific arrangement in the page owner; keep feature behavior in the feature owner.
8. If an asset is missing, follow the asset approval gate. Ask before sourcing outside.
9. Test mobile widths, tablet/desktop, keyboard, safe areas, touch targets, overflow and state variants.
10. Run tests/build and inspect all consumers if a shared module changed.
11. Update this registry and record the commit/deploy/UAT status.

## Current status
The canonical layout vocabulary and opt-in CSS primitives exist. Most legacy pages still have independent class systems and are not yet fully normalized. This registry is the migration contract; it does not misrepresent an inventory as completed migration.
