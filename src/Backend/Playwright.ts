import { firefox, Browser, Page } from 'playwright';

export class PlaywrightController {
  private browser: Browser;
  private page: Page;
  constructor() {}

  async launch(url: string) {
    this.browser = await firefox.launch({
      headless: false,
    });
    this.page = await this.browser.newPage();
    await this.page.goto(url);
  }

  async close() {
    await this.browser.close();
  }

  async getRecapchaImg() {
    const recapchaImg = await this.page.locator('#inputTextWrapper img').getAttribute('src');
    return recapchaImg;
  }
}
