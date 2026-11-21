import assert from 'node:assert/strict';
import test from 'node:test';
import { band, checklistCoverage, emptyInvestigation, score, validateWorkspace } from '../../src/app/domain.js';
import { mergeImport, parseImport } from '../../src/app/storage.js';

test('priority score and bands remain explicit and deterministic', () => {
  assert.equal(score({ severity: 4, likelihood: 4 }), 16);
  assert.equal(band({ severity: 4, likelihood: 4 }), 'High');
  assert.equal(band({ severity: 3, likelihood: 3 }), 'Moderate');
});

test('unknown checklist answers do not count toward assessed coverage', () => {
  const investigation = emptyInvestigation('Synthetic');
  investigation.records.checklist.push({ status: 'Concern' }, { status: 'Unknown' }, { status: 'Not applicable' });
  const coverage = checklistCoverage(investigation);
  assert.equal(coverage.assessed, 2);
  assert.equal(coverage.unknown, 1);
});

test('legacy imports migrate into the current workspace schema', () => {
  const workspace = validateWorkspace({ investigation: { companyName: 'Legacy synthetic' }, findings: [{ title: 'Legacy finding' }] });
  assert.equal(workspace.schemaVersion, 1);
  assert.equal(workspace.investigations[0].name, 'Legacy synthetic');
  assert.equal(workspace.investigations[0].records.findings[0].type, 'finding');
});

test('malformed imports are rejected and duplicate investigations are retained safely', () => {
  assert.throws(() => parseImport('{not-json}'), /valid JSON/);
  const current = validateWorkspace({ schemaVersion: 1, investigations: [emptyInvestigation('Synthetic')] });
  const incoming = validateWorkspace({ schemaVersion: 1, investigations: [current.investigations[0]] });
  const merged = mergeImport(current, incoming);
  assert.equal(merged.summary.renamed, 1);
  assert.equal(merged.workspace.investigations.length, 2);
});
