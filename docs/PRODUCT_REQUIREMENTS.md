# Caveat Red v1 product requirements

## Product decision record

| Decision | v1 policy |
| --- | --- |
| Promise | One person’s local browser workspace; no account, sync, collaboration, server backup, or attachment upload. |
| Audience | Internal investment and commercial diligence teams. |
| Advice boundary | Not legal, compliance, fraud-detection, or investment advice. |
| Evidence | Citation metadata and notes only; no source-file contents. |
| Data | Do not store credentials, privileged material, highly sensitive personal data, or data prohibited by organizational policy. |
| Encryption | No application encryption at rest in v1. Browser-profile and device protections remain the user’s responsibility. |
| Browser support | Current and previous major Chrome, Safari, Firefox, and Edge. |
| Offline | HTTPS PWA app-shell caching; no guarantee for arbitrary network resources. |
| Owner | Bored Polymath Studios. |
| Go/no-go | Bored Polymath Studios after the release procedure passes. |

## Schema and compatibility

Schema version 1 models an investigation, claim, evidence, finding, question, contradiction, note, checklist response, and immutable activity event. Each record has a stable UUID-like ID, created/updated timestamps, source metadata, and bidirectional links. Imports are validated and normalized at the persistence boundary. Versioned migration accepts the previous prototype export shape as a legacy import; later releases must retain migration tests for the two immediately previous shipped schemas.

## Acceptance criteria

Release only when the automated checks pass; manual supported-browser workflows pass; no critical/high security or accessibility defect is open; a clean-profile JSON restore succeeds; performance measurements meet the documented targets; and the owner completes the final review. No pilot program is planned for v1 by product decision; structured internal manual acceptance replaces that gate.

## Scoring and checklist rules

Priority = severity (1–5) × likelihood (1–5). Priority bands: High 16–25, Elevated 10–15, Moderate 5–9, Low 1–4. Evidence confidence is Low/Medium/High and never changes the priority arithmetic. Findings require factual basis, known limitations, and next action; resolving requires a rationale. Checklist coverage counts `Concern`, `No concern`, and `Not applicable` as assessed; `Unknown` and unanswered responses remain gaps.
