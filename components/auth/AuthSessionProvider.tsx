'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export interface AuthSessionProviderProps {
  children: React.ReactNode;
}

export const AuthSessionProvider: React.FC<AuthSessionProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
