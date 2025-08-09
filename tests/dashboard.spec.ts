import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { AUTH_DATA } from '../utils/testData';
import { DashboardPage } from '../pages/DashboardPage';
import { MarketingPage } from '../pages/MarketingPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Add/create project', async ({ page }) => {
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
  await dashboardPage.openAddProjectModal();
  await dashboardPage.expectNewProjectModalVisible();
  await dashboardPage.expectTabContentMinChildren(4);

  // Step 2 – Enter desired project name in "Name *".
  //   (1-100 chars, not spaces-only, unique)
  //   Expected result:
  //   Text field contains valid project name.
  const projectName = `QA-auto-${Date.now()}`;
  await dashboardPage.fillProjectName(projectName);
  await dashboardPage.expectProjectNameValue(projectName);

  // Step 3 – Click "Save".
  await dashboardPage.saveProject();

  // Expected result:
  //   Toast "Project created" appears, project is listed.
  await dashboardPage.expectProjectCreatedToast();
  await dashboardPage.expectProjectRowVisible(projectName);
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
  await dashboardPage.selectMember('Radu Automation');
  await dashboardPage.expectMemberSelected('Radu Automation');

  // Step 2 – Enter amount ≥ 0.005 in "Amount per member".
  //   Expected result:
  //   Amount is entered.

  // extra click needed because the dropdown is still selected
  await dashboardPage.enterAmount('0.01');
  await dashboardPage.expectAmount('0.01');

  // Step 3 – Enter note text.
  //   Expected result:
  //   Note is added.
  await dashboardPage.enterNote('Automation bonus');
  await dashboardPage.expectNote('Automation bonus');

  // Step 4 – Click "Create payment".
  //   Expected result:
  //   Summary modal pops up.
  await dashboardPage.openCreatePayment();

  // Step 5 – Click "Create payment" inside modal.
  //   Expected result:
  //   Page reloads, toast "Marked as paid" shows; Payment modal with Export/Send appears.
  await dashboardPage.confirmCreatePaymentInModal();
  await dashboardPage.expectMarkedAsPaidAndExportSendVisible();

  // Step 6 – Close modal via "Not now".
  await dashboardPage.closeExportModalNotNow();

  // Expected final result:
  //   Payment summary row shows correct columns/values.
  await dashboardPage.expectPaymentSummaryRow('Radu Automation', {
    rateLabel: 'Bonus',
    hours: '0:00:00',
    status: 'Pending',
  });
});
