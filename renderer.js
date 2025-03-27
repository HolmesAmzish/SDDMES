document.addEventListener('DOMContentLoaded', () => {
    // 初始化界面
    setupTabs()
    
    // 绑定事件
    document.getElementById('browse-image').addEventListener('click', browseImage)
    document.getElementById('browse-folder').addEventListener('click', browseFolder)
    document.getElementById('start-detection').addEventListener('click', startDetection)
    
    // 监听Python输出
    window.electronAPI.onPythonOutput((event, output) => {
      const consoleOutput = document.getElementById('console-output')
      consoleOutput.textContent += output + '\n'
      consoleOutput.scrollTop = consoleOutput.scrollHeight
    })
  })
  
  async function browseImage() {
    const { filePaths } = await window.electronAPI.openDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }]
    })
    
    if (filePaths && filePaths.length > 0) {
      document.getElementById('image-path').value = filePaths[0]
    }
  }
  
  async function startDetection() {
    const imagePath = document.getElementById('image-path').value
    if (!imagePath) return
    
    try {
      const result = await window.electronAPI.detectImage(imagePath)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // 显示结果
      displayResult(result)
      
    } catch (error) {
      logToConsole(`检测失败: ${error.message}`)
    }
  }
  
  function displayResult(result) {
    // 更新结果图像
    const imgElement = document.getElementById('result-image')
    imgElement.src = `data:image/png;base64,${result.res_fig}`
    
    // 添加到结果表格
    const tableBody = document.getElementById('results-body')
    const row = document.createElement('tr')
    
    row.innerHTML = `
      <td>${result.name}</td>
      <td>${result.label}</td>
      <td>${result.num}</td>
      <td>${result.time}s</td>
    `
    
    tableBody.appendChild(row)
  }
  
  function logToConsole(message) {
    const consoleOutput = document.getElementById('console-output')
    consoleOutput.textContent += `${new Date().toLocaleTimeString()}: ${message}\n`
    consoleOutput.scrollTop = consoleOutput.scrollHeight
  }
  