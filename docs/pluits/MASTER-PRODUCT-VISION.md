# PLUITS — MASTER PRODUCT VISION & BUSINESS MODEL
Version: 1.0
Status: Approved product direction / implementation baseline
Last updated: 2026-11-08
Owner: Pluits Indonesia

> One account. One identity. Many activities. One connected ecosystem.

## 1. Product vision
Pluits is a mobile-first digital ecosystem connecting people, communities, content, local discovery, businesses, commerce, and travel. It is not a clone of any single social network or marketplace. Its advantage is the continuity between discovering something, connecting with people, taking action, and sharing the real experience.

The social experience remains the primary entry point. Commerce and travel are connected modules, not replacements for the social identity of the product.

## 2. Product principles
1. Mobile-first, responsive, installable web experience; optimize for modest Android devices and variable networks.
2. Simple by default: frequent actions are short; advanced controls live in profile/settings or contextual menus.
3. Media integrity: preserve uploaded aspect ratio and composition; never crop originals destructively. Generate optimized derivatives for delivery while retaining the original.
4. Privacy by design: audience controls, least privilege, private-by-default sensitive data, explicit location sharing.
5. Secure by default: server-side authorization, RLS, storage policies, audit trails, abuse controls.
6. Integrated identity: one account and profile identity across enabled modules; module-specific roles and permissions.
7. Accessible and international-ready: readable contrast, captions, keyboard/screen-reader support, localization-ready data.
8. Sustainable delivery: ship in tested increments; do not destabilize working modules.

## 3. Core experience
### Social
- Home feed for posts from followed/friend connections and selected discovery content.
- Photo, video, text, carousel, and short-form vertical video posts.
- Stories with configurable audience and 24-hour expiry behavior.
- Reactions, threaded comments, mentions, sharing/reposting with attribution, bookmarks and collections.
- Follow and friend relationships with clear distinctions.
- Profile with bio, posts, media, collections, activity and optional professional/business sections.
- Notifications grouped by social, messages, commerce, travel, and security.
- Search and Explore across people, posts, communities, places, products and services.

### Creation
Posting flow: choose media -> compose -> choose audience -> optional location/topic/product association -> publish.
Keep the default composer compact. Put detailed defaults (privacy, preferred post destinations, comment controls) in profile/settings. Support drafts, upload progress, retry, clear failure messages, and safe cancellation.

### Media handling
- Store original uploads unchanged where practical.
- Record original width, height, orientation, MIME type, duration and file size.
- Generate responsive derivatives/thumbnails without altering the original.
- Render images using intrinsic aspect ratio; do not force a universal square crop.
- Video uses correct orientation/aspect ratio, poster frame, adaptive delivery where available, and explicit upload limits.
- Validate file type and size server-side; use signed or policy-protected URLs.
- Strip or control EXIF metadata, especially GPS, according to privacy settings.
- Do not expose private media through public buckets or guessable permanent URLs.

## 4. Differentiating modules
### Pluits Around You
Location-aware discovery of nearby public posts, places, communities and services. Location sharing must be opt-in, granular and revocable. Never expose precise user location by default.

### Pluits Moments
A personal timeline/journal to collect photos, videos, stories and travel memories by date and optional place. Owner controls visibility and export.

### Pluits Communities
Interest-, profession-, location- and activity-based groups with roles, posts, discussions, events, member approval and moderation.

### Social Commerce
Posts can link to verified business profiles, product/service listings and completed transactions. Product cards must not obscure the social content. Purchase flow clearly shows seller identity, price, shipping/fulfillment, refund terms and support path.

### Pluits Trip
Travel discovery and planning with shared itineraries, destinations, activities, stays, rentals and transport bookings. Bookings require clear provider identity, price breakdown, cancellation terms and booking status.

### Digital Identity
One account with optional personal, creator, professional and business presentation. Separate module permissions; no automatic public disclosure of private account details.

