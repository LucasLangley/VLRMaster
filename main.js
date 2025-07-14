const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const si = require('systeminformation');

let mainWindow;
let overlayWindow;
let gameDetectionInterval;
let gameRunning = false;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    titleBarStyle: 'hiddenInset',
    resizable: true,
    minimizable: true,
    maximizable: true
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
  }

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      window.electron = {
        invoke: (channel, ...args) => {
          const { ipcRenderer } = require('electron');
          return ipcRenderer.invoke(channel, ...args);
        },
        send: (channel, ...args) => {
          const { ipcRenderer } = require('electron');
          return ipcRenderer.send(channel, ...args);
        },
        on: (channel, listener) => {
          const { ipcRenderer } = require('electron');
          return ipcRenderer.on(channel, listener);
        }
      };
    `);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createOverlayWindow() {
  if (overlayWindow) {
    overlayWindow.focus();
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  overlayWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    movable: true,
    focusable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  overlayWindow.setPosition(width - 420, 20);
  overlayWindow.setVisibleOnAllWorkspaces(true);
  
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    overlayWindow.loadURL('http://localhost:3000/overlay');
  } else {
    overlayWindow.loadFile(path.join(__dirname, 'build/overlay.html'));
  }

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

async function detectValorantGame() {
  try {
    const processes = await si.processes();
    
    const valorantProcess = processes.list.find(proc => {
      const processName = proc.name.toLowerCase();
      return processName.includes('valorant.exe') || 
             processName.includes('valorant-win64-shipping') ||
             (processName.includes('riotclientux.exe') && proc.cmd && proc.cmd.toLowerCase().includes('valorant'));
    });
    
    gameRunning = !!valorantProcess;
    
    if (mainWindow) {
      mainWindow.webContents.send('game-status-changed', gameRunning);
    }
    
  } catch (error) {
    console.error('Erro ao detectar Valorant:', error);
  }
}

function startGameDetection() {
  gameDetectionInterval = setInterval(detectValorantGame, 5000);
}

function stopGameDetection() {
  if (gameDetectionInterval) {
    clearInterval(gameDetectionInterval);
    gameDetectionInterval = null;
  }
}

app.whenReady().then(() => {
  createMainWindow();
  startGameDetection();
  
  globalShortcut.register('F1', () => {
    if (overlayWindow) {
      overlayWindow.webContents.send('toggle-overlay');
    }
  });
  
  globalShortcut.register('F2', () => {
    if (overlayWindow) {
      overlayWindow.webContents.send('toggle-crosshair');
    }
  });
  
  globalShortcut.register('ESC', () => {
    if (overlayWindow) {
      overlayWindow.close();
    }
  });
});

app.on('window-all-closed', () => {
  stopGameDetection();
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.handle('get-system-info', async () => {
  try {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const graphics = await si.graphics();
    
    return {
      cpu: cpu.brand,
      memory: Math.round(mem.total / 1024 / 1024 / 1024),
      gpu: graphics.controllers[0]?.model || 'Desconhecido'
    };
  } catch (error) {
    return null;
  }
});

ipcMain.handle('toggle-overlay', () => {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  } else {
    createOverlayWindow();
  }
});

ipcMain.handle('set-overlay-opacity', (event, opacity) => {
  if (overlayWindow) {
    overlayWindow.setOpacity(opacity);
  }
});

ipcMain.handle('close-overlay', () => {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
});

ipcMain.handle('get-game-status', () => {
  return gameRunning;
});

ipcMain.handle('check-process', async (event, processName) => {
  try {
    const processes = await si.processes();
    
    const valorantProcess = processes.list.find(proc => {
      const processName = proc.name.toLowerCase();
      return processName.includes('valorant.exe') || 
             processName.includes('valorant-win64-shipping') ||
             (processName.includes('riotclientux.exe') && proc.cmd && proc.cmd.toLowerCase().includes('valorant'));
    });
    
    return !!valorantProcess;
  } catch (error) {
    console.error('Erro ao verificar processo:', error);
    return false;
  }
}); 