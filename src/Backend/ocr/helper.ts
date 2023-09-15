import fs from 'fs';

const tempFolder = './src/Backend/ocr/history/raw/';

export function saveBase64Img(base64String: string) {
  const imgId = new Date().toJSON();
  const imagePath = tempFolder + imgId + '.jpg';
  fs.writeFileSync(imagePath, Buffer.from(base64String.replace('data:image/jpg;base64,', ''), 'base64'));
  return imagePath;
}

export function getBufferFromBase64(base64String: string) {
  const buffer = Buffer.from(base64String.replace('data:image/jpg;base64,', ''), 'base64');
  console.log('GOT BUFFER')
  return buffer;
}

export function getPossibleCombo(buttons: RecapchaButton[], text: string) {
  return buttons.filter((button) => text.includes(button.value));
}

export function isValidCombo(buttons: RecapchaButton[]): boolean {
  return buttons.length === 4;
}

export function waitForDOMElementChange(target: HTMLElement) {
  return new Promise<void>((resolve) => {
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
}