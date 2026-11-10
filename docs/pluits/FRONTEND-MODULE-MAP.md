# PLUITS Frontend Module Map

This file is the working directory of the frontend. Use it before editing so each feature has one clear owner and a predictable screen location.

## Screen and route ownership

| User-facing area | Route | Main controller / feature files | Visible position |
|---|---|---|---|
| Public home | `#/` | `src/pages/home/index.js` | Public landing/feed |
| Signed-in Explore | `#/account/explore` | `src/pages/account/index.js` | Main social feed |
| Profile | `#/account/profile`, `#/@username` | `src/pages/account/index.js` | Profile identity and tabs |
| Edit profile | `#/account/profile/edit` | `src/pages/account/index.js` | Opened from profile three-dot menu |
| Account settings | `#/account/settings` | `src/pages/account/account-context.js` | Opened from profile three-dot menu |
| Inbox / DM | `#/messages` | `src/pages/messages/index.js`, `messages.css` | Conversation list and chat |
| Notifications | `#/account/activity` | `src/pages/account/index.js` | Activity list; bell badge in shared navigation |
| Reels | `#/account/reels` | `src/pages/account/index.js`, `src/features/reels/*` | Vertical short-video feed |
| Post composer | `#/account/compose` | `src/pages/account/index.js`, `src/features/media/*` | Create Post |
| Reel composer | `#/account/reel` | `src/pages/account/index.js`, `src/features/media/*` | Create one short video |
| Story | `#/account/story` | `src/pages/account/index.js`, shared media feature | Story creation/viewer |
| Search | `#/search` | `src/pages/search/*` | Discover people and content |
| GeoDirectory | directory routes | `src/pages/directory/*` | Places and providers |
| Marketplace | marketplace routes | `src/pages/marketplace/*` | Catalog, product, cart and checkout |
| Trip | trip routes | `src/pages/trip/*` | Trip discovery and booking |
| Seller workspace | seller routes | `src/pages/seller/*` | Store management |

## Component ownership (change only at the owning location)

| Small feature | Owning file | Does not own |
|---|---|---|
| Bell icon and unread badge placement | `src/components/social/navigation.js` + `src/styles/social-navigation.css` | Notification query/data |
| Notification list and read state | account activity controller | Header layout |
| DM icon and navigation entry | shared social navigation | Message persistence |
| Conversation UI and voice note recorder | `src/pages/messages/index.js` + `messages.css` | Global social nav |
| SVG paths | `src/components/common/social-icons.js` | Icon placement |
| Media file type detection | `src/features/media/media-types.js` | Upload or page markup |
| Supabase media upload | `src/features/media/storage-upload.js` | File picker and preview |
| Reel card markup | `src/features/reels/reel-card.js` | Feed ranking/query |
| Reel appearance and responsive layout | `src/features/reels/reels.css` | Other feed/post styles |
| Feed ranking and data | account feed controller | Reel card markup |
| Profile editor and settings routing | account controller + `account-context.js` | Global navigation contract |

## Change isolation rules

1. Identify the smallest owner above before changing a feature.
2. Keep route/data orchestration in page controllers; keep UI component markup and feature logic in their feature modules.
3. Do not add feature-specific CSS to global styles. Use a namespace and feature stylesheet.
4. Do not replace shared navigation to fix a local screen.
5. Add a regression test for each feature contract and one sibling-screen test for any shared dependency.
6. Test at 320, 360, 390 and 430 CSS px before desktop. Mobile layout and interaction are the release gate; desktop is secondary.
7. No deploy is complete until the production verifier, Vite build and Pages workflow all pass.
