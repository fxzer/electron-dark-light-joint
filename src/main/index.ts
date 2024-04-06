import { app, shell, BrowserWindow, ipcMain, desktopCapturer, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // let cutWindow: BrowserWindow | null = null
  // function closeCutWindow() {
  //   cutWindow && cutWindow.close()
  //   cutWindow = null
  // }

  // // electron/main.js

  // function getSize() {
  //   const { size, scaleFactor } = screen.getPrimaryDisplay()
  //   return {
  //     width: size.width * scaleFactor,
  //     height: size.height * scaleFactor
  //   }
  // }

  // function createCutWindow() {
  //   const { width, height } = getSize()
  //   cutWindow = new BrowserWindow({
  //     width,
  //     height,
  //     autoHideMenuBar: true,
  //     useContentSize: true,
  //     movable: false,
  //     frame: false,
  //     resizable: false,
  //     hasShadow: false,
  //     transparent: true,
  //     fullscreenable: true,
  //     fullscreen: true,
  //     simpleFullscreen: true,
  //     alwaysOnTop: false,
  //     webPreferences: {
  //       preload: join(__dirname, 'preload.js'),
  //       nodeIntegration: true,
  //       contextIsolation: false
  //     }
  //   })

  //   if (is.dev) {
  //     cutWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/cut')
  //   } else {
  //     cutWindow.loadFile(join(__dirname, '../renderer/index.html'), {
  //       hash: 'cut'
  //     })
  //   }
  //   cutWindow.maximize()
  //   cutWindow.setFullScreen(true)
  // }

  // mainWindow.on('close', () => {
  //   closeCutWindow()
  // })

  // ipcMain.on('OPEN_CUT_SCREEN', async () => {
  //   closeCutWindow()
  //   mainWindow.hide()
  //   createCutWindow()
  //   cutWindow?.show()
  // })
  // ipcMain.on('SHOW_CUT_SCREEN', async () => {
  //   const sources = await desktopCapturer.getSources({
  //     types: ['screen'],
  //     thumbnailSize: getSize()
  //   })
  //   cutWindow?.webContents.send('GET_SCREEN_IMAGE', sources[0])
  // })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.