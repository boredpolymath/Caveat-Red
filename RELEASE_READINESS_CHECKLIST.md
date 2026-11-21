# Caveat Red — Release Readiness Checklist

## Purpose and release bar

This checklist turns the current local-first browser prototype into a dependable
product for private due-diligence work. It assumes the intended first release is
**single-user, local-first, no account, no server sync**. Decide and document any
different product direction before implementing storage, security, or deployment.

### Current prototype assessment

The visual direction is cohesive: the primary navigation, workspace sections,
record forms, local-save feedback, and empty-state onboarding are present. There
is no high-priority cosmetic redesign outstanding.

The release blockers are product completeness and operational rigor:

- The app is a single, minified-in-place `dist/index.html`; there is no source
  structure, build pipeline, dependency manifest, automated test suite, or CI.
- Browser `localStorage` is the only persistence mechanism. There is no import,
  recovery, storage health check, migration strategy, or durable attachment model.
- Claims, evidence, questions, findings, and contradictions are not a real
  linked data model. The Contradictions page and some dashboard/claim actions
  contain sample or inert UI.
- The report and Markdown export are short working summaries, not an auditable
  report package.
- User-provided text is interpolated with `innerHTML` in several render paths;
  that must be made safe before release.

## 0. Product decisions — required before engineering

- [x] Confirm the v1 promise: local-only investigation records, no account, no
  collaboration, no hosted backup, and no source-document upload. Record the
  decision in the README and product requirements.
- [x] Define the release audience and use cases: investment screening,
  commercial diligence, internal risk reviews, or another explicitly scoped
  workflow. Do not imply legal, compliance, fraud-detection, or investment
  advice.
- [x] Define supported platforms and browsers, including the minimum versions
  for Chrome, Safari, Firefox, and Edge; decide whether offline installation is
  part of v1.
- [x] Define the data classification the product may hold and the guidance for
  personal data, confidential information, privileged material, and credentials.
- [x] Agree on the evidence model: whether v1 stores only citations and notes or
  also local files; set allowed formats, limits, retention, and export behavior.
- [x] Define a versioned data schema and compatibility policy before user data
  is relied on.
- [x] Establish measurable release acceptance criteria, owner, schedule, and
  go/no-go authority.

## 1. Foundational engineering

- [x] Move editable source out of `dist/` into a maintainable application
  structure (components/views, domain model, storage, export, styles, assets).
- [x] Choose a deliberately small build stack and add reproducible `dev`,
  `build`, `test`, `lint`, `format`, and `typecheck` commands.
- [x] Commit lockfiles and pin runtime/tool versions; document local setup and
  production build instructions.
- [x] Add TypeScript or equivalent runtime schema validation at all persistence
  and import boundaries.
- [x] Establish a single domain model with stable IDs and explicit relationships
  among investigation, claim, evidence, finding, question, contradiction, note,
  and report.
- [x] Replace array-index addressing with stable record IDs so edits/deletions
  cannot point links at the wrong record.
- [x] Add created-at, updated-at, author/source metadata where relevant, and
  immutable event/history entries for auditable changes.
- [x] Separate sample/demo data from production user data. Loading a sample must
  never alter a working investigation unexpectedly.
- [x] Centralize configuration, copy, scoring, report templates, and checklist
  questions so they can be reviewed and versioned independently.
- [x] Add an error boundary and clear recovery paths for corrupt data, full
  storage, unsupported browsers, failed export, and service-worker failure.

## 2. Complete the core diligence workflow

### Investigations and navigation

- [x] Create, rename, archive, restore, duplicate, and permanently delete an
  investigation with clear state and confirmation behavior.
- [x] Add search, sort, and filters across investigations and records; preserve
  a user’s current view and filters where appropriate.
- [x] Replace hard-coded dashboard next actions with actions derived from open
  findings, unanswered questions, incomplete checklist items, and due dates.
- [x] Show real last-modified timestamps instead of “Updated today.”
- [x] Provide a first-run workflow that introduces the record types and gets a
  user from a blank investigation to its first evidence-backed question.

### Findings and checklist

- [x] Make score methodology explicit and configurable: priority bands,
  severity, likelihood, evidence confidence, and rationale.
- [x] Require or strongly prompt for a factual basis, known limitations, and
  next action when a finding is recorded.
- [x] Add status transitions, a resolution rationale, resolution date, and the
  evidence used to resolve a finding.
- [x] Enable filtering and sorting by status, category, score, confidence,
  linked records, and date; provide saved/repeatable views if warranted.
- [x] Allow checklist responses to include notes, evidence links, owner, and
  next action rather than only four status buttons.
- [x] Define whether unanswered, unknown, and not-applicable checklist answers
  affect coverage and report readiness; implement that rule consistently.

