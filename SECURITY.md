# Security

## Reporting

Do not publish credentials, personal data, or exploit details in public issues.
Send security reports privately to the repository maintainer. Include the affected
route or file, impact, and a reproducible test case with secrets and personal data
removed.

## Current safeguards and limitations

- Vercel API middleware applies an origin allowlist. CORS is not authentication.
- API proxies must require HTTPS, reject URL credentials and custom ports, use an
  exact hostname allowlist, and cap upstream response sizes.
- Notification and alert-rule endpoints are temporarily disabled. Do not re-enable
  them until caller authentication, authorization, per-user storage isolation,
  request validation, and rate limiting have been implemented and tested.
- Browser-provided market-data API keys are stored in browser local storage and
  sent directly to the selected data provider. Use only restricted, read-only
  data keys; never use exchange trading or withdrawal keys in this app.
- The Content Security Policy remains report-only because the current single-page
  app uses inline scripts and event handlers. Do not enforce it without a
  compatibility review and a nonce/hash-based script migration.

## Release checks

Before a public release, scan the complete Git history for credentials, review all
deployment targets and environment variables, confirm asset and dependency
licenses, run the security smoke checks, and manually review all API routes.
A clean scan of the latest source does not prove the history is clean.
