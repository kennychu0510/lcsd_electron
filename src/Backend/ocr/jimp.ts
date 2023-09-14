import Jimp from 'jimp';

export async function jimpCleanImage(imagePath: string) {
  const image = await Jimp.read(imagePath);

  let trimAmount = 1;
  image.crop(trimAmount, trimAmount, image.getWidth() - 2 * trimAmount, image.getHeight() - 2 * trimAmount);

  image.contrast(1); // Increase contrast

  const width = image.bitmap.width;
  const height = image.bitmap.height;

  // Iterate over each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Get the color of the current pixel
      const currentColor = Jimp.intToRGBA(image.getPixelColor(x, y));
      // const currentColor = image.getPixelColor(x, y)

      // Check the color difference with nearby pixels
      let diffCount = 0;
      for (let j = y - 1; j <= y + 1; j++) {
        for (let i = x - 1; i <= x + 1; i++) {
          // Skip if the current pixel is out of bounds
          if (i < 0 || i >= width || j < 0 || j >= height) {
            continue;
          }

          // Get the color of the nearby pixel
          const nearbyColor = Jimp.intToRGBA(image.getPixelColor(i, j));

          // Calculate the color difference
          const colorDifference = Jimp.colorDiff(currentColor, nearbyColor);
          if (colorDifference > 0) {
            diffCount++;
          }
          // Remove the pixel if the color difference exceeds the tolerance
        }
      }
      if (diffCount > 4) {
        image.setPixelColor(16777215 / 2, x, y); // Set transparent pixel
      }
    }
  }
  let threshold = 1;
  trimAmount = 1;

  image.crop(trimAmount, trimAmount, width - 2 * trimAmount, height - 2 * trimAmount);

  // Iterate over each pixel
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    // Get the color components of the current pixel
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];

    // Calculate the pixel's grayscale value
    const grayscale = Math.floor((red + green + blue) / 3);

    // Convert the pixel to white or black based on the threshold
    const newColor = grayscale >= threshold ? 0xffffffff : 0x000000ff;

    // Set the new color for the pixel
    this.bitmap.data[idx + 0] = Jimp.intToRGBA(newColor).r;
    this.bitmap.data[idx + 1] = Jimp.intToRGBA(newColor).g;
    this.bitmap.data[idx + 2] = Jimp.intToRGBA(newColor).b;
    this.bitmap.data[idx + 3] = Jimp.intToRGBA(newColor).a;
  });

  // Create a sharpen kernel
  const kernel = [
    [-1, 0, -1, 0, -1],
    [0, -1, 1, -1, 0],
    [0, 1, 9, 1, 1],
    [0, -1, 1, 1, 0],
    [-1, 0, 1, 0, -1],
  ];

  // Apply the sharpen kernel using convolute
  image.convolute(kernel);

  // Save the cleaned image
  const cleanedImagePath = imagePath.replace('raw', 'parsed');
  await image.writeAsync(cleanedImagePath);

  return cleanedImagePath
  // const buffer = await image.getBufferAsync(`image/${image.getExtension()}`);
  // return buffer;
}
