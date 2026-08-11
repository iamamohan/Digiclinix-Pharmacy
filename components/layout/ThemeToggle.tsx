'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse shrink-0', className)} />
    );
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'w-10 h-10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0',
        className
      )}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-indigo-400 shrink-0" aria-hidden="true" />
      ) : (
        <Sun className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
};
