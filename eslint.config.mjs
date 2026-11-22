import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const ALLOWED_COMMENTS = [
  /^\s*prettier-ignore\s*$/,
  /^\s*eslint-(disable|enable)/,
  /^\/\s*<reference\s/,
  /https?:\/\/\S+/,
  /\b(copyright|license|SPDX-License-Identifier)\b/i,
];

function isDocOnExport(comment, source) {
  if (comment.type !== 'Block' || !comment.value.startsWith('*')) return false;
  return source.getTokenAfter(comment, { includeComments: false })?.value === 'export';
}

const noCommentsPlugin = {
  rules: {
    'no-comments': {
      meta: {
        type: 'suggestion',
        messages: {
          banned:
            'Delete this comment and let the code say it. Allowed: a license header, prettier-ignore, /** */ on an export, or a link to the issue, RFC or vendor doc that forces the behaviour.',
        },
      },
      create(context) {
        const source = context.sourceCode;
        return {
          Program() {
            for (const comment of source.getAllComments()) {
              if (comment.type === 'Shebang') continue;
              if (isDocOnExport(comment, source)) continue;
              if (ALLOWED_COMMENTS.some((pattern) => pattern.test(comment.value))) continue;
              context.report({ loc: comment.loc, messageId: 'banned' });
            }
          },
        };
      },
    },
  },
};

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
        React: 'readonly',
        JSX: 'readonly',
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
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
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

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': 'warn',
      'react/no-unescaped-entities': 'warn',

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
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
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    ignores: ['next-env.d.ts'],
    plugins: { local: noCommentsPlugin },
    rules: { 'local/no-comments': 'error' },
  },
];
