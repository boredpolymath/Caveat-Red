# Security policy

## Reporting a vulnerability

Please use GitHub’s **Report a vulnerability** control in the repository’s Security tab for a private report. Do not include private investigation data in an issue, report, reproduction, screenshot, or log.

If private reporting is unavailable, open a minimal issue requesting a secure contact channel; include no exploit details or sensitive data.

## Scope and support boundary

Caveat Red is a static, local-only application. Security review focuses on stored/imported-data handling, cross-site scripting, service-worker caching, accidental deletion, static deployment configuration, and exported data. Bored Polymath Studios cannot recover local browser data or decrypt a user’s device/backups.

Supported releases receive fixes on the current `main` release line. See [docs/RELEASE.md](docs/RELEASE.md) for incident and rollback procedures.
