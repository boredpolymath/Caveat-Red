# Release-readiness evidence

This is the implementation and evidence register for `RELEASE_READINESS_CHECKLIST.md`. It deliberately separates shipped controls from actions that must be performed by the release owner on deployed browsers/hosting.

| Checklist area | Status | Evidence / remaining release action |
| --- | --- | --- |
| Product decisions | Complete | [Product requirements](PRODUCT_REQUIREMENTS.md) records the approved local-only audience, browser support, evidence, encryption, scoring, compatibility, owner, and acceptance policy. |
| Source/build/configuration | Complete | `src/`, `public/`, `scripts/`, Makefile, pinned Python 3.9, no dependencies, deterministic build. |
| Domain, persistence, recovery | Complete | Stable IDs, record links, history, schema validation/migration, storage health, import preflight/duplicates, export-all, clear confirmation, and recovery UI. |
| Core workflow | Complete | Investigation lifecycle; record CRUD; linking/unlinking; checklist; questions; contradiction records; notes; derived next actions; timestamps; search/filter. |
| Reporting | Complete | Selectable report preview, factual language, Markdown, JSON backup, print/PDF layout, app/schema/timestamp/citation fields. |
| Privacy/security | Complete in code | DOM text-node rendering, no third-party runtime assets, CSP/referrer/feature policy meta, same-origin versioned service worker, threat model, privacy/security/support terms. Host response-header limitation is documented below. |
| Accessibility/UI | Implemented; manual gate required | Semantic controls, native dialog/focus behavior, labels, responsive/print/reduced-motion styles. Complete the manual matrix in [RELEASE.md](RELEASE.md) before approval. |
| Automated QA/CI | Baseline complete; browser suites require runner selection | `make check` runs on pull requests and production deployments and blocks forbidden unsafe rendering/build omissions. The repository intentionally has no Node/browser runtime; adopt a supported Playwright/WebDriver runner before claiming cross-browser, visual-regression, coverage, or automated assistive-tech results. |
| Deployment/operations | Configuration complete; owner action required | GitHub Pages workflow, rollback and incident procedures are included. Enable GitHub Actions Pages source, custom domain/HTTPS, branch protection, and availability/integrity monitoring in repository/account settings. |
| Documentation/launch | Complete except external execution | README, user guide, privacy, security, accessibility, terms, license, third-party notices, changelog, threat model, and release procedure exist. Product decision explicitly excludes a v1 pilot program. |

## Release blockers outside the working tree

1. **GitHub Pages administration:** enable the workflow as the Pages source; set domain/HTTPS; enable branch protection and required `Quality checks`; configure a privacy-preserving availability/asset-integrity monitor.
2. **Host security headers:** GitHub Pages cannot be configured in-repository to emit custom response headers. The meta CSP is in place, but if policy requires HTTP CSP/Permissions-Policy/HSTS controls, front Pages with an approved CDN/host before release.
3. **Manual acceptance:** execute and record the supported-browser, keyboard/screen-reader, responsive/print, PWA-update, upgrade/rollback, performance, and hostile-import matrix in [RELEASE.md](RELEASE.md). No browser engine is installed in this workspace to fabricate those results.
4. **Release authority:** Bored Polymath Studios must set the actual release date, sign go/no-go, and publish/review the release from the protected production branch.
