# 🛡️ Branch Protection Rules Setup

## Navigate to Branch Protection Settings

Go to: `https://github.com/robialexz/bot-architect-studio/settings/branches`

## Main Branch Protection Configuration

### 1. **Add Rule for `main` branch**

Click **Add rule** and configure:

#### Branch name pattern:

```
main
```

#### Protection Settings:

✅ **Require a pull request before merging**

- ✅ Require approvals: `1`
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require review from code owners

✅ **Require status checks to pass before merging**

- ✅ Require branches to be up to date before merging

#### Required Status Checks:

```
✅ Code Quality & Linting
✅ Unit & Integration Tests
✅ Build & Bundle Analysis
✅ Security Audit
✅ Performance Budget
```

✅ **Require conversation resolution before merging**

✅ **Require signed commits** (Optional but recommended)

✅ **Require linear history**

✅ **Include administrators** (Enforce rules for admins too)

✅ **Restrict pushes that create files** (Optional)

### 2. **Development Branch Protection** (Optional)

If you use a `develop` branch:

#### Branch name pattern:

```
develop
```

#### Protection Settings:

- ✅ Require pull request reviews: `1`
- ✅ Require status checks to pass
- ✅ Require conversation resolution

## Auto-merge Configuration

### Enable Auto-merge for Dependabot PRs

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 10
    reviewers:
      - 'robialexz'
    assignees:
      - 'robialexz'
    commit-message:
      prefix: '⬆️'
      include: 'scope'
```

## Verification Steps

1. ✅ Try to push directly to main (should be blocked)
2. ✅ Create a PR and verify status checks run
3. ✅ Verify PR requires approval before merge
4. ✅ Test that failing CI blocks merge

## Emergency Override

In case of emergency, administrators can:

1. Temporarily disable branch protection
2. Push critical fixes
3. Re-enable protection immediately

⚠️ **Always re-enable protection after emergency fixes**
