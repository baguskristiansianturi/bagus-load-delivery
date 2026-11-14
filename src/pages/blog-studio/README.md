# Blog Studio — module contract

## Ownership
- Canonical account route: `#/account/blog`.
- Public reader route: `#/@username/blog/:blogSlug/:postSlug`.
- Runtime owner: `src/pages/blog-studio/index.js` (dashboard, setup, editor, preview, public reader).
- Scoped presentation: `blog-studio.css`.
- The page controller owns Blog Studio state and Supabase queries until a separately tested repository/feature extraction is approved.

## Responsibilities
- Create and manage one personal blog space linked to the PLUITS account.
- Manage published posts, drafts, settings, and categories.
- Edit a post with title, short description, cover image, body text, and supporting media.
- Supporting media may be images or videos. The cover remains an image.
- Public blog articles link back to the owner's public profile so visitors can follow the account.
- Blog is a Social Media content format. Premium entitlement is deferred; the create flow must not independently gate the feature.

## Dependencies
- Auth/data client: `src/lib/supabase/client.js`.
- Media transport: `src/features/media/storage-upload.js`.
- Media validation and MIME normalization: `src/features/media/media-types.js`.
- Signed URLs: `src/services/storage/signed-urls.js`.
- Shared social navigation: `src/components/social/navigation.js`.

## Data and storage contract
- Blog metadata: `blog_profiles`, `blog_categories`, `blog_posts`.
- Article body media reuses `blog_posts.supporting_paths` (JSON array of Storage object paths); no extra media table is required for the current image/video scope.
- Cover path is image-only. Supporting paths may contain image or video.
- Storage bucket: private `pluits-user-media`; owner path prefix is the authenticated user's UUID.
- Public media access is granted only when referenced by a published, public blog post under a public blog profile. Draft/private media remains owner-only.
- Video files use the existing 50 MB bucket limit. The UI validates size and allowed media types before upload.
- Blog profile INSERT RLS must enforce `owner_user_id = auth.uid()`. The free-account policy migration is staged separately and is not live until applied.

## Boundaries
- Do not modify Post, Like, Comment, Reels, or profile ownership to change Blog Studio.
- Do not create a second Blog route/controller; use the canonical routes above.
- Do not move blog storage into a public bucket or expose a service-role key.
- Do not report a blog post as published until the database insert/update succeeds.
- Do not change existing applied migrations; add a new chronological migration with rollback notes.

## Tests and acceptance
- `tests/pages/blog-studio.test.js` checks mixed-media rendering and entitlement removal.
- `tests/features/media-upload.test.js` guards TUS destination-path fingerprints and safe fallback.
- `tests/features/media-types.test.js` covers mobile video MIME formats and the 50 MB limit.
- Runtime UAT still requires Android file picker, video upload, playback, refresh persistence, public/private visibility, and a second account.


## Draft autosave and Blog Saya navigation
- Editor auto-saves draft changes to the authenticated owner's `blog_posts` row after a short typing pause and attempts a final save when the page becomes hidden or is unloaded.
- Drafts may be saved before a cover is selected. An unfinished untitled draft uses the internal placeholder title `Draft tanpa judul`; the editor displays an empty title field when reopened. Published posts still require a title and cover.
- The owner Blog Saya dashboard has a hero, management settings, published article cards ordered by publication date, and a separate Draft tab ordered by recent edits.
- The hero's `Blog Saya` link opens the public blog homepage when the blog is public; private blogs remain owner-managed only.
- The auto-save indicator is the visible source of truth. If it reports an error, the draft has not been confirmed saved.
