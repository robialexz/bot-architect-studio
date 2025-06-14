import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Bug,
  Monitor,
  Globe,
  Code,
  Layers,
} from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: unknown;
}

interface ViewportInfo {
  width?: number;
  height?: number;
}

interface ScreenInfo {
  width?: number;
  height?: number;
}

interface EnvironmentInfo {
  userAgent?: string;
  url?: string;
  hostname?: string;
  protocol?: string;
  viewport?: ViewportInfo;
  screen?: ScreenInfo;
  timestamp?: string;
  timezone?: string;
  language?: string;
  cookieEnabled?: boolean;
  onLine?: boolean;
}

interface ComponentTest {
  name: string;
  component: React.ComponentType;
  status: 'loading' | 'success' | 'error';
  error?: string;
}

const DiagnosticPage: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [componentTests, setComponentTests] = useState<ComponentTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<EnvironmentInfo>({});

  // Capture all console errors
  useEffect(() => {
    const originalError = console.error;
    const capturedErrors: string[] = [];

    console.error = (...args) => {
      const errorMessage = args
        .map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(' ');
      capturedErrors.push(`${new Date().toISOString()}: ${errorMessage}`);
      setErrors([...capturedErrors]);
      originalError.apply(console, args);
    };

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      capturedErrors.push(
        `${new Date().toISOString()}: Unhandled Error: ${event.message} at ${event.filename}:${event.lineno}`
      );
      setErrors([...capturedErrors]);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      capturedErrors.push(
        `${new Date().toISOString()}: Unhandled Promise Rejection: ${event.reason}`
      );
      setErrors([...capturedErrors]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Gather environment information
  useEffect(() => {
    setEnvironment({
      userAgent: navigator.userAgent,
      url: window.location.href,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: screen.width,
        height: screen.height,
      },
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    });
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Test 1: React availability
    try {
      if (typeof React !== 'undefined' && React.version) {
        results.push({
          name: 'React Availability',
          status: 'pass',
          message: `React ${React.version} is loaded`,
          details: { version: React.version, createContext: typeof React.createContext },
        });
      } else {
        results.push({
          name: 'React Availability',
          status: 'fail',
          message: 'React is not properly loaded',
          details: { React: typeof React },
        });
      }
    } catch (error) {
      results.push({
        name: 'React Availability',
        status: 'fail',
        message: `React test failed: ${error}`,
        details: { error: String(error) },
      });
    }

    // Test 2: DOM readiness
    try {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        results.push({
          name: 'DOM Readiness',
          status: 'pass',
          message: 'Root element found',
          details: {
            rootElement: rootElement.tagName,
            children: rootElement.children.length,
            innerHTML: rootElement.innerHTML.length > 0,
          },
        });
      } else {
        results.push({
          name: 'DOM Readiness',
          status: 'fail',
          message: 'Root element not found',
        });
      }
    } catch (error) {
      results.push({
        name: 'DOM Readiness',
        status: 'fail',
        message: `DOM test failed: ${error}`,
      });
    }

    // Test 3: Module loading
    try {
      const moduleTests = [
        { name: 'Lucide React', test: () => import('lucide-react') },
        { name: 'React Router', test: () => import('react-router-dom') },
        { name: 'Tailwind Classes', test: () => document.querySelector('.bg-background') !== null },
      ];

      for (const moduleTest of moduleTests) {
        try {
          if (typeof moduleTest.test === 'function') {
            await moduleTest.test();
            results.push({
              name: `Module: ${moduleTest.name}`,
              status: 'pass',
              message: `${moduleTest.name} loaded successfully`,
            });
          }
        } catch (error) {
          results.push({
            name: `Module: ${moduleTest.name}`,
            status: 'fail',
            message: `Failed to load ${moduleTest.name}: ${error}`,
          });
        }
      }
    } catch (error) {
      results.push({
        name: 'Module Loading',
        status: 'fail',
        message: `Module loading test failed: ${error}`,
      });
    }

    // Test 4: CSS and Styling
    try {
      const testElement = document.createElement('div');
      testElement.className = 'bg-background text-foreground';
      document.body.appendChild(testElement);
      const styles = window.getComputedStyle(testElement);
      document.body.removeChild(testElement);

      results.push({
        name: 'CSS Loading',
        status: 'pass',
        message: 'CSS classes are being applied',
        details: {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        },
      });
    } catch (error) {
      results.push({
        name: 'CSS Loading',
        status: 'fail',
        message: `CSS test failed: ${error}`,
      });
    }

    // Test 5: Network connectivity
    try {
      const response = await fetch(window.location.origin + '/favicon.ico');
      results.push({
        name: 'Network Connectivity',
        status: response.ok ? 'pass' : 'warning',
        message: `Network test: ${response.status} ${response.statusText}`,
        details: { status: response.status, ok: response.ok },
      });
    } catch (error) {
      results.push({
        name: 'Network Connectivity',
        status: 'fail',
        message: `Network test failed: ${error}`,
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const testComponent = async (
    name: string,
    componentImport: () => Promise<{ default: React.ComponentType }>
  ) => {
    const newTest: ComponentTest = {
      name,
      component: () => <div>Loading...</div>,
      status: 'loading',
    };

    setComponentTests(prev => [...prev, newTest]);

    try {
      const module = await componentImport();
      const Component = module.default || module;

      setComponentTests(prev =>
        prev.map(test =>
          test.name === name ? { ...test, component: Component, status: 'success' } : test
        )
      );
    } catch (error) {
      setComponentTests(prev =>
        prev.map(test =>
          test.name === name ? { ...test, status: 'error', error: String(error) } : test
        )
      );
    }
  };

  const downloadDiagnosticReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      environment,
      diagnostics,
      componentTests,
      errors,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowsyai-diagnostic-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            <Bug className="w-8 h-8" />
            FlowsyAI Diagnostic Center
          </h1>
          <p className="text-muted-foreground">
            Comprehensive testing and debugging tools for deployment issues
          </p>
        </div>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Environment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>URL:</strong> {environment.url}
              </div>
              <div>
                <strong>Hostname:</strong> {environment.hostname}
              </div>
              <div>
                <strong>Protocol:</strong> {environment.protocol}
              </div>
              <div>
                <strong>Viewport:</strong> {environment.viewport?.width}x
                {environment.viewport?.height}
              </div>
              <div>
                <strong>Screen:</strong> {environment.screen?.width}x{environment.screen?.height}
              </div>
              <div>
                <strong>Language:</strong> {environment.language}
              </div>
              <div>
                <strong>Online:</strong> {environment.onLine ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Cookies:</strong> {environment.cookieEnabled ? 'Enabled' : 'Disabled'}
              </div>
              <div>
                <strong>Timezone:</strong> {environment.timezone}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={runDiagnostics} disabled={isRunning} className="flex items-center gap-2">
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
            {isRunning ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
          </Button>

          <Button
            onClick={() =>
              testComponent(
                'HeroSection',
                () => import('@/components/landing/HeroSection-NoMotion')
              )
            }
            variant="outline"
            className="flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Test Hero Section
          </Button>

          <Button
            onClick={() => testComponent('Navbar', () => import('@/components/Navbar-NoMotion'))}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Test Navbar
          </Button>

          <Button
            onClick={downloadDiagnosticReport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Diagnostic Results */}
        {diagnostics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {diagnostics.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.name}</span>
                        <Badge
                          variant={
                            result.status === 'pass'
                              ? 'default'
                              : result.status === 'fail'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                      {typeof result.details !== 'undefined' && (
                        <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {String(JSON.stringify(result.details as any, null, 2))}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Component Tests */}
        {componentTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Component Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {componentTests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(test.status)}
                      <span className="font-medium">{test.name}</span>
                      <Badge
                        variant={
                          test.status === 'success'
                            ? 'default'
                            : test.status === 'error'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {test.status}
                      </Badge>
                    </div>
                    {test.error && (
                      <Alert className="mb-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{test.error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="border rounded p-2 bg-muted/50">
                      <React.Suspense fallback={<div>Loading component...</div>}>
                        <test.component />
                      </React.Suspense>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Log */}
        {errors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Log ({errors.length} errors)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-auto">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm bg-red-50 border border-red-200 rounded p-2">
                    <pre className="whitespace-pre-wrap text-red-800">{error}</pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiagnosticPage;
