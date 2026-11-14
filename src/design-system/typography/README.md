# Typography Foundation

The runtime type roles and line-height tokens are defined in `../tokens/foundation.css`; opt-in type utility classes are in `../layouts/foundation.css`.

## Font loading decision
No local font files are present in the repository. The app therefore uses a system UI font stack. This avoids silently adding a remote font request or a large font download to first paint. Do not add Google Fonts or another remote font provider without explicit product-owner approval and a measured performance/license review.

## Semantic roles
- 11px: compact metadata
- 12px: secondary labels
- 14px: standard UI copy
- 15px: default body copy
- 18px: emphasized subheading
- 24px: section/page title
- 28px: page heading
- Tight/normal/relaxed line-height tokens: 1.2 / 1.5 / 1.65

These roles are a migration target. Legacy pages still contain one-off font sizes; migrate one component owner at a time and verify hierarchy before changing rendered values.
