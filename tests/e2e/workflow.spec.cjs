const { test, expect } = require('@playwright/test');

async function createInvestigation(page, name = 'Synthetic diligence review') {
  await page.goto('/');
  await page.locator('#overviewPrimaryAction').click();
  await page.locator('#iName').fill(name);
  await page.locator('#iIndustry').fill('Synthetic testing');
  await page.locator('#iPurpose').fill('Release verification only.');
  await page.locator('#investigationForm').getByRole('button', { name: 'Create investigation' }).click();
  await expect(page.locator('#dashboardCompanyName')).toHaveText(name);
}

test('original workspace can create an investigation and record a finding', async ({ page }) => {
  await createInvestigation(page);
  await page.locator('#overviewPrimaryAction').click();
  await page.locator('#fTitle').fill('Synthetic finding');
  await page.locator('#fDescription').fill('Synthetic factual basis.');
  await page.getByRole('button', { name: 'Save finding' }).click();
  await expect(page.locator('#priorityList').getByText('Synthetic finding', { exact: true })).toBeVisible();
});

test('original workspace navigation preserves the established primary views', async ({ page }, testInfo) => {
  await page.goto('/');
  const isMobile = testInfo.project.name === 'mobile-chrome';
  const navigation = page.getByRole('navigation', { name: isMobile ? 'Mobile workspace' : 'Workspace' });
  for (const [name, heading] of [['Assess', 'Red flag checklist'], ['Research', 'Claims'], ['Report', 'Preliminary review'], ['Settings', 'Settings'], ['Help', 'Help']]) {
    if (isMobile && ['Settings', 'Help'].includes(name)) {
      await navigation.getByRole('button', { name: 'More' }).click();
      await page.getByRole('button', { name }).click();
    } else await navigation.getByRole('button', { name }).click();
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
});

test('original first-run layout matches the approved visual baseline @visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('original-first-run.png', { fullPage: true, maxDiffPixelRatio: 0.02 });
});
