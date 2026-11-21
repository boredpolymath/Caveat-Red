import { APP_VERSION, SCHEMA_VERSION, STORAGE_KEY, validateWorkspace } from './domain.js';

export function storageHealth() {
  const value = localStorage.getItem(STORAGE_KEY) || '';
  let used = new Blob([value]).size;
  let available = true;
  try { localStorage.setItem(`${STORAGE_KEY}.probe`, 'ok'); localStorage.removeItem(`${STORAGE_KEY}.probe`); } catch { available = false; }
  return { key: STORAGE_KEY, bytes: used, available, schemaVersion: SCHEMA_VERSION, appVersion: APP_VERSION };
}

export function parseImport(text) {
  if (typeof text !== 'string' || text.length > 25_000_000) throw new Error('Choose a JSON backup smaller than 25 MB.');
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('This is not valid JSON.'); }
  return validateWorkspace(parsed);
}

export function mergeImport(current, incoming, onDuplicate = 'keep-both') {
  const copy = (value) => typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
  const result = copy(current);
  const existing = new Set(result.investigations.map((item) => item.id));
  const summary = { imported: 0, skipped: 0, renamed: 0 };
  incoming.investigations.forEach((investigation) => {
    if (existing.has(investigation.id) && onDuplicate === 'skip') { summary.skipped += 1; return; }
    const item = copy(investigation);
    if (existing.has(item.id)) { item.id = `${item.id}-imported-${Date.now()}`; item.name = `${item.name} (imported)`; summary.renamed += 1; }
    result.investigations.push(item); existing.add(item.id); summary.imported += 1;
  });
  return { workspace: validateWorkspace(result), summary };
}
