# Release procedure

## Environments and rollback

Use pull-request previews for review, the `main` branch as production, and a separate staging branch/environment if the organization enables one. GitHub Pages deployment is performed by `.github/workflows/pages.yml`. Roll back by reverting the release commit and rerunning the workflow; verify the Pages deployment history after rollback.

## Release checklist

1. Set the version in `src/app/domain.js`, `public/sw.js`, and `CHANGELOG.md`.
2. Run `make check` in a clean checkout.
3. Manually test on the supported Chrome, Safari, Firefox, and Edge versions: first-run creation; each record CRUD flow; linking/unlinking; contradiction with two records; checklist; report/Markdown/PDF; backup/import into a clean profile; clear-data confirmation; and service-worker update.
4. Run stored/imported XSS payload checks in all text inputs, notifications, reports, and exports. Test malformed/large JSON, Unicode, commas/newlines, and HTML-like text.
5. Test narrow mobile, tablet, laptop, and large desktop; keyboard-only; 200%/400% zoom; screen reader; reduced motion; and print/PDF.
6. Measure first-load, interaction, export, and offline-start results against targets: initial app shell under 500 KB uncompressed; common local interactions under 100 ms; a 500-record export under 2 seconds on representative hardware; and offline app-shell start under 3 seconds. Record results in the release issue.
7. Review dependency/license status (v1 has none), browser support, GitHub Pages configuration, HTTPS, custom domain, asset MIME types, and no analytics/error-reporting transmission.
8. Bored Polymath Studios completes go/no-go and publishes release notes. No pilot program is required for v1 by approved product decision.

## Incident, support, and deprecation

For a security incident: stop promotion, preserve a sanitized reproduction, use private GitHub security reporting, ship a fixed static release, invalidate old service-worker cache through a new named cache version, and publish non-sensitive release notes. Never request users’ investigation files for ordinary support. Offer a user-controlled diagnostic summary containing app version, schema version, storage health, and browser version only.

For deprecation, announce the final supported version, keep the export path working, publish migration guidance, and retain the static release for a documented period. Caveat Red cannot centrally delete local user data; users must clear it in Settings or browser site-data controls.
