# PLUITS Inbox — Two-account UAT and Voice Messages

**Date:** 10 November 2026  
**Status:** Voice-note schema applied; frontend implementation in this release; two-account UAT pending.  
**Production data:** Existing users, profiles, conversations and messages are preserved.

## 1. Live baseline before this release

The connected Supabase project reported:
- 2 Auth users and 2 public user profiles.
- 0 direct conversations.
- 0 conversation members.
- 0 messages.
- 0 notifications.

No test account was created by this implementation. The second profile may already represent the account intended for testing; verify sign-in access before registering another account. Do not share passwords or OTP codes in chat.

## 2. Inbox feature structure

### Direct conversations
- One-to-one conversation identity is deduplicated by a stable direct_key.
- Only conversation members can read the conversation, membership rows and messages.
- Message sender identity is always the authenticated user.
- Existing start_direct_conversation RPC is retained.

### Text messages
- Up to 5,000 characters.
- Idempotent client message IDs prevent duplicate sends during retry.
- Offline text outbox is device-local and scoped to the signed-in account.
- A queued message is visibly marked pending and is not represented as delivered until the server confirms it.

### Voice notes
- Browser microphone capture via MediaRecorder.
- Maximum duration: 3 minutes; maximum upload size: 10 MB.
- Private Storage bucket: pluits-message-media.
- Object path: conversation UUID / sender UUID / random file.
- Only conversation members can read audio; only the sender can upload/delete under their own path.
- Audio playback uses short-lived signed URLs, never a public bucket URL.
- Supported browser MIME types: WebM, MP4, OGG, MPEG, WAV and 3GPP where available.
- Voice notes require an online connection in this release; text messages retain offline queue behavior.
- A failed message insert triggers best-effort removal of its uploaded object.

### Read state and realtime
- Opening a conversation updates the member's last_read_at.
- Outgoing messages show a read marker when the other member's last_read_at is later than the message timestamp.
- Realtime INSERT events refresh the open conversation or inbox list.
- Conversation updated_at is advanced by each inserted message for correct inbox ordering.

## 3. Two-account test preparation

Use two independently signed-in accounts on separate browser contexts/devices:
- Account A: existing account currently used by the founder.
- Account B: the second existing profile if its owner can sign in; otherwise register a separate test account using an email controlled by the founder.

Never sign both accounts into the same browser profile at once: Supabase auth storage is shared in that context and the second login replaces the first session. Use one account in the normal browser and the other in an incognito/private context or a second browser/device.

## 4. UAT checklist

| ID | Scenario | Expected result |
|---|---|---|
| DM-01 | A searches B by username | B appears; no email or private fields exposed |
| DM-02 | A starts a chat with B | One direct conversation; both are members |
| DM-03 | A sends text to B | B sees message without manual refresh; inbox preview updates |
| DM-04 | B replies | A receives the new message in the open thread |
| DM-05 | B opens the conversation | A sees read marker after refresh/realtime update |
| DM-06 | A sends multi-line text | Line breaks remain readable; max 5,000 chars enforced |
| VO-01 | A grants microphone permission and records 5–15 sec | Audio uploads and appears as playable voice note |
| VO-02 | B plays A's voice note | Audio plays from a signed URL |
| VO-03 | B tries to access an unrelated conversation's audio | Storage denies access |
| VO-04 | Record with microphone permission denied | Helpful error; no broken conversation |
| VO-05 | Record beyond 3 minutes | Recording stops automatically at 3 minutes |
| NET-01 | A sends text while offline | Device shows pending; no false delivered state |
| NET-02 | A reconnects | Pending text sends once; no duplicate |
| NET-03 | Refresh either account | Server history is restored |
| SEC-01 | Account A attempts to read a conversation it does not belong to | RLS denies access |
| SEC-02 | Account A attempts to upload under B's storage path | Storage policy denies access |
| MOB-01 | Test on Android Chrome | Composer, keyboard, audio controls and bottom navigation remain usable |

## 5. Known limits before wider rollout

- Voice notes are online-only; offline voice recording/queue is not enabled.
- Read receipts currently use conversation-level last_read_at, not per-message delivery/read records.
- No voice calls, group calls, typing indicator, attachments beyond voice, or end-to-end encryption are included.
- Signed URLs expire after one hour and are regenerated when the thread is opened.
- Browser/device microphone support and permissions must be tested on the target Android device.

## 6. Data safety

- Do not seed fake accounts or messages in production.
- Do not expose service-role credentials in the browser.
- Keep the voice bucket private.
- Do not change existing conversation/message rows or migrate existing user media.
- If UAT finds a defect, fix and verify it without resetting user data.
