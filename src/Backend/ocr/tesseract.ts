import { createWorker } from 'tesseract.js';
import Path from 'path';

export async function tesseractGetText(img: any) {
  const worker = await createWorker({
    langPath: Path.join(__dirname, 'lang-data'),
    // logger: (m) => console.log(m),
  });
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const {
    data: { text },
  } = await worker.recognize(img);
  await worker.terminate();
  let result = text.replace(/[\n\s]+/g, '');

  return result;
}
