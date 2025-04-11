const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess = null;

// Set the test account
const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'password'
};

function createLoginWindow() {
  mainWindow = new BrowserWindow({
    width: 768,
    height: 640,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
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
  // 获取主屏幕的尺寸
  const { screen } = require('electron');
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  // 设置窗口大小
  const winWidth = 1400;
  const winHeight = 860;

  mainWindow.setSize(winWidth, winHeight);

  // 计算窗口居中的位置
  const x = Math.floor((screenWidth - winWidth) / 2);
  const y = Math.floor((screenHeight - winHeight) / 2);

  mainWindow.setBounds({ width: winWidth, height: winHeight, x, y });

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

// TODO: Implement the login api of springboot
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