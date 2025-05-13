
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { generateMathProblem, type MathProblem } from '@/lib/game-utils';
import { adjustDifficulty as adjustMathDifficultyAI } from '@/ai/flows/adaptive-difficulty';
import { CheckCircle2, XCircle, Zap, Send, Target } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useScore } from '@/contexts/ScoreContext';
import { CURRENCY_NAME } from '@/lib/constants';

export function MathModule() {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0);

  const { toast } = useToast();
  const { addVBucks } = useScore(); // Changed from addScore

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
    const vBucksEarned = 10 * difficulty; // Base V-Bucks

    if (answerNum === currentProblem.answer) {
      addVBucks(vBucksEarned); // Changed from addScore
      setFeedback({ message: `Correct! +${vBucksEarned} ${CURRENCY_NAME}!`, type: 'correct' });
      newCorrectStreak++;
      newIncorrectStreak = 0;
      toast({
        title: "Victory Royale!",
        description: `That's the right answer! You earned ${vBucksEarned} ${CURRENCY_NAME}!`,
        variant: "default", 
        className: "bg-correct border-correct text-correct-foreground",
      });
    } else {
      setFeedback({ message: `Not quite! The answer was ${currentProblem.answer}. Keep going!`, type: 'incorrect' });
      newIncorrectStreak++;
      newCorrectStreak = 0;
      toast({
        title: "So Close!",
        description: `Keep trying! The correct answer was ${currentProblem.answer}. You'll get it next time!`,
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
      
      if (aiResponse.newDifficulty !== difficulty) {
        setDifficulty(aiResponse.newDifficulty);
         toast({
            title: "Difficulty Shift!",
            description: `Threat Level changed to ${aiResponse.newDifficulty}. ${aiResponse.reasoning}`,
            className: "bg-accent text-accent-foreground border-accent" // Using accent for neutral/info
        });
      } else {
        loadNewProblem(difficulty); 
      }
      
    } catch (error) {
      console.error("AI difficulty adjustment error:", error);
      toast({
        title: "Storm Interference!",
        description: "A little glitch! We'll stick to this Threat Level for now.",
        variant: "destructive",
      });
      loadNewProblem(difficulty); 
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentProblem) {
    return <div className="text-center p-8 text-3xl font-bold text-primary">Loading Math Mission... <Zap className="inline-block animate-ping h-10 w-10" /></div>;
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-8xl md:text-9xl font-black my-8 tracking-tighter text-primary drop-shadow-[0_6px_8px_rgba(var(--primary-rgb),0.4)] animate-bounce">MATH</h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-lg shadow-2xl rounded-2xl border-4 border-primary/50">
        <CardHeader>
          <CardTitle className="text-4xl text-center font-extrabold flex items-center justify-center gap-2">
            <Target className="h-10 w-10 text-primary"/> Solve the Equation!
          </CardTitle>
          <CardDescription className="text-center text-xl font-semibold text-muted-foreground">Threat Level: {difficulty}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-8xl font-bold text-center py-12 text-foreground">{currentProblem.text.replace('?', '').trim()}</p>
          <form onSubmit={handleAnswerSubmit} className="space-y-6">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your Answer"
              className="text-4xl h-20 text-center rounded-xl border-2 border-input focus:border-primary shadow-inner"
              disabled={isLoading}
              aria-label="Math problem answer"
            />
            <Button type="submit" className="w-full" disabled={isLoading} size="xl">
              {isLoading ? 'Checking...' : 'Lock In Answer'} <Send className="ml-2 h-7 w-7"/>
            </Button>
          </form>
        </CardContent>
        {feedback && (
          <CardFooter className="mt-6">
            <div
              className={`w-full p-5 rounded-lg text-center text-xl font-semibold flex items-center justify-center gap-3 shadow-md
                ${feedback.type === 'correct' ? 'bg-correct text-correct-foreground border-2 border-green-600' : ''}
                ${feedback.type === 'incorrect' ? 'bg-incorrect text-incorrect-foreground border-2 border-red-700' : ''}
                ${feedback.type === 'info' ? 'bg-accent text-accent-foreground border-2 border-purple-600' : ''}`}
            >
              {feedback.type === 'correct' && <CheckCircle2 className="h-8 w-8" />}
              {feedback.type === 'incorrect' && <XCircle className="h-8 w-8" />}
              {feedback.message}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
