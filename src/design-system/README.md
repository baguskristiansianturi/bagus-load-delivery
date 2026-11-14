# PLUITS Design System

The design system is the shared foundation for tokens, layout primitives, typography, motion and icon assets.

- `tokens/foundation.css`: viewport, safe-area, spacing, geometry and type-size tokens.
- `layouts/foundation.css`: opt-in page/container/section/layout primitives.
- `icons/index.js`: canonical local SVG rendering facade.
- `icons/registry.js` and `icons/social-registry.js`: repository-owned SVG artwork.
- `typography/`: typography roles and font loading policy (migration in progress).
- `motion/`: motion and reduced-motion policy (migration in progress).

Do not place feature-specific business logic or page-specific visual overrides here. New UI must reuse the foundation and register any new shared component or asset.
