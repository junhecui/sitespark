const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

let driver;

beforeAll(async () => {
  driver = new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
  await driver.quit();
});

test('Login test', async () => {
  await driver.get('http://localhost:3000/login');

  const usernameInput = await driver.findElement(By.id('username'));
  const passwordInput = await driver.findElement(By.id('password'));
  const submitButton = await driver.findElement(By.tagName('button'));

  await usernameInput.sendKeys('testuser');
  await passwordInput.sendKeys('password123');
  await submitButton.click();

  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();
    return !currentUrl.includes('/login');
  }, 5000);
  const pageTitle = await driver.getTitle();
  expect(pageTitle).toBe('Home');
});