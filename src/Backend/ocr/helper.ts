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
  return buffer;
}
