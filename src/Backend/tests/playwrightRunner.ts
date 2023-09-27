import { URLS } from '../../links';
import { firefox, Browser, Page } from 'playwright';

async function main() {
  const browser = await firefox.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(URLS.enquireLandingEN);
}

main();
