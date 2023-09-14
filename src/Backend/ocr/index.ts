import { jimpCleanImage } from './jimp';
import { tesseractGetText } from './tesseract';

export async function cleanImg(imgPath: string) {
  const cleanedImg = await jimpCleanImage(imgPath);
  return cleanedImg;
}

export async function getText(imagePath: string) {
  const text = await tesseractGetText(imagePath);
  return text;
}
