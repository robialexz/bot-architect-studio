# 🛠️ AI Flow - Development Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)
- Mobile device for AR features (optional)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd AiFlow

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ar/              # AR-specific components
│   ├── landing/         # Landing page components
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── workflow/        # Workflow builder components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── pages/               # Page components
├── services/            # API services and integrations
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--ultra-deep-black: #0a0a0b;
--premium-blue: #0078ff;
--luxury-gold: #ffd700;

/* Accent Colors */
--sapphire: #0f52ba;
--emerald: #50c878;
--diamond: #b9f2ff;
--ruby: #e0115f;

/* Neutral Colors */
--platinum: #e5e4e2;
--silver: #c0c0c0;
```

### Typography

- **Primary Font**: Inter
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px, 64px

### Spacing

- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

## 📱 AR Development

### AR Components

- `ARWorkflowInterface.tsx` - Main AR interface
- `ARNode.tsx` - 3D workflow nodes
- `ARGestureHandler.tsx` - Touch gesture recognition

### AR Features

- Camera access and streaming
- 3D node positioning and manipulation
- Touch gesture recognition (drag, pinch, rotate)
- Real-time workflow building

### Testing AR

1. Use mobile device or mobile emulator
2. Grant camera permissions
3. Point camera at flat surface
4. Test gesture controls

## 🤖 AI Integration

### Supported Services

- **OpenAI**: GPT-4, GPT-3.5, DALL-E
- **Anthropic**: Claude 3 Sonnet
- **Hugging Face**: Various models
- **Stability AI**: Stable Diffusion
- **Cohere**: Language models

### Service Configuration

```typescript
// src/services/realAIService.ts
class RealAIService {
  private apiKeys = {
    openai: import.meta.env.VITE_OPENAI_API_KEY,
    anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
    // ... other services
  };
}
```

### Adding New AI Service

1. Add API configuration to `realAIService.ts`
2. Implement service methods
3. Add error handling and fallbacks
4. Update workflow node types
5. Add tests

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
src/
├── components/__tests__/
├── hooks/__tests__/
├── services/__tests__/
└── utils/__tests__/
```

### Writing Tests

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders component correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## 🔧 Development Tools

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks
- **Vitest**: Testing framework

### VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

## 🌐 Environment Variables

### Required Variables

```env
# App Configuration
VITE_APP_NAME=AI Flow
VITE_APP_VERSION=1.0.0

# Supabase (for authentication)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Optional AI Service Keys

```env
# OpenAI
VITE_OPENAI_API_KEY=your_openai_key

# Anthropic
VITE_ANTHROPIC_API_KEY=your_anthropic_key

# Other services...
```

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
npm ci

# Build application
npm run build

# Preview build (optional)
npm run preview
```

### Environment Setup

1. Set environment variables in hosting platform
2. Configure build settings
3. Set up domain and SSL
4. Configure redirects for SPA

### Hosting Platforms

- **Vercel**: Automatic deployments from Git
- **Netlify**: Easy setup with form handling
- **AWS Amplify**: Scalable hosting
- **Firebase Hosting**: Google integration

## 🔒 Security

### Best Practices

- Never commit API keys
- Use environment variables
- Implement CSP headers
- Validate user inputs
- Use HTTPS in production

### API Key Management

- Store in environment variables
- Use different keys for dev/prod
- Implement rate limiting
- Monitor usage and costs

## 🐛 Debugging

### Common Issues

1. **Camera not working**: Check HTTPS and permissions
2. **API errors**: Verify API keys and rate limits
3. **Build failures**: Check TypeScript errors
4. **Performance issues**: Use React DevTools

### Debug Tools

- React DevTools
- Chrome DevTools
- Network tab for API calls
- Console for errors and logs

## 📚 Learning Resources

### React & TypeScript

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

### AR Development

- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

### AI Services

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
- [Hugging Face API](https://huggingface.co/docs/api-inference)

## 🤝 Contributing

### Development Workflow

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Run quality checks
6. Submit pull request

### Code Standards

- Use TypeScript strict mode
- Follow ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Maintain test coverage above 80%

### Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request code review

---

**Happy coding! 🚀**
