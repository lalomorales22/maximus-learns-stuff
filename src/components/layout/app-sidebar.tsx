"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { APP_NAME, NAVIGATION_ITEMS } from '@/lib/constants';
import { BookHeart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 group">
          <BookHeart className="h-10 w-10 text-primary group-hover:animate-pulse" /> {/* Larger icon, hover animation */}
          <h1 className="text-2xl font-black group-data-[collapsible=icon]:hidden bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary group-hover:scale-105 transition-transform">
            {APP_NAME}
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link href={item.path} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  size="lg" // Using new larger button size
                  isActive={pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))}
                  tooltip={{ children: item.name, side: 'right', className: 'bg-card text-card-foreground border-border text-sm p-2 rounded-md shadow-lg' }} // Styled tooltip
                  className={cn(
                    'justify-start font-semibold', // Bolder font
                    (pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path)))
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <a>
                    <item.icon className="h-6 w-6" /> {/* Larger icons */}
                    <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {/* Placeholder for potential settings or user profile link */}
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              tooltip={{ children: "Settings", side: 'right', className: 'bg-card text-card-foreground border-border' }}
            >
              <Settings className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarFooter>
    </>
  );
}
