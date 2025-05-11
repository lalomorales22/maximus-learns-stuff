
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDisplay } from '@/components/game/score-display';
import { generateReadingPassage } from '@/lib/game-utils';
import { adjustReadingDifficulty as adjustReadingDifficultyAI } from '@/ai/flows/adaptive-reading';
import { BookOpen, Zap, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { Label } from "@/components/ui/label";

export function ReadingModule() {
  const [currentPassage, setCurrentPassage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passagesRead, setPassagesRead] = useState(0);
  const [comprehensionTime, setComprehensionTime] = useState<number | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const loadNewPassage = useCallback((level: number) => {
    setIsLoading(true); // Set loading true when starting to load
    setCurrentPassage(generateReadingPassage(level));
    setPassagesRead(prev => prev + 1);
    
    if (timerId) clearInterval(timerId);
    setComprehensionTime(0); 
    const newTimerId = setInterval(() => {
      setComprehensionTime(prevTime => (prevTime !== null ? prevTime + 1 : 0));
    }, 1000);
    setTimerId(newTimerId);
    setIsLoading(false); // Set loading false after passage is set

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerId]); // timerId is a dependency for cleanup

  useEffect(() => {
    // Initial load
    loadNewPassage(difficulty);
    return () => {
      if (timerId) clearInterval(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount for initial load triggered by difficulty default.

   useEffect(() => {
    // Subsequent loads when difficulty changes
    if (passagesRead > 0) { // Ensure it's not the initial load
        loadNewPassage(difficulty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);


  const handleNextPassage = async () => {
    setIsLoading(true);
    if (timerId) clearInterval(timerId);

    const maxTime = 60; // Max seconds for good score (increased for child-friendliness)
    const timeTaken = comprehensionTime || maxTime;
    // Adjusted scoring to be more generous
    const simulatedScore = Math.max(0, Math.min(100, (1 - (timeTaken / (maxTime * (difficulty * 0.3 + 1)))) * 120));
    const simulatedCorrectAnswers = Math.round(simulatedScore / 20); 
    const simulatedTotalQuestions = 5;

    setScore(prev => prev + Math.max(5,Math.round(simulatedScore / 10))); // Min 5 points

    try {
      const aiResponse = await adjustReadingDifficultyAI({
        level: difficulty,
        score: Math.min(100, simulatedScore), // Cap score at 100 for AI
        correctAnswers: simulatedCorrectAnswers,
        totalQuestions: simulatedTotalQuestions,
      });
      
      if (aiResponse.newLevel !== difficulty) {
        setDifficulty(aiResponse.newLevel);
        toast({
            title: "Way to go!",
            description: `New reading level: ${aiResponse.newLevel}! ${aiResponse.reason}`,
            className: "bg-secondary text-secondary-foreground border-secondary-darker" 
        });
      } else {
         // If difficulty is same, manually load new passage.
        loadNewPassage(difficulty);
      }

    } catch (error) {
      console.error("AI difficulty adjustment error:", error);
      toast({
        title: "Oops!",
        description: "A little hiccup! We'll get a new story at this level.",
        variant: "destructive",
      });
      loadNewPassage(difficulty);
    } 
    // setIsLoading(false) is handled by loadNewPassage if difficulty doesn't change, or by useEffect if it does.
  };
  

  if (!currentPassage && isLoading) { // Show loading state when actively loading
    return <div className="text-center p-8 text-2xl font-semibold text-secondary">Fetching a new story... <Zap className="inline-block animate-ping h-8 w-8" /></div>;
  }
   if (!currentPassage && !isLoading && passagesRead === 0) { // Initial loading before first passage
    return <div className="text-center p-8 text-2xl font-semibold text-secondary">Getting ready to read... <Zap className="inline-block animate-ping h-8 w-8" /></div>;
  }


  const progressValue = comprehensionTime !== null ? (comprehensionTime / (30 + difficulty * 5)) * 100 : 0; // Timer bar fills slower at higher diff


  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-7xl md:text-9xl font-black my-6 tracking-tighter text-secondary drop-shadow-lg animate-pulse">READ</h1>
      <ScoreDisplay score={score} title="Reading Score"/>

      <Card className="w-full max-w-3xl shadow-xl rounded-2xl"> {/* Increased max-width and roundness */}
        <CardHeader>
          <CardTitle className="text-3xl text-center flex items-center justify-center gap-3 font-bold"><BookOpen className="h-10 w-10"/> Read Aloud!</CardTitle> {/* Larger title and icon */}
          <CardDescription className="text-center text-lg">Current Reading Level: {difficulty}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[250px]"> {/* Increased min-height */}
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin mx-auto text-secondary" />
              <p className="mt-4 text-muted-foreground text-xl">Loading new story...</p>
            </div>
          ) : (
            <p className="text-2xl md:text-3xl leading-relaxed md:leading-loose text-foreground whitespace-pre-line py-6 px-4 bg-background rounded-xl border-2 border-border shadow-inner"> {/* Larger text, more padding, new style */}
              {currentPassage}
            </p>
          )}
          {comprehensionTime !== null && !isLoading && (
            <div className="mt-6">
              <Label htmlFor="reading-time" className="text-md text-muted-foreground font-semibold">Reading time progress...</Label>
              <Progress id="reading-time" value={progressValue} className="w-full h-3 mt-2 rounded-lg" /> {/* Larger progress bar */}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextPassage} className="w-full" disabled={isLoading} size="xl" variant="secondary"> {/* Using new XL size and secondary variant */}
            {isLoading ? 'Loading...' : 'Next Story'} <RefreshCw className={`ml-3 h-7 w-7 ${isLoading ? 'animate-spin' : ''}`}/> {/* Larger icon */}
          </Button>
        </CardFooter>
      </Card>
       <p className="text-md text-muted-foreground mt-6 font-medium">Stories read this session: {passagesRead > 0 ? passagesRead : 0}</p>
    </div>
  );
}
