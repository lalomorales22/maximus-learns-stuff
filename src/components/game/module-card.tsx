import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ModuleInfo } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

interface ModuleCardProps {
  module: ModuleInfo;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col h-full rounded-2xl"> {/* Increased roundness */}
      <CardHeader className={`p-0 ${module.themeColor} text-primary-foreground`}>
        <div className="relative w-full h-56"> {/* Increased height */}
          <Image
            src={`https://picsum.photos/seed/${module.name.replace(/\s+/g, '-')}/400/240`} /* Adjusted image size for new height */
            alt={module.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={module.dataAiHint}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4"> {/* Slightly darker overlay */}
             <module.icon className="w-20 h-20 opacity-90" /> {/* Made icon larger and more opaque */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="text-3xl font-bold mb-3">{module.name}</CardTitle> {/* Larger title */}
        <CardDescription className="text-muted-foreground text-base mb-6 flex-grow">{module.description}</CardDescription> {/* Larger description */}
        <Button 
          asChild 
          size="lg" // Using new larger 'lg' size for buttons
          className="w-full mt-auto" // Removed explicit bg/text colors to inherit from variant
          variant={module.path.includes('math') ? 'default' : module.path.includes('reading') ? 'secondary' : 'default'} // Example: vary button color
        >
          <Link href={module.path}>
            Start Learning <ArrowRight className="ml-2 h-6 w-6" /> {/* Larger arrow */}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
