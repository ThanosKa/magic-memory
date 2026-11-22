import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      '.next/**',
      '.cloudflare/**',
      '.vinext/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      '.cache/**',
      'public/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // React
        React: 'readonly',
        JSX: 'readonly',
        // Node.js
        NodeJS: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Browser
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        // Web APIs
        fetch: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        File: 'readonly',
        Blob: 'readonly',
        Image: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLImageElement: 'readonly',
        MouseEvent: 'readonly',
        TouchEvent: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // React specific
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': 'warn',
      'react/no-unescaped-entities': 'warn',

      // General best practices
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Handled by TypeScript
      'prefer-const': 'warn',
      'no-var': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
      next: {
        rootDir: '.',
      },
    },
  },
  // TypeScript only: type-aware lint and the CODING_STANDARDS.md rules the linter can check.
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration[params.length>1]:not([id.name=/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|generateMetadata|generateViewport|middleware|proxy)$/])',
          message: 'Take one object argument instead of positional params.',
        },
        {
          selector: 'VariableDeclarator:not([id.name=/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|generateMetadata|generateViewport|middleware|proxy)$/]) > ArrowFunctionExpression[params.length>1]',
          message: 'Take one object argument instead of positional params.',
        },
      ],
    },
  },
  // Server code logs through lib/logger.ts. Client code and scripts/ keep the rule above.
  {
    files: [
      'app/api/**/*.{ts,tsx}',
      'lib/email.ts',
      'lib/logger.ts',
      'lib/redis.ts',
      'lib/supabase/server.ts',
      'lib/users/index.ts',
      'lib/validations/**/*.ts',
    ],
    rules: {
      // The empty options object drops the allow list; a bare severity would inherit it.
      'no-console': ['error', {}],
    },
  },
  // Tests may use any, type assertions, non-null assertions and positional params.
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'tests/**',
      '__tests__/**',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-restricted-syntax': 'off',
    },
  },
];