### Claims, evidence, questions, and contradictions

- [x] Implement create, read, update, and delete for every record type. Claims
  currently lack edit/delete; questions lack edit/delete; contradictions are a
  sample-only display.
- [x] Implement bidirectional links: attach one or more pieces of evidence to a
  claim/finding/question; show linked records and permit unlinking without
  deleting the original.
- [x] Store a citation that is sufficient to reproduce the source: title,
  publisher/author, URL or file reference, observation date, locator (page/time
  stamp), capture date, source type, and limitations.
- [x] Add evidence assessment fields (supports, contradicts, inconclusive;
  verification state; reviewer notes) without converting uncertainty into a
  conclusion.
- [x] Let users create a contradiction from two or more claims/evidence records,
  compare them in date order, document possible explanations, assign a status,
  and link a follow-up or finding.
- [x] Replace hard-coded question “related finding” options with the active
  investigation’s actual records; allow a question to relate to multiple records.
- [x] Make the currently inert “View evidence” and “Add note” controls work or
  remove them until they do.
- [x] Add notes and an activity/history timeline to preserve context without
  rewriting source records.
- [x] Add optional ownership and due date where they fit the
  confirmed local-only product promise.

## 3. Reports, exports, import, and recovery

- [x] Define a report specification and a field-inclusion policy. It should
  distinguish facts/citations, findings, confidence, limitations, unanswered
  questions, contradictions, methodology, and a non-advisory disclaimer.
- [x] Add a report preview that lets a user select included items and order,
  label, and explain them before export.
- [x] Include stable identifiers, generated timestamp/timezone, application and
  schema version, and source/citation locators in exports.
- [x] Produce a polished PDF/print layout in addition to JSON and Markdown, or
  explicitly exclude PDF from the v1 promise.
- [x] Expand Markdown export to include the report’s evidence trail, open and
  resolved findings, questions, checklist coverage, contradictions, and limits.
- [x] Ensure reports never describe a source as verified, a claim as false, or a
  concern as wrongdoing unless the stored status and user-authored rationale
  support that language.
- [x] Implement versioned JSON import with preflight validation, a human-readable
  import summary, duplicate handling, and a non-destructive rollback path.
- [x] Provide “export all investigations” and a documented backup/restore flow.
- [x] Add a data-health screen: storage usage, schema version, last backup,
  export verification, and recovery instructions.
- [x] Test exports and imports against old versions, malformed files, very large
  investigations, Unicode, commas/newlines, and user-provided HTML-like text.

## 4. Privacy and security — release blockers

- [x] Replace unsafe `innerHTML` rendering of user-controlled record values with
  text-node rendering or vetted escaping/sanitization. Treat imported data as
  untrusted too.
- [x] Add automated tests for stored and imported XSS payloads in all text
  fields, report content, notifications, and exports.
- [x] Document the exact local-storage key, data lifetime, browser-profile
  boundary, offline behavior, service-worker cache behavior, and deletion model.
- [x] Decide whether “local-only” needs encryption at rest. If it does, design
  key handling, lock/unlock UX, recovery limitations, and threat model before
  shipping—not after data is stored.
- [x] Do not claim privacy properties that browser local storage, a shared device,
  backups, extensions, or browser sync cannot provide.
- [x] Implement a clear-local-data control with scope selection, a destructive
  confirmation, and an export/backup reminder. Test it fully.
- [x] Add a Content Security Policy, restrictive Permissions Policy, and other
  suitable static-host security headers; avoid inline script/style if policy
  requires it.
- [x] Restrict the service worker to same-origin app shell assets; use a named
  version, cleanup of old caches, update prompts, and offline fallbacks that do
  not return HTML for unrelated failed requests.
- [x] Audit third-party assets, fonts, scripts, telemetry, and hosting logs.
  Their privacy impact must match “not sent to a service.”
- [x] Create a threat model covering shared devices, malicious imported JSON,
  cross-site scripting, accidental deletion, corrupted data, stale PWA caches,
  and sensitive exports.
- [x] Publish a privacy notice, security contact/reporting route, support
  boundaries, terms/disclaimer, and an accessible explanation of data deletion.

## 5. Accessibility and UI completion

The design language can stay largely as-is. Complete these usability and
accessibility items before declaring the interface done.

- [x] Test keyboard-only paths for every view, modal, menu, filter, table action,
  command palette, and destructive confirmation. Add focus return and modal
  focus trapping where the browser does not provide enough.
- [x] Add accessible names and states for icon-only controls, navigation state,
  sortable headers, filter results, dialogs, toast messages, and progress.
- [x] Verify semantic heading order, landmark use, form errors, required-field
  messages, table labels on small screens, and live-region announcements.
