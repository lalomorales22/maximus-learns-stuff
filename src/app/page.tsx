
import { SiteHeader } from '@/components/layout/site-header';
import { ModuleCard } from '@/components/game/module-card';
import { ALL_MODULES, APP_NAME, CURRENCY_NAME } from '@/lib/constants';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader showSidebarTrigger={false} />
      <main className="flex-1">
        <section className="container mx-auto py-12 px-4 text-center">
           <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl mb-16">
            <Image
              src="https://picsum.photos/seed/fortnitegame/1200/400" 
              alt="Epic gaming adventure"
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="epic gaming adventure" // Updated AI hint
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-center p-8">
              <h1 className="text-7xl md:text-9xl font-black mb-6 animate-fade-in-down text-primary-foreground drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                 {APP_NAME}
              </h1>
              <p className="text-2xl md:text-3xl text-slate-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md animate-fade-in-up delay-200 font-semibold">
                Complete missions, level up your Tiers, and earn {CURRENCY_NAME}! Let the adventure begin!
              </p>
            </div>
          </div>
          
          <h2 className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">Choose Your Mission!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ALL_MODULES.map((module) => (
              <ModuleCard key={module.name} module={module} />
            ))}
          </div>
        </section>
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t mt-12">
        <p className="text-lg">&copy; {new Date().getFullYear()} {APP_NAME}. Keep earning those {CURRENCY_NAME}!</p>
      </footer>
    </div>
  );
}
