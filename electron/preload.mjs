import { contextBridge, ipcRenderer } from 'electron';

// 将API暴露给渲染进程
contextBridge.exposeInMainWorld("electron", {
  // 接收截图通知
  onScreenshotTaken: (callback) => {
    ipcRenderer.on('screenshot-taken', (event, path) => callback(path));
  },

  // 发送截图到后端进行分析
  analyzeScreenshot: (imagePath) => {
    return ipcRenderer.invoke('analyze-screenshot', imagePath);
  },

  // 其他通用API
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
