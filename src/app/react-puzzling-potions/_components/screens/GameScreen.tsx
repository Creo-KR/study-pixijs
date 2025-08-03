'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import BaseScreen, { BaseScreenProps } from './BaseScreen';
import useScreen from '../../_hooks/useScreen';
import GameHeader from '../ui/GameHeader';
import GameFooter from '../ui/GameFooter';
import Board from '../ui/Board';
import GameComplete from '../ui/GameComplete';
import GamePause from '../ui/GamePause';
import RippleButton from '../ui/RippleButton';
import useSfx from '../../_hooks/useSfx';

const assetBundles = ['game', 'common'];

export interface GameScreenRef {
  show: () => Promise<void>;
  hide: () => Promise<void>;
  resize: () => void;
}

const GameScreen: React.FC<BaseScreenProps> = ({ visible, onShow, onHide }) => {
  const screen = useScreen();
  const sfx = useSfx();

  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);

  const headerRef = useRef<any>(null);
  const footerRef = useRef<any>(null);
  const boardRef = useRef<any>(null);
  const gameCompleteRef = useRef<any>(null);
  const gamePauseRef = useRef<any>(null);

  // Game timer
  useEffect(() => {
    if (!visible || isGamePaused || isGameComplete) return;

    const interval = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, isGamePaused, isGameComplete]);

  // Show animation
  const handleShow = useCallback(async () => {
    // Reset game state
    setGameTime(0);
    setScore(0);
    setMoves(0);
    setLevel(1);
    setIsGameComplete(false);
    setIsGamePaused(false);

    // Show UI elements with staggered animation
    if (headerRef.current?.show) {
      await headerRef.current.show();
    }

    if (boardRef.current?.show) {
      await boardRef.current.show();
    }

    if (footerRef.current?.show) {
      await footerRef.current.show();
    }

    onShow?.();
  }, [onShow]);

  // Hide animation
  const handleHide = useCallback(async () => {
    // Hide UI elements
    await Promise.all([
      headerRef.current?.hide?.(),
      boardRef.current?.hide?.(),
      footerRef.current?.hide?.(),
    ]);

    onHide?.();
  }, [onHide]);

  // Game events
  const handleGameComplete = useCallback(() => {
    setIsGameComplete(true);
    sfx.play('common/sfx-correct.wav');

    if (gameCompleteRef.current?.show) {
      gameCompleteRef.current.show();
    }
  }, []);

  const handlePause = useCallback(() => {
    setIsGamePaused(true);
    sfx.play('common/sfx-press.wav');

    if (gamePauseRef.current?.show) {
      gamePauseRef.current.show();
    }
  }, []);

  const handleResume = useCallback(() => {
    setIsGamePaused(false);

    if (gamePauseRef.current?.hide) {
      gamePauseRef.current.hide();
    }
  }, []);

  const handleRestart = useCallback(() => {
    setGameTime(0);
    setScore(0);
    setMoves(0);
    setIsGameComplete(false);
    setIsGamePaused(false);

    if (gameCompleteRef.current?.hide) {
      gameCompleteRef.current.hide();
    }

    if (gamePauseRef.current?.hide) {
      gamePauseRef.current.hide();
    }

    if (boardRef.current?.restart) {
      boardRef.current.restart();
    }
  }, []);

  const handleMove = useCallback(() => {
    setMoves(prev => prev + 1);
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  return (
    <BaseScreen
      visible={visible}
      assetBundles={assetBundles}
      onShow={handleShow}
      onHide={handleHide}
    >
      <RippleButton
        visible={true}
        image='icon-pause'
        ripple='icon-pause-stroke'
        x={30}
        y={30}
      />

      {/* Game Board */}
      <Board
        ref={boardRef}
        x={screen.width * 0.5}
        y={screen.height * 0.5}
        onMove={handleMove}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={handleGameComplete}
        disabled={isGamePaused || isGameComplete}
      />

      {/* Game Footer */}
      <GameFooter
        ref={footerRef}
        x={screen.width * 0.5}
        y={screen.height - 50}
        onRestart={handleRestart}
      />

      {/* Game Complete Overlay */}
      {isGameComplete && (
        <GameComplete
          ref={gameCompleteRef}
          visible={isGameComplete}
          score={score}
          time={gameTime}
          moves={moves}
          onRestart={handleRestart}
          x={screen.width * 0.5}
          y={screen.height * 0.5}
        />
      )}

      {/* Game Pause Overlay */}
      {isGamePaused && (
        <GamePause
          ref={gamePauseRef}
          visible={isGamePaused}
          onResume={handleResume}
          onRestart={handleRestart}
          x={screen.width * 0.5}
          y={screen.height * 0.5}
        />
      )}
    </BaseScreen>
  );
};

export default GameScreen;
