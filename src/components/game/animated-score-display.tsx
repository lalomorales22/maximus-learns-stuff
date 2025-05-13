
"use client";

import React, { useEffect, useState } from 'react';
import { useScore } from '@/contexts/ScoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, CircleDollarSign, TrendingUp, Zap } from 'lucide-react'; // Zap for XP/progress, ShieldCheck for Tier, CircleDollarSign for V-Bucks
import { cn } from '@/lib/utils';
import { LEVEL_NAME_SINGULAR, CURRENCY_NAME } from '@/lib/constants';


export function AnimatedScoreDisplay() {
  const { totalVBucks, tier, vBucksInTier, vBucksForNextTier, currencyName, levelName } = useScore();
  const [displayedVBucks, setDisplayedVBucks] = useState(totalVBucks);
  const [displayedTier, setDisplayedTier] = useState(tier);

  useEffect(() => {
    const vbucksTimer = setTimeout(() => setDisplayedVBucks(totalVBucks), 100);
    const tierTimer = setTimeout(() => setDisplayedTier(tier), 100);

    return () => {
      clearTimeout(vbucksTimer);
      clearTimeout(tierTimer);
    };
  }, [totalVBucks, tier]);


  const vbucksPercentage = (vBucksInTier / vBucksForNextTier) * 100;

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-2xl border-4 border-primary/70 bg-gradient-to-br from-card to-muted/60">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-lg">
          Your Loot!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-around text-center">
          {/* Tier Display */}
          <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-xl shadow-lg border-2 border-secondary transform hover:scale-105 transition-transform">
            <ShieldCheck className="h-14 w-14 text-secondary mb-1 animate-pulse" />
            <p className="text-md font-bold text-secondary-foreground uppercase tracking-wider">{levelName}</p>
            <p className={cn(
                "text-6xl font-extrabold text-secondary transition-all duration-300",
                tier > displayedTier ? "animate-ping-once" : "" // animate-ping-once needs to be defined in tailwind.config.js if not standard
              )}>
              {displayedTier}
            </p>
          </div>

          {/* Total V-Bucks Display */}
          <div className="flex flex-col items-center p-4 bg-primary/20 rounded-xl shadow-lg border-2 border-primary transform hover:scale-105 transition-transform">
            <CircleDollarSign className="h-14 w-14 text-primary mb-1" style={{ animation: 'spin 3s linear infinite' }} />
            <p className="text-md font-bold text-primary-foreground uppercase tracking-wider">{currencyName}</p>
            <p className={cn(
                "text-6xl font-extrabold text-primary transition-all duration-300",
                 totalVBucks > displayedVBucks ? "scale-110" : "scale-100" 
              )}>
              {displayedVBucks}
            </p>
          </div>
        </div>
        
        {/* V-Bucks Tier Progress */}
        <div className="space-y-2 pt-3">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xl font-semibold text-accent flex items-center">
              <Zap className="h-7 w-7 mr-2 text-accent" /> 
              {levelName} Progress
            </p>
            <p className="text-lg font-bold text-accent">
              {vBucksInTier} / {vBucksForNextTier}
            </p>
          </div>
          <Progress value={vbucksPercentage} className="h-7 rounded-lg border-2 border-accent/60 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-yellow-400 shadow-inner" />
          {vBucksInTier >= vBucksForNextTier * 0.9 && (
             <p className="text-center text-sm text-green-400 font-semibold animate-pulse pt-1">Almost to the next {levelName.toLowerCase()}!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
