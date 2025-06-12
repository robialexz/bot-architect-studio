interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  frameRate: number;
  memoryUsage?: number;
  errors: string[];
  retryCount: number;
}

class BackgroundPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    frameRate: 0,
    errors: [],
    retryCount: 0,
  };

  private startTime: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private frameRateInterval?: NodeJS.Timeout;

  startMonitoring(componentName: string) {
    this.startTime = performance.now();
    console.log(`🎬 ${componentName}: Starting performance monitoring`);

    // Start frame rate monitoring
    this.startFrameRateMonitoring();

    // Monitor memory usage if available
    this.monitorMemoryUsage();
  }

  markLoadComplete(componentName: string) {
    const loadTime = performance.now() - this.startTime;
    this.metrics.loadTime = loadTime;

    console.log(`✅ ${componentName}: Loaded in ${loadTime.toFixed(2)}ms`);

    if (loadTime > 5000) {
      console.warn(`⚠️ ${componentName}: Slow loading detected (${loadTime.toFixed(2)}ms)`);
    }
  }

  markRenderComplete(componentName: string) {
    const renderTime = performance.now() - this.startTime;
    this.metrics.renderTime = renderTime;

    console.log(`🎨 ${componentName}: Rendered in ${renderTime.toFixed(2)}ms`);
  }

  recordError(componentName: string, error: string) {
    this.metrics.errors.push(`${new Date().toISOString()}: ${error}`);
    console.error(`❌ ${componentName}: Error recorded - ${error}`);
  }

  recordRetry(componentName: string) {
    this.metrics.retryCount++;
    console.log(`🔄 ${componentName}: Retry attempt #${this.metrics.retryCount}`);
  }

  private startFrameRateMonitoring() {
    this.frameCount = 0;
    this.lastFrameTime = performance.now();

    const measureFrameRate = () => {
      this.frameCount++;
      const currentTime = performance.now();

      if (currentTime - this.lastFrameTime >= 1000) {
        this.metrics.frameRate = this.frameCount;

        if (this.metrics.frameRate < 30) {
          console.warn(`⚠️ Low frame rate detected: ${this.metrics.frameRate} FPS`);
        }

        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }

      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);
  }

  private monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;

      if (memory.usedJSHeapSize > 50 * 1024 * 1024) {
        // 50MB
        console.warn(
          `⚠️ High memory usage detected: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
        );
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  generateReport(componentName: string): string {
    const report = `
📊 Performance Report for ${componentName}:
- Load Time: ${this.metrics.loadTime.toFixed(2)}ms
- Render Time: ${this.metrics.renderTime.toFixed(2)}ms
- Frame Rate: ${this.metrics.frameRate} FPS
- Memory Usage: ${this.metrics.memoryUsage ? (this.metrics.memoryUsage / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}
- Errors: ${this.metrics.errors.length}
- Retry Count: ${this.metrics.retryCount}
${this.metrics.errors.length > 0 ? '\nErrors:\n' + this.metrics.errors.join('\n') : ''}
    `;

    return report.trim();
  }

  stopMonitoring(componentName: string) {
    if (this.frameRateInterval) {
      clearInterval(this.frameRateInterval);
    }

    console.log(this.generateReport(componentName));
  }

  // Static method for quick performance checks
  static checkBrowserCapabilities(): {
    supportsCanvas: boolean;
    supportsWebGL: boolean;
    supportsRequestAnimationFrame: boolean;
    devicePixelRatio: number;
    hardwareConcurrency: number;
  } {
    const canvas = document.createElement('canvas');
    const webglContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    return {
      supportsCanvas: !!canvas.getContext('2d'),
      supportsWebGL: !!webglContext,
      supportsRequestAnimationFrame: !!window.requestAnimationFrame,
      devicePixelRatio: window.devicePixelRatio || 1,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
    };
  }

  // Static method to determine if device can handle heavy animations
  static shouldUseReducedAnimations(): boolean {
    const capabilities = this.checkBrowserCapabilities();

    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }

    // Check device capabilities
    if (!capabilities.supportsCanvas || capabilities.hardwareConcurrency < 2) {
      return true;
    }

    // Check for low-end devices
    if (capabilities.devicePixelRatio > 2 && capabilities.hardwareConcurrency < 4) {
      return true;
    }

    return false;
  }
}

export const backgroundPerformanceMonitor = new BackgroundPerformanceMonitor();
export default BackgroundPerformanceMonitor;
