# Agent instructions — Pluits

## Mandatory first read
1. Read MASTER/AI-START-HERE.md and the entire MASTER/BUSINESS-MODEL-MASTER.md before analysis or changes.
2. Read MASTER/PLUITS-AI-GOVERNANCE.md, MASTER/DECISION-LOG.md, and MASTER/PROJECT-STATUS-ROADMAP.md.
3. Read SOP/README.md and the SOPs relevant to the task.
4. For Social Media, read MASTER/PLUITS-SOCIAL-FIRST-RELEASE-SPEC.md and MASTER/PLUITS-USER-TESTING.md.
5. Read relevant technical/security/UAT specifications and inspect the latest code/runtime evidence.
6. Read IDEAS/IDEA-BACKLOG.md to understand unapproved ideas. Never implement an idea merely because it is recorded there.

## Authority
- Business Model Master is the single authority for approved business and product decisions.
- Idea Backlog is non-authoritative until the founder explicitly approves an idea.
- Project Status & Roadmap is the single delivery status source.
- Technical specifications explain implementation and may not silently redefine business rules.
- Code and database show actual implementation; they do not override the business model.

## Required change flow
Business decision → user journey and acceptance criteria → backend data/security/API contract → frontend route/components/states → tests → deployment evidence → founder UAT.
If a mismatch is discovered, document it and propose the smallest safe correction. Do not fake functionality.

## Safety and repository rules
- Pluits is live/published and has registered users; treat all current accounts, posts, media, messages and settings as production data.
- Social Media is the current P0 focus; do not start Café, Resto or additional experience verticals before founder UAT acceptance.
- Keep the project identity Pluits. Bagusin and Bali Trans are separate projects.
- Do not introduce another brand/repository/backend identity for this product.
- Do not expose secrets, personal data, test credentials, or private testing records.
- Do not delete applied migrations or production/user data.
- Before deleting files, inspect imports, routes, dynamic references, workflows, tests, and docs; move unique content first.
- No demo catalogue, fake reviews, fake orders, fake balances, fake engagement, or fabricated provider verification.
- Backend must enforce authorization; frontend visibility is not security.
- Do not make production/security/permission/credential changes without explicit authorization and a rollback plan.
- Preserve unrelated UI and behavior. Work mobile-first and keep modules maintainable.

## Evidence
Record exact commit SHA, workflow run, build/test result, deployment result, and UAT state. Distinguish IMPLEMENTED, DEPLOYED, TESTED, and ACCEPTED. A successful deployment is not proof of Android UAT.


## Page/component ownership — mandatory
- Before adding or changing a navigation page, read docs/pluits/PAGE-COMPONENT-OWNERSHIP-AUDIT-2026-11-12.md and docs/pluits/FRONTEND-MODULE-CONTRACTS.md.
- Every canonical route must have one explicit page owner; each workspace owns its own layout and sidebar. Seller Center navigation and Inbox conversation sidebar are separate feature components.
- Never edit a sibling page's component or CSS as a side effect. Shared component changes require a consumer audit.
- Keep page composition in pages/, behavior-rich domain UI in features/, true shared primitives in components/, backend communication in services/, and only truly global rules in styles/.
- Do not declare the application fully modular until the route/component/style/service ownership audit and regression tests support that claim.
