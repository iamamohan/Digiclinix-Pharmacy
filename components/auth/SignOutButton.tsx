'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const SignOutButton: React.FC = () => {
  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      onClick={() => signOut({ callbackUrl: '/' })}
      leftIcon={<LogOut className="w-4 h-4 text-red-500" aria-hidden="true" />}
      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/60 hover:bg-red-50 dark:hover:bg-red-950/30"
    >
      Sign Out
    </Button>
  );
};
