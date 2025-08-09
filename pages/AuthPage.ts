import { expect, type Locator, type Page } from '@playwright/test';

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
        this.signInButton = page.getByRole('button').filter({ hasText: 'Sign in' });
        this.acceptCookiesButton = page.getByRole('button').filter({ hasText: 'OK' });
    }


    async verifyConfirmationEmail() {
        // const helper = new MaildropHelper(request);
        // let messageId: string | undefined;
        // for (let i = 0; i < 10; i++) {
        //   const inbox = await helper.getInbox(mailbox);
        //   if (inbox.length) { messageId = inbox[0].id; break; }
        //   await page.waitForTimeout(3000);
        // }
        // expect(messageId, 'No email received').toBeTruthy();

        // const { html } = await helper.readMessage(mailbox, messageId!);
        // const linkMatch = html.match(/https?:\/\/[^\s"']+/);
        // expect(linkMatch, 'Link not found').toBeTruthy();

        // await page.goto(linkMatch![0]);
        // await expect(page.getByText('Account confirmed')).toBeVisible();
    }

    async login(email: string, password: string) {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.signInButton.click();
    }
}