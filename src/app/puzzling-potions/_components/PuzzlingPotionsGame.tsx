/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import '@pixi/spine-pixi';
import { useEffect, useRef, useCallback, useState } from 'react';
import { Application } from 'pixi.js';
import { initAssets } from './utils/assets';
import { navigation } from './utils/navigation';
import { GameScreen } from './screens/GameScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LoadScreen } from './screens/LoadScreen';
import { ResultScreen } from './screens/ResultScreen';
import { TiledBackground } from './ui/TiledBackground';
import { getUrlParam } from './utils/getUrlParams';
import { sound } from '@pixi/sound';
import { setApp } from './utils/appInstance';

interface PuzzlingPotionsGameProps {
  className?: string;
  showControls?: boolean;
}

interface GameState {
  isLoading: boolean;
  isInitialized: boolean;
  currentScreen: string | null;
  error: string | null;
}

const PuzzlingPotionsGame: React.FC<PuzzlingPotionsGameProps> = ({
  className = '',
  showControls = false,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const isInitializedRef = useRef(false);

  const [gameState, setGameState] = useState<GameState>({
    isLoading: false,
    isInitialized: false,
    currentScreen: null,
    error: null,
  });

  const [isControlsVisible, setIsControlsVisible] = useState(false);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  /** Set up a resize function for the app */
  const resize = useCallback(() => {
    if (!appRef.current) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minWidth = 375;
    const minHeight = 700;

    // Calculate renderer and canvas sizes based on current dimensions
    const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
    const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
    const scale = scaleX > scaleY ? scaleX : scaleY;
    const width = windowWidth * scale;
    const height = windowHeight * scale;

    // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
    appRef.current.renderer.canvas.style.width = `${windowWidth}px`;
    appRef.current.renderer.canvas.style.height = `${windowHeight}px`;
    window.scrollTo(0, 0);

    // Update renderer and navigation screens dimensions
    appRef.current.renderer.resize(width, height);
    navigation.resize(width, height);
  }, []);

  /** Fire when document visibility changes - lose or regain focus */
  const visibilityChange = useCallback(() => {
    if (document.hidden) {
      sound.pauseAll();
      navigation.blur();
    } else {
      sound.resumeAll();
      navigation.focus();
    }
  }, []);

  /** Navigate to a specific screen */
  const navigateToScreen = useCallback(
    async (screenClass: any, screenName: string) => {
      if (!appRef.current) return;

      try {
        updateGameState({ isLoading: true, error: null });
        await navigation.showScreen(screenClass);
        updateGameState({
          isLoading: false,
          currentScreen: screenName,
        });
      } catch (error) {
        updateGameState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Navigation failed',
        });
      }
    },
    [updateGameState]
  );

  /** Pause the game */
  const pauseGame = useCallback(() => {
    navigation.blur();
    sound.pauseAll();
  }, []);

  /** Resume the game */
  const resumeGame = useCallback(() => {
    navigation.focus();
    sound.resumeAll();
  }, []);

  /** Setup app and initialise assets */
  const initGame = useCallback(async () => {
    if (!canvasRef.current || isInitializedRef.current) return;

    try {
      updateGameState({ isLoading: true, error: null });

      // Initialize app
      const app = new Application();
      appRef.current = app;
      setApp(app); // Set the global app instance

      await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: 0xffffff,
      });

      // Add pixi canvas element (app.canvas) to the container
      canvasRef.current.appendChild(app.canvas);

      // Setup assets bundles and start up loading everything in background
      await initAssets();

      // Add a persisting background shared by all screens
      navigation.setBackground(TiledBackground);

      // Show initial loading screen
      await navigation.showScreen(LoadScreen);
      updateGameState({ currentScreen: 'LoadScreen' });

      // Go to one of the screens if a shortcut is present in url params, otherwise go to home screen
      if (getUrlParam('game') !== null) {
        await navigation.showScreen(GameScreen);
        updateGameState({ currentScreen: 'GameScreen' });
      } else if (getUrlParam('load') !== null) {
        await navigation.showScreen(LoadScreen);
        updateGameState({ currentScreen: 'LoadScreen' });
      } else if (getUrlParam('result') !== null) {
        await navigation.showScreen(ResultScreen);
        updateGameState({ currentScreen: 'ResultScreen' });
      } else {
        await navigation.showScreen(HomeScreen);
        updateGameState({ currentScreen: 'HomeScreen' });
      }

      updateGameState({ isLoading: false, isInitialized: true });
      isInitializedRef.current = true;
    } catch (error) {
      updateGameState({
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to initialize game',
      });
      console.error('Failed to initialize game:', error);
    }
  }, [updateGameState]);

  useEffect(() => {
    initGame();

    // Add event listeners
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibilityChange);

    // Trigger the first resize
    resize();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityChange);

      if (appRef.current) {
        try {
          appRef.current.destroy(true, { children: true, texture: true });
        } catch (error) {
          console.error('Error destroying PIXI app:', error);
        }
        appRef.current = null;
        setApp(null); // Clear the global app instance
      }

      isInitializedRef.current = false;
    };
  }, [initGame, resize, visibilityChange]);

  const screens = [
    { name: 'Home', class: HomeScreen },
    { name: 'Game', class: GameScreen },
    { name: 'Load', class: LoadScreen },
    { name: 'Result', class: ResultScreen },
  ];

  return (
    <div className={`puzzling-potions-game relative ${className}`}>
      <div
        ref={canvasRef}
        className='game-canvas'
        style={{ width: '100%', height: '100vh' }}
      />

      {gameState.error && (
        <div className='absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{gameState.error}</span>
        </div>
      )}

      {showControls && (
        <div className='absolute top-4 right-4 z-50'>
          <button
            onClick={() => setIsControlsVisible(!isControlsVisible)}
            className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors'
          >
            {isControlsVisible ? 'Hide Controls' : 'Show Controls'}
          </button>

          {isControlsVisible && (
            <div className='absolute top-12 right-0 bg-white rounded-lg shadow-xl p-4 min-w-64'>
              <h3 className='text-lg font-bold mb-4 text-gray-800'>
                Game Controls
              </h3>

              <div className='space-y-2 mb-4'>
                <div className='text-sm text-gray-600'>
                  Current Screen:{' '}
                  <span className='font-medium'>
                    {gameState.currentScreen || 'None'}
                  </span>
                </div>
                <div className='text-sm text-gray-600'>
                  Status:{' '}
                  <span className='font-medium'>
                    {gameState.isLoading
                      ? 'Loading...'
                      : gameState.isInitialized
                        ? 'Ready'
                        : 'Initializing...'}
                  </span>
                </div>
              </div>

              <div className='space-y-2 mb-4'>
                <h4 className='text-md font-semibold text-gray-700'>
                  Navigate to:
                </h4>
                {screens.map(screen => (
                  <button
                    key={screen.name}
                    onClick={() =>
                      navigateToScreen(screen.class, screen.name + 'Screen')
                    }
                    disabled={gameState.isLoading || !gameState.isInitialized}
                    className='w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm transition-colors'
                  >
                    {screen.name} Screen
                  </button>
                ))}
              </div>

              <div className='space-y-2'>
                <h4 className='text-md font-semibold text-gray-700'>
                  Game Control:
                </h4>
                <div className='flex space-x-2'>
                  <button
                    onClick={pauseGame}
                    disabled={!gameState.isInitialized}
                    className='flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm transition-colors'
                  >
                    Pause
                  </button>
                  <button
                    onClick={resumeGame}
                    disabled={!gameState.isInitialized}
                    className='flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm transition-colors'
                  >
                    Resume
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PuzzlingPotionsGame;