## 5. Further innovation candidates
- Collaborative posts with co-author consent and ownership rules.
- Polls, Q&A, voice notes and group conversations.
- Pluits Trust: evidence-based verification and transaction reputation; never a popularity score.
- Memories recap with explicit controls over what is included.
- Personalized discovery with user controls, transparency and chronological/following alternatives.
- Accessibility settings: text scaling, captions, contrast and reduced motion.
- Wallet/held balance only after legal, compliance, security and payment-provider review. Initially provide transaction history and payment status; do not represent a stored-value wallet before approval.

## 6. Navigation proposal
Mobile bottom navigation:
- Home
- Explore
- Create
- Activity
- Profile

Marketplace, Communities and Trip are reached through Explore, profile modules, contextual links or a clearly organized More/Services area. Avoid overcrowding the bottom bar. The final information architecture must be validated against current implementation and user testing.

## 7. Account roles and trust
Roles are scoped and explicit:
- Member
- Creator (optional capability)
- Business owner / store operator
- Business staff (scoped permissions)
- Community moderator
- Pluits moderator
- Platform administrator

A store registration represents a business owner/operator, not an ordinary consumer storefront impersonation. Business verification requirements should support legal business types and collect only necessary evidence. Verification badges must explain what was verified and when.

## 8. Security and privacy baseline
- Supabase Auth with verified email, secure recovery, optional MFA and session/device management.
- RLS on every exposed table; deny by default; policies tested for anonymous, owner, peer, staff, moderator and admin roles.
- Never trust client-supplied user IDs, role claims, prices, order status or ownership.
- Privileged operations run server-side (Edge Functions/backend) with secrets kept out of frontend.
- Storage buckets private by default; policies mirror record-level visibility; signed URLs expire.
- Validate and normalize input server-side; rate-limit auth, posting, comments, messaging, search and reports.
- Prevent IDOR, mass assignment, XSS, CSRF where applicable, SQL injection, upload abuse and enumeration.
- Audit security-sensitive actions: role changes, business verification, moderation, account recovery, payment/refund state changes.
- Provide block, restrict, mute, report, appeal and content takedown workflows.
- Minimize personal data, define retention/deletion/export workflows, and document consent.
- Do not log passwords, tokens, private message bodies or sensitive personal data.
- Backups, restore tests, dependency updates and incident response procedures are required before public scale.

## 9. Data domains (logical, not a migration instruction)
Identity: profiles, account_settings, user_roles, sessions/security events.
Social: posts, post_media, post_audience, follows, friendships, reactions, comments, mentions, shares, bookmarks, stories.
Discovery: topics, places, public_location_associations, search indexes.
Community: communities, memberships, roles, events, moderation actions.
Messaging: conversations, participants, messages, attachments, read states.
Commerce: businesses, business_members, verification_cases, products, inventory, carts, orders, payments, refunds, reviews.
Travel: providers, destinations, activities, listings, availability, itineraries, bookings.
Trust & safety: reports, blocks, restrictions, moderation_queue, appeals, audit_events.
Notifications: notification_preferences, notifications, delivery_attempts.

This is a domain map only. Inspect existing schema and preserve current identifiers/data before any migration. Do not create duplicate identity tables if equivalent structures already exist.

## 10. Monetization principles
Potential revenue: business subscriptions/tools, clearly disclosed promoted listings, transaction commissions where justified, travel booking commissions, and optional creator/business services. Ads must be labeled and must not secretly influence organic ranking. Avoid pay-to-win trust badges.

## 11. Product success measures
- Activation: registration completion, first meaningful follow, first post.
- Social health: meaningful interactions, creator retention, comment quality, report rates.
- Reliability: upload success, feed latency, crash/error rate, uptime.
- Safety: report response time, repeat abuse rate, account compromise rate.
- Commerce/travel: conversion, completed order/booking, cancellation/refund and dispute rates.
- Accessibility and performance: low-end Android load time, data usage, successful task completion.

## 12. Non-negotiable product decisions
- Pluits is the product/company identity; Pluits Indonesia is the company name.
- Marketplace remains an integrated module and its existing working implementation must not be discarded.
- My Bali concepts are incorporated as travel, moments and local discovery capabilities; do not create a disconnected second identity system.
- One core account and shared authorization; modular business domains.
- Preserve uploaded media ratio and composition.
- Privacy and security are release gates, not later enhancements.
- Do not publish unfinished private roadmap details or test credentials.
