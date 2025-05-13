
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { useScore } from '@/contexts/ScoreContext';
import { useToast } from '@/hooks/use-toast';
import { CURRENCY_NAME, MODULE_DATA } from '@/lib/constants';
import { generateKindnessScenario, type KindnessScenarioOutput } from '@/ai/flows/being-nice-scenario';
import { Heart, Lightbulb, MessageSquareHeart, ThumbsUp, ThumbsDown, Zap, CheckCircle2, XCircle } from 'lucide-react';

export function BeingNiceModule() {
  const { addVBucks } = useScore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [scenario, setScenario] = useState<KindnessScenarioOutput | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
  
  const BEING_NICE_MODULE_COLOR = MODULE_DATA.beingNice.themeColor.replace('bg-', 'text-'); // e.g. text-yellow-500

  const fetchNewScenario = useCallback(async () => {
    setIsLoading(true);
    setSelectedChoice(null);
    setFeedback(null);
    try {
      // Input for the flow can be extended if difficulty or themes are added
      const newScenario = await generateKindnessScenario({}); 
      setScenario(newScenario);
    } catch (error) {
      console.error("Error fetching kindness scenario:", error);
      toast({
        title: "Oops! Scenario Error",
        description: "Couldn't load a new scenario. Please try again later.",
        variant: "destructive",
      });
      setScenario(null); // Clear scenario on error
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNewScenario();
  }, [fetchNewScenario]);

  const handleChoice = (choice: 'A' | 'B') => {
    if (!scenario) return;
    setSelectedChoice(choice);
    const isCorrect = choice === scenario.correctChoice;
    const vBucksEarned = isCorrect ? 25 : 5; // More for correct, some for trying
    addVBucks(vBucksEarned);

    if (isCorrect) {
      setFeedback({ message: `Great choice! That was very kind. ${scenario.explanation}`, type: 'correct' });
      toast({
        title: "Kindness Champion!",
        description: `You chose wisely! +${vBucksEarned} ${CURRENCY_NAME}!`,
        className: `bg-yellow-500 text-white border-yellow-600`
      });
    } else {
      setFeedback({ message: `That's one way to think about it. Here's another idea: ${scenario.explanation}`, type: 'incorrect' });
      toast({
        title: "Good Try!",
        description: `Learning to be kind is a journey! +${vBucksEarned} ${CURRENCY_NAME}!`,
        className: `bg-orange-500 text-white border-orange-600` // A softer "incorrect" color
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className={`text-8xl md:text-9xl font-black my-8 tracking-tighter ${BEING_NICE_MODULE_COLOR} drop-shadow-[0_6px_8px_rgba(245,158,11,0.4)] animate-pulse`}>
        KINDNESS ARENA
      </h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border-4 border-yellow-500/50">
        <CardHeader>
          <CardTitle className="text-4xl text-center flex items-center justify-center gap-3 font-extrabold">
            <MessageSquareHeart className={`h-12 w-12 ${BEING_NICE_MODULE_COLOR}`} /> What Would You Do?
          </CardTitle>
          <CardDescription className="text-center text-xl font-semibold text-muted-foreground">
            Choose the kindest action to earn {CURRENCY_NAME}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[300px] flex flex-col justify-center">
          {isLoading ? (
            <div className="text-center py-12">
              <Zap className={`h-16 w-16 animate-ping mx-auto ${BEING_NICE_MODULE_COLOR}`} />
              <p className="mt-6 text-muted-foreground text-2xl font-semibold">Loading a kindness challenge...</p>
            </div>
          ) : scenario ? (
            <>
              <p className={`text-3xl md:text-4xl leading-relaxed text-center p-6 rounded-lg bg-yellow-500/10 border-2 border-yellow-500/30 shadow-inner ${BEING_NICE_MODULE_COLOR}`}>
                {scenario.scenarioText}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={() => handleChoice('A')}
                  disabled={!!selectedChoice}
                  size="xl"
                  className={`h-auto py-6 text-xl whitespace-normal ${selectedChoice === 'A' ? (scenario.correctChoice === 'A' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : 'bg-primary hover:bg-primary/90'} text-primary-foreground`}
                >
                  <ThumbsUp className="mr-3 h-8 w-8 shrink-0" /> {scenario.choiceA}
                </Button>
                <Button
                  onClick={() => handleChoice('B')}
                  disabled={!!selectedChoice}
                  size="xl"
                  className={`h-auto py-6 text-xl whitespace-normal ${selectedChoice === 'B' ? (scenario.correctChoice === 'B' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : 'bg-secondary hover:bg-secondary/90'} text-secondary-foreground`}
                >
                  <ThumbsDown className="mr-3 h-8 w-8 shrink-0 md:hidden" /> {/* Hide one for mobile layout if needed */}
                  <Heart className="mr-3 h-8 w-8 shrink-0 hidden md:inline-flex" /> {/* Show Heart on larger screens */}
                   {scenario.choiceB}
                </Button>
              </div>
            </>
          ) : (
             <p className="text-center text-xl text-destructive py-10">Could not load a scenario. Try refreshing!</p>
          )}
        </CardContent>
        {feedback && (
          <CardFooter className="flex-col gap-4 pt-4">
             <div
              className={`w-full p-5 rounded-lg text-lg font-semibold flex items-start gap-3 shadow-md
                ${feedback.type === 'correct' ? `bg-green-100 border-2 border-green-500 text-green-700` : ''}
                ${feedback.type === 'incorrect' ? `bg-orange-100 border-2 border-orange-500 text-orange-700` : ''}`}
            >
              {feedback.type === 'correct' ? <CheckCircle2 className="h-7 w-7 mt-1 shrink-0 text-green-600" /> : <XCircle className="h-7 w-7 mt-1 shrink-0 text-orange-600" />}
              <p>{feedback.message}</p>
            </div>
            <Button onClick={fetchNewScenario} size="lg" className={`w-full ${BEING_NICE_MODULE_COLOR.replace('text-', 'bg-')} hover:opacity-90 text-white`}>
              <Lightbulb className="mr-2 h-6 w-6" /> Next Scenario
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
