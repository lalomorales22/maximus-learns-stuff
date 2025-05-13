
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { APP_NAME, NAVIGATION_ITEMS } from '@/lib/constants';
import { Shield } from 'lucide-react'; // Using Shield icon
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 group"> {/* Increased gap */}
          <Shield className="h-12 w-12 text-sidebar-primary group-hover:animate-spin" /> {/* Larger icon, different animation */}
          <h1 className="text-3xl font-black group-data-[collapsible=icon]:hidden text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
            {APP_NAME}
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2"> {/* Added padding to content area */}
        <SidebarMenu>
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link href={item.path} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  size="lg" 
                  isActive={pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))}
                  tooltip={{ children: item.name, side: 'right', className: 'bg-popover text-popover-foreground border-border text-sm p-2 rounded-lg shadow-xl' }} 
                  className={cn(
                    'justify-start font-bold text-md', // Bolder font, larger text
                    (pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path)))
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "group-data-[collapsible=icon]:justify-center" // Center icon when collapsed
                  )}
                >
                  <a>
                    <item.icon className="h-7 w-7" /> {/* Larger icons */}
                    <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
        {/* Optional: Footer content like settings or a V-Bucks balance display */}
        {/* <p className="text-xs text-center text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          Win More V-Bucks!
        </p> */}
      </SidebarFooter>
    </>
  );
}
