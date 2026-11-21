const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs/promises');

async function createInvestigation(page, name = 'Synthetic diligence review') {
  await page.goto('/');
  await page.getByRole('button', { name: 'New investigation' }).click();
  await page.locator('input[name="name"]').fill(name);
  await page.locator('input[name="industry"]').fill('Synthetic testing');
  await page.getByRole('button', { name: 'Save investigation' }).click();
  await expect(page.getByRole('heading', { name })).toBeVisible();
}

test('new investigator can create, assess, link, report, and back up a synthetic record', async ({ page }) => {
  await createInvestigation(page);
  await page.getByRole('button', { name: 'Records' }).click();
  await page.getByRole('button', { name: 'Add evidence' }).click();
  await page.locator('input[name="title"]').fill('Synthetic source note');
  await page.locator('input[name="publisher"]').fill('Synthetic publisher');
  await page.locator('input[name="url"]').fill('https://example.test/source');
  await page.getByRole('button', { name: 'Save evidence' }).click();
  await expect(page.getByText('Synthetic source note')).toBeVisible();

  await page.getByRole('button', { name: 'Add finding' }).click();
  await page.locator('input[name="title"]').fill('Synthetic finding');
  await page.locator('input[name="category"]').fill('Testing');
  await page.locator('input[name="severity"]').fill('3');
  await page.locator('input[name="likelihood"]').fill('2');
  await page.locator('textarea[name="factualBasis"]').fill('Synthetic factual basis.');
  await page.locator('textarea[name="limitations"]').fill('Synthetic limitation.');
  await page.locator('textarea[name="nextAction"]').fill('Synthetic next action.');
  await page.locator('input[name="links"]').first().check();
  await page.getByRole('button', { name: 'Save finding' }).click();
  await expect(page.getByRole('heading', { name: 'Synthetic finding' })).toBeVisible();

  await page.getByRole('button', { name: 'Report' }).click();
  await page.locator('input[name="report-label"]').fill('Synthetic report');
  await expect(page.getByRole('heading', { name: 'Synthetic report' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  expect((await download).suggestedFilename()).toMatch(/\.md$/);
});

test('stored and imported HTML-like text stays text, not executable markup or raw Markdown', async ({ page }) => {
  const payload = '<img src=x data-xss="unsafe">';
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: 'caveat-red.workspace.v1',
    value: { schemaVersion: 1, investigations: [{ id: 'investigation_x', name: payload, industry: payload, stage: payload, purpose: payload, status: 'active', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', records: { claims: [{ id: 'claim_x', type: 'claim', statement: payload, claimant: payload, limitations: payload, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] }], evidence: [{ id: 'evidence_x', type: 'evidence', title: payload, publisher: payload, url: payload, locator: payload, limitations: payload, reviewerNotes: payload, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] }], findings: [{ id: 'finding_x', type: 'finding', title: payload, category: payload, factualBasis: payload, limitations: payload, nextAction: payload, owner: payload, resolutionRationale: payload, severity: 3, likelihood: 3, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] }], questions: [{ id: 'question_x', type: 'question', text: payload, response: payload, owner: payload, nextAction: payload, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] }], contradictions: [{ id: 'contradiction_x', type: 'contradiction', title: payload, possibleExplanations: payload, nextAction: payload, resolutionRationale: payload, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] }], notes: [{ id: 'note_x', type: 'note', text: payload, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] }], checklist: [{ id: 'checklist_x', type: 'checklist', prompt: payload, notes: payload, nextAction: payload, owner: payload, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', links: [] }] }, history: [{ id: 'event_x', at: '2026-01-01T00:00:00.000Z', action: payload, summary: payload }] }], activeInvestigationId: 'investigation_x' }
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Records' }).click();
  await expect(page.getByRole('heading', { name: payload }).first()).toBeVisible();
  await expect(page.locator('img[data-xss="unsafe"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Report' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const text = await fs.readFile(await (await download).path(), 'utf8');
  expect(text).toContain('&lt;img src=x data-xss="unsafe"&gt;');
  expect(text).not.toContain(payload);
});

test('focusable skip navigation and semantics are usable @a11y', async ({ page }) => {
  await createInvestigation(page, 'Accessible synthetic review');
  const skip = page.getByText('Skip to content');
  await skip.focus();
  await expect(skip).toBeFocused();
  for (const name of ['Overview', 'Records', 'Checklist', 'Contradictions', 'Report', 'Settings', 'Help']) {
    await page.getByRole('navigation', { name: 'Workspace navigation' }).getByRole('button', { name }).click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations, `${name} accessibility violations`).toEqual([]);
  }
  await page.getByRole('navigation', { name: 'Workspace navigation' }).getByRole('button', { name: 'Records' }).click();
  await page.getByRole('button', { name: 'Add finding' }).click();
  await expect(page.getByRole('dialog', { name: 'Add Finding' })).toBeVisible();
  await expect(page.getByLabel('Title')).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
});

test('first-run layout matches the approved visual baseline @visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('first-run.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
});
