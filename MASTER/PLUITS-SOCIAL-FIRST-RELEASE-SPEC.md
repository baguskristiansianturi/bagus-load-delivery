# PLUITS — SOCIAL-FIRST RELEASE SPECIFICATION

**Updated:** 8 November 2026  
**Priority:** P0 — Social Media is the only product area to complete and validate before Café, Resto, Marketplace expansion, or additional experience verticals.  
**Status vocabulary:** DECIDED / SPECIFIED / IMPLEMENTED / DEPLOYED / TESTED / ACCEPTED / BLOCKED / NOT TESTED.

## 1. Product focus and release gate

Pluits is already published and has a registered user. Treat the current application, accounts, posts, media, messages, and settings as production. Do not add demo mode, fake data, sample users, fake engagement, fake media, pretend notifications, or controls that look functional but have no backend action.

The next founder UAT release focuses on the Social Media experience. Do not start Café, Resto, or other experience verticals until the founder has tested and accepted the social release.

## 2. Core social scope

| Domain | Required user outcome | Current evidence/status |
|---|---|---|
| Photo/video publishing | Select media on device, preview, upload with progress, publish, edit, delete, persist after refresh | IMPLEMENTED base; 50 MB/file and up to 15 media; Android real-file UAT NOT TESTED |
| Feed and profile | Responsive media feed, profile grid, Stories/Reels entry, public/private visibility | IMPLEMENTED base; UAT NOT TESTED |
| Likes | Like/unlike and double-tap photo to like | IMPLEMENTED in post UI; cross-account UAT NOT TESTED |
| Comments | Comment, nested reply, comment-like | IMPLEMENTED base; cross-account UAT NOT TESTED |
| Follow | Follow/unfollow, private follow request, accept/remove, follower/following lists | IMPLEMENTED base; cross-account UAT NOT TESTED |
| DM/inbox | Start direct conversation, contacts, inbox, send/read messages | IMPLEMENTED base; new contacts/inbox UI and realtime path added; real two-account UAT NOT TESTED |
| Offline DM | Cached contacts/inbox metadata and queued outgoing messages; automatically retry when online | IMPLEMENTED as device-local outbox; cannot send or fetch remote history without network; browser storage and reconnect UAT NOT TESTED |
| Notifications | Follow request, new follower, accepted request, unfollow, likes, comments, new message, system update | Existing event triggers plus new unfollow/message triggers; UI labels added. System announcement publisher, read receipts and realtime activity refresh are IMPLEMENTED; live admin-role publishing and UAT NOT TESTED |
| Music/audio | Use original or properly licensed tracks only; show source/license and attribution requirements | NOT IMPLEMENTED |
| Reels/FYP | Short-video player, relevant recommendation feed, safe moderation and feedback controls | Reels base exists; current ranking is a simple engagement/recency heuristic, NOT a validated viral/FYP recommender |
| Account settings | Public/private, username, password, phone verification, TOTP 2FA, language preference | New modular account settings UI added; Auth provider configuration and live account UAT NOT TESTED |
| Optional verification | Personal identity verification with clear review and appeal process | NOT IMPLEMENTED; current verification workflow covers professional/store only |
| Device permissions | Ask for location only when needed; use native photo/video picker on user action | Location request and picker entry point implemented; browser/Android permission UAT NOT TESTED |

## 3. Social user journeys and acceptance criteria

### 3.1 Publish photo/video
1. User taps Create.
2. Native device picker opens only after user action.
3. User selects one or multiple images/videos (maximum 15 media, current maximum 50 MB/file).
4. App previews each media item, keeps the source aspect ratio, and allows caption/visibility.
5. Upload shows progress and actionable errors; retry must not create duplicate posts.
6. Post and media metadata persist in Supabase; media access follows profile/post visibility.
7. Edit/delete only affect the owner's post. Media deletion must not leave the parent post pointing to a missing object.

Acceptance: Android photo/video upload, MP4/WebM playback, refresh, logout/login, second-account visibility, private media isolation, failure/retry, and upload cleanup all pass.

### 3.2 Feed, like, comments and follow
- Feed prioritizes relevant people/content and preserves a coherent visual rhythm.
- Like/unlike state and counts are consistent after refresh.
- Double-tap on a photo triggers one like action and a short heart animation; double-tap must not accidentally navigate or zoom.
- Comments support reply and comment-like; counts are not incremented twice.
- Public follow is immediate; private follow creates pending request; only target account may accept.
- Unfollow removes relationship and produces a notification event as requested.
- Blocked users and private visibility rules must apply to feed, profile, comments, messages and search.

Acceptance: at least two real accounts exercise all paths, including private account and blocked-account negative cases.

### 3.3 DM and offline behavior
- Contacts are sourced from accepted follow relationships and searchable by username.
- Inbox and message stream are backed by Supabase; realtime subscription updates open conversations.
- Offline cache may preserve contact metadata and thread metadata on the current device. A new DM can be drafted offline from a previously cached contact; the server conversation is created and delivery occurs only after reconnect.
- A message typed offline is explicitly marked "saved on this device / waiting for connection"; never label it sent/delivered.
- On reconnect, queued messages are retried with an idempotency key to prevent duplicates.
- Starting a brand-new conversation offline creates a local draft tied to a cached recipient; the actual conversation is created after reconnect. Remote history cannot be fetched while offline.
- Do not store auth tokens or private message history in an unprotected local cache.

