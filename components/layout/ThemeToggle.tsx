'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse shrink-0', className)} />
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        'w-10 h-10 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 shrink-0',
        className
      )}
      aria-label={`Current theme is ${theme}. Click to switch theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <Sun className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />}
      {theme === 'dark' && <Moon className="w-5 h-5 text-indigo-400 shrink-0" aria-hidden="true" />}
      {theme === 'system' && <Monitor className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden="true" />}
    </button>
  );
};
