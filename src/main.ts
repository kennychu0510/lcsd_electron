import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { PlaywrightController } from './Backend/Playwright';
import { URL } from './url';
import { getBufferFromBase64, getPossibleCombo, isValidCombo, saveBase64Img } from './Backend/ocr/helper';
import { cleanImg, getText } from './Backend/ocr';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const playwright = new PlaywrightController();
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  async function playwrightMain() {
    await playwright.launch(URL.enquireLandingEN);
    mainWindow.webContents.send('playwright-update', 'On Enquire Landing Page');

    async function autoCompleteRecapcha(retry = 5) {
      let enteredPage = false;
      for (let i = 0; i < retry || enteredPage; i++) {
        console.log(`ATTEMPT ${i + 1}`);
        await playwright.refreshRecapcha();
        await playwright.resetButtons();
        const base64Img = await playwright.getRecapchaImg();
        const buttons = await playwright.getButtons();

        /* DEV */
        // const imgPath = saveBase64Img(base64Img);

        const buffer = getBufferFromBase64(base64Img);
        const cleanedBuffer = await cleanImg(buffer);
        const text = await getText(cleanedBuffer);
        console.log(`IDENTIFIED ${text}`);
        console.log(`BUTTONS: ${buttons.map((item) => item.value)}`);
        const answers = getPossibleCombo(buttons, text);
        if (isValidCombo(answers)) {
          console.log('ANSWER IS VALID');
          await playwright.clickButtons(answers);
          const result = await playwright.enterEnquirePage();
          enteredPage = result;
        } else {
          console.log('ANSWER IS INVALID');
        }
      }
    }

    await autoCompleteRecapcha(10);
    console.log('PLAYWRIGHT MAIN - DONE');
  }

  /* Start playwright on start */
  try {
    playwrightMain();
  } catch (error) {
    console.log(error);
  }

  /* Listeners */
  ipcMain.on('close-browser', async () => {
    mainWindow.webContents.send('playwright-update', 'closed');
    await playwright.close();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
