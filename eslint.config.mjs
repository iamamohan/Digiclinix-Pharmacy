import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Disabled: This rule flags legitimate patterns used throughout this codebase:
      // - localStorage hydration on mount
      // - Syncing initialValues into controlled form state
      // - Syncing prop changes (URL params, external values) into local state
      // These are established React patterns and do not cause actual cascading render bugs here.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);

export default eslintConfig;
