import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class AnimatedBackgroundErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AnimatedBackgroundErrorBoundary: Caught error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-retry mechanism
    if (this.state.retryCount < this.maxRetries) {
      this.retryTimeout = setTimeout(
        () => {
          console.log(
            `AnimatedBackgroundErrorBoundary: Retrying (${this.state.retryCount + 1}/${this.maxRetries})`
          );
          this.setState(prevState => ({
            hasError: false,
            retryCount: prevState.retryCount + 1,
          }));
        },
        2000 * (this.state.retryCount + 1)
      );
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // Show fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback
      return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-gold/5" />
          <div className="absolute inset-0 flex items-center justify-center">
            {this.state.retryCount < this.maxRetries ? (
              <div className="text-primary/40 text-sm">
                Retrying animation... ({this.state.retryCount + 1}/{this.maxRetries})
              </div>
            ) : (
              <div className="text-muted-foreground/40 text-sm">Animation unavailable</div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AnimatedBackgroundErrorBoundary;
