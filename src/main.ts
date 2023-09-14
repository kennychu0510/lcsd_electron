import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { PlaywrightController } from './Backend/Playwright';
import { URL } from './url';
import { saveBase64Img } from './Backend/ocr/helper';
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

  /* Listeners */
  ipcMain.on('go-to-enquire-page', async () => {
    await playwright.launch(URL.enquireEN);
    mainWindow.webContents.send('playwright-update', 'launched');
    const base64Img = await playwright.getRecapchaImg();
    const imgPath = saveBase64Img(base64Img);
    const cleanedImg = await cleanImg(imgPath);
    const text = await getText(cleanedImg);
    console.log(text);
  });

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
