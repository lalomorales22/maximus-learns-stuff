
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
  let customButtonStyle: React.CSSProperties = {};

  // Determine button variant or custom style based on module path or themeColor
  if (module.path.includes('math')) {
    buttonVariant = 'default'; // Primary
  } else if (module.path.includes('reading')) {
    buttonVariant = 'secondary'; // Accent color for reading in theme
  } else if (module.path.includes('typing')) {
    buttonVariant = 'default'; // Default often maps to primary or a distinct button color
                               // if secondary used for reading, default might be primary or accent
                               // let's assume secondary is for orange, accent for purple, primary for blue
                               // So typing could use accent (purple)
    customButtonStyle = { backgroundColor: 'hsl(var(--accent))', borderColor: 'hsl(var(--accent))' }; // if accent is purple
  } else if (module.path.includes('draw')) {
    if (module.themeColor === 'bg-pink-500') { // pink
      customButtonStyle = { backgroundColor: '#ec4899', borderColor: '#db2777' };
    } else {
      buttonVariant = 'default';
    }
  } else if (module.path.includes('coding')) {
     if (module.themeColor === 'bg-green-500') { // green
      customButtonStyle = { backgroundColor: '#22c55e', borderColor: '#16a34a' };
    } else {
      buttonVariant = 'default';
    }
  } else if (module.path.includes('being-nice')) {
    if (module.themeColor === 'bg-yellow-500') { // yellow
      customButtonStyle = { backgroundColor: '#eab308', borderColor: '#ca8a04', color: 'hsl(var(--primary-foreground))' }; // Added text color for yellow
    } else {
      buttonVariant = 'default';
    }
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
          style={customButtonStyle} // Apply custom styles
          variant={Object.keys(customButtonStyle).length > 0 ? 'default' : buttonVariant} // Use default variant if custom styles are applied, otherwise specific variant
        >
          <Link href={module.path}>
            Let's GO! <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

