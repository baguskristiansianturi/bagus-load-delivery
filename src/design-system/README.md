# Design System

**Status:** reserved architectural layer; existing tokens and styles remain authoritative.

Owns design tokens, typography, spacing, color, breakpoints, motion, icon conventions and accessible visual primitives. It does not own page layouts, feature state or data access.

Existing visual sources to audit before extraction:
- `src/styles/brand.css`
- `src/styles/social-components.css`
- `src/styles/social-navigation.css`
- `src/style.css`

Do not create a parallel token system. Reuse the existing PLUITS teal identity and soft neutral surfaces.
