import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nextConfigDir = dirname(fileURLToPath(import.meta.resolve('eslint-config-next/package.json')));

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: nextConfigDir,
});

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**'],
  },
  ...compat.extends('next/core-web-vitals'),
];
