# PLUITS — Comprehensive Modularization Acceptance Contract

Status: ACTIVE WORK / NOT YET COMPLETE
Base: `main`
Work branch: `refactor/comprehensive-module-isolation`

## Objective

Make every page, feature, layout, component, stylesheet, icon set, and asset independently maintainable. A change owned by one page or feature must not create unintended visual or behavioral changes elsewhere.

This is a structural and behavioral refactor. Existing UI, responsive behavior, routes, Supabase contracts, authorization, and user data are protected unless a separately approved change explicitly changes them.

## Non-negotiable safety rules

- Never develop this refactor directly on `main`.
- Keep production deployment unchanged while work is in progress.
- Use isolated branches and a separate preview deployment for user acceptance testing.
- Do not merge or deploy to production before build, automated tests, regression checks, and user approval.
- Do not move or rename files based only on folder naming. Trace imports, runtime ownership, route dispatch, DOM selectors, and asset references first.
- Refactor in small, reversible slices. Avoid broad visual redesign while changing architecture.
- Preserve existing route behavior, data contracts, RLS, authentication, and backend behavior.

## Required ownership boundaries

1. **Application shell and routing** — bootstrap, route matching, route guards, global providers, and shell composition only.
2. **Pages** — page-level composition and route-specific orchestration; no unrelated feature internals.
3. **Features** — each business capability owns its UI, controller/state, service adapters, and feature-specific tests.
4. **Components** — reusable primitives and shared components have explicit contracts and no hidden page-specific behavior.
5. **Layouts** — named layout variants own their responsive structure; page-specific layout rules must not leak into other layouts.
6. **Styles** — global reset/tokens only in global styles; component styles are scoped; page/feature styles have unique ownership and naming. Avoid broad element selectors and accidental global overrides.
7. **Design system** — tokens, typography, spacing, radii, shadows, motion, and shared interaction states have one source of truth.
8. **Icons** — one documented icon contract and registry strategy; no ambiguous duplicate registries or untracked SVG sprite consumers.
9. **Assets** — distinguish public/static assets from imported feature assets; document ownership, naming, dimensions, aspect-ratio/cropping rules, and responsive variants.
10. **Services and data** — UI modules consume explicit service interfaces; do not duplicate Supabase access or bypass existing authorization/data contracts.

## Known audit findings from the current main branch

- `src/style.css` is approximately 286 KB and requires selector-to-owner mapping before extraction.
- A separate top-level `styles/home-layout.css` and multiple files under `src/styles/` coexist; import order and overlap must be traced.
- Marketplace route handling has shared-controller coupling.
- Inbox controller responsibilities include multiple conversation concerns and need explicit ownership boundaries.
- Social and Account composition/controller responsibilities need a consumer and dependency map.
- Icon registries and `public/icons.svg` consumers require a complete audit.
- Existing directories under `src/components`, `src/features`, and `src/pages` are not proof that runtime dependencies are isolated.

These findings are starting points, not a complete audit. Re-verify against the exact branch before each extraction.

## Work phases and exit criteria

### Phase 0 — Baseline and inventory
- Record the exact base commit and current production surface.
- Map router dispatch, startup/import chain, all page controllers, renderers, binders, services, and cross-feature imports.
- Inventory all CSS files, import order, selectors, token consumers, global selectors, and selector-to-markup consumers.
- Inventory icon registries, SVG symbols, `<use>` references, and all icon callers.
- Inventory assets and every usage, including image aspect ratios, object-fit/crop rules, responsive sizing, and public URL dependencies.
- Identify existing tests and missing visual/regression coverage.

Exit: every source area has an owner, consumer map, risk rating, and proposed safe extraction sequence. No guessed dependencies.

### Phase 1 — Guardrails
- Add or strengthen automated module-boundary checks.
- Add checks for forbidden cross-feature imports and unapproved global CSS selectors.
- Define stable shared component, layout, icon, and asset contracts.
- Add regression fixtures for critical routes and responsive breakpoints.

Exit: CI detects boundary violations before merge.

### Phase 2 — Isolated extraction
Refactor one bounded domain at a time, starting with the highest-risk shared controllers only after their consumers and contracts are mapped. Keep each slice behavior-preserving and independently reviewable.

Exit: no unrelated page or feature changes; tests pass after every slice; ownership docs match the source.

### Phase 3 — CSS and asset isolation
- Reduce the monolithic stylesheet only through verified selector ownership.
- Scope component and feature styles; centralize design tokens without changing their values unintentionally.
- Consolidate icon rendering only after all callers and SVG symbol references are accounted for.
- Define asset ownership and image presentation contracts.

Exit: no accidental cross-page selector effects; no broken or missing assets/icons; responsive image behavior remains stable.

### Phase 4 — Verification and preview
- Run production build, unit/integration tests, module-boundary checks, and route smoke tests.
- Verify auth, account, feed, story, inbox, marketplace, seller, checkout, and other existing routes.
- Perform visual regression checks at narrow mobile, common mobile, tablet, and desktop widths.
- Test overflow, horizontal scrolling, safe areas, image/video dimensions, and navigation interactions.
- Publish an isolated preview and complete mobile browser UAT.

Exit: all checks pass, known exceptions are documented, and user approves the preview.

### Phase 5 — Production handoff
- Rebase/resolve conflicts carefully and review the complete diff.
- Merge only after explicit approval.
- Verify production deployment and critical routes after release.
- Record final commit, deployment URL, test results, and any remaining accepted limitations.

Exit: production is stable and the modularization acceptance checklist is signed off.

## Definition of done

PLUITS is considered comprehensively modularized only when all required ownership boundaries are implemented, the dependency/CSS/icon/asset audits are complete, automated boundary and regression checks pass, preview UAT passes, and the user approves the production release.

A documentation-only change, folder creation, or partial controller extraction does not satisfy this definition.
