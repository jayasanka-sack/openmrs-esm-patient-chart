import { expect } from '@playwright/test';
import { test } from '../core';
import { ProceduresPage } from '../pages';

test('Record a procedure with a known start date', async ({ page, patient }) => {
  const proceduresPage = new ProceduresPage(page);

  await test.step('Given I am on the patient procedures page', async () => {
    await proceduresPage.goTo(patient.uuid);
  });

  await test.step('When I click on "Add procedure"', async () => {
    await page.getByRole('button', { name: /add procedure/i }).click();
  });

  await test.step('Then the procedure workspace should open', async () => {
    await expect(page.getByText(/record procedure/i)).toBeVisible();
  });

  await test.step('When I search for and select a procedure blood pressure panel', async () => {
    await page.getByPlaceholder(/search procedures/i).fill('blood pressure');
    await page.getByRole('menuitem', { name: /blood pressure panel/i }).click();
  });

  await test.step('And I select a procedure type elective', async () => {
    await page.getByRole('combobox', { name: /select procedure type/i }).click();
    await page.getByRole('option', { name: /elective/i }).click();
  });

  await test.step('And I search for and select a body site arm', async () => {
    await page.getByPlaceholder(/search body sites/i).fill('arm');
    await page.getByRole('menuitem', { name: /^arm$/i }).click();
  });

  await test.step('And I search for and select a status completed', async () => {
    await page.getByPlaceholder(/search status/i).fill('completed');
    await page.getByRole('menuitem', { name: /completed/i }).click();
  });

  await test.step('And I select "Yes" for "Is start date known?"', async () => {
    await page.getByRole('tab', { name: /yes/i }).click();
  });

  await test.step('And I enter a start date and time 01/01/2024 at 10:00 AM', async () => {
    await page.getByRole('textbox', { name: /start date and time/i }).fill('01/01/2024');
    await page.locator('input[placeholder="hh:mm"]').nth(0).fill('10:00');
    await page.locator('[aria-label="AM/PM"]').nth(0).selectOption('AM');
  });

  await test.step('And I enter an end date and time 01/01/2024 at 11:00 AM', async () => {
    await page.getByRole('textbox', { name: /end date and time/i }).fill('01/01/2024');
    await page.locator('input[placeholder="hh:mm"]').nth(1).fill('11:00');
    await page.locator('[aria-label="AM/PM"]').nth(1).selectOption('AM');
  });

  await test.step('And I enter a duration of 60 minutes', async () => {
    await page.getByRole('spinbutton', { name: /duration/i }).fill('60');
  });

  await test.step('And I enter notes routine blood pressure check', async () => {
    await page.getByPlaceholder(/enter notes/i).fill('routine blood pressure check');
  });

  await test.step('And I click "Save & close"', async () => {
    await page.getByRole('button', { name: /save & close/i }).click();
  });

  await test.step('Then I should see a "Procedure saved" success notification', async () => {
    await expect(page.getByText(/procedure saved/i)).toBeVisible();
  });

  await test.step('And the procedure blood pressure panel should appear in the procedures table', async () => {
    await expect(proceduresPage.proceduresTable().locator('tbody')).toContainText(/blood pressure panel/i);
  });

  await test.step('And the start date column should show 01-Jan-2024, 10:00 AM', async () => {
    await expect(proceduresPage.proceduresTable().locator('tbody')).toContainText(/01-jan-2024/i);
  });
});

test('Record a procedure with an unknown start date', async ({ page, patient }) => {
  const proceduresPage = new ProceduresPage(page);

  await test.step('Given I am on the patient procedures page', async () => {
    await proceduresPage.goTo(patient.uuid);
  });

  await test.step('When I click on "Add procedure"', async () => {
    await page.getByRole('button', { name: /add procedure/i }).click();
  });

  await test.step('Then the procedure workspace should open', async () => {
    await expect(page.getByText(/record procedure/i)).toBeVisible();
  });

  await test.step('When I search for and select a procedure blood pressure panel', async () => {
    await page.getByPlaceholder(/search procedures/i).fill('blood pressure');
    await page.getByRole('menuitem', { name: /blood pressure panel/i }).click();
  });

  await test.step('And I select a procedure type elective', async () => {
    await page.getByRole('combobox', { name: /select procedure type/i }).click();
    await page.getByRole('option', { name: /elective/i }).click();
  });

  await test.step('And I select "No" for "Is start date known?"', async () => {
    await page.getByRole('tab', { name: /no/i }).click();
  });

  await test.step('And I select year 2024', async () => {
    await page.getByLabel(/year/i).selectOption('2024');
  });

  await test.step('And I select month January', async () => {
    await page.getByLabel(/month/i).selectOption('January');
  });

  await test.step('And I click "Save & close"', async () => {
    await page.getByRole('button', { name: /save & close/i }).click();
  });

  await test.step('Then I should see a "Procedure saved" success notification', async () => {
    await expect(page.getByText(/procedure saved/i)).toBeVisible();
  });

  await test.step('And the procedure blood pressure panel should appear in the procedures table', async () => {
    await expect(proceduresPage.proceduresTable().locator('tbody')).toContainText(/blood pressure panel/i);
  });

  await test.step('And the start date column should show Jan 2024*', async () => {
    await expect(proceduresPage.proceduresTable().locator('tbody')).toContainText(/jan 2024\*/i);
  });
});

