# PLUITS — Development Workflow and Environment Readiness

**Status:** workflow baseline implemented; hosted full-site preview and isolated Supabase branch remain gated.
**Last verified:** 13 November 2026
**Production baseline:** `main` at `4ef9fb96e8e942511879303f355a7336860c287f`

## 1. Environment separation

| Environment | Purpose | Source | Database | Deployment |
|---|---|---|---|---|
| Local development | Daily feature development | Working branch | Local Supabase when configured; never production by default | `npm run dev` |
| Pull request validation | Test candidate changes | PR head branch | No production DB credentials in CI | GitHub Actions build artifact; no Pages deployment |
| Hosted preview | Full-site browser testing | Approved development branch | Dedicated Supabase development branch | Separate preview host required |
| Production | Public PLUITS | `main` only | Live Supabase project | GitHub Pages |

## 2. Pull request workflow — implemented and verified

Workflow: `.github/workflows/deploy.yml`

For pull requests targeting `main`, it runs:
1. Checkout source.
2. Set up Node 22 and npm cache.
3. `npm ci`.
4. `npm test` (production surface checks plus Node test runner).
5. `npm run build`.
6. Verify `dist/index.html`.
7. Upload the Pages build artifact.
8. Skip the GitHub Pages deployment step.

Verified PR #8 run:
- Run: `43443790690`
- Commit: `9c78bb20aca2fe2e70ec9db91ab7e2c76c035dee`
- Result: success.
- Test step: success.
- Vite build: success.
- Build output verification: success.
- Artifact upload: success.
- Production deploy step: skipped.
- Artifact expires 24 hours after creation.

This artifact proves that the PR can build. It is **not** a public hosted preview URL and is not a substitute for route-by-route browser UAT.

## 3. Production deployment boundary

Production deployment runs only on:
- a push to `main`; or
- an explicit manual workflow dispatch.

A pull request event must never deploy to the production Pages environment. Merge to `main` is a release action and requires explicit product-owner approval after preview/UAT.

Current production URL:
`https://baguskristiansianturi.github.io/pluits/`

## 4. Hosted preview — not yet complete

GitHub Pages in this repository uses the official Actions deployment environment as a single production site. Deploying a PR artifact to that same Pages environment would replace or interfere with production. Therefore the PR workflow intentionally uploads an artifact and skips deployment.

A separate hosted preview requires one of:
- a separately configured preview host (for example, a dedicated Vercel/Netlify project with credentials); or
- a separate GitHub Pages preview repository/site with its own Pages environment.

Do not publish preview builds under the production Pages environment. Do not place preview credentials or service-role secrets in client-side Vite variables.

## 5. Supabase backend environments

Live project:
- Project ref: `ytndswhqxayqpftszwfh`
- Region: `ap-southeast-1`
- PostgreSQL: 17
- Status at last inspection: `ACTIVE_HEALTHY`
- No Supabase development branches currently exist.

A dedicated Supabase branch named `pluits-development` was requested through the management API, but Supabase requires explicit cost confirmation first. The quoted branch compute cost is **US$0.01344 per hour** (recurring hourly, before any applicable additional usage). No branch was created.

Do not connect preview builds to production data. Once the owner approves the recurring branch cost, create the isolated Supabase branch, apply only a reconciled migration history, configure preview Auth URLs and test identities, and keep production secrets separate.

## 6. Migration gate — blocks backend environment promotion

The live database records 97 migrations; repository `main` has 90 migration SQL files. Nine Blog migration SQL sources remain unavailable in all inspected repository branches and path history. Twenty-one other live records need exact content/order reconciliation. Two repository migration files have no exact live-name match.

Until resolved:
- do not replay the stale manifest from PR #3;
- do not reset or push migrations to live;
- do not invent historical SQL;
- do not treat the production schema export as proof of original migration contents;
- do not mark local Supabase replay as passing.

A canonical mapping must record repository file, live version/name, exact SQL equivalence or documented semantic replacement, order, evidence and reviewer status. Then replay on an empty local database and compare schema, functions, policies, triggers, extensions and storage setup.

## 7. Backend readiness

Live Supabase is reachable and reports healthy, but operational readiness is **conditional**, not complete:
- RLS is enabled on all 68 public tables.
- Critical GeoDirectory media policy correlation defect requires a forward fix and cross-entity regression tests.
- Public product/variant table policies need to match the online-sales eligibility condition used by the public catalog.
- Public post-to-directory relation policy must enforce public visibility and published moderation status.
- Review SECURITY DEFINER function grants/search_path, storage object policies, Auth redirect settings, and realtime subscriptions.
- Enable leaked-password protection after confirming desired Auth policy.
- Do not deploy Edge Functions unless server-only secrets, webhooks, scheduled work or trusted outbound integrations actually require them.

## 8. Local developer start

Prerequisites: Node.js 22 and npm.

```bash
npm ci
npm test
npm run build
npm run dev
```

Vite base path is `/pluits/` for GitHub Pages. Local dev server uses the root path; verify both local routes and the deployed base path. Current scripts do not yet provide a verified one-command local Supabase bootstrap. Do not point local work at the live project by default.

## 9. Definition of ready to begin feature development

The architecture/workflow foundation is ready to support **isolated frontend work** when:
- work is done on a feature branch;
- PR CI passes;
- changes are previewed without touching production;
- component/route registries and reuse policy are followed.

The complete product/backend release foundation is ready only after:
- hosted full-site preview URL exists and all canonical routes are tested on mobile and desktop;
- isolated Supabase development branch or verified local Supabase setup exists;
- migration history is reconciled and empty-database replay passes;
- critical RLS findings are corrected in forward migrations and cross-role regression tests pass;
- production secrets and preview credentials are separated;
- release approval and rollback procedure are documented and tested.

**Current overall status:** PR CI passes; hosted preview and isolated backend environment are blocked by separate hosting setup and Supabase branch cost confirmation; migration/security gates remain open. Do not label PLUITS fully release-ready.
