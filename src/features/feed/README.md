# Feed Feature

**Status:** planned extraction; not an independent runtime module yet.

Current runtime owners:
- Public visitor feed: `src/pages/home/` and `src/features/public-home/`
- Signed-in feed: `src/pages/account/`

Target responsibility: feed composition, ranking inputs, feed item states and feed-specific interactions. Preserve current route and data behavior during extraction. Do not duplicate either current feed.
