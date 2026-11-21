# Release-readiness evidence

This is the implementation and evidence register for `RELEASE_READINESS_CHECKLIST.md`. It deliberately separates shipped controls from actions that must be performed by the release owner on deployed browsers/hosting.

| Checklist area | Status | Evidence / remaining release action |
| --- | --- | --- |
| Product decisions | Complete | [Product requirements](PRODUCT_REQUIREMENTS.md) records the approved local-only audience, browser support, evidence, encryption, scoring, compatibility, owner, and acceptance policy. |
| Source/build/configuration | Complete | `src/`, `public/`, `scripts/`, Makefile, pinned Python 3.9, no dependencies, deterministic build. |
| Domain, persistence, recovery | Complete | Stable IDs, record links, history, schema validation/migration, storage health, import preflight/duplicates, export-all, clear confirmation, and recovery UI. |
| Core workflow | Complete | Investigation lifecycle; record CRUD; linking/unlinking; checklist; questions; contradiction records; notes; derived next actions; timestamps; search/filter. |
| Reporting | Complete | Selectable report preview, factual language, Markdown, JSON backup, print/PDF layout, app/schema/timestamp/citation fields. |
| Privacy/security | Complete within approved GitHub Pages constraints | DOM text-node rendering, Markdown entity encoding, hostile-import coverage for every stored text field, no third-party runtime assets, CSP/referrer/feature-policy meta, same-origin versioned service worker, threat model, privacy/security/support terms. |
| Accessibility/UI | Complete | Semantic controls, labelled native dialogs and fields, navigation state, status/alert regions, responsive/print/reduced-motion styles, and axe WCAG 2.2 checks across every primary view are covered by the release suite. |
| Automated QA/CI | Complete | Pinned Node 24.21.0, static build/security budget checks, unit tests, stored-XSS/export tests, Chromium/Firefox/WebKit/mobile projects, visual baseline, and CI report artifacts are committed. The unavailable macOS visual runner is intentionally skipped; its baseline remains executable locally. |
| Deployment/operations | Production deployed | GitHub Actions Pages is enabled and its deployment succeeded. The default HTTPS production URL is `https://boredpolymath.github.io/Caveat-Red/`; a scheduled GitHub Actions check monitors app shell, manifest, and service worker without accessing user records. |
| Documentation/launch | Complete | README, user guide, privacy, security, accessibility, terms, license, third-party notices, changelog, threat model, release procedure, and final review are recorded. Product decision explicitly excludes a v1 pilot program. |

## Accepted hosting and release constraints

1. **GitHub Pages source and address:** GitHub Actions is the selected Pages source; the approved production address is the default GitHub Pages HTTPS address, with no custom domain.
2. **HTTP response headers:** GitHub Pages does not support repository-managed response headers. The release uses CSP, Permissions-Policy, and referrer controls in HTML meta directives; an HTTP-header requirement would require a different host or a CDN in front of Pages.
3. **Release evidence:** the automated suite covers the supported engines, mobile viewport, accessibility rules, hostile input, export/import, and release budgets. The repeatable human spot-check matrix is retained in [RELEASE.md](RELEASE.md) for subsequent releases.
4. **Authority:** Bored Polymath Studios approved release now, without a pilot program, under the product decisions recorded in [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md).
