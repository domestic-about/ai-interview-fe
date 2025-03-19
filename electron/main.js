const { app, BrowserWindow, ipcMain, globalShortcut, desktopCapturer, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = process.env.NODE_ENV === "development";
const { analyzeImage } = require("./mockBackend");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // 如果需要在渲染进程中使用Node.js API，请设置以下选项
      // preload: path.join(__dirname, 'preload.js')
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 根据是否为开发环境加载不同的URL
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173"); // Vite默认开发服务器地址
    mainWindow.webContents.openDevTools(); // 在开发模式下打开开发者工具
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html")); // 生产环境加载打包后的文件
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // 注册全局快捷键 (Cmd+Shift+4 或 Ctrl+Shift+4)
  const screenshotShortcut = process.platform === "darwin" ? "CommandOrControl+Shift+4" : "CommandOrControl+Shift+4";
  globalShortcut.register(screenshotShortcut, () => {
    takeScreenshot();
  });
}

// 截屏功能
async function takeScreenshot() {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 },
    });
    const primaryDisplay = sources[0]; // 获取主显示器

    if (primaryDisplay) {
      const screenshotPath = path.join(app.getPath("temp"), `screenshot-${Date.now()}.png`);
      fs.writeFileSync(screenshotPath, primaryDisplay.thumbnail.toPNG());

      // 将截图发送到渲染进程
      mainWindow.webContents.send("screenshot-taken", screenshotPath);
    }
  } catch (error) {
    console.error("截屏失败:", error);
    dialog.showErrorBox("截屏失败", error.message);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 清理全局快捷键
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// 处理渲染进程发送的截图分析请求
ipcMain.handle("analyze-screenshot", async (event, imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);

    // 使用模拟后端
    const result = await analyzeImage(imageBuffer);
    return result;
  } catch (error) {
    console.error("分析截图失败:", error);
    return { error: error.message };
  }
});

// 这里可以添加其他IPC通信处理
// 例如：
// ipcMain.on('message-from-renderer', (event, arg) => {
//   console.log(arg)
//   event.reply('message-from-main', 'Hello from main process')
// })
