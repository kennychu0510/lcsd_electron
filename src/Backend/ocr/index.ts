import { jimpCleanImage } from './jimp';
import { tesseractGetText } from './tesseract';

export async function cleanImg(buffer: any, options?: {
  devMode: boolean,
  imagePath: string;
}) {
  const cleanedImg = await jimpCleanImage(buffer, options);
  return cleanedImg;
}

export async function getText(imagePath: any) {
  const text = await tesseractGetText(imagePath);
  return text;
}
