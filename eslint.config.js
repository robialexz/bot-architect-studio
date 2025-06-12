import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage/**', 'test-results/**', 'playwright-report/**'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': 'off',
      // Optimize React Hooks rules for better developer experience
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useCallback|useMemo)',
        },
      ],
      // Allow certain patterns that are common in UI libraries
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'meta',
            'loader',
            'action',
            'ErrorBoundary',
            'buttonVariants',
            'badgeVariants',
            'toggleVariants',
          ],
        },
      ],
    },
  },
  // Special configuration for UI components and test files
  {
    files: [
      'src/components/ui/**/*.{ts,tsx}',
      'src/components/lazy/**/*.{ts,tsx}',
      'src/components/workflow/index.tsx',
      'src/contexts/**/*.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  }
);
