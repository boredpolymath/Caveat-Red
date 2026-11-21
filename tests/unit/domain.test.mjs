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

test('large Unicode and multiline backups preserve records within the documented import limit', () => {
  const workspace = validateWorkspace({ schemaVersion: 1, investigations: [emptyInvestigation('Résumé — synthetic, comma\nand newline')] });
  const records = workspace.investigations[0].records.notes;
  for (let index = 0; index < 500; index += 1) records.push({ id: `note_${index}`, type: 'note', text: `証拠 ${index}, line one\nline two`, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] });
  const startedAt = performance.now();
  const restored = parseImport(JSON.stringify(workspace));
  assert.ok(performance.now() - startedAt < 2_000, '500-record import meets the two-second local budget');
  assert.equal(restored.investigations[0].records.notes.length, 500);
  assert.equal(restored.investigations[0].records.notes[499].text, '証拠 499, line one\nline two');
  assert.throws(() => parseImport(' '.repeat(25_000_001)), /smaller than 25 MB/);
});
