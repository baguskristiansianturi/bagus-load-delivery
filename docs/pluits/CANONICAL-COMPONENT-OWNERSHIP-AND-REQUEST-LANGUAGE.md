# PLUITS — Canonical Component Ownership & Change Request Language

**Status:** Active engineering contract  
**Purpose:** Let the product owner request a change by naming the component, without needing to know its page, route, source file, or CSS file.

## 1. The rule

A component name identifies its canonical owner, not the page where it happens to appear.

If the product owner says **“perbaiki Post Instagram”**, engineering must locate and change the one canonical Instagram Post component. Every supported consumer must use that same public component contract. The owner must not make a page-specific copy or silently patch only the currently visible instance.

The page/workspace is not required when the component name resolves to exactly one registered owner.

## 2. Resolve a request before editing

For every request:

1. Extract the component or feature name and the requested outcome.
2. Look it up in the Component Ownership Registry in section 5 and the live source/import graph.
3. If exactly one canonical owner matches, change that owner and inspect every consumer.
4. If multiple distinct owners match, stop and ask one short disambiguating question before editing.
5. If no registry entry exists, inspect the codebase and determine whether the component already exists under another name. Do not invent a new owner or assume a page from context.
6. If the requested phrase names a broad family (for example, “sidebar”) and several owners exist, ask which workspace/role it refers to.
7. Confirm the target in the work summary before implementation. Do not ask the product owner to provide technical paths or filenames.

**Never guess.** A wrong-scope edit is worse than one clarification question.

## 3. Naming and uniqueness

- Use stable, human-readable canonical names: 'Instagram Post', 'Story Card', 'Product Card', 'Friends Search', 'Product Search', 'Inbox Sidebar', 'Seller Sidebar'.
- Keep a distinct canonical name for components with different purpose, behavior, data contract, ownership or workspace, even if they look alike.
- Do not create two canonical owners with the same unqualified name.
- If a generic term legitimately has multiple owners, the registry must list the qualified names and mark the generic term as ambiguous. Example: 'Sidebar' → ask whether 'Inbox Sidebar', 'Seller Sidebar', 'Marketplace Sidebar', or another registered sidebar.
- Aliases and common phrases may point to one canonical name, but aliases must never merge separate owners.
- A rename updates the registry, documentation, exports and call sites together; retain a documented alias when useful for older language.

## 4. Component boundary and reuse

A canonical component owns its markup, component-level presentation, namespaced styles, accessibility, responsive behavior, loading/empty/error states, and local interactions appropriate to that component.

A component does **not** automatically own page-level data fetching, authentication, permissions, or business rules. Those remain with the appropriate page controller, feature/domain layer, service or backend and are supplied through documented inputs and callbacks.

For example, 'Instagram Post' can own its profile header, media, caption, metadata and engagement controls as one coherent public component. It must not own the page navbar, global bottom navigation or unrelated page sections.

Pages compose canonical components; they do not fork their implementation. Internal subcomponents may be private to the canonical owner. Extract a separate public component only when it has independent purpose, behavior, meaningful complexity, reuse or test needs. Avoid both duplicated implementations and an oversized universal component.

When the same component appears in different contexts:
- Reuse one canonical implementation when purpose and behavior are the same.
- Use explicit, documented variants for presentation differences that do not change its core purpose or behavior.
- Create separate canonical components when purpose, behavior, contract or workspace ownership differs.
- Preserve existing approved layout and visual behavior unless the request explicitly asks to change them.

## 5. Initial Component Ownership Registry

This is the naming contract and initial ownership map. File paths below are canonical targets/owners only when verified in the source; entries marked **Audit required** must be mapped to actual source files before implementation. Do not treat a proposed path as proof that the component already exists there.

| User-facing name | Canonical owner / domain | Scope rule | Status |
|---|---|---|---|
| Instagram Post / Post Konten Instagram | Posts feature | One shared post component across all consumers; excludes page navigation | Audit required |
| Story Card | Stories feature | Story presentation only; excludes page-level story rail/container | Audit required |
| Profile Header / Profile Hero | Profile feature | Profile identity/hero component; not the entire profile page | Existing partial extraction; audit required |
| Friends Search / People Search | People/Friends feature | People discovery and friend lookup only | Audit required |
| Content Search | Content discovery feature | Posts, stories and other content lookup only | Audit required |
| Product Search | Marketplace catalog/search feature | Product catalog lookup and commerce filters only | Audit required |
| Contact Search / Inbox Search | Inbox feature | Conversation/contact lookup only | Audit required |
| Product Card | Marketplace product/catalog feature | Product presentation; not seller card or service card | Audit required |
| Seller Card | Seller/Marketplace domain | Seller identity/presentation; distinct from Product Card | Audit required |
| Service Card | Services/Directory domain | Service offering; distinct from product and destination cards | Audit required |
| Destination Card | Directory/Trip domain | Destination/place presentation | Audit required |
| Social Navigation | Social shell (components/social) | Global social routes only | Existing owner; verify consumers |
| Marketplace Navigation | Marketplace workspace | Marketplace-specific navigation only | Audit required |
| Seller Sidebar / Seller Navigation | Seller feature | Seller workspace only | Existing extraction; verify consumers |
| Inbox Sidebar | Inbox feature | Conversation workspace only | Existing extraction; verify consumers |
| Admin Navigation | Admin workspace | Moderation/admin only | Audit required |
| Sidebar (unqualified) | No single owner | Ambiguous whenever more than one sidebar is registered; ask which one | Ambiguous by design |

The registry must be expanded from source audits, not assumptions. New entries must include a canonical name, owner, public contract, actual source path, consumers, styles, dependencies, test coverage and status.

## 6. Search ownership rule

Search components are separate by intent, not merely by their visual input field:

- 'Friends Search' — people/friend discovery.
- 'Content Search' — posts and other content.
- 'Product Search' — marketplace products and commerce filters.
- 'Contact Search' — Inbox conversations and contacts.

They may share a low-level input primitive only if its API, accessibility and behavior genuinely match. Each search feature owns its own filters, query semantics, result rendering, loading/empty/error states and domain-specific behavior. Changing one search must not alter another search's behavior or styling.

## 7. Required change report

Before implementation, state in ordinary language:
- **Target:** canonical component name.
- **Owner:** feature/workspace that owns it.
- **Consumers:** pages/features that use it and may be affected.
- **Boundary:** what is included and excluded.
- **Preservation:** approved layouts and unrelated components that must not change.

After implementation, report changed files, tests, build, commit, workflow/deployment and what was not physically tested. Never claim a deployment or UAT that was not verified.

## 8. Migration policy

Apply this contract incrementally. Start by auditing the current Instagram Post implementation and its consumers, then extract or consolidate only the canonical Post component boundary. Preserve the approved full-width carousel/media behavior. Do not mass-rewrite page controllers, search features, sidebars or unrelated layouts as part of that first extraction.

After Post is established, audit and register search types, then other repeated components. Every extraction must include a caller/import/CSS/dependency audit and consumer regression checks.