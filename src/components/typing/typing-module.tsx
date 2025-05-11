
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { adjustTypingDifficulty as adjustTypingDifficultyAI } from '@/ai/flows/adaptive-typing';
import { Keyboard as KeyboardIcon, Zap, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useScore } from '@/contexts/ScoreContext';

const INITIAL_TEXT = "The quick brown fox jumps over the lazy dog.";
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
  const { addScore } = useScore();
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
        title: "New Challenge!",
        description: aiResponse.feedback || `Get ready! Difficulty: ${aiResponse.newDifficultyLevel}`,
        className: "bg-accent text-accent-foreground border-accent-darker"
      });
    } catch (error) {
      console.error("AI typing adjustment error:", error);
      toast({
        title: "Oh no!",
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

    const points = Math.round((wpm * 0.3) + (accuracy * 0.7) + (difficulty * 2));
    const earnedPoints = Math.max(5, points); // Min 5 points
    addScore(earnedPoints);

    toast({
      title: "Round Done!",
      description: `SPEED: ${wpm} WPM, SMARTS: ${accuracy}% accuracy! +${earnedPoints} points!`,
      className: accuracy > 85 ? "bg-correct text-correct-foreground border-correct" : "bg-blue-500 text-white border-blue-600" 
    });
    
    fetchNewTypingChallenge(textToType, userInput, difficulty);
  };
  
  const renderTextWithHighlight = () => {
    if (isLoading && !isSessionActive) return null; 
    return textToType.split('').map((char, index) => {
      let charClass = "text-muted-foreground opacity-70"; 
      if (index < userInput.length) {
        charClass = char === userInput[index] ? "text-correct font-bold" : "text-incorrect bg-destructive/30 font-bold";
      } else if (index === userInput.length) {
        charClass = "border-b-2 border-primary animate-pulse"; 
      }
      return <span key={index} className={charClass}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-7xl md:text-9xl font-black my-6 tracking-tighter text-accent drop-shadow-lg">TYPE</h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl"> 
        <CardHeader>
          <CardTitle className="text-3xl text-center flex items-center justify-center gap-3 font-bold"><KeyboardIcon className="h-10 w-10"/> Type This Fast!</CardTitle>
          <CardDescription className="text-center text-lg mt-1">Current Difficulty: Level {difficulty}</CardDescription>
           {currentAccuracy > 0 && !isSessionActive && (
             <CardDescription className="text-center text-md mt-1">Last Round: {currentWpm} WPM, {currentAccuracy}% Accuracy</CardDescription>
           )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && !isSessionActive ? (
             <div className="text-center py-12">
                <Zap className="h-12 w-12 animate-ping mx-auto text-accent" />
                <p className="mt-4 text-muted-foreground text-xl">Loading new typing challenge...</p>
            </div>
          ) : (
            <div className="p-6 border-2 border-border rounded-xl bg-muted/20 min-h-[120px] text-3xl md:text-4xl tracking-wider font-mono select-none shadow-inner">
              {renderTextWithHighlight()}
            </div>
          )}
          <Textarea
            ref={textAreaRef}
            value={userInput} 
            onChange={handleInputChange}
            placeholder={isSessionActive ? "Start typing here..." : "Waiting for challenge..."}
            className="text-2xl h-40 font-mono rounded-xl" 
            disabled={!isSessionActive || isLoading}
            aria-label="Typing input area"
            onPaste={(e) => e.preventDefault()} 
          />
          {feedback && !isLoading && ( 
            <div className={`p-4 rounded-lg text-md font-medium flex items-center gap-2 border-2 ${currentAccuracy < 80 && userInput.length > 0 && !isSessionActive ? 'bg-destructive/10 text-destructive border-destructive/30' : 'bg-accent/10 text-accent-foreground border-accent/30'}`}>
              {currentAccuracy < 80 && userInput.length > 0 && !isSessionActive ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" /> }
              <span>{feedback}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitChallenge} className="w-full" disabled={!isSessionActive || isLoading || userInput.trim().length === 0} size="xl" variant="default"> 
            {isLoading ? 'Loading Next...' : 'Done! Next Challenge'} <Send className="ml-3 h-7 w-7"/>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
