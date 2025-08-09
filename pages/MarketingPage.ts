import { expect, type Locator, type Page } from '@playwright/test';

export class MarketingPage {
    readonly page: Page;
    readonly freeTrialButton: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.freeTrialButton = page.getByRole('link', { name: 'Free 14-day trial' })
        this.signInButton = page.getByTestId('sign_in_button');
    }
}