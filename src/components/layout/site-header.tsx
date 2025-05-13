
import Link from 'next/link';
import { APP_NAME, VBUCKS_ICON } from '@/lib/constants'; // VBUCKS_ICON for potential use
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Shield } from 'lucide-react'; // Using Shield as a more "epic" icon

type SiteHeaderProps = {
  showSidebarTrigger?: boolean;
};

export function SiteHeader({ showSidebarTrigger = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
      <div className="container flex h-20 items-center"> {/* Increased header height */}
        {showSidebarTrigger && (
          <div className="mr-4 md:hidden">
            <SidebarTrigger />
          </div>
        )}
        <Link href="/" className="mr-6 flex items-center space-x-3 group"> {/* Increased space */}
          <Shield className="h-10 w-10 text-primary group-hover:animate-pulse" /> {/* Changed icon and size */}
          <span className="font-black text-4xl sm:inline-block text-primary group-hover:scale-105 transition-transform drop-shadow-sm"> {/* Bolder, larger, primary color */}
            {APP_NAME}
          </span>
        </Link>
        {/* Add User/Auth button here if needed in the future */}
      </div>
    </header>
  );
}
