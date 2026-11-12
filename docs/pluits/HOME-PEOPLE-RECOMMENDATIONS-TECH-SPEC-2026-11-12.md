# PLUITS — Home People Recommendations & Feed Increment
**Tanggal:** 12 November 2026  
**Status:** Frontend implementation scope; no production schema changes.

## Approved experience
After the existing nearby section, retain the Beranda heading and filters, then show a horizontal **Orang yang Mungkin Anda Kenal** carousel. Each card links to the public profile and offers a real follow action. Followed, pending, blocked, self, and private profiles are excluded from this public recommendation rail. Newly created public profiles receive a temporary discovery boost for 14 days so new members can be found.

The carousel is followed by the existing composer and up to 30 feed posts. The feed fetches a bounded 60 newest candidate rows, removes blocked authors, then hydrates at most 30 posts. A compact **Temukan Lebih Banyak** section follows the feed. Existing downstream local marketplace and service sections remain unchanged.

## Recommendation signals in this increment
- Accepted follow graph: shared-follow network count (only an aggregate count is shown; names are not disclosed).
- Public profile city/province: coarse area relevance only.
- user_profiles.created_at: new-account boost for 14 days plus a 30-day freshness decay.
- Existing relationships, blocks, self, and non-public profiles are excluded.
- Ranking is deterministic and bounded; there is no contact-book access, phone-number matching, precise location inference, paid ranking, or hidden contact upload.

## Backend/security contract
- Reads use existing user_profiles, user_follows, and user_blocks tables under existing RLS. No new table, RPC, SECURITY DEFINER function, migration, or production data write is introduced.
- Public profile visibility is filtered in SQL and enforced again by RLS. Accepted follow edges are only visible under existing follow-table policy. Blocks and both-direction relationships are excluded before rendering.
- The follow button uses the existing user_follows insert/delete lifecycle. Existing database trigger sets public targets to accepted and private targets to pending; notification triggers remain the source of follow notifications.
- Only public avatar paths are signed in one bounded batch. No phone numbers, email addresses, exact coordinates, private profile data, or mutual-friend identities are returned to the UI.

## Performance and scaling
- Candidate profile query is capped at 60; mutual-edge query is capped at 300; recommendation output is capped at 10; signed avatar paths are batched.
- Feed candidate fetch is capped at 60, with only 30 posts passed to the existing hydration pipeline. This improves the chance of displaying 30 posts after block filtering without unbounded reads.
- The ranking runs client-side over a small bounded candidate set. No realtime subscription or per-card query is introduced.
- For a much larger social graph, move ranking to a narrowly scoped, indexed SQL/RPC read model only after query plans and workload measurements justify it. Any RPC must preserve RLS semantics, privacy, block exclusions, rate limits and abuse controls; do not expose a SECURITY DEFINER endpoint merely for convenience.

## Release validation
- Automated ranking tests cover privacy/relationship exclusions, new-account boost, mutual connections and empty/rendered UI.
- CI must run npm test, production build and GitHub Pages deployment.
- Founder Android UAT remains the acceptance gate for visual/interaction review and real follow behavior.
