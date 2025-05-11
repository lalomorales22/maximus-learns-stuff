
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const XP_PER_LEVEL = 100;

interface ScoreContextState {
  totalScore: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  addScore: (points: number) => void;
}

const ScoreContext = createContext<ScoreContextState | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [totalScore, setTotalScore] = useState(0);

  const addScore = useCallback((points: number) => {
    setTotalScore((prevScore) => prevScore + points);
  }, []);

  const contextValue = useMemo(() => {
    const level = Math.floor(totalScore / XP_PER_LEVEL) + 1;
    const xpInLevel = totalScore % XP_PER_LEVEL;
    return {
      totalScore,
      level,
      xpInLevel,
      xpForNextLevel: XP_PER_LEVEL,
      addScore,
    };
  }, [totalScore, addScore]);

  return (
    <ScoreContext.Provider value={contextValue}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore(): ScoreContextState {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
}