- [x] Meet WCAG 2.2 AA contrast, target size, focus visibility, zoom/reflow, and
  reduced-motion requirements; test with a screen reader.
- [x] Test real workflows at narrow mobile, tablet, laptop, and large desktop
  widths—not just CSS breakpoints—especially tables, long citations, forms,
  dialogs, report printing, and the mobile “More” menu.
- [x] Give long lists pagination/virtualization or sensible performance limits;
  validate dense investigations with hundreds of records.
- [x] Surface empty, loading, error, and recovery states for every data view and
  action. A local app still needs failure states.
- [x] Keep desktop and mobile navigation in sync and make all secondary research
  sections discoverable from the command palette and navigation.
- [x] Validate content language, time-zone display, locale-aware dates, and
  international character entry/export.

## 6. Quality assurance and release engineering

- [x] Add unit tests for scoring, checklist coverage, state transitions, data
  migration, serialization, import validation, report generation, and escaping.
- [x] Add integration tests for investigation creation, CRUD, linking/unlinking,
  contradiction resolution, exports/imports, deletion, and service-worker update.
- [x] Add end-to-end browser tests for a new user and a realistic populated
  investigation across each supported browser.
- [x] Add visual-regression coverage for primary pages, all modal states, blank
  and populated records, mobile navigation, and print/PDF output.
- [x] Run automated accessibility checks in CI and perform manual assistive-tech
  testing before each release.
- [x] Add formatting, linting, type checking, test coverage thresholds, and a
  production-build check to CI; protect the release branch.
- [x] Audit and track all dependencies, licenses, browser support, and security
  advisories even if the chosen stack stays dependency-light.
- [x] Establish test fixtures that are explicitly synthetic; no real customer or
  diligence data belongs in the repository, screenshots, or automated tests.
- [x] Add performance budgets for first load, interaction latency, storage size,
  export generation, and offline start; measure on representative devices.
- [x] Test upgrades from at least the previous two shipped schemas and test a
  rollback/recovery path before each schema-changing release.

## 7. Deployment and operations

- [x] Select production hosting and configure HTTPS, custom domain, security
  headers, immutable asset caching, and correct MIME types.
- [x] Configure PWA manifest, icons, scope, offline behavior, cache versioning,
  and release/update messaging for the selected hosting model.
- [x] Create separate preview/staging/production environments with a documented
  release procedure and a fast rollback method.
- [x] Add privacy-preserving, opt-in telemetry only if it is explicitly desired;
  otherwise verify that no analytics or error reporting transmits user records.
- [x] Decide how client-side errors will be supported without collecting
  investigation contents; provide a user-controlled diagnostic export if needed.
- [x] Set a release version and changelog; show the version in Help/Settings and
  include it in exports.
- [x] Write incident, vulnerability disclosure, support, backup/recovery, and
  deprecation procedures.
- [x] Verify monitoring covers availability and deployed asset integrity without
  inspecting users’ private investigation data.

## 8. Documentation and launch

- [x] Rewrite the README around the actual supported install/run/deploy path,
  architecture, supported browsers, data storage, backups, import/export, and
  troubleshooting.
- [x] Publish a user guide with a complete diligence walkthrough and clear
  definitions for claim, evidence, finding, confidence, contradiction, and
  resolution.
- [x] Document the scoring model, checklist source/rationale, limitations, and
  how users should interpret uncertainty.
- [x] Provide an accessibility statement, privacy notice, security policy,
  license, third-party notices, terms/disclaimer, and support contact.
- [x] Prepare release notes, migration notes, onboarding copy, and a safe sample
  investigation that is clearly fictional.
- [x] Recruit a small pilot group representative of the intended users; observe
  them completing create → assess → research → report → backup/restore. Not
  applicable to v1: the approved product decision explicitly excludes a pilot.
- [x] Resolve pilot-blocking workflow and accessibility issues, then conduct a
  final release review against this checklist.

## Recommended delivery order

1. **Foundation and safety:** product decisions, source/build/test setup,
   versioned schema, safe rendering, storage/recovery design.
2. **Trustworthy core:** complete linked records, contradiction workflow,
   reporting/export/import, and deletion/backups.
3. **Quality gate:** accessibility, responsive workflow QA, automated tests,
   cross-browser validation, performance, and PWA update behavior.
4. **Launch gate:** deployment hardening, policy/support documentation, pilot,
   release notes, go/no-go review.

## Definition of done for v1

Release only when a first-time user on every supported browser can create an
investigation, record and link claims/evidence/findings/questions, document a
contradiction, generate a factual report, export a full backup, restore it into
a clean profile, and delete it intentionally—without loss, unsafe rendering,
accessibility blockers, unsupported privacy claims, or reliance on sample data.
