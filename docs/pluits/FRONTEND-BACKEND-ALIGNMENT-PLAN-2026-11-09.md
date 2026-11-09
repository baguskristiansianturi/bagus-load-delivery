# PLUITS — Frontend / Backend Alignment Plan

**Tanggal:** 9 November 2026  
**Status:** SPECIFIED — implementation is incremental  
**Priority:** Social First Release P0

## 1. Current implementation observation

The app uses Vite and hash routes in `src/app/router.js`. Account, Seller Center, Marketplace, Trip, Directory, Messages and Moderation are separated into page modules. The current pages contain direct Supabase queries and some local presentation/state logic. This plan does not authorize a full rewrite.

The target is one canonical session/client layer and one service boundary per domain. Existing routes and working UI are preserved while data access is extracted.

## 2. Route → domain contract map

| Current route | Page owner | Backend domain | Contract boundary | Release status |
|---|---|---|---|---|
| `/`, `/account/explore` | Home / Account | Social feed | published post visibility, profile context, media access | P0 |
| `/@username`, `/account/profile` | Account | Identity/profile/privacy | profile read/write, visibility, username uniqueness | P0 |
| `/account/compose`, `/account/post/:id` | Account | Social content | upload ownership, post lifecycle, media gallery | P0 |
| likes/comments/replies/saves | Account | Social interactions | canonical parent visibility, content preferences, ownership | P0 |
| follow/followers/following | Account | Social graph | pending/accepted/removed relationship state | P0 |
| `/messages` | Messages | Conversations | participant-only read/write, block and follow restrictions | P0 |
| activity/notifications | Account | Activity | recipient-only rows, read receipts, announcements | P0 |
| `/seller`, `/seller/register` | Seller | Store and membership | owner/staff permissions, verification lifecycle | Existing; align after P0 security |
| `/places`, `/place/:id` | Directory | GeoDirectory | public entity status, membership/claim, media moderation | Existing; security gate |
| `/marketplace`, `/shop/:slug` | Marketplace | Catalog | published listing, seller visibility, price/stock | Later release |
| `/market-cart`, `/market-checkout`, `/market-order/:id` | Marketplace | Orders/payments | server price validation, idempotent order, payment lifecycle | Later release |
| `/trip`, `/trip/itinerary/:id` | Trip | Trip services | public itinerary and request lifecycle | Later release |
| `/admin/moderation` | Moderation | Trust/operations | admin/moderator server authorization, audit trail | P0 supporting control |

## 3. Frontend service contracts

### Shared platform
- `supabase/client.js`: exactly one browser client, environment-safe URL/key configuration, no service-role key.
- `app/session.js`: one auth-state subscription and current session/user source.
- `app/permissions.js`: presentation helpers only; never a substitute for RLS.
- `app/errors.js`: normalize network, validation, auth, authorization, conflict, rate-limit and unknown errors.
- Domain service functions return explicit `{ data, error }` or throw normalized errors consistently; never swallow an authorization error as empty data.

### Social
- Feed: `listFeed({cursor, viewerContext})`; visibility remains backend-owned.
- Post: `createPost(input)`, `updatePost(id,input)`, `deletePost(id)`.
- Media: `uploadPostMedia(file,postId)`, `removePostMedia(id)`; validate size/type before upload and enforce ownership on backend.
- Interactions: `setPostLike(postId, liked)`, `createComment(postId,input)`, `setCommentLike(commentId,liked)`, `setPostSaved(postId,saved)`.
- Graph: `followUser(userId)`, `respondToFollowRequest(requestId,decision)`, `unfollowUser(userId)`, `listFollowers(userId,cursor)`.
- Every read of child data must be constrained by the same canonical parent post visibility rule. Do not infer access from knowing a UUID.

### Messaging and activity
- `listConversations(cursor)`, `listMessages(conversationId,cursor)`, `sendMessage(conversationId,input)`.
- Message send uses a client-generated idempotency key; retry cannot create duplicate messages.
- Offline queue is explicitly local and pending; it must never be displayed as sent before backend acknowledgement.
- Notification list and unread count are recipient-scoped; realtime is only an update channel.

### Seller and GeoDirectory
- Store lifecycle, membership and entity claim actions use backend RPCs/constraints; client does not write status/verification fields directly.
- User's legal form is optional where product decision D-005 allows; physical/operational presence and responsible party are verified with privacy safeguards.
- Directory media permissions are checked against the entity on the current row, not any membership on any entity.

### Marketplace and Trip
- Product price, stock, minimum order, delivery fee, permissions, total and lifecycle transitions are calculated/validated server-side.
- Order submission must be idempotent; frontend cannot set paid/settled/fulfilled states directly.
- Trip requests use backend lifecycle; itinerary visibility follows publication and access rules.

## 4. Frontend state contract

Every asynchronous surface has:
- Initial/loading state.
- Empty state with a truthful next action.
- Success state based on persisted backend response.
- Validation error state tied to the input.
- Authorization state that does not leak protected data.
- Network/offline state and retry behavior where safe.
- Conflict/idempotency state for concurrent or repeated actions.

Never display fabricated counts, prices, balances, stock, verified status, payment completion, delivery completion, or successful posting.

## 5. Refactor order

1. [x] Audit existing page-level Supabase client initialization.
2. [x] Create one shared browser client at `src/lib/supabase/client.js`; route account, seller, marketplace, trip, messages, directory, moderation, and home through it.
3. [ ] Audit auth-state listeners and establish one session owner; the shared client alone does not prove listener deduplication.
4. [ ] Extract account/profile services and preserve all existing account paths.
4. Extract Social post/media/interactions/follow services; add direct API negative tests.
5. Extract Messaging/activity services and verify realtime/offline semantics.
6. Extract moderation/admin operations and server-side role checks.
7. Align Seller Center and GeoDirectory against D-005 and the security findings.
8. Only after Social UAT, refactor Marketplace and Trip service boundaries.
9. Remove old query paths only after all callers/tests are migrated.

## 6. Regression checklist
- Login, email confirmation, logout and session refresh.
- Public and private profile; owner, accepted follower, unrelated user.
- Post publish/edit/delete and photo/video media ownership.
- Like/unlike, comment/reply, comment-like, save/unsave.
- Follow request/accept/decline/unfollow and block both directions.
- DM read/write, idempotent retry, offline draft and reconnect.
- Notifications only to intended recipient.
- Moderation action only for authorized admin/moderator.
- No private address or precise location leaks into public profile/feed.
- Seller membership cannot grant access to another store/entity.
- Marketplace order total/status cannot be forged by client.
- All tests run on disposable local data; production remains unchanged.
