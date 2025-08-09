import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardWelcomeHeader: Locator;
    readonly membersSelect: Locator;
    readonly selectedMemberChip: Locator;

    readonly pageHeading: Locator;
    readonly amountInput: Locator;
    readonly amountPerMember: Locator;

    readonly noteInput: Locator;

    readonly createPaymentButton: Locator;
    readonly summaryModal: Locator;
    readonly modalCreatePaymentBtn: Locator;

    readonly markedAsPaidToast: Locator;

    readonly exportSendModal: Locator;
    readonly exportTab: Locator;
    readonly sendTab: Locator;
    readonly exportModalNotNowButton: Locator;
    readonly addProjectButton: Locator;
    readonly projectModal: Locator;
    readonly tabsContainer: Locator;
    readonly tabContentChildren: Locator;
    readonly projectNameTextarea: Locator;
    readonly projectSaveButton: Locator;
    readonly projectCreatedToast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardWelcomeHeader = page.getByText('Welcome');
        this.membersSelect = page.getByPlaceholder('Select members');
        this.selectedMemberChip = page.locator('.select2-selection__choice');
        this.pageHeading = page.locator('.page-heading ');
        this.amountInput = page.locator('#team_payment_total_amount');
        this.amountPerMember = page.getByLabel('Amount per member');
        this.noteInput = page.locator('#team_payment_note');
        this.createPaymentButton = page.locator('#bonus').getByText('Create payment');
        this.summaryModal = page.locator('#payment-wizard-modal .modal-dialog');
        this.modalCreatePaymentBtn = this.summaryModal.locator('input').getByText('Create payment');
        this.markedAsPaidToast = page.getByText('Marked as paid');
        this.exportSendModal = page.locator('#export-payment-modal');
        this.exportTab = this.exportSendModal.locator('.export-tab');
        this.sendTab = this.exportSendModal.locator('.send-tab');
        this.exportModalNotNowButton = this.exportSendModal
            .locator('#export_payment')
            .getByText('Not now');

        // —— NEW: project creation locators ——
        this.addProjectButton = page.getByText('Add project');
        this.projectModal = page.locator('.project-dialog .modal.fade.in');
        this.tabsContainer = page.locator('#tabs-container');
        this.tabContentChildren = page.locator('.tab-content > *');
        this.projectNameTextarea = this.projectModal.locator('textarea');
        this.projectSaveButton = this.projectModal.getByRole('button', { name: 'Save' });
        this.projectCreatedToast = page.getByText('Project created');
    }

    rowByMember(name: string): Locator {
        return this.page.getByRole('row', { name: new RegExp(name) });
    }
    memberOption(name: string): Locator {
        return this.page.getByText(name).last();
    }
    rowByProject(name: string): Locator {
        return this.page.getByRole('row', { name });
    }

    async selectMember(name: string) {
        await this.membersSelect.click();
        await this.memberOption(name).click();
    }
    async expectMemberSelected(name: string) {
        await expect(this.selectedMemberChip).toHaveAttribute('title', name);
    }
    async enterAmount(value: string) {
        await this.pageHeading.click();
        await this.amountInput.fill(value);
    }
    async expectAmount(value: string) {
        await expect(this.amountPerMember).toHaveValue(value);
    }
    async enterNote(text: string) {
        await this.noteInput.fill(text);
    }
    async expectNote(text: string) {
        await expect(this.noteInput).toHaveValue(text);
    }
    async openCreatePayment() {
        await this.createPaymentButton.click();
        await expect(this.summaryModal).toBeVisible();
    }
    async confirmCreatePaymentInModal() {
        await this.modalCreatePaymentBtn.click();
    }
    async expectMarkedAsPaidAndExportSendVisible() {
        await expect(this.markedAsPaidToast).toBeVisible();
        await expect(this.exportTab).toBeVisible();
        await expect(this.sendTab).toBeVisible();
    }
    async closeExportModalNotNow() {
        await this.exportModalNotNowButton.click();
        await expect(this.exportSendModal).toBeHidden();
    }
    async expectPaymentSummaryRow(
        memberName: string,
        {
            rateLabel = 'Bonus',
            hours = '0:00:00',
            status = 'Pending',
        }: { rateLabel?: string; hours?: string; status?: string } = {}
    ) {
        const row = this.rowByMember(memberName);
        await expect(row.getByRole('link', { name: rateLabel })).toBeVisible();
        await expect(row.getByText(hours)).toBeVisible();
        await expect(row.getByText(status)).toBeVisible();
    }

    async openAddProjectModal() {
        // Step 1 – Click on the "Add project" button.
        await this.addProjectButton.click();
    }
    async expectNewProjectModalVisible() {
        //   Expected result: The "New project" modal is visible with tabs + fields.
        await expect(this.projectModal).toBeVisible({ timeout: 10_000 });
        await expect(this.tabsContainer).toBeVisible();
    }
    async expectTabContentMinChildren(min = 4) {
        const count = await this.tabContentChildren.count();
        expect(count).toBeGreaterThanOrEqual(min);
    }
    async fillProjectName(name: string) {
        // Step 2 – Enter desired project name in "Name *".
        await this.projectNameTextarea.fill(name);
    }
    async expectProjectNameValue(name: string) {
        await expect(this.projectNameTextarea).toHaveValue(name);
    }
    async saveProject() {
        // Step 3 – Click "Save".
        await this.projectSaveButton.click();
    }
    async expectProjectCreatedToast() {
        // Expected result: Toast "Project created" appears.
        await expect(this.projectCreatedToast).toBeVisible();
    }
    async expectProjectRowVisible(name: string) {
        await expect(this.rowByProject(name)).toBeVisible();
    }
}