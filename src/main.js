'use strict';

const path = require('node:path');
const { app, BrowserWindow, WebContentsView, ipcMain, session } = require('electron');
const { DEFAULT_HOME, resolveNavigation, isAllowedWebNavigation } = require('./security');
const { shouldGrantPermission, shouldAllowDownload } = require('./permission-policy');

let window;
let page;
let activeUrl = DEFAULT_HOME;

function reportState() {
  if (!window || window.isDestroyed() || !page || page.webContents.isDestroyed()) return;
  window.webContents.send('browser:state', {
    url: page.webContents.getURL() || activeUrl,
    loading: page.webContents.isLoading(),
    canGoBack: page.webContents.navigationHistory.canGoBack(),
    canGoForward: page.webContents.navigationHistory.canGoForward()
  });
}

async function navigate(input) {
  const url = resolveNavigation(input);
  if (!url || !page || page.webContents.isDestroyed()) return false;
  activeUrl = url;
  try {
    await page.webContents.loadURL(url);
    reportState();
    return true;
  } catch {
    reportState();
    return false;
  }
}

function fitPage() {
  if (!window || window.isDestroyed() || !page) return;
  const [width, height] = window.getContentSize();
  page.setBounds({ x: 0, y: 58, width, height: Math.max(0, height - 58) });
}

function configureSecurity() {
  const browsingSession = session.fromPartition('metis:session');
  browsingSession.setPermissionRequestHandler((contents, permission, callback) => {
    callback(shouldGrantPermission(contents.getURL(), permission));
  });
  browsingSession.setPermissionCheckHandler((contents, permission) => {
    return shouldGrantPermission(contents.getURL(), permission);
  });
  browsingSession.on('will-download', (event, item) => {
    if (!shouldAllowDownload(item.getURL())) event.preventDefault();
  });
  return browsingSession;
}

function createBrowser() {
  window = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    title: 'Metis Browser',
    backgroundColor: '#101827',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  window.setMenuBarVisibility(false);
  const uiLoaded = window.loadFile(path.join(__dirname, 'index.html'));
  if (process.env.METIS_SMOKE_TEST === '1') {
    uiLoaded.then(async () => {
      const hasToolbar = await window.webContents.executeJavaScript(
        "Boolean(document.querySelector('#address') && document.querySelector('#back') && window.metis)"
      );
      if (!hasToolbar) throw new Error('Toolbar or preload bridge is unavailable');
      console.log('METIS_SMOKE_TEST_PASSED');
      app.exit(0);
    }).catch((error) => {
      console.error('METIS_SMOKE_TEST_FAILED:', error.message);
      app.exit(1);
    });
  }
  const browsingSession = configureSecurity();
  page = new WebContentsView({
    webPreferences: {
      session: browsingSession,
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      javascript: true
    }
  });
  window.contentView.addChildView(page);
  fitPage();
  window.on('resize', fitPage);
  page.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  page.webContents.on('will-navigate', (event, url) => {
    if (!isAllowedWebNavigation(url)) event.preventDefault();
  });
  page.webContents.on('will-redirect', (event, url) => {
    if (!isAllowedWebNavigation(url)) event.preventDefault();
  });
  for (const event of ['did-navigate', 'did-navigate-in-page', 'did-start-loading', 'did-stop-loading']) {
    page.webContents.on(event, reportState);
  }
  page.webContents.on('will-attach-webview', (event) => event.preventDefault());
  window.webContents.on('will-navigate', (event) => event.preventDefault());
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.on('closed', () => {
    if (page && !page.webContents.isDestroyed()) page.webContents.close();
    page = null;
    window = null;
  });
  void navigate(DEFAULT_HOME);
}

app.whenReady().then(() => {
  app.on('web-contents-created', (_event, contents) => {
    contents.on('will-attach-webview', (event) => event.preventDefault());
  });
  ipcMain.handle('browser:navigate', (event, input) => {
    if (!window || event.sender !== window.webContents) return false;
    return navigate(input);
  });
  ipcMain.handle('browser:command', (event, command) => {
    if (!window || event.sender !== window.webContents || !page) return false;
    const history = page.webContents.navigationHistory;
    switch (command) {
      case 'back':
        if (history.canGoBack()) history.goBack();
        break;
      case 'forward':
        if (history.canGoForward()) history.goForward();
        break;
      case 'reload':
        page.webContents.reload();
        break;
      case 'home':
        void navigate(DEFAULT_HOME);
        break;
      default:
        return false;
    }
    return true;
  });
  createBrowser();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createBrowser();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
