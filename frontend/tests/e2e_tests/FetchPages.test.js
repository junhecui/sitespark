const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

let driver;

beforeAll(async () => {
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