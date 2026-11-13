# PLUITS Reuse-First Design and Component Policy

Status: mandatory engineering rule  
Scope: every existing and future PLUITS page, route, feature, component, asset and interaction.

## 1. Core rule: inspect before creating

Before implementing any new page, section, component, interaction or technical pattern, the developer MUST inspect the current PLUITS implementation and its registries.

The required order is:

1. Identify the page/feature and the exact element being requested.
2. Search the relevant registries and existing source code for an existing asset, component, pattern or variant.
3. Inspect its actual implementation and its current consumers. Do not rely on a filename or a similar-looking screenshot alone.
4. Reuse the existing approved item when its visual contract and behavior fit.
5. If only the content, order, placement or composition needs to change, compose existing items. Do not create a duplicate.
6. Create a new item or variant only when a real requirement cannot be met by an existing item without breaking its contract.
7. Record every approved addition or change in its designated registry.

No new design or implementation is allowed merely because it is quicker or more convenient than finding and reusing the existing one.

## 2. One product, consistent visual language

Pages may have different content and workflows, but must retain the same PLUITS visual language. Reuse the canonical values for:

- brand and semantic colors, including text, links, borders, surfaces and states;
- typography, font weights, sizes and line heights;
- icon artwork, stroke/fill, size and alignment;
- component dimensions, spacing, padding, gaps, radii, borders and shadows;
- responsive breakpoints and interaction feedback.

A developer must not approximate a known value, introduce a near-match color, substitute a familiar icon, or independently tune a component on one page.

When the requested page needs only a different arrangement, compose existing building blocks in a different order. Keep each building block's visual and behavioral contract intact.

## 3. Separate visual identity from behavior

Two elements can share the same visual design while serving different workflows. In that case, prefer a shared visual component or shared visual specification with separately identified behavior/configuration.

Example: two search bars may have different data sources, filters, submit actions or result destinations, but should reuse the same search-bar visual contract if their appearance is intended to be identical.

Do not duplicate the visual component just because its behavior differs. Do not merge behavior that has different ownership, permissions, data lifecycle or navigation.

## 4. Variants are explicit, not accidental

A new visual variant is justified only when a documented requirement calls for a genuine visual difference (for example, a compact search field versus a full-size search field).

Every variant MUST have:
- a unique stable ID and descriptive name;
- a parent/base component ID;
- an explicit list of properties that differ from the base;
- inherited properties clearly identified;
- intended page/feature consumers and responsive rules;
- behavior contract or a link to the behavior specification;
- status: observed baseline, proposed, approved, deprecated;
- evidence and change history.

Example IDs:
- `search-bar.standard`
- `search-bar.compact`
- `icon.profile.standard`
- `icon.profile.large`

These are naming examples only; do not assume these variants already exist. A page-specific size must not silently override a shared component. If the size difference is intentional and reusable, register a named variant. If it is truly unique, document why it is page-scoped and who owns it.

## 5. Property-level change contract

A change request modifies only the named property or properties. Preserve all unrelated properties and behavior.

Examples:
- Change background color → change background only.
- Replace an icon asset → preserve size, color, alignment, label and click behavior.
- Increase icon size → preserve artwork, color, position and behavior.
- Move a sidebar below a header → change composition/order only; preserve the sidebar itself.
- Change search behavior → preserve the visual contract unless a visual change is explicitly requested.

If the target is ambiguous, stop and ask one concise clarification. Never guess which of two similar components the user means.

## 6. Required registries and ownership

Keep information in its correct source of truth; do not create one vague catch-all list.

- Asset Registry: canonical logos, SVGs, icons, images, illustrations and fonts; file path, ID, source, license, version and usage.
- Design Token Registry: canonical colors, typography, spacing, dimensions, radii, shadows and breakpoints.
- Component Registry: component IDs, visual contracts, properties, variants, implementation paths and consumers.
- Behavior/Interaction Registry: actions, states, permissions, data dependencies, navigation and lifecycle.
- Layout/Pattern Registry: containers, rails, grids, headers, sidebars, navigation patterns and responsive composition.
- Page Composition Registry: route-to-section/component order and page-specific configuration.
- Change History: request, scope, affected IDs/properties, preview, approval, release and registry updates.

Every component and variant must have clear ownership. Avoid ambiguous names such as just `sidebar`, `carousel` or `search` when multiple distinct patterns exist.

## 7. Missing asset or component procedure

If the required item does not exist:

1. Report what was searched and what is missing.
2. Recommend professional options with direct links to the exact asset or source page.
3. Explain relevant format, dimensions, compatibility, version and license/attribution.
4. Wait for the user's explicit approval.
5. Only after approval, acquire and add it to the repository where permitted.
6. Record provenance and license in the Asset Registry, then implement it using the approved contract.

Never silently download, install, embed, render or substitute an external asset.

## 8. Baseline, proposal and release

The production inventory records what exists today, including inconsistencies; it is not permission to normalize or redesign it.

- Observed baseline: measured or inspected current implementation.
- Proposed: work on a development branch; not canonical.
- Preview: full-site review environment; not production approval.
- Approved: explicitly accepted by the user.
- Released: deployed to production and recorded as current canonical state.
- Deprecated: retained for history but not used for new work.

Do not overwrite the observed baseline with assumptions. Do not promote a proposal to approved or released without the corresponding user approval and verified deployment.

## 9. Mandatory pre-work checklist

Before every implementation task, confirm:

- [ ] Exact page/feature and target component are identified.
- [ ] Relevant registries and source implementations have been searched.
- [ ] Existing assets, tokens, components and variants have been checked.
- [ ] Existing consumers and ownership have been checked.
- [ ] Reuse/composition has been considered before creating anything.
- [ ] Any proposed new variant has a documented reason and explicit property differences.
- [ ] The change scope lists only the requested properties.
- [ ] No unapproved external asset or visual substitution is included.

If these checks cannot be completed, do not invent a replacement. Report the gap and ask for the necessary decision.

## 10. Definition of done

A change is not complete merely because the code works. It is complete only when the approved preview/release is verified, the correct registries are updated, component consumers remain consistent, and the change history records the exact IDs and properties affected.
