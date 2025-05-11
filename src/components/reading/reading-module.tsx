
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
    setCurrentPassage(generateReadingPassage(level));
    setPassagesRead(prev => prev + 1);
    
    if (timerId) clearInterval(timerId);
    setComprehensionTime(0); // Reset timer
    const newTimerId = setInterval(() => {
      setComprehensionTime(prevTime => (prevTime !== null ? prevTime + 1 : 0));
    }, 1000);
    setTimerId(newTimerId);

  }, [timerId]);

  useEffect(() => {
    loadNewPassage(difficulty);
    return () => {
      if (timerId) clearInterval(timerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]); // Only run when difficulty changes initially


  const handleNextPassage = async () => {
    setIsLoading(true);
    if (timerId) clearInterval(timerId);

    // Simulate performance for AI. 
    // For a real app, this would involve comprehension questions.
    // Here, faster reading implies better comprehension for demo.
    const maxTime = 30; // Max seconds for good score
    const timeTaken = comprehensionTime || maxTime;
    const simulatedScore = Math.max(0, Math.min(100, (1 - (timeTaken / (maxTime * (difficulty * 0.5 + 1)))) * 100));
    const simulatedCorrectAnswers = Math.round(simulatedScore / 20); // e.g. 0-5
    const simulatedTotalQuestions = 5;

    setScore(prev => prev + Math.round(simulatedScore / 10)); // Add to score

    try {
      const aiResponse = await adjustReadingDifficultyAI({
        level: difficulty,
        score: simulatedScore,
        correctAnswers: simulatedCorrectAnswers,
        totalQuestions: simulatedTotalQuestions,
      });
      
      setDifficulty(aiResponse.newLevel);
      toast({
        title: "Great Reading!",
        description: `New reading level: ${aiResponse.newLevel}. ${aiResponse.reason}`,
      });

      // Load new passage - will be triggered by useEffect if difficulty changed.
      // If difficulty is same, manually load new passage.
      if (aiResponse.newLevel === difficulty) {
        loadNewPassage(aiResponse.newLevel);
      }

    } catch (error) {
      console.error("AI difficulty adjustment error:", error);
      toast({
        title: "Error",
        description: "Could not adjust reading level. Using current level for next passage.",
        variant: "destructive",
      });
      loadNewPassage(difficulty);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // This effect ensures that if difficulty changes, loadNewPassage is called.
    // It's separated from the initial load to avoid issues with timer clearing.
    // We only want this to run *after* the initial load, hence passagesRead > 0 check was problematic.
    // The key is to only re-run loadNewPassage if difficulty *actually changes* after the first load.
    const isInitialLoad = passagesRead <= 1; // Or similar logic if passagesRead starts at 0 or 1
    if (!isInitialLoad) {
        loadNewPassage(difficulty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]); // Rerun when difficulty changes. loadNewPassage is memoized.


  if (!currentPassage && !isLoading) {
    return <div className="text-center p-8">Loading reading realm... <Zap className="inline-block animate-ping" /></div>;
  }

  const progressValue = comprehensionTime !== null ? (comprehensionTime / 30) * 100 : 0;


  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-primary">Reading Realm</h1>
      <ScoreDisplay score={score} title="Reading Score"/>

      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2"><BookOpen /> Read Aloud</CardTitle>
          <CardDescription className="text-center">Current Reading Level: {difficulty}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[200px]">
          {isLoading && passagesRead > 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">Fetching new passage...</p>
            </div>
          ) : (
            <p className="text-xl md:text-2xl leading-relaxed text-foreground whitespace-pre-line py-4 px-2 bg-background rounded-md border border-border">
              {currentPassage}
            </p>
          )}
          {comprehensionTime !== null && !isLoading && (
            <div className="mt-4">
              <Label htmlFor="reading-time" className="text-sm text-muted-foreground">Reading time...</Label>
              <Progress id="reading-time" value={progressValue} className="w-full h-2 mt-1" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleNextPassage} className="w-full h-12 text-lg" disabled={isLoading} size="lg">
            {isLoading ? 'Loading...' : 'Next Passage'} <RefreshCw className={`ml-2 ${isLoading ? 'animate-spin' : ''}`}/>
          </Button>
        </CardFooter>
      </Card>
       <p className="text-sm text-muted-foreground mt-4">Passages read this session: {passagesRead > 0 ? passagesRead-1 : 0}</p>
    </div>
  );
}

