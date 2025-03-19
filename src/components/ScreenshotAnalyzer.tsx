import React, { useEffect, useState } from "react";

interface AnalysisResult {
  question?: string;
  answer?: string;
  error?: string;
}

const ScreenshotAnalyzer: React.FC = () => {
  const [screenshotPath, setScreenshotPath] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // 监听截图事件
    window.electron?.onScreenshotTaken((path: string) => {
      console.log(path, "path");
      setScreenshotPath(path);
      analyzeScreenshot(path);
    });

    return () => {
      // 清理监听器
    };
  }, []);

  const analyzeScreenshot = async (path: string) => {
    try {
      setIsAnalyzing(true);
      setResult(null);

      const analysisResult = await window.electron.analyzeScreenshot(path);
      setResult(analysisResult);
    } catch (error: unknown) {
      setResult({
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">截屏问答应用</h1>
        <p className="text-sm">
          按下 Ctrl+Shift+4 (Windows) 或 Cmd+Shift+4 (Mac) 进行截屏
        </p>
      </header>

      <div className="flex-1 p-4 overflow-auto">
        {screenshotPath && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">截图预览</h2>
            <img
              src={`file://${screenshotPath}`}
              alt="Screenshot"
              className="max-w-full border border-gray-300 rounded"
            />
          </div>
        )}

        {isAnalyzing && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">正在分析截图...</span>
          </div>
        )}

        {result && (
          <div className="mt-4 border rounded p-4 bg-gray-50">
            {result.error ? (
              <div className="text-red-500">
                <h3 className="font-semibold">分析失败</h3>
                <p>{result.error}</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">问题</h3>
                  <p className="p-2 bg-white border rounded">
                    {result.question}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">答案</h3>
                  <div className="p-2 bg-white border rounded whitespace-pre-wrap">
                    {result.answer}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {!screenshotPath && !isAnalyzing && !result && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-xl mb-2">使用快捷键进行截屏</p>
              <p>截图将自动发送到后端进行分析</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenshotAnalyzer;
