# Offline Outbox

**Status:** Planned; DM outbox remains in Messages page.

**Target responsibility:** Queued operations, retry policy and idempotent delivery.

**Boundary:** Partition by user; queued content is not server-persisted.

This README tracks the planned module. It is not a runtime implementation. Extract only with a documented consumer, contract, regression tests and no production-data dependency.
