# 🧩 Component Documentation

## Overview

This document provides comprehensive documentation for all React components in
the AI Flow application. Components are organized by category and include usage
examples, props, and best practices.

## Component Categories

### 🎯 Core Components

#### ErrorBoundary

Enterprise-grade error boundary component for graceful error handling.

**Usage:**

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary
  onError={(error, errorInfo) => {
    logger.error('Component error', { error, errorInfo });
  }}
>
  <YourComponent />
</ErrorBoundary>;
```

**Props:**

- `children: ReactNode` - Components to wrap
- `fallback?: ReactNode` - Custom error UI
- `onError?: (error: Error, errorInfo: ErrorInfo) => void` - Error callback

**Features:**

- Automatic error logging
- Development error details
- Production-safe error display
- Retry functionality

#### ProtectedRoute

Authentication wrapper for protected pages.

**Usage:**

```tsx
import { AuthenticatedRoute, PublicRoute } from '@/components/ProtectedRoute'

// For authenticated pages
<AuthenticatedRoute>
  <DashboardPage />
</AuthenticatedRoute>

// For public-only pages (redirects if authenticated)
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

**Props:**

- `children: ReactNode` - Page component to protect
- `redirectTo?: string` - Custom redirect path

### 🎨 UI Components

#### Button

Enhanced button component with multiple variants and states.

**Usage:**

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="md" disabled={false}>
  Click me
</Button>;
```

**Variants:**

- `default` - Primary button style
- `destructive` - For dangerous actions
- `outline` - Outlined button
- `secondary` - Secondary styling
- `ghost` - Minimal styling
- `link` - Link appearance

**Sizes:**

- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

#### Card

Flexible card component for content containers.

**Usage:**

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>;
```

#### Dialog

Modal dialog component with accessibility features.

**Usage:**

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>;
```

### 🏗️ Layout Components

#### Navbar

Main navigation component with authentication state handling.

**Usage:**

```tsx
import { Navbar } from '@/components/Navbar';

<Navbar />;
```

**Features:**

- Responsive design
- Authentication state awareness
- Smart logo navigation
- Mobile menu support
- Accessibility compliant

#### Layout

Main layout wrapper with navigation and footer.

**Usage:**

```tsx
import Layout from '@/components/Layout';

<Layout>
  <YourPageContent />
</Layout>;
```

**Features:**

- Consistent page structure
- Responsive navigation
- Footer integration
- Theme support

### 🔄 Workflow Components

#### EnhancedWorkflowBuilder

Advanced workflow builder with drag-and-drop functionality.

**Usage:**

```tsx
import { EnhancedWorkflowBuilder } from '@/components/EnhancedWorkflowBuilder';

<EnhancedWorkflowBuilder
  workflowId="workflow-123"
  onSave={workflow => console.log('Saved:', workflow)}
  onExecute={workflow => console.log('Executing:', workflow)}
/>;
```

**Props:**

- `workflowId?: string` - ID of workflow to load
- `onSave?: (workflow: Workflow) => void` - Save callback
- `onExecute?: (workflow: Workflow) => void` - Execute callback

**Features:**

- Drag-and-drop node creation
- Real-time collaboration
- Auto-save functionality
- Node configuration panels
- Connection validation

#### WorkflowNode

Individual workflow node component.

**Usage:**

```tsx
import { WorkflowNode } from '@/components/workflow/WorkflowNode';

<WorkflowNode
  id="node-1"
  type="ai-processor"
  data={{ label: 'AI Analysis' }}
  selected={false}
  onSelect={nodeId => console.log('Selected:', nodeId)}
/>;
```

### 🤖 AI Components

#### AIAgentCard

Display card for AI agents with capabilities and pricing.

**Usage:**

```tsx
import { AIAgentCard } from '@/components/AIAgentCard';

<AIAgentCard
  agent={{
    id: 'gpt-4',
    name: 'GPT-4 Assistant',
    description: 'Advanced language model',
    capabilities: ['text-generation', 'analysis'],
    pricing: { type: 'usage', cost: 0.01 },
  }}
  onSelect={agent => console.log('Selected:', agent)}
