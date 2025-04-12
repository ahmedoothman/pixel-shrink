const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    app.isPackaged
      ? `file://${path.join(__dirname, '../build/index.html')}`
      : 'http://localhost:3000'
  );

  // if (!app.isPackaged) {
  //   mainWindow.webContents.openDevTools();
  // }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }],
  });

  if (!result.canceled) {
    return result.filePaths;
  }
  return [];
});

ipcMain.handle('select-destination', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });

  if (!result.canceled) {
    return result.filePaths[0];
  }
  return '';
});

ipcMain.handle(
  'compress-images',
  async (event, { files, destination, options }) => {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const results = [];

    for (const file of files) {
      const fileName = path.basename(file);
      const outputPath = path.join(destination, fileName);

      try {
        let sharpInstance = sharp(file);

        // Apply resize if width or height is specified
        if (options.width > 0 || options.height > 0) {
          sharpInstance = sharpInstance.resize({
            width: options.width > 0 ? options.width : null,
            height: options.height > 0 ? options.height : null,
            fit: 'inside',
            withoutEnlargement: true,
          });
        }

        // Apply format-specific options
        const format = path.extname(file).toLowerCase();
        if (format === '.jpg' || format === '.jpeg') {
          sharpInstance = sharpInstance.jpeg({ quality: options.quality });
        } else if (format === '.png') {
          sharpInstance = sharpInstance.png({ quality: options.quality });
        } else if (format === '.webp') {
          sharpInstance = sharpInstance.webp({ quality: options.quality });
        }

        await sharpInstance.toFile(outputPath);

        // Get file sizes
        const originalSize = fs.statSync(file).size;
        const compressedSize = fs.statSync(outputPath).size;

        results.push({
          file: fileName,
          originalSize,
          compressedSize,
          savingsPercent: (
            ((originalSize - compressedSize) / originalSize) *
            100
          ).toFixed(2),
          success: true,
        });
      } catch (error) {
        results.push({
          file: fileName,
          error: error.message,
          success: false,
        });
      }
    }

    return results;
  }
);
