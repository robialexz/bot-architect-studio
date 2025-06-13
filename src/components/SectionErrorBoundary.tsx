import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  sectionName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`🚨 Error in ${this.props.sectionName} section:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center bg-muted/10 border border-destructive/20 rounded-lg mx-4 my-8">
          <div className="text-center p-8 max-w-md">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {this.props.sectionName} Section Error
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              This section failed to load. This might be due to a network issue or component error.
            </p>
            {this.state.error && (
              <details className="text-left mb-4">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Error Details
                </summary>
                <pre className="text-xs text-destructive mt-2 p-2 bg-destructive/10 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <Button
              onClick={this.handleRetry}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Loading
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
