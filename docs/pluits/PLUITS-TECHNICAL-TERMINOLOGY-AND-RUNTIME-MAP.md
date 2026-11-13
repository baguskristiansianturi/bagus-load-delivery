# PLUITS — Technical Terminology and Runtime Map

**Purpose:** explain the current application in standard web-development terms so the product owner can navigate work without learning programming syntax. This document maps only source that exists today. A named boundary is not proof that it has already been extracted into a separate file.

## 1. Standard terms used in this repository

| Standard term | Meaning in PLUITS | Where to inspect |
|---|---|---|
| HTML document / application shell | The single browser document that hosts the application | `index.html` |
| SPA (Single-Page Application) | One document whose visible page changes through client-side routing | `src/main.js`, `src/app/router.js` |
| Route | URL/hash that selects a view or page state | `src/app/router.js`, `src/components/social/navigation-routes.js` |
| Page controller / page module | Builds a page's markup and binds page behavior | Files under `src/pages/` |
| Template / markup renderer | JavaScript function that returns HTML markup for insertion into the application shell | Page and feature `.js` files |
| Runtime | JavaScript executing after the page loads: startup, route resolution, rendering, event binding, data loading and state updates | `src/main.js`, router, page controllers, feature modules |
| Event handler | Function responding to click, submit, input, keyboard or other browser events | Page/feature JavaScript |
| Component | Reusable UI unit with a defined purpose and interface | `src/components/`, `src/features/` |
| Feature module | Domain-specific UI/behavior, for example post actions or inbox sidebar | `src/features/` |
| Stylesheet | CSS rules for global, page or component presentation | `src/style.css`, page and feature CSS |
| Design token / CSS custom property | Named reusable design value such as color, spacing or radius | CSS `:root` and scoped custom properties |
| Service / data-access module | Code communicating with backend, storage or external APIs | `src/services/`, `src/lib/`, and currently some page controllers |
| Dependency / consumer | A module that imports, calls or uses another module/selector/token | Imports, function calls, CSS selectors and route references |
| Code splitting / dynamic import | Loading a page module when its route is selected | `import()` calls in `src/app/router.js` |
| Route alias | Alternate URL normalized to the same canonical route | `src/app/router.js` |

## 2. Current runtime flow

```text
index.html
  └── src/main.js
      ├── imports global/shared CSS
      ├── initializes application dependencies
      └── starts route()
          └── src/app/router.js
              ├── reads location.hash
              ├── matches canonical route or alias
              ├── dynamically imports page controller
              ├── calls page markup renderer
              ├── inserts markup into #app
              ├── schedules page data/event binding
              └── updates page SEO metadata
```

This is a Single-Page Application. Page views are generally rendered by JavaScript template functions; there is not a separate standalone HTML document for every route. The exact runtime owner is recorded in the Page Directory.

## 3. Current icon sources — distinct registries, not yet one canonical system

| Source | Current role | Notes |
|---|---|---|
| `src/components/common/social-icons.js` | Social SVG path registry and `socialIcon()` renderer | Used by Social navigation and several social/inbox modules; exact full consumer list still requires import/call-site audit |
| `src/components/common/icons.js` | Legacy/general inline SVG object named `icon` | Contains common symbols such as search, heart, cart, user, location, menu and others |
| `src/app/ui.js` | Another inline SVG icon map plus legacy application shell helpers | Contains overlapping symbols such as location, truck, store, menu, search, cart, heart and user; duplication is present |
| `public/icons.svg` | Static SVG symbol sprite asset | Symbol IDs and all runtime consumers need a separate reference audit |

**Important:** these are observed source registries, not an approved final icon architecture. Do not silently add an icon to a random registry or replace icons across the application. Before changing an icon, identify its renderer, name/key, consumers, CSS sizing/stroke rules and whether the visual asset is an inline SVG, sprite symbol or image.

Standard terms: **icon**, **icon set**, **SVG icon**, **icon registry**, **icon renderer**, **sprite sheet**, **icon size**, **stroke width**. If PLUITS uses a special visible label for a component, document it as a PLUITS alias beside the standard term.

## 4. Contacts, people and conversations are different concepts

| Standard term | Current PLUITS meaning | Current source owner |
|---|---|---|
| Contact / Inbox Contact | Person shown as an existing or available messaging contact | `src/pages/messages/index.js` |
| Contact List | List of contacts available to start a conversation | `src/pages/messages/index.js` |
| Online Contact Strip | Horizontal strip of contacts currently online | `src/pages/messages/index.js` |
| Conversation List / Thread List | Existing message conversations | `src/pages/messages/index.js` and `src/features/inbox/inbox-sidebar.js` |
| Conversation / Message Thread | Active one-to-one message exchange | `src/pages/messages/index.js` |
| Message Composer | Input and send controls for a message | Currently composed inside `src/pages/messages/index.js`; separate extraction not yet verified |
| People Recommendations | Suggested people to connect with; not necessarily messaging contacts | `src/features/discovery/people-recommendations.js` |
| People / User Search | Search for user profiles | Search behavior must be distinguished from Inbox contact filtering |

Do not use “Contact”, “People”, “Friend”, “Conversation” and “Message” interchangeably. They represent different data and user journeys. A People Recommendation card is not an Inbox Contact item.

## 5. Current CSS ownership levels

| Level | Current example | Impact |
|---|---|---|
| Global stylesheet | `src/style.css` | Can affect multiple workspaces and legacy selectors |
| Shared component stylesheet | `src/styles/brand.css`, `src/styles/social-components.css` | Affects every consumer of those shared selectors |
| Page stylesheet | `src/pages/messages/messages.css`, `src/pages/directory/directory.css` | Intended for a page/workspace; actual selector scope must still be checked |
| Feature stylesheet | `src/features/reels/reels.css`, `src/features/posts/post-actions.css` | Affects consumers of the feature component |
| Legacy large stylesheet | `src/pages/account/user-account.css`, `src/pages/account/circle-experience.css` | Broad selector surface; must be treated as higher-risk until scoped-selector audit is complete |

A file's directory does not guarantee isolation. CSS selectors can be global, generic or shared. Impact analysis must inspect selector names, import graph, markup classes and all consumers.

## 6. How to request work using standard names

Use this order:

```text
<Workspace> → <Page or Route> → <Section> → <Component>
```

Examples:
- `Social → Profile → Profile Header`
- `Social → Feed → Post Card`
- `Inbox → Inbox → Online Contact Strip`
- `Marketplace → Product Detail → Product Gallery`

The names after the workspace/page should use standard UI/product terminology where possible. If a PLUITS-specific alias is useful, write both names, for example **Online Contact Strip (PLUITS alias: Kontak Online)**.

## 7. Audit completeness and accuracy

This map identifies current source owners and known overlap. It does not claim that every icon consumer, CSS selector, contact flow, runtime event handler or backend call has already been exhaustively traced. Those are explicit audit tasks. Mark unverified relationships as **Audit required** rather than inventing a mapping.

No production runtime, design, route, database or user data is changed by this terminology map.
