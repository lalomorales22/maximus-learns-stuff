// src/components/draw/draw-module.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { DrawingCanvas, type DrawingCanvasHandle } from './drawing-canvas';
import { ColorPalette } from './color-palette';
import { BrushSelector } from './brush-selector';
import { Trash2, Palette as PaletteIcon } from 'lucide-react';
import { useScore } from '@/contexts/ScoreContext';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_COLOR = '#000000'; // Black
const DEFAULT_BRUSH_SIZE = 5;

export function DrawModule() {
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
  const [canvasWidth, setCanvasWidth] = useState(800); 
  const [canvasHeight, setCanvasHeight] = useState(600); 
  
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const drawingCanvasWrapperRef = useRef<HTMLDivElement>(null);

  const { addScore } = useScore();
  const { toast } = useToast();

  const drawingActivityInterval = useRef<NodeJS.Timeout | null>(null);
  const [isActivelyDrawing, setIsActivelyDrawing] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (drawingCanvasWrapperRef.current) {
        const newWidth = Math.max(300, drawingCanvasWrapperRef.current.offsetWidth - 20); // Adjusted padding consideration
        const newHeight = Math.max(200, window.innerHeight * 0.55); // Slightly increased height percentage
        setCanvasWidth(newWidth);
        setCanvasHeight(newHeight);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    addScore(2);
    toast({ title: "Color Changed!", description: `Switched to a new color!`, className: "bg-secondary text-secondary-foreground" });
  };

  const handleBrushSizeSelect = (size: number) => {
    setBrushSize(size);
    addScore(2);
    toast({ title: "Brush Resized!", description: `New brush size selected!`, className: "bg-accent text-accent-foreground" });
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      addScore(10); 
      toast({ title: "Canvas Cleared!", description: "Fresh start!", className: "bg-blue-500 text-white" });
    } else {
        toast({ title: "Oops!", description: "Could not clear canvas.", variant: "destructive"})
    }
  };

  // Called for each segment drawn
  const handleDrawSegment = useCallback(() => {
    // Could add very small points for each segment, but might be too noisy.
    // The interval-based scoring for active drawing is likely better.
  }, []);

  const handleDrawStart = useCallback(() => {
    setIsActivelyDrawing(true);
  }, []);

  const handleDrawEnd = useCallback(() => {
    setIsActivelyDrawing(false);
  }, []);

  useEffect(() => {
    if (isActivelyDrawing) {
      if (drawingActivityInterval.current) {
        clearInterval(drawingActivityInterval.current);
      }
      drawingActivityInterval.current = setInterval(() => {
        addScore(1); 
        // Optional: Toast for passive points, can be too much, so commented out for now
        // toast({ title: "Drawing Fun!", description: "+1 point for your masterpiece in progress!", className: "bg-purple-400 text-white" });
      }, 5000); // Add 1 point every 5 seconds of active drawing
    } else {
      if (drawingActivityInterval.current) {
        clearInterval(drawingActivityInterval.current);
        drawingActivityInterval.current = null;
      }
    }
    return () => {
      if (drawingActivityInterval.current) {
        clearInterval(drawingActivityInterval.current);
      }
    };
  }, [isActivelyDrawing, addScore, toast]);


  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-7xl md:text-9xl font-black my-6 tracking-tighter text-pink-500 drop-shadow-lg animate-pulse">DRAW</h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-5xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center flex items-center justify-center gap-3 font-bold">
            <PaletteIcon className="h-10 w-10 text-pink-500" /> Your Creative Canvas
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Pick colors, choose brush sizes, and let your imagination flow!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="flex flex-col gap-6 md:w-64">
              <ColorPalette
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />
              <BrushSelector
                selectedBrushSize={brushSize}
                onBrushSizeSelect={handleBrushSizeSelect}
              />
              <Button onClick={handleClearCanvas} variant="destructive" size="lg" className="w-full">
                <Trash2 className="mr-2 h-6 w-6" /> Clear Canvas
              </Button>
            </div>
            
            <div ref={drawingCanvasWrapperRef} className="flex-grow flex items-center justify-center bg-muted/30 p-1 md:p-2 rounded-2xl border-2 border-dashed border-border">
              <DrawingCanvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                selectedColor={selectedColor}
                brushSize={brushSize}
                onDraw={handleDrawSegment}
                onDrawStart={handleDrawStart}
                onDrawEnd={handleDrawEnd}
                className="touch-none" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
