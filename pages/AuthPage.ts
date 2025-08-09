import { expect, type Locator, type Page } from '@playwright/test';
import { createCipheriv } from 'crypto';

export class AuthPage {
    readonly page: Page;

    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly acceptTermsCheckbox: Locator;
    readonly createMyAccountButton: Locator;

    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly signInButton: Locator;

    readonly acceptCookiesButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.firstNameInput = page.getByTestId('first_name');
        this.lastNameInput = page.getByTestId('last_name');
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.acceptTermsCheckbox = page.getByTestId('accept_terms');
        this.createMyAccountButton = page.getByTestId('create_my_account');

        this.loginEmailInput = page.locator('#user_email');
        this.loginPasswordInput = page.locator('#user_password');
        this.signInButton = page.getByRole('button', { name: 'Sign in' });

        this.acceptCookiesButton = page.getByRole('button', { name: /^ok$/i });
    }

    async fillName(first: string, last: string) {
        await this.firstNameInput.click();
        await this.firstNameInput.fill(first);
        await this.lastNameInput.click();
        await this.lastNameInput.fill(last);
    }

    async fillEmail(email: string) {
        await this.emailInput.click();
        await this.emailInput.fill(email);
    }

    async fillPassword(pass: string) {
        await this.passwordInput.click();
        await this.passwordInput.fill(pass);
    }

    async acceptTerms() {
        await this.acceptTermsCheckbox.click({ force: true });
    }

    async acceptCookies() {
        try {
            await this.acceptCookiesButton.click({ timeout: 10_000 });
        }
        catch {
            console.log('The cookies banner has not been displayed')
        }
    }

    async submitSignup() {
        await this.createMyAccountButton.click();
    }

    async login(email: string, password: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.signInButton.click();
    }

    async expectVerifyEmailBanner() {
        await expect(this.page.getByText(/verify your email/i)).toBeVisible();
    }
}
