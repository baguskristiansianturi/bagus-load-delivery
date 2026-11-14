# Design Tokens

**Runtime entry point:** `src/design-system/tokens/foundation.css`  
**Current status:** Structural layout tokens active; legacy brand colors and typography remain under controlled reconciliation.

## Ownership
This module owns semantic geometry used across pages: viewport/safe-area behavior, mobile gutters, content widths, spacing scale, control dimensions, icon dimensions, radii and text-role sizes. It does not own feature layouts or introduce a second brand palette.

## Rules
- New components consume these tokens instead of inventing one-off values.
- Page-specific variants must be named and justified.
- Do not mass-replace existing CSS values until all consumers are mapped and visual regressions are checked.
- Update the mobile foundation SOP and tests when tokens change.
