# Registration feature

Ownership: guest account creation route #/account/register.

- register.js owns registration markup, form validation, Supabase sign-up request, pending-email state and resend action.
- register.css owns all registration-page presentation under the .pl-register-page namespace.
- src/pages/account/index.js remains the route/session controller and delegates only the register screen to this feature.
- Sign-in remains in the account controller and shares the existing Supabase Auth identity.
- The form collects display name, email and password only. Profile details and phone number are completed later in account settings.
- Email confirmation returns to the app base URL configured by Vite. A successful email confirmation causes the existing guest homepage/session flow to route authenticated users into Explore.

## Verification and rollout

- Browser form validation and server validation both apply.
- Password is not requested twice; a reveal control is available.
- Pending confirmation state distinguishes an accepted request from confirmed delivery.
- Resend errors and provider rate limits are surfaced without claiming delivery.
- Public email delivery requires custom SMTP in Supabase. The built-in SMTP service is restricted to project team addresses and is not suitable for public production traffic.
- SMS verification is intentionally not presented until a paid/selected SMS provider is configured and tested.
