# PLUITS Automated Tests

- `architecture/`: folder ownership and dependency direction.
- `app/`: bootstrap, routes, navigation and deployment.
- `features/`: feature behavior.
- `services/`: data/service adapters.
- `contracts/`: frontend/service/backend contracts.
- `integration/`: cross-feature/service flows.
- `routes/`: canonical routes, aliases and route loading.
- `e2e/`: full browser journeys when a browser runner is configured.
- `visual/`: responsive and visual regression when a screenshot runner is configured.

A README-only test folder is a planned suite, not a passing test. Tests must not mutate production data.
