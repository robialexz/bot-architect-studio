# 🔐 GitHub Secrets Setup Guide

## Required Secrets for CI/CD Pipeline

Navigate to:
`https://github.com/robialexz/bot-architect-studio/settings/secrets/actions`

### 1. **SUPABASE_URL**

```
Value: Your Supabase project URL
Example: https://your-project-id.supabase.co
```

### 2. **SUPABASE_ANON_KEY**

```
Value: Your Supabase anonymous key
Found in: Supabase Dashboard > Settings > API
```

### 3. **SUPABASE_SERVICE_ROLE_KEY**

```
Value: Your Supabase service role key (for CI/CD operations)
Found in: Supabase Dashboard > Settings > API
⚠️ Keep this secret - it has admin privileges
```

### 4. **CODECOV_TOKEN** (Optional - for coverage reporting)

```
Value: Your Codecov token
Get from: https://codecov.io/gh/robialexz/bot-architect-studio
```

### 5. **SENTRY_DSN** (Optional - for error tracking)

```
Value: Your Sentry DSN
Get from: Sentry Dashboard > Settings > Client Keys
```

### 6. **DEPLOYMENT_TOKEN** (For production deployment)

```
Value: Deployment service token (Vercel, Netlify, etc.)
```

## Environment Variables for Different Environments

### Development Environment

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=development
VITE_ENABLE_LOGGING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Production Environment

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=production
VITE_ENABLE_LOGGING=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_SENTRY_DSN=your-sentry-dsn
```

## How to Add Secrets

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add each secret with the name and value above

## Verification

After adding secrets, the CI/CD pipeline will have access to:

- ✅ Supabase for database operations
- ✅ Error tracking for production monitoring
- ✅ Code coverage reporting
- ✅ Deployment automation
