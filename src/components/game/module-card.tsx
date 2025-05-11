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
    <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col h-full">
      <CardHeader className={`p-0 ${module.themeColor} text-primary-foreground`}>
        <div className="relative w-full h-48">
          <Image
            src={`https://picsum.photos/seed/${module.name.replace(/\s+/g, '-')}/400/200`}
            alt={module.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={module.dataAiHint}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
             <module.icon className="w-16 h-16 opacity-80" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="text-2xl font-bold mb-2">{module.name}</CardTitle>
        <CardDescription className="text-muted-foreground mb-4 flex-grow">{module.description}</CardDescription>
        <Button asChild size="lg" className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={module.path}>
            Start Learning <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
