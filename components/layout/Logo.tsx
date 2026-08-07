import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, showSubtitle = true }) => {
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-1 transition-transform active:scale-95', className)}
      aria-label="Digiclinix Pharmacy Home"
    >
      {/* Transparent Purple Brand Logo Icon */}
      <div className="relative w-9 h-10 shrink-0 flex items-center justify-center">
        <Image
          src="/logo/digiclinix-icon-transparent.png"
          alt="Digiclinix Icon"
          width={36}
          height={40}
          priority
          className="w-9 h-10 object-contain shrink-0 drop-shadow-xs"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-purple-950 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors leading-none">
          DIGICLINIX
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-bold tracking-widest text-purple-700/80 dark:text-purple-400 uppercase mt-0.5 leading-none">
            Clinics | Diagnostics | Pharmacy
          </span>
        )}
      </div>
    </Link>
  );
};