/>;
```

### 📊 Analytics Components

#### PerformanceMonitor

Real-time performance monitoring display.

**Usage:**

```tsx
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

<PerformanceMonitor
  showMetrics={true}
  autoRefresh={true}
  refreshInterval={5000}
/>;
```

**Features:**

- Core Web Vitals tracking
- Real-time updates
- Performance alerts
- Historical data

#### HealthCheck

System health status display.

**Usage:**

```tsx
import { HealthCheck } from '@/components/HealthCheck';

<HealthCheck showDetails={true} autoRefresh={true} />;
```

## Component Patterns

### Higher-Order Components (HOCs)

#### withErrorBoundary

Wrap components with error boundary protection.

```tsx
import { withErrorBoundary } from '@/components/ErrorBoundary';

const SafeComponent = withErrorBoundary(YourComponent, {
  onError: error => logger.error('Component error', { error }),
});
```

#### withPerformanceMonitoring

Add performance monitoring to components.

```tsx
import { withPerformanceMonitoring } from '@/lib/performance';

const MonitoredComponent = withPerformanceMonitoring(
  YourComponent,
  'ComponentName'
);
```

### Custom Hooks

#### useAuth

Authentication state and methods.

```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, login, logout, signup } = useAuth();
```

#### usePerformanceMonitor

Performance monitoring utilities.

```tsx
import { usePerformanceMonitor } from '@/lib/performance';

const { measureRender, measureEffect, markInteraction } =
  usePerformanceMonitor('ComponentName');
```

#### useSecurity

Security utilities and validation.

```tsx
import { useSecurity } from '@/lib/security';

const { sanitizeHTML, sanitizeURL, validateInput, generateToken } =
  useSecurity();
```

## Best Practices

### Component Development

1. **TypeScript First**: Always use TypeScript with proper type definitions
2. **Props Interface**: Define clear props interfaces
3. **Error Boundaries**: Wrap components that might fail
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Include proper ARIA attributes
6. **Testing**: Write comprehensive tests for all components

### Example Component Template

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  description?: string;
  variant?: 'default' | 'secondary';
  className?: string;
  children?: React.ReactNode;
  onAction?: () => void;
}

export const MyComponent = React.memo<MyComponentProps>(
  ({
    title,
    description,
    variant = 'default',
    className,
    children,
    onAction,
  }) => {
    return (
      <div
        className={cn(
          'base-styles',
          variant === 'secondary' && 'secondary-styles',
          className
        )}
        role="region"
        aria-label={title}
      >
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {children}
        {onAction && (
          <button onClick={onAction} aria-label={`Action for ${title}`}>
            Action
          </button>
        )}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### Performance Optimization

1. **Lazy Loading**: Use React.lazy for heavy components
2. **Memoization**: Use React.memo and useMemo appropriately
3. **Code Splitting**: Split components into separate bundles
4. **Virtual Scrolling**: For large lists
5. **Image Optimization**: Use optimized image formats

### Accessibility Guidelines

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Provide descriptive labels
3. **Keyboard Navigation**: Ensure keyboard accessibility
4. **Color Contrast**: Meet WCAG guidelines
5. **Screen Readers**: Test with screen reader software

## Testing Components

### Unit Testing Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const mockAction = vi.fn();
    render(<MyComponent title="Test" onAction={mockAction} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<MyComponent title="Test Title" />);

    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-label', 'Test Title');
  });
});
```

## Component Lifecycle

### Development Workflow

1. **Design**: Create component design and API
2. **Implementation**: Build component with TypeScript
3. **Testing**: Write comprehensive tests
4. **Documentation**: Update component docs
5. **Review**: Code review and feedback
6. **Integration**: Add to component library

### Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Performance Monitoring**: Track component performance
3. **Accessibility Audits**: Regular accessibility testing
4. **User Feedback**: Incorporate user feedback
5. **Refactoring**: Improve code quality over time

---

For more detailed component documentation, see individual component files and
their accompanying test files.
