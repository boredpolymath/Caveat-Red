# Threat model

| Threat | Control / residual risk |
| --- | --- |
| Shared device or browser profile | Local-only records can be read by someone with profile/device access. No app encryption in v1; warn users and recommend device/profile controls. |
| Malicious import JSON | Import size limit, JSON parsing, schema normalization, and DOM text-node rendering. Imported fields are treated as untrusted. |
| Stored or imported XSS | No user-controlled `innerHTML`, inline script, remote script, or dynamic code evaluation; restrictive meta CSP. Manual release test includes payloads in every field and export. |
| Accidental deletion | Destructive confirmation, export reminder, full backup, and non-destructive import. Permanent deletion remains unrecoverable without an export. |
| Corrupt storage/full quota | Runtime validation, recovery message, storage-health display, and export guidance. |
| Stale PWA cache | Named service-worker cache, cleanup on activate, same-origin GET-only caching, update notice, and offline 504 for non-navigation failures. |
| Sensitive exports | Exports are user-controlled and unencrypted. Warn users to store them in approved locations. |
| Supply chain/privacy | No runtime dependencies, fonts, telemetry, or remote assets. Review GitHub Actions before modification. |

GitHub Pages cannot provide repository-defined response headers. A meta CSP limits the document but does not replace host-managed headers. If the hosting risk policy requires response `Permissions-Policy`, HSTS control, or custom CSP response headers, place the site behind an approved CDN/host before release.
