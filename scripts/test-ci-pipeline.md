# 🧪 CI/CD Pipeline Testing Guide

## Test 1: Trigger Initial Pipeline Run

The pipeline should have already started running after our push. Check:

- https://github.com/robialexz/bot-architect-studio/actions

## Test 2: Create a Test PR to Verify Quality Gates

### Step 1: Create a test branch

```bash
git checkout -b test/ci-pipeline-verification
```

### Step 2: Make a small change

```bash
echo "# CI/CD Pipeline Test" >> TEST_CI.md
git add TEST_CI.md
git commit -m "test: verify CI/CD pipeline quality gates"
git push origin test/ci-pipeline-verification
```

### Step 3: Create Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Create PR with title: "Test: CI/CD Pipeline Verification"
4. Watch the status checks run

## Test 3: Verify Quality Gates

The following checks should run automatically:

### ✅ Code Quality & Linting

- ESLint check with zero-error policy
- TypeScript compilation check
- Prettier formatting check

### ✅ Unit & Integration Tests

- Vitest test suite execution
- Coverage threshold validation (80%)
- Test result reporting

### ✅ Build & Bundle Analysis

- Production build creation
- Bundle size validation (< 2MB)
- Asset optimization check

### ✅ Security Audit

- npm audit for vulnerabilities
- Dependency security scan
- Security policy compliance

### ✅ Performance Budget

- Bundle size monitoring
- Chunk count validation
- Performance metrics check

## Test 4: Verify Failure Scenarios

### Test ESLint Failure

```bash
# Create a file with ESLint errors
echo "const unused = 'variable';" > src/test-eslint-error.ts
git add src/test-eslint-error.ts
git commit -m "test: trigger ESLint failure"
git push origin test/ci-pipeline-verification
```

This should:

- ❌ Fail the "Code Quality & Linting" check
- 🚫 Block PR merge
- 📝 Show detailed error message

### Test TypeScript Failure

```bash
# Create a file with TypeScript errors
echo "const test: string = 123;" > src/test-typescript-error.ts
git add src/test-typescript-error.ts
git commit -m "test: trigger TypeScript failure"
git push origin test/ci-pipeline-verification
```

This should:

- ❌ Fail the "TypeScript Check"
- 🚫 Block PR merge
- 📝 Show compilation errors

## Test 5: Clean Up Test Files

After verifying the pipeline works:

```bash
# Remove test files
rm src/test-eslint-error.ts src/test-typescript-error.ts TEST_CI.md
git add -A
git commit -m "cleanup: remove CI test files"
git push origin test/ci-pipeline-verification
```

## Expected Results

### ✅ Successful Pipeline Run Should Show:

- All status checks passing
- Green checkmarks on all jobs
- PR ready for merge
- Coverage report generated

### ❌ Failed Pipeline Run Should Show:

- Red X on failed checks
- Detailed error messages
- PR blocked from merging
- Clear instructions for fixes

## Monitoring and Alerts

### GitHub Notifications

- Email notifications for failed builds
- Slack/Discord integration (optional)
- Status badges in README

### Performance Monitoring

- Bundle size trends
- Build time tracking
- Test execution time

## Next Steps After Verification

1. ✅ Merge successful test PR
2. ✅ Delete test branch
3. ✅ Set up branch protection rules
4. ✅ Configure deployment targets
5. ✅ Add status badges to README
