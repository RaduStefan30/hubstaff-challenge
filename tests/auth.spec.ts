import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { AUTH_DATA } from '../utils/testData';
import { MarketingPage } from '../pages/MarketingPage';
import { MaildropHelper } from '../utils/maildrop';
import { DashboardPage } from '../pages/DashboardPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.skip('Signup for the 14 day free trial', async ({ page, request }) => {
  const authPage = new AuthPage(page);
  const marketingPage = new MarketingPage(page);

  // const { mailbox, email } = MaildropHelper.randomMailbox();

  // Step 1: Click "Free 14-day trial" button on the top nav header
  await marketingPage.freeTrialButton.click();

  // Step 2: Fill "Full name"
  await authPage.firstNameInput.click();
  await authPage.firstNameInput.fill(AUTH_DATA.FIRST_NAME);

  await authPage.lastNameInput.click();
  await authPage.lastNameInput.fill(AUTH_DATA.LAST_NAME);

  // Step 3: Fill "Work email"
  await authPage.emailInput.click();
  // This would have been replaced with the email from line 15 if the service would have worked
  await authPage.emailInput.fill(AUTH_DATA.EMAIL_ADDRESS);

  // Step 4: Fill "Password"
  await authPage.passwordInput.click();
  await authPage.passwordInput.fill(AUTH_DATA.PASSWORD);

  // Step 5: Click terms checkbox
  await authPage.acceptTermsCheckbox.click({ force: true });

  // Step 6: Click "Create my account"
  // needed because the account creation is not working unless the cookies are accepted
  await authPage.acceptCookiesButton.click({ timeout: 10000 });
  await authPage.createMyAccountButton.click();

  // add check for the confirmation page
  await expect(page.getByText('Verify your email')).toBeVisible();

  // Step 7: Click "Confirm account" in confirmation email (Step skipped because the free disposable email domains I tested with are blocked from creating accounts)
  await authPage.verifyConfirmationEmail();
});

test.skip('Sign in from the Marketing page navigation bar', async ({ page }) => {
  const authPage = new AuthPage(page);
  const marketingPage = new MarketingPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Click the "Sign in" button on the top nav header.
  await marketingPage.signInButton.click();
  // Step 2: Click the "Work email" input then type a valid email address.
  await authPage.loginEmailInput.click();
  await authPage.loginEmailInput.fill(AUTH_DATA.EMAIL_ADDRESS);
  // Step 3: Click the "Password" input then type a valid password.
  await authPage.loginPasswordInput.click();
  await authPage.loginPasswordInput.fill(AUTH_DATA.PASSWORD);
  // Step 4: Click the "Login" button.
  await authPage.signInButton.click();
  // the user should be logged in and redirected to the dashboard
  await expect(dashboardPage.dashboardWelcomeHeader).toBeVisible();
});