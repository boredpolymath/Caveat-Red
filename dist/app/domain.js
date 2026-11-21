import { SCORE_BANDS } from './config.js';

export const APP_VERSION = '1.0.0';
export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'caveat-red.workspace.v1';

export const checklistQuestions = Object.freeze({
  'Technology & product': ['Has the claimed capability been independently tested under realistic conditions?', 'Are meaningful technical limitations recorded?'],
  'Financial integrity': ['Are revenue figures supported by primary records?', 'Are projection assumptions documented?'],
  'Commercial traction': ['Can reported customer or deployment counts be independently confirmed?', 'Are pilots and paying customers distinguished?'],
  'Leadership & governance': ['Are leadership credentials verifiable?', 'Is there independent oversight for key decisions?'],
  'Operational execution': ['Is readiness supported by evidence?', 'Are material dependencies identified?'],
  'Transparency & verification': ['Has reasonable supporting documentation been provided?', 'Can results be reproduced or independently confirmed?']
});

export const newId = (prefix) => `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`}`;
export const now = () => new Date().toISOString();
export const clone = (value) => JSON.parse(JSON.stringify(value));

const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
const safeText = (value, max = 12000) => typeof value === 'string' && value.length <= max;
const validRecord = (record, type) => object(record) && typeof record.id === 'string' && record.type === type && safeText(record.createdAt, 64) && safeText(record.updatedAt, 64);

export function emptyInvestigation(name = 'Untitled investigation') {
  const createdAt = now();
  return {
    id: newId('investigation'), type: 'investigation', name, status: 'active', industry: '', stage: 'Screening', purpose: '',
    createdAt, updatedAt: createdAt, source: 'user', records: {
      claims: [], evidence: [], findings: [], questions: [], contradictions: [], notes: [], checklist: []
    }, history: [{ id: newId('event'), at: createdAt, action: 'created', summary: 'Investigation created locally.' }]
  };
}

export function emptyWorkspace() {
  return { schemaVersion: SCHEMA_VERSION, appVersion: APP_VERSION, activeInvestigationId: null, investigations: [], preferences: { reducedMotion: false, lastBackupAt: null }, createdAt: now(), updatedAt: now() };
}

function normalizeRecord(record, type) {
  const createdAt = safeText(record.createdAt, 64) ? record.createdAt : now();
  return {
    ...record, id: typeof record.id === 'string' ? record.id : newId(type), type,
    createdAt, updatedAt: safeText(record.updatedAt, 64) ? record.updatedAt : createdAt,
    links: strings(record.links) ? record.links : [], source: safeText(record.source, 500) ? record.source : 'user'
  };
}

function normalizeInvestigation(investigation) {
  const base = emptyInvestigation(safeText(investigation?.name, 300) ? investigation.name : 'Recovered investigation');
  if (!object(investigation)) return base;
  base.id = typeof investigation.id === 'string' ? investigation.id : base.id;
  for (const key of ['name', 'status', 'industry', 'stage', 'purpose', 'createdAt', 'updatedAt', 'source']) if (safeText(investigation[key], 12000)) base[key] = investigation[key];
  const records = object(investigation.records) ? investigation.records : {};
  for (const type of ['claims', 'evidence', 'findings', 'questions', 'contradictions', 'notes', 'checklist']) {
    base.records[type] = Array.isArray(records[type]) ? records[type].filter(object).map((record) => normalizeRecord(record, type.slice(0, -1))) : [];
  }
  base.history = Array.isArray(investigation.history) ? investigation.history.filter(object).map((event) => ({ id: typeof event.id === 'string' ? event.id : newId('event'), at: safeText(event.at, 64) ? event.at : now(), action: safeText(event.action, 100) ? event.action : 'updated', summary: safeText(event.summary, 12000) ? event.summary : '' })) : base.history;
  return base;
}

function migrateLegacy(payload) {
  if (!object(payload)) throw new Error('The imported file is not a JSON object.');
  if (payload.schemaVersion === SCHEMA_VERSION && Array.isArray(payload.investigations)) return payload;
  if (payload.investigation && (payload.findings || payload.claims || payload.evidence || payload.questions)) {
    const investigation = emptyInvestigation(payload.investigation.companyName || 'Imported investigation');
    investigation.industry = payload.investigation.industry || '';
    investigation.stage = payload.investigation.stage || 'Screening';
    for (const type of ['findings', 'claims', 'evidence', 'questions']) {
      investigation.records[type] = (payload[type] || []).filter(object).map((record) => normalizeRecord(record, type.slice(0, -1)));
    }
    return { ...emptyWorkspace(), investigations: [investigation], activeInvestigationId: investigation.id };
  }
  throw new Error('This file uses an unsupported data schema.');
}

export function validateWorkspace(raw) {
  const migrated = migrateLegacy(raw);
  if (!Array.isArray(migrated.investigations)) throw new Error('The workspace has no investigations array.');
  const workspace = emptyWorkspace();
  workspace.investigations = migrated.investigations.map(normalizeInvestigation);
  workspace.activeInvestigationId = typeof migrated.activeInvestigationId === 'string' ? migrated.activeInvestigationId : workspace.investigations[0]?.id || null;
  workspace.preferences = { ...workspace.preferences, ...(object(migrated.preferences) ? migrated.preferences : {}) };
  workspace.createdAt = safeText(migrated.createdAt, 64) ? migrated.createdAt : workspace.createdAt;
  workspace.updatedAt = safeText(migrated.updatedAt, 64) ? migrated.updatedAt : now();
  return workspace;
}

export function loadWorkspace() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyWorkspace();
  try { return validateWorkspace(JSON.parse(raw)); } catch (error) { return { ...emptyWorkspace(), recoveryError: `Stored data could not be opened: ${error.message}` }; }
}

export function saveWorkspace(workspace) {
  const candidate = validateWorkspace(workspace);
  candidate.updatedAt = now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidate));
  return candidate;
}

export function activeInvestigation(workspace) { return workspace.investigations.find((item) => item.id === workspace.activeInvestigationId) || null; }
export function addEvent(investigation, action, summary) { investigation.history.unshift({ id: newId('event'), at: now(), action, summary }); investigation.updatedAt = now(); }
export function score(finding) { return Number(finding.severity || 0) * Number(finding.likelihood || 0); }
export function band(finding) { const value = score(finding); return SCORE_BANDS.find((item) => value >= item.min).name; }
export function checklistCoverage(investigation) {
  const answers = investigation.records.checklist;
  const assessed = answers.filter((item) => ['Concern', 'No concern', 'Not applicable'].includes(item.status)).length;
  const unknown = answers.filter((item) => item.status === 'Unknown').length;
  return { total: Object.values(checklistQuestions).flat().length, assessed, unknown, percent: Math.round((assessed / Object.values(checklistQuestions).flat().length) * 100) };
}
export function recordById(investigation, id) { return Object.values(investigation.records).flat().find((record) => record.id === id) || null; }
export function linkedRecords(investigation, record) { return (record.links || []).map((id) => recordById(investigation, id)).filter(Boolean); }
export function linkRecords(investigation, ids) { ids.forEach((id) => { const record = recordById(investigation, id); if (record) record.links = [...new Set([...(record.links || []), ...ids.filter((other) => other !== id)])]; }); }
export function unlinkRecords(investigation, ids) { ids.forEach((id) => { const record = recordById(investigation, id); if (record) record.links = (record.links || []).filter((other) => !ids.includes(other)); }); }
export function sampleWorkspace() {
  const workspace = emptyWorkspace(); const investigation = emptyInvestigation('Northstar Materials — fictional sample');
  investigation.source = 'sample'; investigation.purpose = 'Practice the workflow with fictional records only.'; investigation.industry = 'Industrial technology';
  const claim = normalizeRecord({ statement: 'The process is deployed at 40 active sites.', claimant: 'Fictional sales deck', observationDate: '2026-10-07', assessment: 'Unassessed' }, 'claim');
  const evidence = normalizeRecord({ title: 'Fictional customer-call note', publisher: 'Sample source', sourceType: 'Primary', verification: 'Recorded', observationDate: '2026-10-12', locator: 'Call note 2', assessment: 'Inconclusive', limitations: 'Synthetic sample; not a real source.' }, 'evidence');
  const finding = normalizeRecord({ title: 'Definition of “active site” needs verification', category: 'Commercial traction', severity: 3, likelihood: 3, confidence: 'Low', status: 'Open', factualBasis: 'The term is not defined in the fictional deck.', limitations: 'No primary customer data is present.', nextAction: 'Request a definition and site list.' }, 'finding');
  claim.links = [evidence.id, finding.id]; evidence.links = [claim.id, finding.id]; finding.links = [claim.id, evidence.id];
  investigation.records.claims.push(claim); investigation.records.evidence.push(evidence); investigation.records.findings.push(finding); addEvent(investigation, 'sample loaded', 'Fictional sample loaded into a separate investigation.');
  workspace.investigations = [investigation]; workspace.activeInvestigationId = investigation.id; return workspace;
}
