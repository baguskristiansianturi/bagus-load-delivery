# PLUITS central authentication

All guest authentication entry points use the single feature at `#/account/auth?mode=...`.

- `mode=login`: email/password sign-in.
- `mode=register`: display name, email, password, terms consent, and email confirmation.
- `mode=forgot`: request a Supabase password-recovery email.
- `mode=reset`: set a new password after the recovery callback.
- Legacy `#/login`, `#/register`, `#/account/login`, and `#/account/register` routes remain compatible and render the same central screen.
- The approved registration visual system remains owned by `register.css`; auth modes share its responsive shell and card.
- Password recovery redirects to the app root with `?auth=reset`; the router recognizes Supabase recovery callbacks and opens the reset form.
- Public email delivery still requires custom SMTP in Supabase. Do not claim production email delivery until SMTP is configured and tested.
- SMS verification remains out of the initial signup flow until a provider is configured and tested.
