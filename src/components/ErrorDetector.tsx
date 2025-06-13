import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorInfo {
  message: string;
  timestamp: string;
  source?: string;
  stack?: string;
}

const ErrorDetector: React.FC = () => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const capturedErrors: ErrorInfo[] = [];

    // Capture console errors
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      const errorInfo: ErrorInfo = {
        message: errorMessage,
        timestamp: new Date().toISOString(),
        source: 'console.error'
      };
      
      capturedErrors.push(errorInfo);
      setErrors([...capturedErrors]);
      
      // Show error detector if we have errors
      if (capturedErrors.length > 0) {
        setIsVisible(true);
      }
      
      originalError.apply(console, args);
    };

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        message: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        timestamp: new Date().toISOString(),
        source: 'window.error',
        stack: event.error?.stack
      };
      
      capturedErrors.push(errorInfo);
      setErrors([...capturedErrors]);
      setIsVisible(true);
    };

    // Capture unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorInfo: ErrorInfo = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date().toISOString(),
        source: 'unhandledrejection'
      };
      
      capturedErrors.push(errorInfo);
      setErrors([...capturedErrors]);
      setIsVisible(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (!isVisible || errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">
              JavaScript Errors Detected ({errors.length})
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {errors.slice(-3).map((error, index) => (
            <div key={index} className="text-sm">
              <div className="text-red-700 font-medium">
                {error.source} - {new Date(error.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-red-600 bg-red-100 p-2 rounded text-xs font-mono break-all">
                {error.message}
              </div>
              {error.stack && (
                <details className="mt-1">
                  <summary className="text-red-600 text-xs cursor-pointer">Stack trace</summary>
                  <pre className="text-red-600 bg-red-100 p-2 rounded text-xs font-mono whitespace-pre-wrap mt-1">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t border-red-200">
          <button
            onClick={() => window.open('/debug', '_blank')}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
          >
            Open Full Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDetector;
