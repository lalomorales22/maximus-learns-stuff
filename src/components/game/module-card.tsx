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
  let buttonVariant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" = "default";
  if (module.path.includes('math')) {
    buttonVariant = 'default';
  } else if (module.path.includes('reading')) {
    buttonVariant = 'secondary';
  } else if (module.path.includes('typing')) {
    buttonVariant = 'default'; // Or another variant like 'accent' if defined
  } else if (module.path.includes('draw')) {
    buttonVariant = 'default'; // Default for draw, can be customized
  }


  return (
    <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col h-full rounded-2xl">
      <CardHeader className={`p-0 ${module.themeColor} text-primary-foreground`}>
        <div className="relative w-full h-56">
          <Image
            src={`https://picsum.photos/seed/${module.name.replace(/\s+/g, '-')}/400/240`}
            alt={module.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint={module.dataAiHint}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
             <module.icon className="w-20 h-20 opacity-90" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="text-3xl font-bold mb-3">{module.name}</CardTitle>
        <CardDescription className="text-muted-foreground text-base mb-6 flex-grow">{module.description}</CardDescription>
        <Button 
          asChild 
          size="lg"
          className="w-full mt-auto"
          // Use explicit button variant or a custom style if themeColor should directly influence button
          // For pink-500, we might need a custom button style or use 'default' if primary is acceptable
          style={module.themeColor === 'bg-pink-500' ? { backgroundColor: '#ec4899', borderColor: '#db2777' } : {}}
          variant={buttonVariant}
        >
          <Link href={module.path}>
            Start Learning <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
