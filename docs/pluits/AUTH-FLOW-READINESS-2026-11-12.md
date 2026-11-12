# PLUITS Account & Authentication Readiness Audit
**Date:** 12 November 2026  
**Repository:** `baguskristiansianturi/pluits` (`main`)  
**Supabase project:** `ytndswhqxayqpftszwfh` (active/healthy, Singapore)

## Executive status
The project has a live Supabase Auth integration and an existing account UI. This does **not** mean every sign-in method is production-ready. The audit separates code support from provider configuration and real-device verification.

## Current capability matrix

| Flow | Frontend/code | Supabase capability | Current readiness | UI treatment |
|---|---|---|---|---|
| Email + password login | Implemented with `signInWithPassword` | Native Supabase Auth | Code path ready; real-account UAT still required | Available |
| Email registration | Implemented with `signUp`, display-name metadata and terms consent | Native Supabase Auth | Public email delivery requires custom SMTP and confirmation-template/redirect validation | Explain email setup requirement |
| Email confirmation + resend | Implemented; resend uses `auth.resend` | Native Supabase Auth | Depends on SMTP, email template, Site URL and allowed redirect URLs | Pending-email state; do not promise delivery |
| Forgot password | Implemented with `resetPasswordForEmail` | Native Supabase Auth | Depends on SMTP and allowed redirect URL `/pluits/?auth=reset` | Available with email-delivery caveat |
| Password reset | Implemented with `updateUser`; router recognizes recovery callback | Native Supabase Auth | Must UAT a real recovery email end-to-end | Available with email-delivery caveat |
| Phone OTP | UI and `signInWithOtp` / `verifyOtp` code exist | Supported, but needs phone auth enabled and an SMS provider | Not verified; provider and billing/rate limits need setup | Show “Perlu konfigurasi SMS” |
| Phone + password | Login path exists | Supported if phone auth is enabled and the phone is registered/confirmed | Not verified; do not market as ready | Only accept valid E.164 numbers; test after provider setup |
| Google OAuth | OAuth call exists | Supported by Supabase | Provider configuration and callback have not been independently verified | Show “Perlu diuji”; handle provider-disabled error |
| Facebook OAuth | Previous click handler existed | Supported by Supabase | No evidence of configured Facebook app/client credentials or callback | Disabled, “Sedang dikembangkan” |
| X OAuth | Previous provider key was `twitter` (legacy provider flow) | Supabase recommends X OAuth 2.0 over legacy Twitter OAuth 1.0a | Requires X Developer app, OAuth 2.0 credentials and callback | Disabled, “Sedang dikembangkan”; use X mark |
| LinkedIn OAuth | Previous click handler used `linkedin_oidc` | Supported by Supabase | No evidence of configured LinkedIn OIDC credentials/callback | Disabled, “Sedang dikembangkan” |
| Username login | Placeholder example exists only | Requires a secure username-to-auth-identity lookup or custom auth design | Not implemented | Explain that email/phone are required |
| Invite friends | Share/copy registration link only | Supabase Admin invite is a privileged server-side operation | No referral attribution, invite tracking or admin Edge Function exists | Label as “Bagikan undangan”; do not imply tracked referrals |

## Important implementation findings
1. Login identity validation previously used an incorrectly escaped regular expression for phone numbers. It has been corrected to strip spaces/parentheses/hyphens and validate E.164 ( followed by 8–15 digits, first digit non-zero).
2. Password recovery redirect is built as the app root plus `?auth=reset`; the router recognizes that callback and opens the reset-password form. The exact redirect must be allowed in Supabase Auth URL Configuration.
3. The account UI now uses current SVG marks for Google, Facebook, X and LinkedIn. Facebook, X and LinkedIn are disabled and explicitly marked “Sedang dikembangkan”. Google remains an unverified integration and is labelled “Perlu diuji”.
4. The invite action shares/copies a public registration link only. It does not generate a unique referral token or store who invited whom.
5. The account page footer is reduced to the copyright line; login-specific spacing is tightened, including compact-height mobile breakpoints.

## Live Supabase evidence
- Project status: active/healthy.
- Database migration history: 95 migrations present at audit time.
- Public schema tables: all tables returned by the live table inventory report RLS enabled.
- Edge Functions: none deployed at audit time.
- Security advisor findings at audit time:
  - Leaked-password protection is disabled.
  - 22 SECURITY DEFINER functions are callable by authenticated users. Review each function's authorization checks and whether EXECUTE should be restricted. Do not remove permissions blindly; several may be intentional RPC entry points.
- The project has a publishable browser key. Never place a service-role/secret key in frontend code.

## Required Supabase dashboard configuration and acceptance tests

### A. General Auth URLs
- Set Site URL to the canonical GitHub Pages base: `https://baguskristiansianturi.github.io/pluits/`.
- Add exact redirect URLs for:
  - `https://baguskristiansianturi.github.io/pluits/`
  - `https://baguskristiansianturi.github.io/pluits/?auth=reset`
- Keep any local development URLs separate and explicit.
- Verify the confirmation and recovery email templates preserve the intended redirect.

### B. Email
- Configure custom SMTP before public signup and password recovery are announced as production-ready.
- Configure sender name/address and confirmation/recovery templates.
- Test: register a new address, receive and confirm email, sign out, request reset, open link on Android, set new password, sign in.
- Test resend throttling and duplicate registration errors.

### C. Google, Facebook, X and LinkedIn
For each provider, create the external OAuth app, configure the exact Supabase callback URL `https://ytndswhqxayqpftszwfh.supabase.co/auth/v1/callback`, add credentials in Supabase Auth Providers, and test the redirect back to the Pages origin.
- Google: do not remove the “Perlu diuji” marker until a real OAuth login passes on mobile.
- Facebook: retain “Sedang dikembangkan” until app credentials, callback, consent screen and mobile UAT pass.
- X: configure OAuth 2.0; do not rely on the legacy Twitter OAuth 1.0a integration.
- LinkedIn: configure LinkedIn OIDC and verify the requested scopes and callback.

### D. Phone OTP
- Enable phone authentication in Supabase Auth.
- Configure an SMS provider (Twilio, MessageBird or Vonage) and sender/template.
- Configure OTP frequency, expiry, CAPTCHA/rate limits and cost monitoring.
- Test Indonesian E.164 numbers (+62...), resend cooldown, wrong code, expired code, already-registered number, and login on a second device.
- Phone + password and phone OTP are different flows; do not imply that configuring one automatically proves the other.

### E. Username and invitations
- Username login needs a secure, privacy-preserving lookup strategy; never expose a public endpoint that reveals whether an email/phone belongs to a username.
- Proper invitations need a trusted server-side flow (Edge Function or backend) if the product intends to email an invitation or track referral attribution. Never expose the Supabase service-role key in the browser.
- The current “Bagikan undangan” action only shares the public signup URL; add tracking later through a designed referral table and server-verified attribution.

## Go-live gate
Do not describe all account methods as ready until the real-device acceptance tests above pass. A button being rendered, an Auth API call existing, a migration being applied, or a successful build is not proof that a third-party provider, SMTP or SMS delivery is configured.
