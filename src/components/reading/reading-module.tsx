
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { generateReadingPassage } from '@/lib/game-utils';
import { adjustReadingDifficulty as adjustReadingDifficultyAI } from '@/ai/flows/adaptive-reading';
import { BookOpen, Zap, RefreshCw, BookMarked } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { Label } from "@/components/ui/label";
import { useScore } from '@/contexts/ScoreContext';
import { CURRENCY_NAME } from '@/lib/constants';

export function ReadingModule() {
  const [currentPassage, setCurrentPassage] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passagesRead, setPassagesRead] = useState(0);
  const [comprehensionTime, setComprehensionTime] = useState<number | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const { addVBucks } = useScore(); // Changed from addScore

  const loadNewPassage = useCallback((level: number) => {
    setIsLoading(true); 
    setCurrentPassage(generateReadingPassage(level));
    setPassagesRead(prev => prev + 1);
    
    if (timerId) clearInterval(timerId);
    setComprehensionTime(0); 
    const newTimerId = setInterval(() => {
      setComprehensionTime(prevTime => (prevTime !== null ? prevTime + 1 : 0));
    }, 1000);
    setTimerId(newTimerId);
    setIsLoading(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerId]); 

  useEffect(() => {
    loadNewPassage(difficulty);
    return () => {
      if (timerId) clearInterval(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

   useEffect(() => {
    if (passagesRead > 0) { 
        loadNewPassage(difficulty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);


  const handleNextPassage = async () => {
    setIsLoading(true);
    if (timerId) clearInterval(timerId);

    const maxTime = 60; 
    const timeTaken = comprehensionTime || maxTime;
    const simulatedScore = Math.max(0, Math.min(100, (1 - (timeTaken / (maxTime * (difficulty * 0.3 + 1)))) * 120));
    const simulatedCorrectAnswers = Math.round(simulatedScore / 20); 
    const simulatedTotalQuestions = 5;

    const vBucksEarned = Math.max(5,Math.round(simulatedScore / 10)); // Min 5 V-Bucks
    addVBucks(vBucksEarned); // Changed from addScore
    toast({
        title: "Quest Complete!",
        description: `You earned ${vBucksEarned} ${CURRENCY_NAME}!`,
        className: "bg-correct border-correct text-correct-foreground"
    });

    try {
      const aiResponse = await adjustReadingDifficultyAI({
        level: difficulty,
        score: Math.min(100, simulatedScore), 
        correctAnswers: simulatedCorrectAnswers,
        totalQuestions: simulatedTotalQuestions,
      });
      
      if (aiResponse.newLevel !== difficulty) {
        setDifficulty(aiResponse.newLevel);
        toast({
            title: "New Chapter!",
            description: `New Reading Level: ${aiResponse.newLevel}! ${aiResponse.reason}`,
            className: "bg-secondary text-secondary-foreground border-secondary" 
        });
      } else {
        loadNewPassage(difficulty);
      }

    } catch (error) {
      console.error("AI difficulty adjustment error:", error);
      toast({
        title: "Lost Signal!",
        description: "A little hiccup! We'll get a new story at this level.",
        variant: "destructive",
      });
      loadNewPassage(difficulty);
    } 
  };
  

  if (!currentPassage && isLoading) { 
    return <div className="text-center p-8 text-3xl font-bold text-secondary">Loading new lore... <Zap className="inline-block animate-ping h-10 w-10" /></div>;
  }
   if (!currentPassage && !isLoading && passagesRead === 0) { 
    return <div className="text-center p-8 text-3xl font-bold text-secondary">Preparing Reading Quest... <Zap className="inline-block animate-ping h-10 w-10" /></div>;
  }

  const progressValue = comprehensionTime !== null ? (comprehensionTime / (30 + difficulty * 5)) * 100 : 0; 

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-8xl md:text-9xl font-black my-8 tracking-tighter text-secondary drop-shadow-[0_6px_8px_rgba(var(--secondary-rgb),0.4)] animate-pulse">READ</h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl border-4 border-secondary/50">
        <CardHeader>
          <CardTitle className="text-4xl text-center flex items-center justify-center gap-3 font-extrabold">
            <BookMarked className="h-12 w-12 text-secondary"/> Read the Lore!
            </CardTitle>
          <CardDescription className="text-center text-xl font-semibold text-muted-foreground">Current Reading Level: {difficulty}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[250px]">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-14 w-14 animate-spin mx-auto text-secondary" />
              <p className="mt-4 text-muted-foreground text-2xl">Fetching new intel...</p>
            </div>
          ) : (
            <p className="text-3xl md:text-4xl leading-relaxed md:leading-loose text-foreground whitespace-pre-line py-8 px-6 bg-card rounded-xl border-2 border-border shadow-inner">
              {currentPassage}
            </p>
          )}
          {comprehensionTime !== null && !isLoading && (
            <div className="mt-6">
              <Label htmlFor="reading-time" className="text-lg text-muted-foreground font-semibold">Comprehension Timer...</Label>
              <Progress id="reading-time" value={progressValue} className="w-full h-4 mt-2 rounded-lg border border-muted shadow-sm" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextPassage} className="w-full" disabled={isLoading} size="xl" variant="secondary">
            {isLoading ? 'Loading...' : 'Next Chapter'} <RefreshCw className={`ml-3 h-7 w-7 ${isLoading ? 'animate-spin' : ''}`}/>
          </Button>
        </CardFooter>
      </Card>
       <p className="text-lg text-muted-foreground mt-6 font-medium">Quests completed this session: {passagesRead > 0 ? passagesRead : 0}</p>
    </div>
  );
}
