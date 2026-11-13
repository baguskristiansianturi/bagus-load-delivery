# PLUITS Source Structure

| Folder | Responsibility | Status |
|---|---|---|
| `app/` | Bootstrap, router, guards and application lifecycle | Active |
| `config/` | Environment parsing and non-secret configuration | Scaffolded |
| `pages/` | Route-level screen composition | Active; some controllers need decomposition |
| `features/` | User-facing domain behavior, state and scoped UI | Mixed: active and planned modules |
| `components/` | Shared accessible UI; no domain data fetching | Active and scaffolded |
| `design-system/` | Tokens, typography, icons, motion and visual foundations | Scaffolded; existing CSS remains authoritative |
| `services/` | Data repositories, Auth, Storage, Realtime and offline operations | Mixed |
| `lib/` | SDK clients and low-level library adapters | Active; one shared Supabase client |
| `platform/` | Browser and future native adapters | Scaffolded; no native runtime |
| `styles/` | Truly global CSS | Active |
| `assets/` | Bundled assets processed by Vite | Active |

## Dependency direction
`pages → features → components/design-system`
`pages/features → services → lib/platform`

Pages own routes and compose features. Features own user-facing behavior/state. Shared components never fetch domain data. Services never render HTML or access page DOM. Feature-to-feature integration uses explicit public exports, not private file imports.

A README-only module is a roadmap marker, not a working feature. It must not be imported by the router or presented as implemented.
