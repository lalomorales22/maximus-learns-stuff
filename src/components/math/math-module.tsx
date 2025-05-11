"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDisplay } from '@/components/game/score-display';
import { generateMathProblem, type MathProblem } from '@/lib/game-utils';
import { adjustDifficulty as adjustMathDifficultyAI } from '@/ai/flows/adaptive-difficulty';
import { CheckCircle2, XCircle, Zap, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function MathModule() {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);

  const { toast } = useToast();

  const loadNewProblem = useCallback((level: number) => {
    setCurrentProblem(generateMathProblem(level));
    setUserAnswer('');
    setFeedback(null);
  }, []);

  useEffect(() => {
    loadNewProblem(difficulty);
  }, [difficulty, loadNewProblem]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem || userAnswer.trim() === '') return;

    setIsLoading(true);
    const answerNum = parseInt(userAnswer, 10);
    let newCorrectStreak = correctStreak;
    let newIncorrectStreak = incorrectStreak;

    if (answerNum === currentProblem.answer) {
      setScore((prev) => prev + 10);
      setFeedback({ message: 'Correct! Great job!', type: 'correct' });
      newCorrectStreak++;
      newIncorrectStreak = 0;
      toast({
        title: "Awesome!",
        description: "That's the right answer!",
        variant: "default", 
        className: "bg-correct border-correct text-correct-foreground",
      });
    } else {
      setFeedback({ message: `Not quite! The answer was ${currentProblem.answer}.`, type: 'incorrect' });
      newIncorrectStreak++;
      newCorrectStreak = 0;
      toast({
        title: "Oops!",
        description: `Keep trying! The correct answer was ${currentProblem.answer}.`,
        variant: "destructive",
      });
    }
    setCorrectStreak(newCorrectStreak);
    setIncorrectStreak(newIncorrectStreak);

    try {
      const aiResponse = await adjustMathDifficultyAI({
        currentDifficulty: difficulty,
        correctAnswers: newCorrectStreak,
        incorrectAnswers: newIncorrectStreak,
      });
      
      setDifficulty(aiResponse.newDifficulty);
      // AI gives reasoning, could display it if desired
      // setFeedback(prev => ({ ...prev, message: `${prev?.message}\nAI: ${aiResponse.reasoning}`}));
      
      // Load new problem with potentially new difficulty
      // If difficulty hasn't changed, loadNewProblem will use the same difficulty
      // If it changed, useEffect for difficulty will trigger loadNewProblem
      if (aiResponse.newDifficulty === difficulty) {
        loadNewProblem(aiResponse.newDifficulty);
      }
      // If difficulty changed, the useEffect watching 'difficulty' will call loadNewProblem.
      
    } catch (error) {
      console.error("AI difficulty adjustment error:", error);
      toast({
        title: "Error",
        description: "Could not adjust difficulty. Using current level.",
        variant: "destructive",
      });
      loadNewProblem(difficulty); // Load new problem with current difficulty on error
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentProblem) {
    return <div className="text-center p-8">Loading math adventure... <Zap className="inline-block animate-ping" /></div>;
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-primary">Math Adventures</h1>
      <ScoreDisplay score={score} />

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Solve This!</CardTitle>
          <CardDescription className="text-center">Current Difficulty: Level {difficulty}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-center py-8 text-foreground">{currentProblem.text.replace('?', '').trim()}</p>
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer"
              className="text-2xl h-14 text-center"
              disabled={isLoading}
              aria-label="Math problem answer"
            />
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading} size="lg">
              {isLoading ? 'Checking...' : 'Submit Answer'} <Send className="ml-2"/>
            </Button>
          </form>
        </CardContent>
        {feedback && (
          <CardFooter className="mt-4">
            <div
              className={`w-full p-3 rounded-md text-center font-medium flex items-center justify-center gap-2
                ${feedback.type === 'correct' ? 'bg-correct text-correct-foreground' : ''}
                ${feedback.type === 'incorrect' ? 'bg-incorrect text-incorrect-foreground' : ''}
                ${feedback.type === 'info' ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              {feedback.type === 'correct' && <CheckCircle2 className="h-5 w-5" />}
              {feedback.type === 'incorrect' && <XCircle className="h-5 w-5" />}
              {feedback.message}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
