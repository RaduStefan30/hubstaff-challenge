import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { MarketingPage } from '../pages/MarketingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AUTH_DATA } from '../utils/testData';
import { createAlias } from '../utils/maildrop'

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Signup for the 14 day free trial', async ({ page }) => {
  const authPage = new AuthPage(page);
  const marketingPage = new MarketingPage(page);
  const { email } = createAlias(AUTH_DATA.EMAIL_ADDRESS);

  // Step 1: Click "Free 14-day trial" button on the top nav header
  await marketingPage.openFreeTrial();

  // Step 2: Fill "Full name"
  await authPage.fillName(AUTH_DATA.FIRST_NAME, AUTH_DATA.LAST_NAME);

  // Step 3: Fill "Work email"
  // This would have been replaced with the disposable email if the service worked
  await authPage.fillEmail(email);

  // Step 4: Fill "Password"
  await authPage.fillPassword(AUTH_DATA.PASSWORD);

  // Step 5: Click terms checkbox
  await authPage.acceptTerms();

  // Step 6: Click "Create my account"
  // needed because the account creation is not working unless the cookies are accepted
  await authPage.acceptCookies();
  await authPage.submitSignup();

  // add check for the confirmation page
  await authPage.expectVerifyEmailBanner();

  // Step 7: Click "Confirm account" in confirmation email
  // (Step skipped because the free disposable email domains tested are blocked)
  // await authPage.verifyConfirmationEmail();
});

test('Sign in from the Marketing page navigation bar', async ({ page }) => {
  const authPage = new AuthPage(page);
  const marketingPage = new MarketingPage(page);
  const dashboardPage = new DashboardPage(page);

  // Step 1: Click the "Sign in" button on the top nav header.
  await marketingPage.openSignIn();

  // Step 2: Click the "Work email" input then type a valid email address.
  // Step 3: Click the "Password" input then type a valid password.
  // Step 4: Click the "Login" button.
  await authPage.login(AUTH_DATA.EMAIL_ADDRESS, AUTH_DATA.PASSWORD);

  // the user should be logged in and redirected to the dashboard
  await expect(dashboardPage.dashboardWelcomeHeader).toBeVisible();
});
