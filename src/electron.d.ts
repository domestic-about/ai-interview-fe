interface AnalysisResult {
  question?: string;
  answer?: string;
  error?: string;
}

interface ElectronAPI {
  onScreenshotTaken: (callback: (path: string) => void) => void;
  analyzeScreenshot: (imagePath: string) => Promise<AnalysisResult>;
  send: <T>(channel: string, data: T) => void;
  receive: <T>(channel: string, func: (...args: T[]) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {}; 