Acceptance: owner/recipient two-account send/read, reconnect, duplicate retry, browser reload while offline, storage quota failure, blocked/private messaging, and message permission tests.

### 3.4 Notifications and Pluits system information
User notification categories:
- Follow request, new follower, accepted request, unfollow.
- Post like, comment, and reply (reply should be represented as a comment notification).
- New inbox message.
- Pluits system updates, release notes, service notices and security notices.

System announcements now have an admin/moderator-authorized publishing surface, language, severity, publish/expiry timestamps, RLS and per-user read receipts. Audience targeting and a dedicated audit log remain future hardening. Do not fabricate announcement rows.

Acceptance: each event is generated once, appears only to the intended recipient, can be marked read, and routes to the correct post/profile/conversation/announcement. Test with multiple accounts.

## 4. Account, privacy and device settings

Settings are grouped and modular; each section has a single owner module and may grow without turning into one giant page.

- Account identity: username change with unique validation; display name remains distinct from username.
- Privacy: public/private profile and content audience controls.
- Login security: password update, phone update + OTP confirmation, TOTP authenticator enrollment/verification/unenroll.
- Optional verification: must be a distinct review process; no automatic badge and no promise until admin review, appeal and evidence-retention rules are designed.
- Language: store account language preference. Full interface translation is a separate release gate; do not imply all screens have been translated merely because the preference is saved.
- Location: request browser location only from a user-initiated feature; explain why and never publish precise coordinates by default.
- Photos/video: open the native picker from the user's action. Browser file picker permissions are managed by the browser/Android; do not claim the website can pre-grant gallery permission.
- Camera/microphone: request only when a recording feature is actually used.

## 5. Music, rights, and recommendation integrity

- Never copy, download, rip, or rehost commercial songs without a license covering Pluits' use.
- Initial audio library should use original sounds or verified royalty-free/Creative Commons tracks whose license explicitly permits the intended commercial/social use.
- Store track title, creator, source URL, license type/version, attribution text, territory, allowed use, expiry/revocation and proof of license.
- Audio must be muted/removed from affected videos if license expires or rights are revoked.
- Do not promise "viral" or "For You Page" distribution. A recommendation system must be evaluated for watch completion, replays, meaningful interactions, freshness, creator diversity, negative feedback, safety, privacy, and spam resistance.
- Do not rank solely by like counts. Apply blocks, reports, content eligibility, user interests, freshness and creator repetition limits.
- Start with transparent "Following" and "Latest" feeds; test recommendation ranking against a baseline before broad rollout.

## 6. Design system and responsive quality

- One design token source for typography, spacing, radius, borders, elevation, colors and control sizes.
- One SVG icon library with consistent stroke, viewBox, optical weight and accessible labels. No mixed emoji/glyph icons for primary navigation/settings actions.
- Preserve the established Pluits palette and high contrast; no decorative redesign unrelated to the requested task.
- Mobile-first: test 320, 360, 390, 430 px widths; tablet; desktop.
- Avoid horizontal overflow, clipped menus, tiny tap targets, full-width controls that create awkward scrolling, and media aspect-ratio distortion.
- Respect reduced motion, keyboard focus, screen-reader labels and touch interactions.
- Performance: measure real build assets, image sizes, lazy loading, video preload strategy, feed query count, signed URL generation and long lists. Do not claim performance is optimized without measurements.

## 7. Release and founder UAT gate

A social release is ready for founder testing only after:
- [ ] All core social journeys work against real Supabase data.
- [ ] No fake/demo data or nonfunctional controls remain in active Social Media flows.
- [ ] Public/private, block, report, media ownership and message access are tested with two accounts.
- [ ] Photo/video upload and playback pass on Android.
- [ ] DM reconnect/outbox duplicate behavior passes.
- [ ] Notifications match backend events and recipient scope.
- [ ] Settings save and Auth provider flows are tested or clearly labeled unavailable.
- [ ] Responsive checks pass on mobile/tablet/desktop widths.
- [ ] Production build and regression tests pass.
- [ ] GitHub Pages deploy is successful for the exact commit.
- [ ] Founder performs UAT and records acceptance before the next vertical starts.

## 8. Current open blockers

1. Android real-media upload and playback UAT.
2. Two-account RLS and end-to-end social tests.
3. DM realtime, offline queue, cached contacts and reconnect UAT.
4. Notification unread badge in global navigation; audience targeting and dedicated audit log for system announcements; admin-role and multi-account UAT.
5. SMS provider/configuration for phone verification.
6. TOTP MFA verification in the actual Supabase Auth project.
7. Full English translation and language switch across the app.
8. Personal verification workflow and reviewer/appeal operations.
9. Music rights catalog and recommendation system.
10. Full device matrix, accessibility and measured performance test.
