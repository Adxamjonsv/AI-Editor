// preload.js - Secure IPC Bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProjectStatus: () => ipcRenderer.invoke('get-project-status'),
  executePlan: (planId, promptData) => ipcRenderer.invoke('execute-plan', { planId, promptData }),
  runCustomJSX: (jsxCode) => ipcRenderer.invoke('run-custom-jsx', jsxCode),
  getReferences: (category) => ipcRenderer.invoke('get-references', category),
  getPresets: () => ipcRenderer.invoke('get-presets'),
  applyPreset: (presetId) => ipcRenderer.invoke('apply-preset', presetId),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (newSettings) => ipcRenderer.invoke('save-settings', newSettings),
  getCreator: () => ipcRenderer.invoke('get-creator'),
  getLocales: (lang) => ipcRenderer.invoke('get-locales', lang),
  startRender: (renderParams) => ipcRenderer.invoke('start-render', renderParams),
  openFolder: (folderType) => ipcRenderer.invoke('open-folder', folderType),
  processPrompt: (prompt, options) => ipcRenderer.invoke('process-prompt', { prompt, options })
});
