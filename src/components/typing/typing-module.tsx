
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreDisplay } from '@/components/game/score-display';
import { adjustTypingDifficulty as adjustTypingDifficultyAI } from '@/ai/flows/adaptive-typing';
import { Keyboard as KeyboardIcon, Zap, Send, CheckCircle, AlertTriangle, Star } from 'lucide-react'; // Added Star
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
    // Feedback is set by AI call, don't clear it here if we want to show it post-session.
    // setFeedback(null); 
    setWpm(0);
    setAccuracy(0);
    setIsSessionActive(true);
    setStartTime(Date.now()); // Set start time when new text is ready
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.value = ''; // Ensure textarea is cleared visually for user
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
      setFeedback(aiResponse.feedback); // Display AI feedback for the *next* round
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
      startSession(textToType || INITIAL_TEXT, difficulty || INITIAL_DIFFICULTY); // Fallback to current or initial
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textToType, difficulty]); // Add current text/difficulty as deps if using them in fallback


  useEffect(() => {
    // Initial load: fetch challenge with empty previous data
    fetchNewTypingChallenge("", "", INITIAL_DIFFICULTY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount


  const calculatePerformance = () => {
    if (!startTime || !textToType || userInput.trim() === '') return { wpm: 0, accuracy: 0 };

    const endTime = Date.now();
    const timeDiffSeconds = (endTime - startTime) / 1000;
    if (timeDiffSeconds <= 0) return { wpm: 0, accuracy: 0 }; // Avoid division by zero

    const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
    const calculatedWpm = Math.round((wordsTyped / timeDiffSeconds) * 60) || 0;

    let correctChars = 0;
    // eslint-disable-next-line
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

    if (!startTime && currentInput.length > 0) { // Start timer on first character input
      setStartTime(Date.now());
    }
  };

  const handleSubmitChallenge = () => {
    if (!isSessionActive || isLoading || userInput.trim() === '') return;

    setIsSessionActive(false); 
    const { wpm: currentWpm, accuracy: currentAccuracy } = calculatePerformance();
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);

    // More generous scoring, rewarding accuracy and WPM
    const points = Math.round((currentWpm * 0.3) + (currentAccuracy * 0.7) + (difficulty * 2));
    setScore(prev => prev + Math.max(5, points)); // Min 5 points

    toast({
      title: "Round Done!",
      description: `SPEED: ${currentWpm} WPM, SMARTS: ${currentAccuracy}% accuracy!`,
      className: currentAccuracy > 85 ? "bg-correct text-correct-foreground border-correct" : "bg-blue-500 text-white border-blue-600" 
    });
    
    // Fetch next challenge, providing the just-completed data
    fetchNewTypingChallenge(textToType, userInput, difficulty);
  };
  
  const renderTextWithHighlight = () => {
    if (isLoading && !isSessionActive) return null; // Don't render text if loading new challenge and session not active
    return textToType.split('').map((char, index) => {
      let charClass = "text-muted-foreground opacity-70"; // Default for untyped characters
      if (index < userInput.length) {
        charClass = char === userInput[index] ? "text-correct font-bold" : "text-incorrect bg-destructive/30 font-bold";
      } else if (index === userInput.length) {
        charClass = "border-b-2 border-primary animate-pulse"; // Current character to type
      }
      return <span key={index} className={charClass}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className="text-7xl md:text-9xl font-black my-6 tracking-tighter text-accent drop-shadow-lg">TYPE</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"> {/* Increased gap and max-width */}
        <ScoreDisplay score={score} title="Typing Score"/>
        <Card className="shadow-xl rounded-xl bg-background"><CardHeader><CardTitle className="text-xl text-center font-semibold flex items-center justify-center gap-2"><Zap className="text-yellow-400"/>WPM</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold text-center text-foreground">{wpm}</p></CardContent></Card>
        <Card className="shadow-xl rounded-xl bg-background"><CardHeader><CardTitle className="text-xl text-center font-semibold flex items-center justify-center gap-2"><Star className="text-yellow-400"/>Accuracy</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold text-center text-foreground">{accuracy}%</p></CardContent></Card>
      </div>

      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl"> {/* Increased max-width and roundness */}
        <CardHeader>
          <CardTitle className="text-3xl text-center flex items-center justify-center gap-3 font-bold"><KeyboardIcon className="h-10 w-10"/> Type This Fast!</CardTitle>
          <CardDescription className="text-center text-lg mt-1">Current Difficulty: Level {difficulty}</CardDescription>
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
            value={userInput} // Controlled component
            onChange={handleInputChange}
            placeholder={isSessionActive ? "Start typing here..." : "Waiting for challenge..."}
            className="text-2xl h-40 font-mono rounded-xl" // Larger textarea
            disabled={!isSessionActive || isLoading}
            aria-label="Typing input area"
            onPaste={(e) => e.preventDefault()} // Prevent pasting
          />
          {feedback && !isLoading && ( // Show feedback if not loading new text
            <div className={`p-4 rounded-lg text-md font-medium flex items-center gap-2 border-2 ${accuracy < 80 && userInput.length > 0 ? 'bg-destructive/10 text-destructive border-destructive/30' : 'bg-accent/10 text-accent-foreground border-accent/30'}`}>
              {accuracy < 80 && userInput.length > 0 ? <AlertTriangle className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" /> }
              <span>{feedback}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitChallenge} className="w-full" disabled={!isSessionActive || isLoading || userInput.trim().length === 0} size="xl" variant="default"> {/* Using new XL size */}
            {isLoading ? 'Loading Next...' : 'Done! Next Challenge'} <Send className="ml-3 h-7 w-7"/>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
