// main.js - AI Studio Electron Desktop Main Process
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const AEBridge = require('./bridge/ae-bridge');
const AIService = require('./server/ai-service');
const ReferenceAnalyzer = require('./server/reference-analyzer');
const UsageTracker = require('./server/usage-tracker');

let mainWindow = null;
const settingsPath = path.join(__dirname, 'config', 'settings.json');
const creatorPath = path.join(__dirname, 'config', 'creator.json');

let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
} catch (e) {
  settings = { language: 'uz', theme: 'dark' };
}

const aeBridge = new AEBridge(settings.aePath);
const aiService = new AIService(settings);
const usageTracker = new UsageTracker(settingsPath);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    title: 'AI Studio PRO — for Adobe After Effects',
    backgroundColor: '#0c0d14',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC HANDLERS
ipcMain.handle('get-project-status', async () => {
  return await aeBridge.getProjectStatus();
});

ipcMain.handle('execute-plan', async (event, { planId, promptData }) => {
  return await aeBridge.create3DLogoReveal(promptData);
});

ipcMain.handle('run-custom-jsx', async (event, jsxCode) => {
  return await aeBridge.executeJSX(jsxCode);
});

ipcMain.handle('process-prompt', async (event, { prompt, options }) => {
  return await aiService.processRequest(prompt, options);
});

ipcMain.handle('get-references', async () => {
  const lang = settings.language || 'uz';
  return {
    analysis: ReferenceAnalyzer.getSampleAnalysis('car_reference.mp4', lang),
    items: [
      { id: 'ref1', name: 'car_reference.mp4', type: 'video', duration: '00:12' },
      { id: 'ref2', name: 'logo.png', type: 'image', dimensions: '4K' },
      { id: 'ref3', name: 'style_reference.jpg', type: 'image' },
      { id: 'ref4', name: 'light_reference.mp4', type: 'video', duration: '00:08' },
      { id: 'ref5', name: 'particles.mp4', type: 'video', duration: '00:10' },
      { id: 'ref6', name: 'text_style.jpg', type: 'image' }
    ]
  };
});

ipcMain.handle('get-presets', async () => {
  try {
    const presetsPath = path.join(__dirname, 'presets', 'default-presets.json');
    if (fs.existsSync(presetsPath)) {
      return JSON.parse(fs.readFileSync(presetsPath, 'utf8'));
    }
  } catch(e) {}
  return [];
});

ipcMain.handle('apply-preset', async (event, presetId) => {
  return await aeBridge.create3DLogoReveal({ preset: presetId });
});

ipcMain.handle('get-settings', async () => {
  return settings;
});

ipcMain.handle('save-settings', async (event, newSettings) => {
  settings = { ...settings, ...newSettings };
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  return { success: true };
});

ipcMain.handle('get-creator', async () => {
  try {
    if (fs.existsSync(creatorPath)) {
      return JSON.parse(fs.readFileSync(creatorPath, 'utf8'));
    }
  } catch(e) {}
  return {
    creator: { name: "Adxamjonsv", role: "Creator and Developer", country: "Uzbekistan" }
  };
});

ipcMain.handle('get-locales', async (event, lang = 'uz') => {
  try {
    const p = path.join(__dirname, 'src', 'locales', `${lang}.json`);
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch(e) {}
  return {};
});

ipcMain.handle('start-render', async () => {
  const rendersDir = path.join(__dirname, 'renders');
  if (!fs.existsSync(rendersDir)) fs.mkdirSync(rendersDir, { recursive: true });

  const outputFile = path.join(rendersDir, 'Logo_Animation.mp4');
  return {
    success: true,
    file: outputFile,
    size: '125 MB',
    resolution: '3840 x 2160',
    duration: '00:00:05:00'
  };
});

ipcMain.handle('open-folder', async (event, folderType) => {
  let target = __dirname;
  if (folderType === 'renders') target = path.join(__dirname, 'renders');
  if (folderType === 'projects') target = path.join(__dirname, 'projects');
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  shell.openPath(target);
  return { success: true };
});
