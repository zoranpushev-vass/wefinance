import { chromium, expect } from '@playwright/test';

const filePath = './LoginAuth.json';
const baseUrl = 'https://author-p133911-e1313554.adobeaemcloud.com/aem/start.html';
const emailId = process.env.AEM_userName;
const password = process.env.AEM_password;

const selectors = {
  iFrame: 'iframe[id*="exc-app-sandbox"]',
  createAnAccount: 'a[class="spectrum-Link EmailPage__create-account-link"]',
  signInWithAdobe: 'text=Sign in with Adobe',
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  userDisplayName: 'div#userDisplayName',
  firstExtButtonItem: 'div[class*="ext-button-item"]:first-child',
};

async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const emailLocator = page.locator(selectors.emailInput);
  const passwordLocator = page.locator(selectors.passwordInput);
  await page.locator(selectors.signInWithAdobe).click();
  await expect(page.locator(selectors.createAnAccount)).toBeVisible();
  await page.getByRole('link', { name: 'View more' }).click();
  await expect(page.getByRole('button', { name: 'Continue with Microsoft' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue with Microsoft' }).click();
  await page.waitForLoadState('networkidle');
  await expect(emailLocator).toBeVisible();
  await emailLocator.fill(emailId);
  await emailLocator.blur();
  await page.getByRole('button', { name: 'Next' }).click();
  expect(await page.locator(selectors.userDisplayName).innerText()).toBe(emailId);
  await passwordLocator.fill(password);
  await passwordLocator.blur();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Stay signed in?')).toBeVisible();
  await page.locator(selectors.firstExtButtonItem).first().click();
  await page.waitForURL('https://author-p133911-e1313554.adobeaemcloud.com/ui#/aem/aem/start.html', { timeout: 30000 });
  await page.waitForLoadState('load');
  await page.waitForURL('https://author-p133911-e1313554.adobeaemcloud.com/ui#/aem/aem/start.html?appId=aemshell');
  const frame = page.frameLocator(selectors.iFrame);
  await expect(frame.getByLabel('Navigation')).toBeVisible();
  await page.context().storageState({ path: filePath });
  await context.close();
  await browser.close();
}

export default globalSetup;
