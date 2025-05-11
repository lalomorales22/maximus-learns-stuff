// src/components/draw/color-palette.tsx
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PaintBucket } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const PREDEFINED_COLORS = [
  '#FF0000', // Red
  '#00FF00', // Lime Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#008000', // Green
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#000000', // Black
  '#FFFFFF', // White (for eraser effect on colored bg, or just white)
];


export function ColorPalette({
  colors = PREDEFINED_COLORS,
  selectedColor,
  onColorSelect,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-card rounded-xl shadow-lg border-2 border-secondary">
      <h3 className="w-full text-xl font-bold text-secondary-foreground mb-2 flex items-center gap-2">
        <PaintBucket className="h-6 w-6 text-secondary" /> Colors
      </h3>
      {colors.map((color) => (
        <Button
          key={color}
          aria-label={`Select color ${color}`}
          onClick={() => onColorSelect(color)}
          className={cn(
            'w-12 h-12 rounded-lg border-4 transition-all duration-150 ease-in-out transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 ring-offset-2',
            selectedColor === color ? 'ring-4 ring-primary border-primary-foreground' : 'border-transparent hover:border-muted-foreground/50',
            color === '#FFFFFF' && 'border-muted' // Special border for white to be visible
          )}
          style={{ backgroundColor: color }}
          variant="ghost"
          size="icon"
        />
      ))}
    </div>
  );
}
