# PLUITS — Development Workflow and Environment Readiness

**Status:** PR validation and frontend module-boundary verification are implemented and CI-tested. Hosted full-site preview and isolated backend environment are not configured.
**Last verified:** 13 November 2026 — branch commit `1219fe3f7c91acdda827cf62ee793d6f817ec402`
**Production baseline:** `main` at `4ef9fb96e8e942511879303f355a7336860c287f`

## 1. Environment separation

| Environment | Purpose | Source | Database | Deployment |
|---|---|---|---|---|
| Local development | Daily feature development | Working branch | No production database by default | `npm run dev` |
| Pull request validation | Test candidate changes | PR head branch | No production DB credentials in CI | GitHub Actions artifact; no Pages deployment |
| Hosted preview | Full-site browser testing | Approved development branch | Isolated development backend required for data flows | Separate preview host required |
| Production | Public PLUITS | `main` only | Live Supabase project | GitHub Pages |

## 2. Pull request workflow — implemented

Workflow: `.github/workflows/deploy.yml`

For pull requests targeting `main`, it runs:
1. Checkout source.
2. Set up Node 22 and npm cache.
3. `npm ci`.
4. `npm test`.
5. `npm run build`.
6. Verify `dist/index.html`.
7. Upload the Pages build artifact.
8. Skip the GitHub Pages deployment step.

Latest verified PR run:
- Run: [43446620778](https://github.com/baguskristiansianturi/pluits/actions/runs/43446620778)
- Commit: `1219fe3f7c91acdda827cf62ee793d6f817ec402`
- Result: **success**.
- Production-surface verification: success.
- Module-boundary verification: success across 53 JavaScript modules.
- Node test suite: 39 passed, 0 failed.
- Vite production build: success; `dist/index.html` verified.
- Pages artifact upload: success.
- Production deploy step: skipped.
- Artifact ID: `14047364889`; expires 14 November 2026 at 14:50 UTC.

This confirms the current PR commit builds and passes the automated tests. It does not prove Android browser UAT or a hosted preview.

## 3. Modular frontend structure

The architecture follows conventional ownership:
- `app/`: application bootstrap, routing and lifecycle.
- `config/`: non-secret environment configuration and flags.
- `pages/`: route-level composition.
- `features/`: domain behavior and feature UI.
- `components/`: reusable shared UI.
- `design-system/`: design tokens and visual primitives.
- `services/`: backend/data access, Storage, Realtime and cache.
- `lib/`: SDK and library adapters.
- `platform/`: browser/native platform adapters.
- `styles/`: global styles only.
- `tests/`, `scripts/`: automated checks and developer tooling.

The current branch now tracks README scaffolding for target folders that do not yet have runtime implementations. Each README identifies the existing runtime owner. A folder or README is not proof that a feature has been implemented.

`scripts/verify-module-boundaries.mjs` is added to check dependency direction. `npm test` invokes it alongside the existing production-surface verification and Node tests. The guard prevents shared components/services/library adapters from importing higher-level UI and prevents private direct imports between feature modules. Feature-to-feature reuse must go through an explicit `src/features/<feature>/index.js` public entry point. The first two consumers now use public entry points for Profile image framing and the App Download section.

The existing runtime is still being modularized incrementally. In particular, the architecture audit identified multiple page controllers that instantiate Supabase independently despite the shared client. Consolidate these only as a tested domain-by-domain refactor; do not mass-move files.

## 4. Production deployment boundary

Production deployment runs only on:
- a push to `main`; or
- an explicit manual workflow dispatch.

A pull request event must never deploy to the production Pages environment. Merge to `main` is a release action and requires explicit product-owner approval after preview/UAT.

Current production URL:
`https://baguskristiansianturi.github.io/pluits/`

## 5. Hosted preview — not configured

GitHub Pages in this repository uses one Actions deployment environment for the production site. Deploying a PR artifact to that same Pages environment would replace or interfere with production. Therefore PR validation uploads an artifact and skips deployment.

The artifact is downloadable from GitHub Actions but is not a public browser preview URL. A full-site preview requires a separate host or a separate GitHub Pages site/repository with its own deployment environment. No separate host credentials or preview environment are currently configured. Do not invent a preview URL and do not publish a preview into the production Pages environment.

## 6. Supabase backend environments — no-cost constraint

Live project:
- Project ref: `ytndswhqxayqpftszwfh`
- Region: `ap-southeast-1`
- PostgreSQL: 17
- Last inspected status: `ACTIVE_HEALTHY`
- No Supabase development branches exist.

Supabase quoted recurring compute cost of **US$0.01344 per hour** for a development branch. The owner declined cost-incurring setup. **No branch was created and no paid development environment will be provisioned.**

Do not connect preview builds or local work to production data by default. Use only a genuinely no-cost local backend setup if its prerequisites are available; otherwise keep backend-dependent testing gated rather than silently using production.

## 7. Migration gate — blocks backend environment promotion

The live database records 97 migrations; the repository contains 90 migration SQL files. Nine Blog migration SQL sources remain unavailable in all inspected repository branches and path history. Other live records still require exact content/order reconciliation.

Until resolved:
- do not replay the stale manifest from PR #3;
- do not reset or push migrations to live;
- do not invent historical SQL;
- do not treat a production schema export as proof of original migration contents;
- do not mark local Supabase replay as passing.

A canonical mapping must record repository file, live version/name, exact SQL equivalence or documented semantic replacement, order, evidence and reviewer status. Then replay on an empty local database and compare schema, functions, policies, triggers, extensions and storage setup.

## 8. Backend readiness

Live Supabase is reachable and reports healthy, but operational readiness is **conditional**, not complete:
- RLS is enabled on all 68 public tables.
- Critical GeoDirectory media policy correlation defect requires a forward fix and cross-entity regression tests.
- Public product/variant table policies need to match the online-sales eligibility condition used by the public catalog.
- Public post-to-directory relation policy must enforce public visibility and published moderation status.
- Review SECURITY DEFINER function grants/search_path, storage object policies, Auth redirect settings, and realtime subscriptions.
- Leaked-password protection remains a configuration hardening item.
- Do not deploy Edge Functions unless server-only secrets, webhooks, scheduled work or trusted outbound integrations actually require them.

No production schema, policy, user data or live Auth setting was changed as part of this workflow work.

## 9. Local developer start

Prerequisites: Node.js 22 and npm.

```bash
npm ci
npm test
npm run build
npm run dev
```

Vite base path is `/pluits/` for GitHub Pages. Local dev server uses the root path; verify both local routes and the deployed base path. The repository does not yet provide a verified one-command local Supabase bootstrap. Do not point local work at the live project by default.

## 10. Definition of ready

The modular frontend foundation is ready for incremental feature work when:
- work is done on a feature branch;
- PR CI passes including module-boundary checks;
- current and target module owners are recorded;
- existing components and route contracts are reused;
- changes are previewed without touching production.

The full development/release loop is complete only after:
- a no-cost hosted full-site preview path is configured and canonical routes can be tested on mobile and desktop;
- a no-cost isolated backend path is available, or backend-dependent tests remain explicitly mocked/gated;
- migration history is reconciled and empty-database replay passes;
- critical RLS findings are corrected in forward migrations and cross-role regression tests pass;
- production secrets and preview credentials are separated;
- release approval and rollback procedure are documented and tested.

**Current overall status:** PR CI, module-boundary guard, 39 automated tests and production build pass on commit `1219fe3`. Modular target folders are scaffolded, but several runtime controllers and data-access paths still need incremental extraction. Hosted preview and isolated backend environment are not configured. Migration/security gates remain open. Do not label PLUITS fully release-ready.
