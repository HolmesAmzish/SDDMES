const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess = null;

const VALID_CREDENTIALS = {
  username: 'admin',
  password: '123456'
};

function createLoginWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600, // 调整为更适合登录界面的高度
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('./view/login.html').catch(err => console.error('加载登录页面失败:', err));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

function createMainWindow() {
  mainWindow.setSize(1400, 800);
  mainWindow.maximize();
  mainWindow.loadFile('./view/index.html').then(() => {
    console.log('主窗口加载成功');
  }).catch(err => console.error('加载主窗口失败:', err));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

}


app.whenReady().then(() => {
  createLoginWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  if (pythonProcess) pythonProcess.kill();
});

ipcMain.handle('login', async (event, { username, password }) => {
  console.log('收到登录请求:', { username, password });
  if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
    console.log('验证通过，创建主窗口');
    createMainWindow();
    return true;
  } else {
    console.log('验证失败');
    return false;
  }
});