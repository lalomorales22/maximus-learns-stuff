
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ScoreProvider } from '@/contexts/ScoreContext';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScoreProvider>
      <SidebarProvider defaultOpen={true} open={true}> {/* Keep sidebar open by default */}
        <Sidebar collapsible="icon" variant="sidebar" side="left">
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </SidebarInset>
        <SidebarRail />
      </SidebarProvider>
    </ScoreProvider>
  );
}
