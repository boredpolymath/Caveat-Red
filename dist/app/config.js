export const APP_COPY = Object.freeze({
  advisory: 'This working record distinguishes reported information from assessment. It is not legal, compliance, fraud-detection, or investment advice, and does not establish wrongdoing.',
  reportMethod: 'Priority is severity × likelihood. Evidence confidence is reported separately. Unknowns, limitations, and unverified sources remain unresolved.',
  storageWarning: 'Data lives only in this browser profile. Browser sync, device backups, extensions, and shared devices may expose data.'
});

export const SCORE_BANDS = Object.freeze([
  { name: 'High', min: 16 }, { name: 'Elevated', min: 10 }, { name: 'Moderate', min: 5 }, { name: 'Low', min: 0 }
]);

export const RECORD_LABELS = Object.freeze({ findings: 'Finding', claims: 'Claim', evidence: 'Evidence', questions: 'Question', contradictions: 'Contradiction', notes: 'Note', checklist: 'Checklist response' });
export const RECORD_TYPES = Object.freeze(['findings', 'claims', 'evidence', 'questions', 'contradictions', 'notes']);
export const REPORT_SECTIONS = Object.freeze(['findings', 'questions', 'contradictions']);

export const RECORD_FIELDS = Object.freeze({
  findings: [['title', 'Title', 'text', true], ['category', 'Category', 'text'], ['status', 'Status', 'select', false, ['Open', 'Investigating', 'Resolved']], ['severity', 'Severity (1–5)', 'number', true], ['likelihood', 'Likelihood (1–5)', 'number', true], ['confidence', 'Evidence confidence', 'select', false, ['Low', 'Medium', 'High']], ['factualBasis', 'Factual basis', 'textarea', true], ['limitations', 'Known limitations', 'textarea', true], ['nextAction', 'Next action', 'textarea', true], ['owner', 'Owner (optional)', 'text'], ['dueDate', 'Due date (optional)', 'date'], ['resolutionRationale', 'Resolution rationale', 'textarea'], ['resolutionDate', 'Resolution date', 'date']],
  claims: [['statement', 'Claim statement', 'textarea', true], ['claimant', 'Claimant / source', 'text', true], ['observationDate', 'Observation date', 'date'], ['assessment', 'Assessment', 'select', false, ['Unassessed', 'Supported', 'Partially supported', 'Contradicted', 'Inconclusive']], ['limitations', 'Limitations', 'textarea']],
  evidence: [['title', 'Title', 'text', true], ['publisher', 'Publisher / author', 'text'], ['url', 'URL or file reference', 'url'], ['observationDate', 'Observation date', 'date'], ['captureDate', 'Capture date', 'date'], ['locator', 'Locator (page, timestamp, etc.)', 'text'], ['sourceType', 'Source type', 'select', false, ['Primary', 'Secondary', 'Unverified']], ['assessment', 'Assessment', 'select', false, ['Supports', 'Contradicts', 'Inconclusive']], ['verification', 'Verification state', 'select', false, ['Recorded', 'Reviewed', 'Verified', 'Not independently verified']], ['limitations', 'Limitations', 'textarea'], ['reviewerNotes', 'Reviewer notes', 'textarea']],
  questions: [['text', 'Question', 'textarea', true], ['status', 'Status', 'select', false, ['Open', 'Answered', 'Deferred', 'Closed']], ['response', 'Response / current answer', 'textarea'], ['owner', 'Owner (optional)', 'text'], ['dueDate', 'Due date (optional)', 'date'], ['nextAction', 'Next action', 'textarea']],
  contradictions: [['title', 'Title', 'text', true], ['possibleExplanations', 'Possible explanations', 'textarea', true], ['status', 'Status', 'select', false, ['Open', 'Investigating', 'Resolved']], ['nextAction', 'Follow-up / next action', 'textarea'], ['resolutionRationale', 'Resolution rationale', 'textarea']],
  notes: [['text', 'Note', 'textarea', true]]
});