test('Edit a procedure', async ({ page, patient }) => {
  const proceduresPage = new ProceduresPage(page);

  await test.step('Given a procedure blood pressure panel has already been recorded for the patient', async () => {
    await proceduresPage.goTo(patient.uuid);
    await page.getByRole('button', { name: /add procedure/i }).click();
    await expect(page.getByText(/record procedure/i)).toBeVisible();
    await page.getByPlaceholder(/search procedures/i).fill('blood pressure');
    await page.getByRole('menuitem', { name: /blood pressure panel/i }).click();
    await page.getByRole('combobox', { name: /select procedure type/i }).click();
    await page.getByRole('option', { name: /elective/i }).click();
    await page.getByRole('tab', { name: /yes/i }).click();
    await page.getByRole('textbox', { name: /start date and time/i }).fill('01/01/2024');
    await page.locator('input[placeholder="hh:mm"]').first().fill('10:00');
    await page.getByRole('button', { name: /save & close/i }).click();
    await expect(page.getByText(/procedure saved/i)).toBeVisible();
  });

  await test.step('When I click the overflow menu on the blood pressure panel procedure row', async () => {
    await proceduresPage
      .proceduresTable()
      .locator('tbody tr')
      .filter({ hasText: /blood pressure panel/i })
      .getByRole('button', { name: /edit or delete procedure/i })
      .click();
  });

  await test.step('And I click "Edit"', async () => {
    await page.getByRole('menuitem', { name: /edit/i }).click();
  });

  await test.step("Then the procedure workspace should open with the procedure's details pre-filled", async () => {
    await expect(page.getByText(/edit procedure/i)).toBeVisible();
  });

  await test.step('When I update the notes to updated follow-up notes', async () => {
    await page.getByPlaceholder(/enter notes/i).clear();
    await page.getByPlaceholder(/enter notes/i).fill('updated follow-up notes');
  });

  await test.step('And I click "Save & close"', async () => {
    await page.getByRole('button', { name: /save & close/i }).click();
  });

  await test.step('Then I should see a "Procedure saved" success notification', async () => {
    await expect(page.getByText(/procedure saved/i)).toBeVisible();
  });

  await test.step('And the notes for the blood pressure panel procedure should show updated follow-up notes', async () => {
    await proceduresPage
      .proceduresTable()
      .locator('tbody tr')
      .filter({ hasText: /blood pressure panel/i })
      .getByRole('button', { name: /expand/i })
      .click();
    await expect(page.getByText(/updated follow-up notes/i)).toBeVisible();
  });
});

test('Delete a procedure', async ({ page, patient }) => {
  const proceduresPage = new ProceduresPage(page);

  await test.step('Given a procedure blood pressure panel has already been recorded for the patient', async () => {
    await proceduresPage.goTo(patient.uuid);
    await page.getByRole('button', { name: /add procedure/i }).click();
    await expect(page.getByText(/record procedure/i)).toBeVisible();
    await page.getByPlaceholder(/search procedures/i).fill('blood pressure');
    await page.getByRole('menuitem', { name: /blood pressure panel/i }).click();
    await page.getByRole('combobox', { name: /select procedure type/i }).click();
    await page.getByRole('option', { name: /elective/i }).click();
    await page.getByRole('tab', { name: /yes/i }).click();
    await page.getByRole('textbox', { name: /start date and time/i }).fill('01/01/2024');
    await page.locator('input[placeholder="hh:mm"]').first().fill('10:00');
    await page.getByRole('button', { name: /save & close/i }).click();
    await expect(page.getByText(/procedure saved/i)).toBeVisible();
  });

  await test.step('When I click the overflow menu on the blood pressure panel procedure row', async () => {
    await proceduresPage
      .proceduresTable()
      .locator('tbody tr')
      .filter({ hasText: /blood pressure panel/i })
      .getByRole('button', { name: /edit or delete procedure/i })
      .click();
  });

  await test.step('And I click "Delete"', async () => {
    await page.getByRole('menuitem', { name: /delete/i }).click();
  });

  await test.step('Then a confirmation modal should appear with the message "Are you sure you want to delete this procedure?"', async () => {
    await expect(page.getByText(/are you sure you want to delete this procedure\?/i)).toBeVisible();
  });

  await test.step('When I click the "Delete" button in the modal', async () => {
    await page.getByRole('button', { name: /^delete$/i }).click();
  });

  await test.step('Then I should see a "Procedure deleted" success notification', async () => {
    await expect(page.getByText(/procedure deleted/i)).toBeVisible();
  });

  await test.step('And the procedure blood pressure panel should no longer appear in the procedures table', async () => {
    await expect(page.getByText(/blood pressure panel/i)).toBeHidden();
    await expect(page.getByText(/no procedures to display/i)).toBeVisible();
  });
});
