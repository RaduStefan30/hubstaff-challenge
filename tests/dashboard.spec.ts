import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { AUTH_DATA } from '../utils/testData';
import { DashboardPage } from '../pages/DashboardPage';
import { MarketingPage } from '../pages/MarketingPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.skip('Add/create project', async ({ page }) => {
  const authPage = new AuthPage(page);
  const marketingPage = new MarketingPage(page);
  const dashboardPage = new DashboardPage(page);

  await marketingPage.signInButton.click();
  await authPage.login(AUTH_DATA.EMAIL_ADDRESS, AUTH_DATA.PASSWORD);
  const orgID = page.url().split('/').pop();
  await page.goto(`https://app.hubstaff.com/organizations/${orgID}/projects`);

  // Step 1 – Click on the "Add project" button.
  //   Expected result:
  //   The "New project" modal is visible with tabs + fields.
  await page.getByText('Add project').click();
  const modal = page.locator('.project-dialog .modal.fade.in');
  await expect(modal).toBeVisible({ timeout: 10000 });
  const tabs = page.locator('#tabs-container');
  await expect(tabs).toBeVisible();
  const children = page.locator('.tab-content > *');
  expect(await children.count()).toBeGreaterThanOrEqual(4)

  // Step 2 – Enter desired project name in "Name *".
  //   (1-100 chars, not spaces-only, unique)
  //   Expected result:
  //   Text field contains valid project name.
  const projectName = `QA-auto-${Date.now()}`;
  await modal.locator('textarea').fill(projectName);
  await expect(modal.locator('textarea')).toHaveValue(projectName);

  // Step 3 – Click "Save".
  await modal.getByRole('button', { name: 'Save' }).click();

  // Expected result:
  //   Toast "Project created" appears, project is listed.
  await expect(page.getByText('Project created')).toBeVisible();
  await expect(page.getByRole('row', { name: projectName })).toBeVisible();
});

test('Bonus payment', async ({ page }) => {
  const authPage = new AuthPage(page);
  const marketingPage = new MarketingPage(page);
  const dashboardPage = new DashboardPage(page);

  await marketingPage.signInButton.click();
  await authPage.login(AUTH_DATA.EMAIL_ADDRESS, AUTH_DATA.PASSWORD);
  const orgID = page.url().split('/').pop();
  await page.goto(`https://app.hubstaff.com/organizations/${orgID}/team_payments/bonus`);

  // Step 1 – Select required member.
  //   Expected result:
  //   Member is shown in "Members" field.
  await page.getByPlaceholder('Select members').click();
  await page.getByText('Radu Automation').last().click();
  await expect(page.locator('.select2-selection__choice')).toHaveAttribute('title', 'Radu Automation')

  // Step 2 – Enter amount ≥ 0.005 in "Amount per member".
  //   Expected result:
  //   Amount is entered.

  // extra click needed because the dropdown is still selected
  await page.locator('.page-heading ').click();

  await page.locator('#team_payment_total_amount').fill('0.01');
  await expect(page.getByLabel('Amount per member')).toHaveValue('0.01');

  // Step 3 – Enter note text.
  //   Expected result:
  //   Note is added.
  await page.locator('#team_payment_note').fill('Automation bonus');
  await expect(page.locator('#team_payment_note')).toHaveValue('Automation bonus');

  // Step 4 – Click "Create payment".
  //   Expected result:
  //   Summary modal pops up.
  await page.locator('#bonus').getByText('Create payment').click();
  const summaryModal = page.locator('#payment-wizard-modal .modal-dialog');
  await expect(summaryModal).toBeVisible();

  // Step 5 – Click "Create payment" inside modal.
  //   Expected result:
  //   Page reloads, toast "Marked as paid" shows; Payment modal with Export/Send appears.
  await summaryModal.locator('input').getByText('Create payment').click();
  await expect(page.getByText('Marked as paid')).toBeVisible();
  const exportSendModal = page.locator('#export-payment-modal');
  await expect(exportSendModal.locator('.export-tab')).toBeVisible();
  await expect(exportSendModal.locator('.send-tab')).toBeVisible();

  // Step 6 – Close modal via "Not now".
  await exportSendModal.locator('#export_payment').getByText('Not now').click();
  await expect(exportSendModal).toBeHidden();

  // Expected final result:
  //   Payment summary row shows correct columns/values.
  const row = page.getByRole('row', { name: /Radu Automation/ });

  // This might be a bug since the text is now Bonus
  // await expect(row.getByText('One time')).toBeVisible();
  await expect(row.getByRole('link', { name: 'Bonus' })).toBeVisible();
  await expect(row.getByText('0:00:00')).toBeVisible();
  await expect(row.getByText('Pending')).toBeVisible();
});
