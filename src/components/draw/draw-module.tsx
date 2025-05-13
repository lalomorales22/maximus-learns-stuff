
// src/components/draw/draw-module.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { DrawingCanvas, type DrawingCanvasHandle } from './drawing-canvas';
import { ColorPalette } from './color-palette';
import { BrushSelector } from './brush-selector';
import { Trash2, Palette as PaletteIcon, Save } from 'lucide-react';
import { useScore } from '@/contexts/ScoreContext';
import { useToast } from '@/hooks/use-toast';
import { CURRENCY_NAME } from '@/lib/constants';

const DEFAULT_COLOR = '#000000'; // Black
const DEFAULT_BRUSH_SIZE = 5;
const DRAW_MODULE_COLOR = "text-pink-500";

export function DrawModule() {
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
  const [canvasWidth, setCanvasWidth] = useState(300); // Initial default
  const [canvasHeight, setCanvasHeight] = useState(200); // Initial default
  
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const drawingCanvasWrapperRef = useRef<HTMLDivElement>(null);

  const { addVBucks } = useScore();
  const { toast } = useToast();

  const drawingActivityInterval = useRef<NodeJS.Timeout | null>(null);
  const [isActivelyDrawing, setIsActivelyDrawing] = useState(false);
  const [artStrokeCounter, setArtStrokeCounter] = useState(0); // Counter for draw strokes

  const updateSize = useCallback(() => {
    if (drawingCanvasWrapperRef.current) {
      const wrapper = drawingCanvasWrapperRef.current;
      const canvasOwnBorderHorizontal = 8; 
      const canvasOwnBorderVertical = 8;   

      let newCanvasDrawingWidth = wrapper.clientWidth - canvasOwnBorderHorizontal;
      newCanvasDrawingWidth = Math.max(50, newCanvasDrawingWidth); 

      let newCanvasDrawingHeight = (window.innerHeight * 0.55);
      newCanvasDrawingHeight = Math.max(50, newCanvasDrawingHeight); 

      setCanvasWidth(newCanvasDrawingWidth);
      setCanvasHeight(newCanvasDrawingHeight);
    }
  }, []);

  useEffect(() => {
    updateSize(); 
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    addVBucks(2);
    toast({ title: "Color Changed!", description: `Switched to a new color! +2 ${CURRENCY_NAME}`, className: "bg-secondary text-secondary-foreground" });
  };

  const handleBrushSizeSelect = (size: number) => {
    setBrushSize(size);
    addVBucks(2);
    toast({ title: "Brush Resized!", description: `New brush size selected! +2 ${CURRENCY_NAME}`, className: "bg-accent text-accent-foreground" });
  };

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      addVBucks(5);
      toast({ title: "Canvas Cleared!", description: `Fresh start! +5 ${CURRENCY_NAME}`, className: "bg-blue-500 text-white" });
    } else {
        toast({ title: "Oops!", description: "Could not clear canvas.", variant: "destructive"})
    }
  };

  const handleDrawSegment = useCallback(() => {
    // This callback is for continuous drawing feedback if needed, currently not resulting in V-Bucks per segment
  }, []);

  const handleDrawStart = useCallback(() => {
    setIsActivelyDrawing(true);
  }, []);

  const handleDrawEnd = useCallback(() => {
    setIsActivelyDrawing(false);
    addVBucks(1); // User earns 1 V-Buck per stroke

    setArtStrokeCounter(prevCounter => {
      const newCounter = prevCounter + 1;
      if (newCounter % 50 === 0) { // Show toast every 50 strokes
        toast({ 
          title: "Stroke of Genius!", 
          description: `+1 ${CURRENCY_NAME} for your art! Keep up the great work!`, 
          className: "bg-pink-500 text-white" 
        });
      }
      return newCounter;
    });
  }, [addVBucks, toast]);

  useEffect(() => {
    if (isActivelyDrawing) {
      if (drawingActivityInterval.current) {
        clearInterval(drawingActivityInterval.current);
      }
      drawingActivityInterval.current = setInterval(() => {
        addVBucks(1); // Earn 1 V-Buck every 10 seconds of active drawing
        // No toast here to avoid spamming, user gets V-Bucks silently for sustained activity
      }, 10000); 
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
  }, [isActivelyDrawing, addVBucks]);


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
            <div className="flex flex-col gap-6 md:w-72">
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
            
            <div ref={drawingCanvasWrapperRef} className="flex-grow flex items-center justify-center bg-muted/20 p-2 md:p-3 rounded-2xl border-4 border-dashed border-border shadow-inner_lg overflow-hidden">
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
  toDataURL: (type?: string, quality?: any) => string;
}

