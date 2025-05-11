import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BookHeart } from 'lucide-react';

type SiteHeaderProps = {
  showSidebarTrigger?: boolean;
};

export function SiteHeader({ showSidebarTrigger = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center"> {/* Increased header height */}
        {showSidebarTrigger && (
          <div className="mr-4 md:hidden">
            <SidebarTrigger />
          </div>
        )}
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <BookHeart className="h-10 w-10 text-primary group-hover:animate-pulse" /> {/* Larger icon, hover animation */}
          <span className="font-black text-2xl sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary group-hover:scale-105 transition-transform">{APP_NAME}</span>
        </Link>
        {/* Add User/Auth button here if needed in the future */}
      </div>
    </header>
  );
}
