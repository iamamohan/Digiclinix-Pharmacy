'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User as UserIcon, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';

export interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  role?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { success: toastSuccess } = useToast();

  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const displayEmail = user.email || '';

  // Get initials for fallback avatar
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Close dropdown on click outside or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    toastSuccess('Signed out successfully');
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`User menu for ${displayName}`}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-purple-600 text-white font-bold text-xs flex items-center justify-center border border-purple-400 shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={displayName}
              fill
              sizes="32px"
              className="object-cover object-center"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Info Header */}
          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
            {displayEmail && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{displayEmail}</p>
            )}
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <UserIcon className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>My Account</span>
            </Link>

            {/* Product Management — ADMIN only */}
            {role === 'ADMIN' && (
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
              >
                <Settings className="w-4 h-4 shrink-0 text-purple-500" aria-hidden="true" />
                <span>Product Management</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
