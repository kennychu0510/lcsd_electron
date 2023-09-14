import fs from 'fs';

const tempFolder = './src/Backend/ocr/history/raw/';

export function saveBase64Img(base64String: string) {
  const imgId = new Date().toJSON();
  const imagePath = tempFolder + imgId + '.jpg';
  fs.writeFileSync(imagePath, Buffer.from(base64String.replace('data:image/jpg;base64,', ''), 'base64'));
  return imagePath;
}
