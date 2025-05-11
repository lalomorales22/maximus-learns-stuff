import { SiteHeader } from '@/components/layout/site-header';
import { ModuleCard } from '@/components/game/module-card';
import { ALL_MODULES, APP_NAME } from '@/lib/constants';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader showSidebarTrigger={false} />
      <main className="flex-1">
        <section className="container mx-auto py-12 px-4 text-center">
           <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl mb-12">
            <Image
              src="https://picsum.photos/seed/learningfun/1200/400"
              alt="Fun learning environment"
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="kids learning fun"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center p-8">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white shadow-md animate-fade-in-down">
                Welcome to {APP_NAME}!
              </h1>
              <p className="text-xl md:text-2xl text-slate-100 max-w-3xl mx-auto leading-relaxed shadow-sm animate-fade-in-up delay-200">
                Embark on exciting adventures in Math, Reading, and Typing. Let's learn and grow together!
              </p>
            </div>
          </div>
          
          <h2 className="text-3xl font-semibold mb-10 text-foreground">Choose Your Adventure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALL_MODULES.map((module) => (
              <ModuleCard key={module.name} module={module} />
            ))}
          </div>
        </section>
      </main>
      <footer className="py-6 text-center text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. Keep learning, Maximus!</p>
      </footer>
    </div>
  );
}
