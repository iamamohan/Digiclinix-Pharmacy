'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

// next-themes injects an inline <script> for FOUC prevention.
// React 19 warns when it encounters a <script> tag inside a component tree
// during client rendering. Setting scriptProps.type = 'application/json'
// marks the injected element as inert JSON data so React skips the warning,
// while the actual FOUC-prevention logic still executes during SSR.
const SCRIPT_PROPS = { type: 'application/json' } as ThemeProviderProps['scriptProps'];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      scriptProps={SCRIPT_PROPS}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

