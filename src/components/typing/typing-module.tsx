"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDisplay } from '@/components/game/score-display';
import { adjustTypingDifficulty as adjustTypingDifficultyAI } from '@/ai/flows/adaptive-typing';
import { Keyboard as KeyboardIcon, Zap, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const INITIAL_TEXT = "The quick brown fox jumps over the lazy dog.";
const INITIAL_DIFFICULTY = 1;

export function TypingModule() {
  const [textToType, setTextToType] = useState<string>(INITIAL_TEXT);
  const [userInput, setUserInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<number>(INITIAL_DIFFICULTY);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const { toast } = useToast();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const startSession = (newText: string, newDifficulty: number) => {
    setTextToType(newText);
    setDifficulty(newDifficulty);
    setUserInput('');
    setFeedback(null);
    setWpm(0);
    setAccuracy(0);
    setIsSessionActive(true);
    setStartTime(Date.now());
    textAreaRef.current?.focus();
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
      setFeedback(aiResponse.feedback); // Display AI feedback
      toast({
        title: "Typing Challenge Updated!",
        description: aiResponse.feedback || `New difficulty: ${aiResponse.newDifficultyLevel}`,
      });
    } catch (error) {
      console.error("AI typing adjustment error:", error);
      toast({
        title: "Error",
        description: "Could not fetch new typing challenge. Please try again.",
        variant: "destructive",
      });
      // Fallback to a simple text or retry logic if needed
      startSession(INITIAL_TEXT, INITIAL_DIFFICULTY); // Fallback to initial
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    // Initial load
    fetchNewTypingChallenge("", "", INITIAL_DIFFICULTY);
  }, [fetchNewTypingChallenge]);


  const calculatePerformance = () => {
    if (!startTime || !textToType) return { wpm: 0, accuracy: 0, errors: 0 };

    const endTime = Date.now();
    const timeDiffSeconds = (endTime - startTime) / 1000;
    const wordsTyped = userInput.trim().split(/\s+/).length;
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
    if (!isSessionActive) return;
    setUserInput(e.target.value);
    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  const handleSubmitChallenge = () => {
    if (!isSessionActive) return;

    setIsSessionActive(false); // End current session
    const { wpm: currentWpm, accuracy: currentAccuracy } = calculatePerformance();
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);

    const points = Math.round((currentWpm * 0.5) + (currentAccuracy * 0.5)); // Simple scoring
    setScore(prev => prev + points);

    toast({
      title: "Round Complete!",
      description: `WPM: ${currentWpm}, Accuracy: ${currentAccuracy}%`,
      className: "bg-blue-500 text-white" // Example custom toast
    });
    
    // Fetch next challenge
    fetchNewTypingChallenge(textToType, userInput, difficulty);
  };
  
  const renderTextWithHighlight = () => {
    return textToType.split('').map((char, index) => {
      let charClass = "text-muted-foreground";
      if (index < userInput.length) {
        charClass = char === userInput[index] ? "text-correct" : "text-incorrect bg-red-200/50";
      }
      return <span key={index} className={charClass}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-primary">Typing Titans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <ScoreDisplay score={score} title="Typing Score"/>
        <Card className="shadow-lg"><CardHeader><CardTitle className="text-lg text-center">WPM</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold text-center">{wpm}</p></CardContent></Card>
        <Card className="shadow-lg"><CardHeader><CardTitle className="text-lg text-center">Accuracy</CardTitle></CardHeader><CardContent><p className="text-4xl font-bold text-center">{accuracy}%</p></CardContent></Card>
      </div>

      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2"><KeyboardIcon /> Type This!</CardTitle>
          <CardDescription className="text-center">Current Difficulty: Level {difficulty}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && !isSessionActive ? (
             <div className="text-center py-8">
                <Zap className="h-8 w-8 animate-ping mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Loading new challenge...</p>
            </div>
          ) : (
            <div className="p-4 border rounded-md bg-muted/30 min-h-[100px] text-2xl tracking-wide font-mono select-none">
              {renderTextWithHighlight()}
            </div>
          )}
          <Textarea
            ref={textAreaRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="text-xl h-32 font-mono"
            disabled={!isSessionActive || isLoading}
            aria-label="Typing input area"
          />
          {feedback && (
            <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${userInput.length > 0 && accuracy < 80 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-blue-100 text-blue-700 border border-blue-300'}`}>
              {userInput.length > 0 && accuracy < 80 ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" /> }
              {feedback}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitChallenge} className="w-full h-12 text-lg" disabled={!isSessionActive || isLoading || userInput.length === 0} size="lg">
            {isLoading ? 'Loading Next...' : 'Submit & Next Challenge'} <Send className="ml-2"/>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
