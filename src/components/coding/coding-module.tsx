"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AnimatedScoreDisplay } from '@/components/game/animated-score-display';
import { useScore } from '@/contexts/ScoreContext';
import { useToast } from '@/hooks/use-toast';
import { CURRENCY_NAME, MODULE_DATA } from '@/lib/constants';
import { Play, Zap, Move, Repeat, AlertTriangle } from 'lucide-react';

const CODE_BLOCK_COLOR = "text-green-500"; // Specific color for Coding module

interface CodeBlock {
  id: string;
  name: string;
  icon: React.ElementType;
  category: 'action' | 'loop' | 'event';
}

const AVAILABLE_BLOCKS: CodeBlock[] = [
  { id: 'moveForward', name: 'Move Forward', icon: Move, category: 'action' },
  { id: 'turnLeft', name: 'Turn Left', icon: Repeat, category: 'action' },
  { id: 'turnRight', name: 'Turn Right', icon: Repeat, category: 'action' },
  { id: 'repeat2', name: 'Repeat 2x', icon: Repeat, category: 'loop' },
  { id: 'onStart', name: 'On Start', icon: Play, category: 'event' },
];

export function CodingModule() {
  const { addVBucks } = useScore();
  const { toast } = useToast();
  const [workspaceBlocks, setWorkspaceBlocks] = useState<CodeBlock[]>([]);
  const [characterPosition, setCharacterPosition] = useState({ x: 0, y: 0 }); // Simple character state

  const CODING_MODULE_COLOR = MODULE_DATA.coding.themeColor.replace('bg-', 'text-'); // e.g. text-green-500

  const handleRunProgram = () => {
    if (workspaceBlocks.length === 0) {
      toast({
        title: "Empty Program!",
        description: "Drag some blocks into the workspace to build your program!",
        variant: "destructive",
        className: "bg-destructive text-destructive-foreground border-destructive"
      });
      return;
    }

    // Simulate program execution
    let tempX = 0;
    // Calculate tempY based on the number of 'moveForward' blocks
    const numMoveForwardBlocks = workspaceBlocks.filter(block => block.id === 'moveForward').length;
    let tempY = numMoveForwardBlocks;
    
    // Placeholder for other block logic (e.g., turns, loops)
    // For now, only 'moveForward' affects position.
    // Example: if implementing 'turnLeft'/'turnRight', you'd need to manage direction state.
    // Example: if implementing 'repeat2x', you'd iterate through a sub-sequence of blocks.

    setCharacterPosition({x: tempX, y: tempY});


    const vBucksEarned = workspaceBlocks.length * 5 + 10; // Reward based on program length
    addVBucks(vBucksEarned);
    toast({
      title: "Program Executed!",
      description: `Awesome! Your program ran. You earned ${vBucksEarned} ${CURRENCY_NAME}!`,
      className: `bg-green-500 text-white border-green-600`
    });
  };

  const addBlockToWorkspace = (block: CodeBlock) => {
    setWorkspaceBlocks(prev => [...prev, block]);
    addVBucks(2);
    toast({
        title: "Block Added!",
        description: `You added '${block.name}' to your program! +2 ${CURRENCY_NAME}`,
        className: `bg-green-500/80 text-white`
    })
  }

  const clearWorkspace = () => {
    setWorkspaceBlocks([]);
    setCharacterPosition({x:0, y:0});
    addVBucks(5);
     toast({
        title: "Workspace Cleared!",
        description: `Ready for a new program! +5 ${CURRENCY_NAME}`,
        className: `bg-green-500/80 text-white`
    })
  }


  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8">
      <h1 className={`text-8xl md:text-9xl font-black my-8 tracking-tighter ${CODING_MODULE_COLOR} drop-shadow-[0_6px_8px_rgba(34,197,94,0.4)] animate-pulse`}>
        CODING COMBAT
      </h1>
      <AnimatedScoreDisplay />

      <Card className="w-full max-w-4xl shadow-2xl rounded-2xl border-4 border-green-500/50">
        <CardHeader>
          <CardTitle className="text-4xl text-center flex items-center justify-center gap-3 font-extrabold">
            <Zap className={`h-12 w-12 ${CODING_MODULE_COLOR}`} /> Build Your Code!
          </CardTitle>
          <CardDescription className="text-center text-xl font-semibold text-muted-foreground">
            Drag (or click) blocks to the workspace and hit 'Run Program' to earn {CURRENCY_NAME}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Toolbox */}
            <div className="md:col-span-1 space-y-4 p-4 border-2 border-dashed border-green-400 rounded-lg bg-green-500/10">
              <h3 className={`text-2xl font-bold mb-3 ${CODING_MODULE_COLOR}`}>Code Blocks</h3>
              {AVAILABLE_BLOCKS.map((block) => (
                <Button
                  key={block.id}
                  variant="outline"
                  className={`w-full justify-start p-3 h-auto text-left border-2 border-green-600 bg-green-500/20 hover:bg-green-500/30 ${CODING_MODULE_COLOR}`}
                  onClick={() => addBlockToWorkspace(block)}
                  title={`Click to add '${block.name}' to workspace`}
                >
                  <block.icon className={`mr-3 h-7 w-7 ${CODING_MODULE_COLOR}`} />
                  <span className="text-lg font-medium">{block.name}</span>
                </Button>
              ))}
            </div>

            {/* Workspace */}
            <div className="md:col-span-2 space-y-3 p-4 border-2 border-dashed border-green-600 rounded-lg bg-green-500/20 min-h-[200px]">
              <h3 className={`text-2xl font-bold mb-3 ${CODING_MODULE_COLOR}`}>Workspace</h3>
              {workspaceBlocks.length === 0 && (
                <p className="text-muted-foreground text-center py-10">Drag or click blocks here!</p>
              )}
              {workspaceBlocks.map((block, index) => (
                <div key={index} className={`flex items-center p-3 rounded-md bg-green-600 text-white shadow`}>
                  <block.icon className="mr-3 h-6 w-6" />
                  <span className="text-lg">{block.name}</span>
                </div>
              ))}
               {workspaceBlocks.length > 0 && (
                <Button onClick={clearWorkspace} variant="destructive" size="sm" className="mt-4 w-full opacity-80 hover:opacity-100">
                  <AlertTriangle className="mr-2 h-5 w-5" /> Clear Workspace
                </Button>
              )}
            </div>
          </div>

           {/* Simulated Output/Character Area - Larger Area */}
          <div className="mt-6 p-4 border-2 border-green-400 rounded-lg bg-muted/30 text-center">
             <h4 className={`text-xl font-semibold mb-2 ${CODING_MODULE_COLOR}`}>Program Output (Simulation)</h4>
             <div 
                className="relative w-full h-64 bg-white border-2 border-green-700 mx-auto rounded shadow-inner grid place-items-center overflow-hidden"
                aria-label="Character movement area"
              >
                <div 
                    className="w-8 h-8 bg-primary rounded-full shadow-lg transition-transform duration-300 ease-linear" 
                    style={{ transform: `translate(${characterPosition.x*10}px, ${-characterPosition.y*10}px)`}} 
                    title={`Character at X: ${characterPosition.x}, Y: ${characterPosition.y}`}
                >
                    <span role="img" aria-label="character" className="text-xl grid place-items-center h-full">🤖</span>
                </div>
             </div>
             <p className="text-sm text-muted-foreground mt-2">Character Position: X={characterPosition.x}, Y={characterPosition.y}</p>
          </div>

          <Button onClick={handleRunProgram} size="xl" className="w-full bg-green-600 hover:bg-green-700 text-white border-green-700 hover:border-green-800">
            <Play className="mr-3 h-8 w-8" /> Run Program & Earn {CURRENCY_NAME}!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
