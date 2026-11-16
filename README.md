<p align="center">
  <img src="assets/caveat-red-lockup.svg" alt="Caveat Red" width="760">
</p>

<p align="center">
  A private, local-first workspace for turning uncertainty into an auditable due-diligence record.
</p>

<p align="center">
  <a href="#what-it-does">What it does</a> ·
  <a href="#run-it-locally">Run it locally</a> ·
  <a href="#privacy">Privacy</a>
</p>

## Due diligence with a paper trail

Caveat Red helps an investigator separate what is known from what still needs verification. It organizes findings, claims, evidence, follow-up requests, contradictions, and a final working report in one focused local workspace.

The product is designed around a simple principle: a red flag is a reason to investigate, not a conclusion. Every concern should have a source trail, a stated limitation, and a next action.

## What it does

- Build and manage local investigations without an account or server.
- Assess technology, financial, commercial, leadership, operational, and verification risks with a structured checklist.
- Record claims alongside source material, evidence limits, and verification status.
- Track follow-up questions and save source-backed responses.
- Compare conflicting statements without inferring intent.
- Prioritize findings using severity and likelihood while keeping evidence confidence separate.
- Export the active investigation as JSON or a readable Markdown working report.

## Built for careful work

| Principle | How Caveat Red applies it |
| --- | --- |
| Facts before conclusions | Claims, evidence, findings, and contradictions remain distinct records. |
| Local by default | Records stay in the browser profile until you export them. |
| Useful uncertainty | Unknowns and unanswered questions are first-class states. |
| Clear next steps | Follow-ups turn concerns into specific, auditable requests. |

## Run it locally

This repository is a dependency-free static application.

1. Clone the repository.
2. Open [`dist/index.html`](dist/index.html) in a modern browser.
3. Create an investigation, or load the included sample from Settings.

For the smoothest local browser behavior, serve `dist/` from any static-file server. No backend, account, or database is required.

## Privacy

Caveat Red is local-first. Investigation records are stored in the browser profile and are not sent to a service by this application. Export JSON backups for any work you need to retain across browsers or devices.

## Status

This is a working prototype intended for private research and due-diligence workflows. It is not legal, investment, compliance, or fraud-detection advice.
