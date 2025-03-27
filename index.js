const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('./renderer/index.html')
  
  // 开发模式下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
}

// Python子进程处理
let pythonProcess = null

function startPythonProcess() {
  const scriptPath = path.join(__dirname, 'python_processor.py')
  pythonProcess = spawn('python', [scriptPath])
  
  pythonProcess.stdout.on('data', (data) => {
    mainWindow.webContents.send('python-process-output', data.toString())
  })
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`)
  })
}

app.whenReady().then(() => {
  createWindow()
  startPythonProcess()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
  if (pythonProcess) pythonProcess.kill()
})

// IPC通信处理
ipcMain.handle('detect-image', async (event, imagePath) => {
  return new Promise((resolve) => {
    pythonProcess.stdin.write(JSON.stringify({ type: 'detect', path: imagePath }) + '\n')
    
    const handler = (data) => {
      const result = JSON.parse(data.toString())
      if (result.type === 'detect-result') {
        pythonProcess.stdout.off('data', handler)
        resolve(result.data)
      }
    }
    
    pythonProcess.stdout.on('data', handler)
  })
})
