const { expect, chromium, test } = require("@playwright/test");

test("screenshot comparison", async ({ page: curPage }) => {
  const browser = await chromium.launch();
  const newPage = await browser.newPage();

  const curUrl = "https://www.belarusians.nl";
  const newUrl = process.env.ENVIRONMENT_URL;

  const newResp = await newPage.goto(newUrl);

  if (newResp.status() > 399) {
    throw new Error(`New URL open failed with response code ${newResp.status()}`);
  }

  await curPage.goto(curUrl);
  await curPage.screenshot({ path: "current.jpg" });
  await expect(newPage).toHaveScreenshot("current.jpg");

  await curPage.close();
  await newPage.close();

  await browser.close();
});
