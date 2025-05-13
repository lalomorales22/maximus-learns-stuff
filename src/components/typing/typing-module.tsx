
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { adjustTypingDifficulty as adjustTypingDifficultyAI } from '@/ai/flows/adaptive-typing';
import { Keyboard as KeyboardIcon, Zap, Send, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useScore } from '@/contexts/ScoreContext';
import { CURRENCY_NAME } from '@/lib/constants';

const INITIAL_TEXT = "The quick brown fox jumps over the lazy dog. Prepare for the storm!";
const INITIAL_DIFFICULTY = 1;

export function TypingModule() {
  const [textToType, setTextToType] = useState<string>(INITIAL_TEXT);
  const [userInput, setUserInput] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(INITIAL_DIFFICULTY);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentWpm, setCurrentWpm] = useState<number>(0);
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const { toast } = useToast();
  const { addVBucks } = useScore(); // Changed from addScore
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const startSession = (newText: string, newDifficulty: number) => {
    setTextToType(newText);
    setDifficulty(newDifficulty);
    setUserInput('');
    setCurrentWpm(0);
    setCurrentAccuracy(0);
    setIsSessionActive(true);
    setStartTime(Date.now()); 
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.value = ''; 
    }
  };

  const fetchNewTypingChallenge = useCallback(async (prevText: string, userText: string, currentLevel: number) => {
    setIsLoading(true);
    try {
      const aiResponse = await adjustTypingDifficultyAI({
        previousText: prevText,
        userTypingResult: userText,
        currentDifficultyLevel: currentLevel,
      });
      startSession(aiResponse.newText, aiResponse.newDifficultyLevel);
      setFeedback(aiResponse.feedback); 
      toast({
        title: "New Typing Drill!",
        description: aiResponse.feedback || `Get ready! Difficulty: ${aiResponse.newDifficultyLevel}`,
        className: "bg-accent text-accent-foreground border-accent"
      });
    } catch (error) {
      console.error("AI typing adjustment error:", error);
      toast({
        title: "Transmission Error!",
        description: "Couldn't get a new challenge. Let's try this one again!",
        variant: "destructive",
      });
      startSession(textToType || INITIAL_TEXT, difficulty || INITIAL_DIFFICULTY); 
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textToType, difficulty]); 


  useEffect(() => {
    fetchNewTypingChallenge("", "", INITIAL_DIFFICULTY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  const calculatePerformance = () => {
    if (!startTime || !textToType || userInput.trim() === '') return { wpm: 0, accuracy: 0 };

    const endTime = Date.now();
    const timeDiffSeconds = (endTime - startTime) / 1000;
    if (timeDiffSeconds <= 0) return { wpm: 0, accuracy: 0 }; 

    const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
    const calculatedWpm = Math.round((wordsTyped / timeDiffSeconds) * 60) || 0;

    let correctChars = 0;
    const targetChars = textToType.split('');
    userInput.split('').forEach((char, index) => {
      if (index < targetChars.length && char === targetChars[index]) {
        correctChars++;
      }
    });
    const calculatedAccuracy = textToType.length > 0 ? Math.round((correctChars / textToType.length) * 100) : 0;
    
    return { wpm: calculatedWpm, accuracy: calculatedAccuracy };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isSessionActive || isLoading) return;
    
    const currentInput = e.target.value;
    setUserInput(currentInput);

    if (!startTime && currentInput.length > 0) { 
      setStartTime(Date.now());
    }
  };

  const handleSubmitChallenge = () => {
    if (!isSessionActive || isLoading || userInput.trim() === '') return;

    setIsSessionActive(false); 
    const { wpm, accuracy } = calculatePerformance();
    setCurrentWpm(wpm);
    setCurrentAccuracy(accuracy);

    const vBucksEarned = Math.max(5, Math.round((wpm * 0.3) + (accuracy * 0.7) + (difficulty * 2))); // Min 5 V-Bucks
    addVBucks(vBucksEarned); // Changed from addScore

    toast({
      title: "Drill Complete!",
      description: `SPEED: ${wpm} WPM, ACCURACY: ${accuracy}%! +${vBucksEarned} ${CURRENCY_NAME}!`,
      className: accuracy > 85 ? "bg-correct text-correct-foreground border-correct" : "bg-primary text-primary-foreground border-primary" 
    });
    
    fetchNewTypingChallenge(textToType, userInput, difficulty);
  };
  
  const renderTextWithHighlight = () => {
    if (isLoading && !isSessionActive) return null; 
    return textToType.split('').map((char, index) => {
      let charClass = "text-muted-foreground opacity-60"; 
      if (index < userInput.length) {
        charClass = char === userInput[index] ? "text-correct font-bold" : "text-incorrect bg-destructive/40 font-bold";
      } else if (index === userInput.length && isSessionActive) { // Only show cursor when session is active
        charClass = "border-b-4 border-primary animate-pulse"; 
      }
      return <span key={index} className={charClass}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-8xl md:text-9xl font-black my-8 tracking-tighter text-accent drop-shadow-[0_6px_8px_rgba(var(--accent-rgb),0.4)]">TYPE</h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl border-4 border-accent/50"> 
        <CardHeader>
          <CardTitle className="text-4xl text-center flex items-center justify-center gap-3 font-extrabold">
            <Trophy className="h-12 w-12 text-accent"/> Type Fast for {CURRENCY_NAME}!
            </CardTitle>
          <CardDescription className="text-center text-xl font-semibold text-muted-foreground mt-1">Challenge Level: {difficulty}</CardDescription>
           {currentAccuracy > 0 && !isSessionActive && (
             <CardDescription className="text-center text-lg mt-1 font-medium">Last Round: {currentWpm} WPM, {currentAccuracy}% Accuracy</CardDescription>
           )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && !isSessionActive ? (
             <div className="text-center py-16">
                <Zap className="h-16 w-16 animate-ping mx-auto text-accent" />
                <p className="mt-6 text-muted-foreground text-2xl font-semibold">Loading new typing drill...</p>
            </div>
          ) : (
            <div className="p-8 border-4 border-input rounded-xl bg-muted/30 min-h-[150px] text-4xl md:text-5xl tracking-wider font-mono select-none shadow-inner_lg">
              {renderTextWithHighlight()}
            </div>
          )}
          <Textarea
            ref={textAreaRef}
            value={userInput} 
            onChange={handleInputChange}
            placeholder={isSessionActive ? "Start typing..." : "Waiting for next drill..."}
            className="text-3xl h-48 font-mono rounded-xl border-2 border-input focus:border-accent shadow-sm" 
            disabled={!isSessionActive || isLoading}
            aria-label="Typing input area"
            onPaste={(e) => e.preventDefault()} 
          />
          {feedback && !isLoading && ( 
            <div className={`p-5 rounded-lg text-lg font-semibold flex items-center gap-3 border-2 shadow-md ${currentAccuracy < 80 && userInput.length > 0 && !isSessionActive ? 'bg-destructive/10 text-destructive border-destructive/40' : 'bg-accent/10 text-accent-foreground border-accent/40'}`}>
              {currentAccuracy < 80 && userInput.length > 0 && !isSessionActive ? <AlertTriangle className="h-7 w-7" /> : <CheckCircle className="h-7 w-7" /> }
              <span>{feedback}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitChallenge} className="w-full" disabled={!isSessionActive || isLoading || userInput.trim().length === 0} size="xl" variant="default"> 
            {isLoading ? 'Loading Next...' : `Lock In & Get ${CURRENCY_NAME}!`} <Send className="ml-3 h-7 w-7"/>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
