import { firefox, Browser, Page } from 'playwright';
import { waitForDOMElementChange } from './ocr/helper';
import { URLS } from '../links';
import { LCSD_PAGE_ERRORS } from '../pageErrors';
import { getEnquiryDates } from './options/dates';
import Locator from './locator';
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
    console.log('GOT RECAPCHA IMAGE');
    return recapchaImg;
  }

  async getButtons() {
    const virtualKeysElements = await this.page.locator('#virtualKeysWrapper .kbkey').all();
    const buttons: RecapchaButton[] = [];

    for (let element of virtualKeysElements) {
      buttons.push({
        value: await element.innerText(),
        key: await element.getAttribute('mapv'),
      });
    }
    console.log('GOT BUTTONS');
    return buttons;
  }

  async refreshRecapcha() {
    console.log('REFRESHING RECAPCHA');
    await this.page.locator('#human_regen_2 input').click();
    console.log('REFRESHED RECAPCHA');
    await this.page.evaluate(async () => {
      const target = document.querySelector('#imageCaptchaDivision');
      await new Promise<void>((resolve) => {
        const observer = new MutationObserver((mutations) => {
          observer.disconnect();
          resolve();
        });

        observer.observe(target, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeOldValue: true,
          characterData: true,
          characterDataOldValue: true,
        });
      });
    });
    console.log('RECAPCHA UPDATED');
  }

  async clickButtons(buttons: RecapchaButton[]) {
    for (let button of buttons) {
      await this.page.locator(`#virtualKeysWrapper .kbkey[mapv="${button.key}"]`).click();
      console.log(`CLICKED ${button.value}`);
    }
  }

  async enterEnquirePage(): Promise<boolean> {
    const slideBtn = await this.page.locator('#continueId > button').boundingBox();
    await this.page.mouse.move(slideBtn.x + slideBtn.width / 2, slideBtn.y + slideBtn.height / 2);
    await this.page.mouse.down({
      button: 'left',
    });
    await this.page.mouse.move(slideBtn.x + slideBtn.width / 2 + slideBtn.width * 1.5, slideBtn.y + slideBtn.height / 2, {
      steps: 40,
    });
    await this.page.mouse.up();
    console.log('SLIDE BUTTON DONE');

    await this.page.waitForURL('**/*');
    console.log('WAIT FOR NAVIGATION DONE');

    if (await this.page.locator('#globalErrorPanel').isVisible()) {
      const errors = await this.page.locator('.errorMsg').allInnerTexts();
      if (errors.some((error) => error.match(LCSD_PAGE_ERRORS.TOO_MANY_ATTEMPTS))) {
        console.log('TOO MANY ATTEMPTS');
      } else {
        console.log(errors);
      }
      return false;
    }
    console.log('ENTER PAGE SUCCESS');
    return true;
  }

  async resetButtons() {
    const selectedBtns = await this.page.locator('#virtualKeysWrapper .kbkey.sel').all();
    for (let button of selectedBtns) {
      await button.click();
    }
  }

  async selectDate(selectedDate: string) {
    await this.page.locator(Locator.dateSelect).selectOption(selectedDate);
  }

  async selectFacility(selectedFacility: string) {
    await this.page.locator(Locator.facilitySelect).selectOption(selectedFacility);
  }

  async selectTime(selectedTime: string) {
    await this.page.locator(Locator.timeSelect).selectOption(selectedTime);
  }

  async selectArea(selectedArea: string) {
    await this.page.locator(Locator.areaSelect).selectOption(selectedArea);
  }
}
