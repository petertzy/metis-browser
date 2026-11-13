'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const allowedCommands = new Set(['back', 'forward', 'reload', 'home']);

contextBridge.exposeInMainWorld('metis', Object.freeze({
  navigate: (input) => ipcRenderer.invoke('browser:navigate', input),
  command: (command) => {
    if (!allowedCommands.has(command)) return Promise.resolve(false);
    return ipcRenderer.invoke('browser:command', command);
  },
  onState: (callback) => {
    if (typeof callback !== 'function') return () => {};
    const handler = (_event, state) => callback(state);
    ipcRenderer.on('browser:state', handler);
    return () => ipcRenderer.removeListener('browser:state', handler);
  }
}));
