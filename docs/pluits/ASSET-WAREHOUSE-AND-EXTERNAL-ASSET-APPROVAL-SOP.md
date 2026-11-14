# PLUITS Asset Warehouse & External Asset Approval SOP

**Owner:** Design System / Frontend Platform  
**Runtime registry:** `src/design-system/icons/`  
**Review date:** 15 November 2026

## Purpose
This is the single warehouse for discovering and reusing approved UI assets. A feature must search the warehouse before creating or sourcing a new icon, image, font or illustration.

## Current inventory — source verified
| Asset group | Canonical source | Inventory |
|---|---|---|
| General UI icons | `icons/registry.js` | 12 semantic names |
| Social/product UI icons | `icons/social-registry.js` | 36 semantic names |
| Application shell icons | `icons/app-registry.js` | 12 semantic names, now imported by `src/app/ui.js` |
| Brand/social symbol sprite | `public/icons.svg` | 6 symbols: Bluesky, Discord, Documentation, GitHub, Social, X |
| PLUITS brand mark | `public/assets/brand/pluits-logo.svg` | Local SVG |
| Favicon | `public/favicon.svg` | Local SVG; verify byte identity/intent with brand asset before changing |
| Hero image | `src/assets/hero.png` | Local raster asset |
| Font files | `public/assets`, `src/assets` | No WOFF/TTF/OTF files found in repository tree at audit time |

Some icon names are intentionally duplicated across general/social/app registries (for example search, heart, cart, user, location, arrow, menu, truck and check). Similar names do not prove identical paths or meaning. Keep the source distinction until visual comparison approves consolidation.

## Rendering and performance decision
**Default for interface icons: repository-owned inline SVG.** The browser renders local SVG markup; it does not request an icon file or icon font from an external server per icon. This gives stable size, color via `currentColor`, no third-party runtime dependency and no additional icon CDN round trip.

Use a standalone local SVG file for a logo/illustration that is reused as a file asset, and use raster formats for photography. For images below the fold, use lazy loading, explicit width/height or aspect ratio, responsive sizing and modern formats where the source quality allows it.

Do not add a remote icon CDN, remote icon font or hotlinked SVG for interface chrome. A remote source can add DNS/TLS/network latency and fail independently of PLUITS. Bundling every icon package is also not automatically faster: it can increase JS payload and parse cost. Keep the current small, local registry unless a measured need justifies a dependency.

## External asset approval gate — mandatory
If a required icon/asset is not in the warehouse:
1. Report the missing semantic asset and show 1–3 candidate sources/previews with license and attribution information.
2. Ask the product owner whether to use a **local vendored asset** or a **remote runtime asset**. Do not silently choose, download, hotlink, install or add a package.
3. Give a recommendation. For stable UI icons, recommend downloading and committing a local SVG **only when the license permits redistribution**. If redistribution is not allowed, ask whether to use an approved alternative or a licensed provider. Remote runtime rendering is reserved for cases where the provider requires it or the asset is dynamic and terms permit embedding.
4. After approval, record exact source URL/provider, author, license, attribution, retrieval date, file hash, dimensions/viewBox, semantic ID, approved use, owner and consumers.
5. Optimize/validate SVG, remove scripts/embedded foreign objects/external references, preserve required accessibility and test on supported viewport sizes.
6. Update the registry and tests.

Never use a remote asset solely because it appears convenient. Never copy an icon from an unknown source or use an asset with unclear license terms.

## Adding an icon to the warehouse
- Search all registries and the SVG sprite first.
- Choose a semantic name and one canonical visual meaning; create an explicit variant if meanings differ.
- Prefer 24×24 viewBox, stroke `currentColor`, consistent stroke width/caps/joins and no hard-coded brand color for generic UI icons.
- Add to the correct registry and export through `icons/index.js`.
- Record accessible label on the control, not decorative SVG.
- Default artwork sizes: metadata 16–18px, general 20px, navigation 22px, prominent action 24px, special creation 28px. Icon-only touch target: 44px minimum.
- Add tests for unknown icon fallback, output dimensions, local-only rendering and semantic name.
