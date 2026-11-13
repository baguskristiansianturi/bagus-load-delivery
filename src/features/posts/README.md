# Posts

**Status:** Partially implemented; post actions are extracted, while composer and other flows remain in Account.

**Current runtime owner:** `src/pages/account/` and `src/features/posts/`.

**Target responsibility:** Post composition, cards, comments and post-specific interactions.

**Implementation boundary:** Reuse media contracts; feed owns ordering; social saves are not product wishlist.

This README records the planned module boundary only. It does not imply runtime implementation or a new route. Keep current working behavior in its existing owner until extraction has consumer mapping, regression tests and review.
