# Caveat Red

Caveat Red is a local-first workspace for internal commercial and investment due-diligence records. It helps a single investigator keep claims, evidence, findings, questions, contradictions, notes, and reports connected without turning uncertainty into a conclusion.

## v1 promise

- Runs entirely in one browser profile: no account, collaboration, hosted backup, telemetry, server sync, or source-document upload.
- Stores citations and investigator notes only. It does not store attachment contents.
- Supports current and previous major Chrome, Safari, Firefox, and Edge releases. It is an installable PWA when served over HTTPS.
- Produces a JSON backup, a Markdown working report, and a print-to-PDF layout.
- Is not legal, compliance, fraud-detection, or investment advice.

Do not store credentials, highly sensitive personal data, or privileged material. Local browser storage is not encrypted at rest and can be exposed by a shared device, browser sync, backups, or extensions.

## Run locally

Requires Python 3.9+ only. There are no third-party runtime dependencies.

```sh
make build
make dev
```

Open <http://localhost:8000>. `make test`, `make lint`, `make typecheck`, and `make check` run the reproducible source and release-structure checks. `make format` checks Python support scripts compile. The app’s runtime boundary validates stored and imported data against a versioned schema.

## Architecture

- `src/app/domain.js` — schema, migration, IDs, relationships, scoring, and history.
- `src/app/storage.js` — storage health and import preflight/duplicate handling.
- `src/app/app.js` — accessible DOM-only user interface; user data is assigned through text nodes, never HTML interpolation.
- `public/` — service worker, manifest, and icons.
- `scripts/build.py` — deterministic static build to `dist/`.

## Data, backup, and restore

The only application key is `caveat-red.workspace.v1` in `localStorage`. Data persists until the user clears it or clears browser site data. “Export all investigations” creates the full versioned JSON backup. Import validates the complete JSON before it changes the workspace; duplicate IDs are retained as separately named imported investigations. The import prompt is non-destructive and existing records remain intact.

For recovery: export a backup regularly, save it in an approved location, and test import into a clean browser profile. The Settings screen shows current storage usage, schema version, storage availability, and last backup time.

## Deployment to GitHub Pages

The included workflow deploys `dist/` to GitHub Pages after checks pass on `main`. In the repository’s **Settings → Pages**, select **GitHub Actions** as the source. Configure a custom domain and enforce HTTPS there if one is used. See [docs/RELEASE.md](docs/RELEASE.md).

GitHub Pages does not provide repository-controlled arbitrary HTTP headers. Caveat Red provides a restrictive meta Content Security Policy, referrer policy, and feature restrictions in the document, but a deployment requiring HTTP `Permissions-Policy` or other response headers needs a fronting host/CDN with header control.

## Documentation

- [Product requirements](docs/PRODUCT_REQUIREMENTS.md)
- [User guide](docs/USER_GUIDE.md)
- [Privacy notice](docs/PRIVACY.md)
- [Security policy](SECURITY.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Release procedure](docs/RELEASE.md)
- [Release-readiness evidence](docs/RELEASE_READINESS_STATUS.md)
- [Accessibility statement](docs/ACCESSIBILITY.md)
- [Terms and disclaimer](docs/TERMS.md)

## License and support

Copyright © 2026 Bored Polymath Studios. Released under the [MIT License](LICENSE).

For product support, use [GitHub Issues](https://github.com/boredpolymath/Caveat-Red/issues). For security reports, follow [SECURITY.md](SECURITY.md) and use GitHub’s private security-advisory reporting route.
