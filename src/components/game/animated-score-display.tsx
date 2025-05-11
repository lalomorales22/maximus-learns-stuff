
"use client";

import React, { useEffect, useState } from 'react';
import { useScore } from '@/contexts/ScoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnimatedScoreDisplay() {
  const { totalScore, level, xpInLevel, xpForNextLevel } = useScore();
  const [displayedScore, setDisplayedScore] = useState(totalScore);
  const [displayedLevel, setDisplayedLevel] = useState(level);

  useEffect(() => {
    // Basic "animation" by updating state. For smoother count-up, more complex logic would be needed.
    // This ensures the numbers visually update.
    const scoreTimer = setTimeout(() => setDisplayedScore(totalScore), 100); // Slight delay for visual effect
    const levelTimer = setTimeout(() => setDisplayedLevel(level), 100);

    return () => {
      clearTimeout(scoreTimer);
      clearTimeout(levelTimer);
    };
  }, [totalScore, level]);


  const xpPercentage = (xpInLevel / xpForNextLevel) * 100;

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-2xl border-4 border-primary/50 bg-gradient-to-br from-background to-muted/50">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-3xl font-black text-center text-primary drop-shadow-md">
          Your Progress!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-around text-center">
          {/* Level Display */}
          <div className="flex flex-col items-center p-3 bg-secondary/20 rounded-xl shadow-md border-2 border-secondary">
            <Award className="h-12 w-12 text-secondary mb-1 animate-bounce" />
            <p className="text-sm font-semibold text-secondary-foreground">LEVEL</p>
            <p className={cn(
                "text-5xl font-extrabold text-secondary transition-all duration-300",
                level > displayedLevel ? "animate-ping" : ""
              )}>
              {displayedLevel}
            </p>
          </div>

          {/* Total Score Display */}
          <div className="flex flex-col items-center p-3 bg-primary/20 rounded-xl shadow-md border-2 border-primary">
            <Star className="h-12 w-12 text-primary mb-1" style={{ animation: 'spin 2s linear infinite' }} />
            <p className="text-sm font-semibold text-primary-foreground">SCORE</p>
            <p className={cn(
                "text-5xl font-extrabold text-primary transition-all duration-300",
                 totalScore > displayedScore ? "scale-110" : "scale-100" // Simple animation hint
              )}>
              {displayedScore}
            </p>
          </div>
        </div>
        
        {/* XP Progress */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center mb-1">
            <p className="text-lg font-semibold text-accent flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-accent" />
              XP Progress
            </p>
            <p className="text-md font-bold text-accent">
              {xpInLevel} / {xpForNextLevel}
            </p>
          </div>
          <Progress value={xpPercentage} className="h-6 rounded-lg border-2 border-accent/50 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-yellow-400" />
          {xpInLevel >= xpForNextLevel * 0.9 && (
             <p className="text-center text-sm text-green-500 font-semibold animate-pulse pt-1">Almost there!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
