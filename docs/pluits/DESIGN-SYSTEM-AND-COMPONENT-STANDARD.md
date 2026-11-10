# PLUITS Design System and Component Standard

Status: Foundation standard; initial inventory of current implementation.  
Scope: Visual tokens, fonts, icons, shared UI, component ownership and CSS isolation.

## 1. Purpose

A design system provides one controlled source for visual decisions. Page and feature developers consume the system rather than inventing new colors, font sizes, spacing or icon styles for every screen.

## 2. Design-system layers

1. **Foundations / design tokens** — color, typography, spacing, sizing, radius, shadow, breakpoints, motion and elevation.
2. **Assets** — brand logo, illustrations, local fonts and approved icon library.
3. **Primitives** — button, input, avatar, badge, icon, surface, divider and typography.
4. **Composite components** — search field, tabs, cards, menus, dialogs, navigation and form groups.
5. **Feature components** — conversation item, post card, product tile, profile hero and other domain-specific UI.
6. **Page layouts** — page-level arrangement of sections and features.

## 3. Token naming

Use semantic names that describe purpose, not only raw color names.

Example target names (illustrative; values must be reconciled with existing approved visual design before implementation):

```css
:root {
  --color-text-primary: #17221f;
  --color-text-secondary: #68746f;
  --color-surface: #ffffff;
  --color-surface-subtle: #f6f8f7;
  --color-border: #e4e9e6;
  --color-action-primary: #0b6b55;

  --font-family-base: Inter, system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;

  --radius-sm: 0.625rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
}
```

Do not blindly replace current values with these examples. First audit existing pages, approved visual decisions and contrast/accessibility. Existing `src/style.css` currently declares root color, radius, container, shadow and font values; it is the current global baseline until a controlled token migration is approved.

## 4. Typography and font assets

- Choose a primary font family and documented fallbacks.
- Prefer a controlled local font asset or a documented provider (for example Google Fonts) with license and loading/performance review.
- Define semantic type roles: display, heading, body, label, caption and numeric.
- Define weight, line-height and responsive behavior.
- Do not load multiple near-identical font families on different pages without a reason.
- Use font-display behavior and avoid layout shift where possible.

Current source sets Inter with system fallbacks in `src/style.css`. Confirm whether the actual font file is bundled or loaded externally before claiming it is locally hosted.

## 5. Icon standard

- Select one primary icon family and one approved integration method.
- Keep a central icon registry/wrapper so page code requests semantic icon names.
- Use SVG for crisp scaling and explicit size/stroke/color.
- Icon-only buttons require accessible names/labels.
- Do not mix arbitrary icon fonts, emoji and unrelated SVG libraries for the same UI purpose.
- Brand marks and custom illustrations are assets, not generic interface icons.

Current repository has `src/components/common/icons.js`, `src/components/common/social-icons.js` and `public/icons.svg`. Audit their overlap and consumers before consolidating. Do not replace the current icon set as part of this documentation change.

## 6. CSS ownership and scoping

- Global CSS owns reset, base document behavior and token definitions only.
- Shared component CSS owns only the shared component namespace.
- Feature CSS is namespaced to its feature root.
- Page CSS owns page-only composition and must not style unrelated pages.
- Use BEM naming or CSS Modules consistently within a module.
- Never add broad rules such as `header { ... }` or `button { ... }` to fix one page.
- Avoid duplicate declarations and append-only overrides. Edit the original owning rule.
- Document intentional exceptions and remove them through a separate verified migration.

## 7. Shared vs page-specific components

Share a component when its semantics, behavior and accessibility contract are genuinely the same. Reuse a primitive with configuration when only content/size/variant differs. Keep separate feature wrappers when behavior, data source or interaction differs.

Example:
- Shared primitive: `SearchInput` (input, clear button, accessible label).
- Feature wrapper: `PersonalInboxSearch` (searches personal conversations).
- Feature wrapper: `StoreInboxSearch` (searches customer/store conversations).
The wrappers may use the same primitive and visual tokens without sharing their search state or backend query.

## 8. Component contract

Each non-trivial component should document:
- owner and purpose;
- public props/inputs and emitted events/callbacks;
- state ownership;
- data/service dependencies;
- root CSS namespace;
- responsive behavior;
- accessibility semantics;
- loading, empty, disabled and error states;
- consumers and tests.

## 9. Visual regression and quality

For each changed component:
- test default, hover/focus, active, disabled, loading and error states as applicable;
- test 320/360/390/430 CSS-pixel widths and tablet/desktop;
- verify keyboard focus, labels, contrast, reduced motion and touch targets;
- capture before/after screenshots for high-impact shared components;
- test all known consumers of shared components.

## 10. Current implementation inventory

- Global CSS: `src/style.css`.
- Additional home layout stylesheet: `styles/home-layout.css`.
- Social navigation styles: `src/styles/social-navigation.css`.
- Shared social component styles: `src/styles/social-components.css`.
- Page transitions: `src/styles/page-transitions.css`.
- Inbox page styles: `src/pages/messages/messages.css`.
- Directory/help/seller page styles exist beside their page modules.
- Profile hero feature CSS: `src/features/profile/profile-hero.css`.
- Reels and post actions have feature-specific CSS.

This inventory shows that styles currently live in more than one location. The correct next step is to map imports and selectors, then migrate gradually. Do not move every stylesheet merely to make the tree look uniform.
