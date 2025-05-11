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
      <div className="container flex h-16 items-center">
        {showSidebarTrigger && (
          <div className="mr-4 md:hidden">
            <SidebarTrigger />
          </div>
        )}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookHeart className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl sm:inline-block">{APP_NAME}</span>
        </Link>
        {/* Add User/Auth button here if needed in the future */}
      </div>
    </header>
  );
}
