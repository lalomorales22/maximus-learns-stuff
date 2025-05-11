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
        <Link href="/" className="flex items-center gap-2">
          <BookHeart className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
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
                  isActive={pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))}
                  tooltip={{ children: item.name, side: 'right', className: 'bg-card text-card-foreground border-border' }}
                  className={cn(
                    'justify-start',
                    (pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path)))
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
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
