# PLUITS Frontend Consistency & Modularization Audit

**Audit date:** 15 November 2026  
**Repository:** `baguskristiansianturi/pluits`  
**Method:** source tree, route controller, stylesheet and icon registry inspection. This is a source audit, not a browser-based visual QA or a Lighthouse run.

## Findings
- The application has route-level dynamic imports in `src/app/router.js`, but experience shells and page controllers still have mixed ownership.
- The public homepage's controller/styles are deferred from non-home routes after the recent lazy-load change.
- The design system now has shared geometry tokens, opt-in layout primitives and canonical icon registries.
- Importing the layout stylesheet does not restyle existing pages; legacy page adoption is still pending.
- The social account controller and CSS remain large legacy files, and several business areas still use one controller for multiple routes.
- SVG assets are local and no remote icon library is required. The general, social and app registries have overlapping semantic names and some different artwork.
- No local font files are present. Inter appears in CSS stacks but is not bundled in the repository; system UI fallbacks are therefore the dependable local option.

## Measured stylesheet/controller debt
| File | Source size | Notes |
|---|---:|---|
| `src/style.css` | 285,949 bytes | Global baseline plus legacy public/commerce styles; 864 font-size declarations and 1,366 spacing/layout declarations |
| `src/pages/account/user-account.css` | 201,957 bytes | Account/social styles; 585 font-size declarations and 1,124 spacing/layout declarations |
| `src/pages/account/circle-experience.css` | 67,219 bytes | Circle-specific styles; 106 font-size declarations and 293 spacing/layout declarations |
| `src/pages/messages/messages.css` | 29,038 bytes | Inbox styles; 78 font-size declarations and 141 spacing/layout declarations |
| `styles/home-layout.css` | 27,323 bytes | Legacy public-home layout; now route-loaded with public home |
| `src/pages/blog-studio/index.js` | 65,230 bytes | Blog Studio controller and composition |
| `src/pages/account/index.js` | 168,370 bytes | Account/social route controller |
| `src/pages/marketplace/index.js` | 25,227 bytes | Several commerce route views in one controller |
| `src/pages/trip/index.js` | 15,457 bytes | Multiple trip sections in one controller |

Font-size and spacing counts are declarations, not unique values or rendered DOM measurements. They demonstrate the scale of legacy inconsistency, not a claim that every declaration is visually wrong.

## Normalization target
Use `src/design-system/tokens/foundation.css` and `src/design-system/layouts/foundation.css` as the canonical target. New and edited sections must use:
- 12/16px mobile gutter;
- 1200px content, 720px reading, 1440px workspace containers;
- 4px spacing scale;
- semantic type roles 11/12/14/15/18/24/28px;
- icon size roles 16/18/20/22/24/28px and 44px hit targets;
- dynamic viewport and safe-area tokens.

Page order and visual composition can differ. Geometry, type scale, component states and spacing tokens must remain consistent.

## Migration plan and exit criteria
1. **Design system:** tokens, page layouts, icon/asset registry, typography roles and tests.
2. **Shared shell/components:** extract shell and primitive ownership without changing page behavior.
3. **Public/help/legal/auth:** adopt page/container/reading patterns and remove duplicate global selectors.
4. **Social account:** decompose controller and CSS by feed/profile/Circle/Reels/composer/settings/activity.
5. **Inbox:** separate sidebar, contact rail, thread, chat panel, composer and settings.
6. **Marketplace/Seller/Trip/Directory:** split route-specific features and styles under owning domains.
7. **Blog/Admin/Misc:** split section composition and shared reading/admin layouts.
8. **Runtime/assets:** inspect route chunks, eager imports, media/image loading, listeners, subscriptions and cache.
9. **QA:** viewport smoke tests and real Android visual/performance test.

A phase is complete only when the owner map is updated, consumers are tested, CSS selectors are scoped, the build and tests pass, and route-specific mobile/tablet/desktop evidence exists. Do not mark all pages normalized until each route family has migrated and been checked.
