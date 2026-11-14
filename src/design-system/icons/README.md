# PLUITS Icon System

**Runtime entry point:** `src/design-system/icons/index.js`  
**Artwork sources during migration:** `src/components/common/social-icons.js` and `src/components/common/icons.js`.

## Rendering decision
PLUITS uses repository-owned inline SVG markup. It does not request icon artwork from an external website at runtime and does not load an icon font or third-party icon CDN. This avoids an extra icon network dependency and keeps artwork crisp at controlled dimensions.

Do not add an icon package solely to render a few icons. Evaluate one only if the icon inventory demonstrates a real maintenance or coverage benefit and its bundle, license and network cost are measured. Prefer local SVG assets for brand marks and complex illustrations.

## API
New code imports `renderIcon` or `socialIcon` from this directory. The facade preserves legacy artwork and is a compatibility boundary; the two old registries are not yet deduplicated.

- Default icon: 20px; navigation: 22px; metadata: 16–18px; prominent action: 24px; creation action may use 28px.
- Artwork size is not the click target. Icon-only controls use a minimum 44px hit area (40px only for documented dense layouts).
- SVG uses `currentColor`, a 24×24 viewBox and consistent stroke caps/joins.
- Decorative SVGs use `aria-hidden="true"`; icon-only buttons require an accessible name.

## Add a missing icon
1. Search this registry and both legacy maps first.
2. Prefer a consistent 24×24 SVG path with stroke `currentColor`.
3. Add artwork to the canonical registry and expose it through this facade.
4. Record name, meaning, owner, consumers and source/license if externally sourced.
5. Test default, active, disabled and 320/360/390/430px contexts.
6. Never hotlink an external SVG or use a remote icon font in production UI.

## Migration status
The facade is implemented. Legacy maps remain for backward compatibility; consumer-by-consumer migration and duplicate-path removal are pending.
