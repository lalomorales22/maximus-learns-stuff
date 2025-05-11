// src/components/draw/brush-selector.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Brush } from 'lucide-react';

interface BrushSelectorProps {
  brushSizes: number[];
  selectedBrushSize: number;
  onBrushSizeSelect: (size: number) => void;
}

const DEFAULT_BRUSH_SIZES = [2, 5, 10, 20, 30];

export function BrushSelector({
  brushSizes = DEFAULT_BRUSH_SIZES,
  selectedBrushSize,
  onBrushSizeSelect,
}: BrushSelectorProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-xl shadow-lg border-2 border-accent">
      <h3 className="text-xl font-bold text-accent-foreground mb-2 flex items-center gap-2">
        <Brush className="h-6 w-6 text-accent" /> Brush Size
      </h3>
      <div className="flex flex-wrap gap-3">
        {brushSizes.map((size) => (
          <Button
            key={size}
            aria-label={`Select brush size ${size}`}
            onClick={() => onBrushSizeSelect(size)}
            variant="outline"
            className={cn(
              'w-16 h-16 rounded-lg border-4 flex items-center justify-center transition-all duration-150 ease-in-out transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 ring-offset-2',
              selectedBrushSize === size ? 'ring-4 ring-primary border-primary-foreground bg-primary/20' : 'border-muted hover:border-accent/80',
            )}
          >
            <div
              className="rounded-full bg-foreground"
              style={{ width: `${Math.min(size, 40)}px`, height: `${Math.min(size, 40)}px` }} // Cap visual size for button
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
