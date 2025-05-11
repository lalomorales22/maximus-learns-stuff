// src/components/draw/drawing-canvas.tsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  width: number;
  height: number;
  selectedColor: string;
  brushSize: number;
  onDraw: () => void; // Callback when drawing occurs
  className?: string;
}

export function DrawingCanvas({
  width,
  height,
  selectedColor,
  brushSize,
  onDraw,
  className,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Initialize canvas with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        setContext(ctx);
      }
    }
  }, [width, height]);

  useEffect(() => {
    if (context) {
      context.strokeStyle = selectedColor;
      context.lineWidth = brushSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }, [selectedColor, brushSize, context]);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(event);
    if (!context || !coords) return;
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  }, [context]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const coords = getCoordinates(event);
    if (!coords) return;
    context.lineTo(coords.x, coords.y);
    context.stroke();
    onDraw(); // Notify parent that drawing is happening
  }, [isDrawing, context, onDraw]);

  const stopDrawing = useCallback(() => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  }, [context]);

  // Clear canvas function, exposed via ref if needed or called internally
  const clearCanvas = () => {
    if (context) {
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
    }
  };
  
  // Expose clearCanvas via ref if DrawingCanvas is used in DrawModule like:
  // const canvasApiRef = useRef<{ clear: () => void }>(null);
  // <DrawingCanvas ref={canvasApiRef} ... />
  // Then parent can call canvasApiRef.current?.clear();
  // For now, we'll make it callable via prop in DrawModule directly for simplicity

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing} // Stop drawing if mouse leaves canvas
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className={cn("border-4 border-primary rounded-2xl shadow-lg bg-white cursor-crosshair touch-none", className)}
      style={{ touchAction: 'none' }} // Prevents page scroll on touch devices
    />
  );
}

// Helper for DrawModule to use clearCanvas if needed
export interface DrawingCanvasHandle {
  clear: () => void;
}
