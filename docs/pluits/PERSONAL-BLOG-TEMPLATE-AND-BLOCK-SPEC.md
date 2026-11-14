# PLUITS Personal Blog — Template & Profile Block Implementation

**Status:** schema deployed; frontend editor implementation in progress; Android UAT not yet performed.

## Approved product rules
- Blog is a personal publishing surface inside PLUITS, not a separate social network.
- Switching templates never changes the blog slug, post slugs, post content, categories, media paths, or visibility.
- The five initial Personal Blog templates are AURELIA, STAVERO, BREWNOX, ROVANTA, and LUNELLE.
- News & Media template names PRESSORA, NEWSTERA, EDITORA, and INFONARA are reserved concepts; they are not exposed in the Personal Blog selector until the News & Media identity and permission model is delivered.
- Blog publication never creates follower-style notifications. Comments and replies use the commenter's PLUITS personal social account identity.
- Private blogs/posts and their media must remain excluded from public routes, search, sitemap, and share previews.

## Workspace information architecture
1. Dashboard — blog status, public URL, article/draft counts, latest changes.
2. Tulisan — published, drafts, scheduled (future), private, archive (future), trash (future).
3. Editor — title, excerpt, cover, rich text, inline images/videos, category, draft/publish, privacy.
4. Media — upload and reuse the user's own PLUITS media; owner-scoped storage.
5. Tampilan — template, accent color, typography, layout blocks, preview.
6. Profil Blog — display title, description, author identity, optional avatar/cover and public profile link.
7. Navigasi & Kategori — category order and visibility; custom pages/navigation are later phase.
8. Privasi & SEO — blog visibility, per-post visibility, crawl/share metadata, canonical URLs.
9. Pengaturan — language, timezone, comments and notification preferences.

## Template contract
- Template is a presentation key, not a content schema. Every template consumes the same semantic blog data.
- Theme settings are a whitelisted JSON object. Do not accept arbitrary HTML, JavaScript, selectors, or CSS text.
- Layout settings contain known block IDs, order, and visibility only. A hidden block never deletes its underlying content.
- Template rendering is mobile-first, accessible, and supports keyboard focus and reduced motion.
- User accent overrides are constrained to a validated hex color. Typography is a finite option set.
- Switching back to an earlier template restores its preset; custom accent and font settings remain owner preferences.

## Initial template identities
| Key | Name | Direction |
|---|---|---|
| aurelia | AURELIA | Soft personal diary; rose, ivory, warm neutrals |
| stavero | STAVERO | Personal studio; charcoal, white, grey |
| brewnox | BREWNOX | Coffee and daily notes; coffee brown, cream, beige |
| rovanta | ROVANTA | Journey diary; sand, navy, white |
| lunelle | LUNELLE | Memory and lifestyle; lavender, lilac, cream |

## Initial Profile Blocks
- profile_header — author avatar, display name, blog name, tagline/description
- featured_story — selected featured story or latest public story
- recent_stories — public article list
- categories — category filter/navigation
- photo_gallery — images referenced by public posts only
- about_me — public author bio
- footer — blog title and subtle “Didukung oleh PLUITS” credit

## Data model
public.blog_profiles additive columns:
- template_key text
- theme_settings jsonb
- layout_settings jsonb

RLS remains the existing blog-profile owner/public-read boundary. Presentation preferences never grant access to posts or media. The public reader must select only explicit public presentation fields; it must not expose owner-only account fields.

## Interaction and notification rules
- No automatic notification is emitted when a blog publishes an article.
- Comments and replies are authored by PLUITS personal accounts, not by an invented blog account.
- Blog owners can moderate comments on their posts; commenters can report abusive content.
- Comment/reply notifications are a separate preference from publication and can be disabled. Do not implement publication subscription as a substitute.
- Official media/organization blogs require verified organization identity and delegated editor roles in a later News & Media phase.

## Delivery acceptance
- [x] Additive schema migration applied to Supabase; existing rows receive safe defaults.
- [ ] Template selector saves and reloads from Supabase.
- [ ] Theme accent/font saves and renders on public blog.
- [ ] Profile block visibility saves and renders on public blog.
- [ ] Reordering blocks is implemented.
- [ ] Add gallery and About Me blocks to the public reader.
- [ ] Add a single Share action with crawler-readable Open Graph metadata.
- [ ] Blog comments use PLUITS personal accounts and existing moderation/reporting rules.
- [ ] No publication notifications are emitted.
- [ ] Public/private authorization tested with owner, second account, and anonymous visitor.
- [ ] Automated tests and production build pass.
- [ ] Android UAT and founder acceptance recorded.
