interface ElectronAPI {
  onScreenshotTaken: (callback: (path: string) => void) => void;
  analyzeScreenshot: (imagePath: string) => Promise<any>;
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {}; 