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
      setScore((prev) => prev + 10 * difficulty); // Score scales with difficulty
      setFeedback({ message: 'Correct! Fantastic!', type: 'correct' });
      newCorrectStreak++;
      newIncorrectStreak = 0;
      toast({
        title: "Yahoo!",
        description: "That's the right answer! You're a math whiz!",
        variant: "default", 
        className: "bg-correct border-correct text-correct-foreground",
      });
    } else {
      setFeedback({ message: `Not quite! The answer was ${currentProblem.answer}. Keep going!`, type: 'incorrect' });
      newIncorrectStreak++;
      newCorrectStreak = 0;
      toast({
        title: "Oopsie!",
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
            title: "Level Update!",
            description: `Difficulty changed to ${aiResponse.newDifficulty}. ${aiResponse.reasoning}`,
            className: "bg-blue-500 text-white border-blue-600" // Using a specific color for level updates
        });
      } else {
        loadNewProblem(difficulty); // Explicitly load new problem if difficulty is unchanged
      }
      
    } catch (error) {
      console.error("AI difficulty adjustment error:", error);
      toast({
        title: "Uh Oh!",
        description: "A little glitch! We'll stick to this level for now.",
        variant: "destructive",
      });
      loadNewProblem(difficulty); 
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentProblem) {
    return <div className="text-center p-8 text-2xl font-semibold text-primary">Loading math adventure... <Zap className="inline-block animate-ping h-8 w-8" /></div>;
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-7xl md:text-9xl font-black my-6 tracking-tighter text-primary drop-shadow-lg animate-bounce">MATH</h1>
      <ScoreDisplay score={score} title="Math Score"/>

      <Card className="w-full max-w-lg shadow-xl rounded-2xl"> {/* Increased max-width and roundness */}
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold">Solve This!</CardTitle> {/* Larger title */}
          <CardDescription className="text-center text-lg">Current Difficulty: Level {difficulty}</CardDescription> {/* Larger description */}
        </CardHeader>
        <CardContent>
          <p className="text-7xl font-bold text-center py-10 text-foreground">{currentProblem.text.replace('?', '').trim()}</p> {/* Increased size and padding */}
          <form onSubmit={handleAnswerSubmit} className="space-y-6"> {/* Increased spacing */}
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer"
              className="text-3xl h-16 text-center rounded-xl" // Larger input
              disabled={isLoading}
              aria-label="Math problem answer"
            />
            <Button type="submit" className="w-full" disabled={isLoading} size="xl"> {/* Using new XL size */}
              {isLoading ? 'Checking...' : 'Submit Answer'} <Send className="ml-2 h-7 w-7"/> {/* Larger icon */}
            </Button>
          </form>
        </CardContent>
        {feedback && (
          <CardFooter className="mt-6"> {/* Increased margin */}
            <div
              className={`w-full p-4 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2
                ${feedback.type === 'correct' ? 'bg-correct text-correct-foreground' : ''}
                ${feedback.type === 'incorrect' ? 'bg-incorrect text-incorrect-foreground' : ''}
                ${feedback.type === 'info' ? 'bg-blue-500 text-white' : ''}`} // Using themed info color
            >
              {feedback.type === 'correct' && <CheckCircle2 className="h-7 w-7" />} {/* Larger icon */}
              {feedback.type === 'incorrect' && <XCircle className="h-7 w-7" />} {/* Larger icon */}
              {feedback.message}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
