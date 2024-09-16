const { By, until } = require('selenium-webdriver');

async function login(driver, maxRetries = 3) {
  try {
    await driver.get('http://localhost:3000/login');

    const usernameInput = await driver.wait(until.elementLocated(By.id('username')), 5000);
    const passwordInput = await driver.wait(until.elementLocated(By.id('password')), 5000);
    let submitButton = await driver.findElement(By.tagName('button'));

    await usernameInput.sendKeys('testuser');
    await passwordInput.sendKeys('password123');

    let redirectSuccess = false;
    let retrySubmit = 0;

    while (!redirectSuccess && retrySubmit < maxRetries) {
      await submitButton.click();

      try {
        await driver.wait(async () => {
          const currentUrl = await driver.getCurrentUrl();
          return !currentUrl.includes('/login');
        }, 5000);

        redirectSuccess = true;
      } catch (error) {
        retrySubmit++;
        console.error(`Redirect attempt ${retrySubmit} failed, clicking submit again...`);

        submitButton = await driver.findElement(By.tagName('button'));
      }
    }

    if (!redirectSuccess) {
      throw new Error('Redirect failed after clicking the submit button multiple times');
    }

  } catch (error) {
    console.error(`Login failed: ${error.message}`);
    throw new Error('Failed to login after multiple attempts');
  }
}

module.exports = { login };