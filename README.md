> 当前进度：截图后，使用模拟数据返回给前端。暂时没有连接后端。

# 截屏问答应用

一个基于 Electron 和 React 的桌面应用，允许用户快速截取屏幕内容，自动识别截图中的问题并提供解答。特别适合编程学习、算法题解答等场景。

## 功能特点

- **快捷键截屏**：通过 `Cmd/Ctrl+Shift+4` 快速捕获屏幕内容
- **自动分析**：将截图发送到后端，自动识别题目内容
- **智能回答**：为识别出的问题生成详细解答
- **优雅界面**：使用 React 和 TailwindCSS 构建的现代化用户界面

## 技术栈

- **前端**：React 19, TailwindCSS 4
- **桌面框架**：Electron 35
- **构建工具**：Vite 6, TypeScript 5.7
- **打包工具**：Electron Builder

## 项目结构
frontend/
├── electron/ # Electron 主进程代码
│ ├── main.mjs # 主进程入口
│ ├── preload.mjs # 预加载脚本
│ └── mockBackend.mjs # 模拟后端响应
├── src/
│ ├── components/ # React 组件
│ │ └── ScreenshotAnalyzer.tsx # 截图分析组件
│ ├── App.tsx # 应用入口组件
│ └── electron.d.ts # Electron API 类型定义
└── package.json # 项目配置
```

## 工作流程

1. 用户按下快捷键 `Cmd/Ctrl+Shift+4` 进行截屏
2. 应用捕获屏幕内容并保存为临时文件
3. 截图在应用界面中显示预览
4. 截图被发送到后端进行分析（当前使用模拟数据）
5. 分析结果（问题和答案）显示在界面上

## 开发指南

### 安装依赖

```bash
# 使用 yarn
yarn

# 或使用 npm
npm install
```

### 开发模式

```bash
# 启动 Electron 应用
yarn electron:dev
```

### 构建应用

```bash
# 构建分发版本
yarn electron:build
```

## 自定义和扩展

### 连接真实后端

目前应用使用模拟数据，要连接真实后端，修改 `electron/main.mjs` 中的 `analyze-screenshot` 处理函数：

```javascript
ipcMain.handle("analyze-screenshot", async (event, imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    
    // 替换为真实API调用
    const response = await fetch('https://your-api-endpoint.com/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: imageBuffer
    });
    
    return await response.json();
  } catch (error) {
    console.error("分析截图失败:", error);
    return { error: error.message };
  }
});
```

### 自定义快捷键

修改 `electron/main.mjs` 中的快捷键设置：

```javascript
const screenshotShortcut = 'CommandOrControl+Shift+5'; // 修改为你想要的快捷键
```

## 许可证

[MIT](LICENSE)