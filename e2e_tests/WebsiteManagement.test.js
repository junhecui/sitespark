const { Builder, By, until } = require('selenium-webdriver');
const { login } = require('./login.js');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

let driver;

beforeAll(async () => {
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless');
  driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  await driver.manage().setTimeouts({ implicit: 10000 });
  await login(driver);
});

afterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

test('Add and delete test website by ID', async () => {
  await driver.get('http://localhost:3000/add-website');

  const nameInput = await driver.wait(until.elementLocated(By.id('name')), 5000);
  await driver.wait(until.elementIsVisible(nameInput), 5000);

  const websiteName = 'Test Website';
  await nameInput.sendKeys(websiteName);

  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await submitButton.click();

  await driver.wait(until.urlIs('http://localhost:3000/'), 5000);
  console.log('Redirected to homepage');

  const addedWebsiteLink = await driver.wait(
    until.elementLocated(By.xpath(`//li/a[contains(text(),'${websiteName}')]`)),
    5000
  );
  const websiteHref = await addedWebsiteLink.getAttribute('href');
  
  const websiteId = websiteHref.match(/\/website\/([^\/]+)\/pages/)[1];
  console.log(`Website ID: ${websiteId}`);

  expect(addedWebsiteLink).toBeDefined();

  const deleteButtonXPath = `//li[a[@href='/website/${websiteId}/pages']]/button[contains(text(), 'Delete')]`;
  const deleteButton = await driver.findElement(By.xpath(deleteButtonXPath));

  await deleteButton.click();
  console.log('Clicked delete button');

  try {
    await driver.wait(until.stalenessOf(addedWebsiteLink), 10000);
    console.log('Website deleted successfully');
  } catch (error) {
    throw new Error('Website was not deleted');
  }
});