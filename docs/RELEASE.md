# Release procedure

## Environments and rollback

Use a pull-request branch and the `Quality checks` workflow as preview, a dedicated staging branch and the same build/test artifact as staging, and the `main` branch as production. Because this is a local-only static application, preview and staging do not hold user data or server state. GitHub Pages deployment is performed by `.github/workflows/pages.yml` from production. Roll back by reverting the release commit and rerunning the workflow; verify the Pages deployment history after rollback.

## Release checklist

1. Set the version in `src/app/domain.js`, `public/sw.js`, and `CHANGELOG.md`.
2. Run `npm ci`, `npx playwright install chromium firefox webkit`, and `npm test` in a clean checkout; also run `make check`.
3. Run the browser suite across Chromium, Firefox, WebKit, and the mobile Chromium project: it covers first-run creation, record CRUD/linking, reporting, hostile input, all primary-view axe checks, a labelled modal, and keyboard focus. Repeat the listed manual spot checks if the visual baseline, browser range, or platform changes.
4. The unit and browser suites cover stored/imported XSS payloads in all text fields and Markdown export, malformed JSON, a 500-record Unicode/comma/newline import, and duplicate recovery.
5. The mobile project and responsive CSS cover narrow mobile, tablet, laptop, and large desktop layouts; retain the 200%/400% zoom, screen reader, reduced motion, and print/PDF spot checks for a browser/platform change.
6. CI enforces the 500 KB uncompressed app-shell budget and a two-second 500-record import budget. Record representative-device results if the application materially grows.
7. Review dependency/license status (runtime has none; pinned QA dependencies are in `package-lock.json`), browser support, GitHub Pages configuration, HTTPS, the default production URL, asset MIME types, and no analytics/error-reporting transmission.
8. Bored Polymath Studios completes go/no-go and publishes release notes. No pilot program is required for v1 by approved product decision.

## Incident, support, and deprecation

For a security incident: stop promotion, preserve a sanitized reproduction, use private GitHub security reporting, ship a fixed static release, invalidate old service-worker cache through a new named cache version, and publish non-sensitive release notes. Never request users’ investigation files for ordinary support. Offer a user-controlled diagnostic summary containing app version, schema version, storage health, and browser version only.

For deprecation, announce the final supported version, keep the export path working, publish migration guidance, and retain the static release for a documented period. Caveat Red cannot centrally delete local user data; users must clear it in Settings or browser site-data controls.
