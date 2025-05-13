
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { VBUCKS_PER_TIER, CURRENCY_NAME, LEVEL_NAME_SINGULAR } from '@/lib/constants';

interface ScoreContextState {
  totalVBucks: number; // Renamed from totalScore
  tier: number; // Renamed from level
  vBucksInTier: number; // Renamed from xpInLevel
  vBucksForNextTier: number; // Renamed from xpForNextLevel
  addVBucks: (points: number) => void; // Renamed from addScore
  currencyName: string;
  levelName: string;
}

const ScoreContext = createContext<ScoreContextState | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [totalVBucks, setTotalVBucks] = useState(0);

  const addVBucks = useCallback((points: number) => {
    setTotalVBucks((prevVBucks) => prevVBucks + points);
  }, []);

  const contextValue = useMemo(() => {
    const currentTier = Math.floor(totalVBucks / VBUCKS_PER_TIER) + 1;
    const currentVBucksInTier = totalVBucks % VBUCKS_PER_TIER;
    return {
      totalVBucks,
      tier: currentTier,
      vBucksInTier: currentVBucksInTier,
      vBucksForNextTier: VBUCKS_PER_TIER,
      addVBucks,
      currencyName: CURRENCY_NAME,
      levelName: LEVEL_NAME_SINGULAR,
    };
  }, [totalVBucks, addVBucks]);

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
