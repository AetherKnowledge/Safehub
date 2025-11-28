import { Builder, By, until } from "selenium-webdriver";

(async function testLogin() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // 1. Navigate to the sign-in page
    console.log("Navigating to sign-in page...");
    await driver.get("http://localhost:3000/sign-in");

    // 2. Find the email and password fields
    console.log("Finding input fields...");
    let emailInput = await driver.findElement(By.id("email"));
    let passwordInput = await driver.findElement(By.id("password"));

    // 3. Enter credentials
    console.log("Entering credentials...");
    await emailInput.sendKeys("user@user.com");
    await passwordInput.sendKeys("user");

    // 4. Submit the form (either by clicking the button or pressing Enter)
    console.log("Submitting form...");
    // Find the submit button. It's inside a form, so we can find the button with type="submit"
    let submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );
    await submitButton.click();

    // 5. Wait for redirection or success message
    console.log("Waiting for redirection...");
    // Wait until the URL contains '/user/dashboard'
    await driver.wait(until.urlContains("/user/dashboard"), 10000);

    console.log("Login successful! Redirected to dashboard.");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Close the browser
    await driver.quit(); // Commented out to let the user see the result
  }
})();
