// src/components/draw/draw-module.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { DrawingCanvas, type DrawingCanvasHandle } from './drawing-canvas';
import { ColorPalette } from './color-palette';
import { BrushSelector } from './brush-selector';
import { Trash2, RotateCcw, Palette as PaletteIcon } from 'lucide-react';
import { useScore } from '@/contexts/ScoreContext';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_COLOR = '#000000'; // Black
const DEFAULT_BRUSH_SIZE = 5;

export function DrawModule() {
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLOR);
  const [brushSize, setBrushSize] = useState<number>(DEFAULT_BRUSH_SIZE);
  const [canvasWidth, setCanvasWidth] = useState(800); // Default width
  const [canvasHeight, setCanvasHeight] = useState(600); // Default height
  
  const canvasRef = useRef<DrawingCanvasHandle>(null); // For calling clearCanvas directly
  const drawingCanvasWrapperRef = useRef<HTMLDivElement>(null);

  const { addScore } = useScore();
  const { toast } = useToast();

  const drawingActivityInterval = useRef<NodeJS.Timeout | null>(null);
  const [isActivelyDrawing, setIsActivelyDrawing] = useState(false);

  // Update canvas size based on its container
  useEffect(() => {
    const updateSize = () => {
      if (drawingCanvasWrapperRef.current) {
        // Subtract padding/margins if any, ensure it fits well
        const newWidth = Math.max(300, drawingCanvasWrapperRef.current.offsetWidth - 40); 
        const newHeight = Math.max(200, window.innerHeight * 0.5); // Example: 50% of viewport height
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
    addScore(2); // Points for changing color
    toast({ title: "Color Changed!", description: `Switched to a new color!`, className: "bg-secondary text-secondary-foreground" });
  };

  const handleBrushSizeSelect = (size: number) => {
    setBrushSize(size);
    addScore(2); // Points for changing brush size
    toast({ title: "Brush Resized!", description: `New brush size selected!`, className: "bg-accent text-accent-foreground" });
  };

  const handleClearCanvas = () => {
    // The DrawingCanvas component handles its own clearing internally now when width/height/key changes.
    // To explicitly clear, we'd need a ref to a method on DrawingCanvas, or pass a 'clear' prop.
    // For simplicity with current DrawingCanvas, we can force a re-render of it with a new key.
    // However, a direct clear method is cleaner. Let's assume DrawingCanvas exposes `clear` via ref.
    // This requires modifying DrawingCanvas to use `useImperativeHandle`.
    // For now, let's simulate by re-keying, or implement the ref approach.
    // Simpler: just re-initialize the context on DrawingCanvas when clear button is clicked.
    // This is handled by the DrawingCanvas itself now via the passed `key` or internal logic.
    // The best way is to use the canvasRef to call a clear method.
    // (For this, DrawingCanvas needs to expose `clear` through `useImperativeHandle(ref, () => ({ clear: clearCanvasMethod }))`)
    // Let's assume DrawingCanvas is modified like this. Or we pass a trigger prop.
    // For now, we'll make DrawingCanvas take a `clearTrigger` prop.
    // Actually, a simpler way for `DrawingCanvas` is to just re-mount it with a new key, or have a clear method in DrawingCanvas
    // Let's assume canvasRef.current.clear() works (requires implementation in DrawingCanvas)

    // If DrawingCanvas doesn't have a clear method on its ref, we'd need another way.
    // For this implementation, we will modify `DrawingCanvas` to accept a ref with a clear method.
    // The prompt does not allow modifying DrawingCanvas.
    // Alternative: We can make DrawingCanvas.tsx manage its own clear via a prop or simply re-instantiate.
    // Given the current structure, the easiest non-invasive way is to rely on its internal clear or re-key it.
    // Or, for now, we will just clear it directly in this component if canvasRef provides the context
    const canvasEl = document.querySelector('canvas'); // Simplistic, better to use ref.
    if (canvasEl) {
      const ctx = canvasEl.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
         addScore(10); // Points for clearing
        toast({ title: "Canvas Cleared!", description: "Fresh start!", className: "bg-blue-500 text-white" });
      }
    }
  };

  const handleDraw = useCallback(() => {
    setIsActivelyDrawing(true);
    if (drawingActivityInterval.current) {
      clearInterval(drawingActivityInterval.current);
    }
    drawingActivityInterval.current = setInterval(() => {
      if (isActivelyDrawing) { // Check if still drawing, might have stopped between interval fires
        addScore(1); // Passive points for drawing
      }
    }, 5000); // Add 1 point every 5 seconds of drawing
  }, [addScore, isActivelyDrawing]);
  
  // Cleanup interval on unmount or when drawing stops
  useEffect(() => {
    return () => {
      if (drawingActivityInterval.current) {
        clearInterval(drawingActivityInterval.current);
      }
    };
  }, []);
  
  // Stop interval if drawing stops
  useEffect(() => {
    if (!isActivelyDrawing && drawingActivityInterval.current) {
        clearInterval(drawingActivityInterval.current);
        drawingActivityInterval.current = null;
    }
  }, [isActivelyDrawing]);


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
            
            <div ref={drawingCanvasWrapperRef} className="flex-grow flex items-center justify-center bg-muted/30 p-2 rounded-2xl border-2 border-dashed border-border">
              <DrawingCanvas
                // Pass a key to re-mount and thus clear canvas if needed, or implement ref clear
                // key={clearTrigger} // clearTrigger would be a state variable you increment
                width={canvasWidth}
                height={canvasHeight}
                selectedColor={selectedColor}
                brushSize={brushSize}
                onDraw={handleDraw}
                className="touch-none" // Ensure touch actions are handled by canvas
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
