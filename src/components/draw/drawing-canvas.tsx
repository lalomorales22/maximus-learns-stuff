
// src/components/draw/drawing-canvas.tsx
"use client";

import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface DrawingCanvasHandle {
  clear: () => void;
  toDataURL: (type?: string, quality?: any) => string;
}

interface DrawingCanvasProps {
  width: number;
  height: number;
  selectedColor: string;
  brushSize: number;
  onDraw: () => void; // Callback when drawing occurs
  onDrawStart?: () => void; // Callback when drawing starts
  onDrawEnd?: () => void; // Callback when drawing ends
  className?: string;
}

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(({
  width,
  height,
  selectedColor,
  brushSize,
  onDraw,
  onDrawStart,
  onDrawEnd,
  className,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const clearCanvas = useCallback(() => {
    if (context) {
      context.fillStyle = 'white'; // Ensure background is white for saved images
      context.fillRect(0, 0, width, height);
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, [context, width, height]);

  const toDataURL = useCallback((type?: string, quality?: any): string => {
    if (canvasRef.current) {
      return canvasRef.current.toDataURL(type, quality);
    }
    return ''; // Should not happen if canvas is rendered
  }, []);


  useImperativeHandle(ref, () => ({
    clear: clearCanvas,
    toDataURL: toDataURL,
  }));

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
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
      if (event.touches.length === 0) return null;
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
    onDrawStart?.();
  }, [context, onDrawStart]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    if (event.cancelable && 'touches' in event) {
        event.preventDefault();
    }
    const coords = getCoordinates(event);
    if (!coords) return;
    context.lineTo(coords.x, coords.y);
    context.stroke();
    onDraw(); 
  }, [isDrawing, context, onDraw]);

  const stopDrawing = useCallback(() => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
    onDrawEnd?.();
  }, [context, onDrawEnd]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={(e) => {
        if (e.cancelable) e.preventDefault(); 
        startDrawing(e);
      }}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className={cn("border-4 border-primary rounded-2xl shadow-lg bg-white cursor-crosshair", className)}
      style={{ touchAction: 'none' }} 
    />
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';
