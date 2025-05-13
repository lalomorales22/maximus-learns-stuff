
// src/components/draw/draw-module.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { DrawingCanvas, type DrawingCanvasHandle } from './drawing-canvas';
import { ColorPalette } from './color-palette';
import { BrushSelector } from './brush-selector';
import { Trash2, Palette as PaletteIcon, Save } from 'lucide-react'; // Added Save icon
import { useScore } from '@/contexts/ScoreContext';
import { useToast } from '@/hooks/use-toast';
import { CURRENCY_NAME } from '@/lib/constants';

const DEFAULT_COLOR = '#000000'; // Black
const DEFAULT_BRUSH_SIZE = 5;
const DRAW_MODULE_COLOR = "text-pink-500"; // Specific color for Draw module from constants or globals

export function DrawModule() {
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
  const [canvasWidth, setCanvasWidth] = useState(800); 
  const [canvasHeight, setCanvasHeight] = useState(600); 
  
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const drawingCanvasWrapperRef = useRef<HTMLDivElement>(null);

  const { addVBucks } = useScore(); // Changed from addScore
  const { toast } = useToast();

  const drawingActivityInterval = useRef<NodeJS.Timeout | null>(null);
  const [isActivelyDrawing, setIsActivelyDrawing] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (drawingCanvasWrapperRef.current) {
        const newWidth = Math.max(300, drawingCanvasWrapperRef.current.offsetWidth - 20);
        const newHeight = Math.max(200, window.innerHeight * 0.55);
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
    addVBucks(2); // Changed from addScore
    toast({ title: "Color Changed!", description: `Switched to a new color! +2 ${CURRENCY_NAME}`, className: "bg-secondary text-secondary-foreground" });
  };

  const handleBrushSizeSelect = (size: number) => {
    setBrushSize(size);
    addVBucks(2); // Changed from addScore
    toast({ title: "Brush Resized!", description: `New brush size selected! +2 ${CURRENCY_NAME}`, className: "bg-accent text-accent-foreground" });
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      addVBucks(5); // Changed from addScore
      toast({ title: "Canvas Cleared!", description: `Fresh start! +5 ${CURRENCY_NAME}`, className: "bg-blue-500 text-white" });
    } else {
        toast({ title: "Oops!", description: "Could not clear canvas.", variant: "destructive"})
    }
  };

  const handleDrawSegment = useCallback(() => {
    // Small reward for drawing activity can be managed by the interval timer
  }, []);

  const handleDrawStart = useCallback(() => {
    setIsActivelyDrawing(true);
  }, []);

  const handleDrawEnd = useCallback(() => {
    setIsActivelyDrawing(false);
    // Potentially award V-Bucks on draw end based on complexity or time, for now using interval.
    addVBucks(1); // Award 1 V-Buck when a stroke is completed
    toast({ title: "Stroke of Genius!", description: `+1 ${CURRENCY_NAME} for your art!`, className: "bg-pink-500 text-white" });
  }, [addVBucks, toast]); // Added toast and CURRENCY_NAME

  useEffect(() => {
    if (isActivelyDrawing) {
      if (drawingActivityInterval.current) {
        clearInterval(drawingActivityInterval.current);
      }
      drawingActivityInterval.current = setInterval(() => {
        addVBucks(1); // Changed from addScore
        // Optional: Toast for passive points, can be too much.
        // toast({ title: "Creative Flow!", description: `+1 ${CURRENCY_NAME} for your masterpiece!`, className: "bg-purple-400 text-white" });
      }, 10000); // Add 1 V-Buck every 10 seconds of active drawing
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
  }, [isActivelyDrawing, addVBucks, toast]);


  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className={`text-8xl md:text-9xl font-black my-8 tracking-tighter ${DRAW_MODULE_COLOR} drop-shadow-[0_6px_8px_rgba(236,72,153,0.4)] animate-pulse`}>DRAW</h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-5xl shadow-2xl rounded-2xl border-4 border-pink-500/50">
        <CardHeader>
          <CardTitle className="text-4xl text-center flex items-center justify-center gap-3 font-extrabold">
            <PaletteIcon className={`h-12 w-12 ${DRAW_MODULE_COLOR}`} /> Your Creative Canvas
          </CardTitle>
          <CardDescription className="text-center text-xl font-semibold text-muted-foreground">
            Pick colors, choose brushes, and earn {CURRENCY_NAME} for your art!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
            <div className="flex flex-col gap-6 md:w-72"> {/* Increased width for controls */}
              <ColorPalette
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />
              <BrushSelector
                selectedBrushSize={brushSize}
                onBrushSizeSelect={handleBrushSizeSelect}
              />
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleClearCanvas} variant="destructive" size="lg" className="w-full">
                  <Trash2 className="mr-2 h-6 w-6" /> Clear
                </Button>
                <Button 
                  onClick={() => {
                     if (canvasRef.current) {
                       const dataUrl = canvasRef.current.toDataURL();
                       const link = document.createElement('a');
                       link.download = 'maximus-art.png';
                       link.href = dataUrl;
                       link.click();
                       addVBucks(20);
                       toast({ title: "Artwork Saved!", description: `Your masterpiece is saved! +20 ${CURRENCY_NAME}`, className: "bg-green-500 text-white"});
                     }
                  }} 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Save className="mr-2 h-6 w-6" /> Save
                </Button>
              </div>
            </div>
            
            <div ref={drawingCanvasWrapperRef} className="flex-grow flex items-center justify-center bg-muted/20 p-2 md:p-3 rounded-2xl border-4 border-dashed border-border shadow-inner_lg">
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

// Add toDataURL to DrawingCanvasHandle
export interface DrawingCanvasHandle {
  clear: () => void;
  toDataURL: (type?: string, quality?: any) => string; // Added this line
}
