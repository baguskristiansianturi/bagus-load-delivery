# PLUITS Engineering Architecture Playbook

Status: Active engineering standard  
Scope: Frontend, backend, design system, testing, deployment and VPS readiness.  
Audience: Developers and project owner.  
Language: Indonesian-first explanations; standard English engineering terms are retained.

## 1. Purpose

This document defines how PLUITS is mapped, structured, changed, tested and deployed. It is an engineering standard, not a product/business specification.

The owner should be able to identify a page and visible section in plain language. Developers must translate that request into the exact page, feature/component, stylesheet, JavaScript module, service and dependency before editing.

## 2. Mandatory sequence for a new or existing application

1. **Technology audit** — identify runtime, framework, build tool, router, dependencies, backend, database, storage, tests and deployment.
2. **Application/page map** — list canonical routes, aliases, access requirements and page owners.
3. **Page anatomy** — decompose each page into layout, sections, components and UI states.
4. **Dependency map** — identify component owners, consumers, service calls, shared styles and backend contracts.
5. **Design-system foundation** — define fonts, icons, color/semantic tokens, type scale, spacing, sizing, breakpoints, motion and component rules.
6. **Frontend architecture** — assign page composition, feature behavior, shared UI, CSS and JavaScript ownership.
7. **Backend architecture** — assign API routes, controllers/handlers, services, repositories, validation, authorization, database and storage ownership.
8. **Integration contracts** — document request/response schemas, error states, authentication and realtime events.
9. **Test architecture** — component, integration, route, accessibility, responsive and regression tests.
10. **Deployment architecture** — define build artifacts, environment configuration, hosting, server processes, database, storage, backups, logs and rollback.
11. **Incremental implementation** — change one owner at a time, preserve compatibility and verify sibling pages.

For an existing application, audit actual implementation first. Do not impose a new framework or perform a mass file move before dependency analysis.

## 3. Standard vocabulary

| Term | Meaning |
|---|---|
| Application | The complete product/runtime |
| Route | A URL/hash destination |
| Page | The screen rendered for a route |
| Layout | The structural frame that arranges page regions |
| Section | A meaningful region within a page |
| Component | A reusable or independently managed UI unit |
| Feature | A user-facing capability with behavior and state |
| Entity | A core domain object/data model |
| Service | A module that communicates with backend/platform services |
| API contract | The agreed request/response format |
| Design token | A named visual value such as color, spacing or typography |
| Scope | The exact area a change is allowed to affect |
| Dependency | Another module or service this module relies on |
| Regression | An unintended break in previously working behavior |

A section does not automatically need its own folder. Split a component when it has meaningful behavior, complexity, reuse, independent testing or a clear ownership boundary.

## 4. Frontend ownership and dependency direction

Target responsibility:

