const { Builder, By, until } = require('selenium-webdriver');
const { login } = require('./login.js');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

let driver;

beforeAll(async () => {
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless');
  driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().setTimeouts({ implicit: 10000 });
});

afterAll(async () => {
  await driver.quit();
});

test('Fetch and display pages', async () => {
  await driver.get('http://localhost:3000');

  await driver.wait(until.elementLocated(By.css('ul')), 5000);

  const pageList = await driver.findElement(By.css('ul'));
  expect(pageList).toBeDefined();
});