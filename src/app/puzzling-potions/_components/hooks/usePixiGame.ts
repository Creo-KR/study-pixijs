import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { navigation } from '../utils/navigation';

export interface GameState {
  isLoading: boolean;
  isInitialized: boolean;
  currentScreen: string | null;
  error: string | null;
}

export const usePixiGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    isLoading: false,
    isInitialized: false,
    currentScreen: null,
    error: null,
  });

  const appRef = useRef<Application | null>(null);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const getApp = () => appRef.current;

  const navigateToScreen = async (screenClass: any) => {
    if (!appRef.current) return;

    try {
      updateGameState({ isLoading: true });
      await navigation.showScreen(screenClass);
      updateGameState({
        isLoading: false,
        currentScreen: screenClass.name || 'Unknown',
      });
    } catch (error) {
      updateGameState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Navigation failed',
      });
    }
  };

  const pauseGame = () => {
    navigation.blur();
  };

  const resumeGame = () => {
    navigation.focus();
  };

  return {
    gameState,
    updateGameState,
    appRef,
    getApp,
    navigateToScreen,
    pauseGame,
    resumeGame,
  };
};