- **app/** — bootstrap, router, route guards, session lifecycle and global error handling.
- **pages/** — route-level composition. A page brings together features and layouts; it should not become a home for unrelated business logic.
- **features/** — behavior, UI state, markup, feature-specific styles and tests.
- **entities/** — shared domain models and domain-level UI where justified.
- **components/** — reusable layout, navigation, feedback and primitive UI.
- **design-system/** — tokens, typography, icon registry, motion and component foundations.
- **services/** — API/Supabase/Storage/Realtime/cache/offline communication; no page HTML.
- **platform/** — browser/native APIs behind adapters.
- **styles/** — reset and truly global styles only.

Dependency direction: page → feature → shared component/design system. Page/feature → service → platform adapter. Shared UI must not import page controllers. Services must not render UI. One feature must not reach into another feature's private implementation.

## 5. Page, section and component naming

Use names that communicate both the domain and purpose.

Examples:
- Page: Inbox Personal
- Section: Conversation List
- Component: Conversation Item
- Element: Conversation Avatar
- CSS namespace: `.personal-inbox__conversation-avatar`
- JavaScript module: `conversation-avatar.js` or the component module entry point.

Use BEM-style names or CSS Modules according to the existing build/runtime. Never use broad selectors to target a page-specific element. Avoid global selectors such as `header`, `nav`, `button`, `input` for feature styling.

## 6. CSS and JavaScript isolation

- Page/feature styles must be rooted in a unique page or feature namespace.
- Shared styles are changed only when the intended impact is shared and all consumers are checked.
- Do not append override patches at the bottom of a global stylesheet to fix one feature.
- Prefer CSS custom properties/design tokens for shared visual values.
- JavaScript must bind within the owning component/root, not query generic selectors across the whole document.
- Event listeners and subscriptions must be cleaned up when a page/feature is unmounted or replaced.
- Keep markup, style and behavior in separate files/modules where that improves ownership and maintainability; do not force artificial fragmentation for tiny static elements.

## 7. Change procedure (required)

Before editing:
1. Identify canonical route and page owner.
2. Identify section and component owner.
3. Find the exact markup/render function, CSS selectors and JavaScript behavior.
4. Search all imports, route consumers and usages of the component/class.
5. Identify service/API/database dependencies.
6. Record what must remain unchanged.

After editing:
1. Inspect the diff; no unrelated files or design changes.
2. Run `npm test` and `npm run build`.
3. Run relevant route and component tests.
4. Check the changed page and all consumers of shared code.
5. Check 320, 360, 390 and 430 CSS-pixel mobile widths, then tablet and desktop.
6. Record commit, CI/deploy evidence and remaining physical-device QA.

A build passing is not proof of visual or end-to-end correctness.

## 8. Design-system ownership

The design system owns canonical typography, semantic colors, spacing, sizing, radii, shadows, breakpoints, motion, icon conventions and reusable primitives.

Pages should consume tokens; they should not invent near-duplicate values without a documented reason. A feature may have local tokens only when the visual rule is genuinely feature-specific.

## 9. Backend boundaries

Backend modules own authorization, validation, business rules, data access and secure integration. Frontend visibility is never an authorization control.

A backend feature should document:
- route/endpoint and HTTP method;
- authentication and authorization requirements;
- request and response schemas;
- validation and error codes;
- service/business operation;
- repository/database tables or RPCs;
- storage/realtime effects;
- tests and migration dependencies.

For PLUITS Supabase-backed modules, distinguish browser-safe publishable configuration from secrets. Service-role keys and private credentials must never be shipped to frontend code.

## 10. VPS and environment portability

The Git repository is the source of truth. Do not make undocumented edits directly on production VPS.

Required environments:
- local/development;
- staging/test;
- production.

Keep environment-specific values outside source code. Document frontend build, backend process, reverse proxy, database, storage, DNS/TLS, backups, logs, monitoring and rollback. The deployment method may be GitHub Actions, container deployment or a documented release process; choose after the actual hosting architecture is known.

## 11. Current project-specific reality

PLUITS currently uses Vite and native JavaScript ES modules. It has one root `index.html` entry point and a hash-based router in `src/app/router.js`. Page modules return/compose markup and bind behavior; pages are not separate standalone HTML documents.

The repository already contains `src/pages`, `src/features`, `src/components`, `src/services`, `src/lib` and `supabase/migrations`. This standard does not require a framework rewrite. The target structure is an ownership guide for incremental evolution.

## 12. Related documents

- [Page, route and section registry](./PAGE-ROUTE-AND-SECTION-REGISTRY.md)
- [Design system and component standard](./DESIGN-SYSTEM-AND-COMPONENT-STANDARD.md)
- [Frontend/backend/VPS boundaries](./FRONTEND-BACKEND-AND-VPS-BOUNDARIES.md)
- [Existing frontend module map](./FRONTEND-MODULE-MAP.md)
- [Existing frontend module contracts](./FRONTEND-MODULE-CONTRACTS.md)
- [Application architecture](./PLUITS-APPLICATION-ARCHITECTURE.md)
