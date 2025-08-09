import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardWelcomeHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardWelcomeHeader = page.getByText('Welcome to Hubstaff!');
    }
}