# Posts

**Status:** Canonical shared post-card renderer and action controls implemented; composer, comment flows and feed data orchestration remain in page controllers.

## Public API
- `src/features/posts/index.js` exports `renderPostCard` and `renderPostActions`.
- `renderPostCard(post, helpers)` is presentational. The page supplies hydrated post data, current viewer, avatar/icon helpers, and action renderer.
- Feature does not fetch data, query Supabase, or own route state.

## Card standard
- Shared full-width card for signed-in Explore/Circle feeds and Profile post feed.
- Display name beside a larger avatar; username remains secondary.
- Instagram-style media presentation preserves the source aspect ratio and constrains tall media to the viewport.
- Like, comment, share and save are icon-only controls; counts are shown in the content area below the caption.
- Caption is plain text, capped at 50 words in the card only.
- Relative Indonesian timestamp; media download controls are suppressed where supported by the browser.
- Card footer keeps standard breathing room from the bottom divider.

## Boundaries
Feed/page controllers own ordering, hydration, authorization and event handling. The card renderer owns shared markup and visual contract. Public guest-home feed is still rendered by `pages/home` and remains a separate migration target; do not claim it uses the canonical card until migrated and tested.
