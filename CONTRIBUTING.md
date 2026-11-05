# Contributing to CYPHR

Thank you for considering a contribution.

## Before opening a pull request

1. Open an issue first for substantial features or behavior changes.
2. Keep pull requests focused and explain the user impact.
3. Do not add API keys, tokens, webhook URLs, environment files, browser state, or production data.
4. Include manual test steps and screenshots only after removing private information.
5. Run the security smoke checks:

   ```bash
   node scripts/security-smoke.mjs
   ```

6. Test the affected functionality in a Vercel Preview before asking for review.

## Security-sensitive changes

Do not re-enable notification, alert-rule, or scheduled-alert functionality until it has caller authentication, authorization, per-user data isolation, request validation, and rate limiting. CORS restrictions alone are not access control.

For a suspected vulnerability, follow [SECURITY.md](SECURITY.md). Avoid publishing working exploit details or secrets in a public issue.

## License status

A project license has not yet been selected. Do not assume that contributions or assets are licensed for redistribution until the maintainers publish explicit license terms.
