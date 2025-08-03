'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import LoadScreen from './screens/LoadScreen';
import GameScreen from './screens/GameScreen';
import { BaseScreenProps } from './screens/BaseScreen';
import HomeScreen from './screens/HomeScreen';

export interface GameNavigationProps {
  background: React.ReactNode;
}

const defaultScreen = 'home';

const GameNavigation: React.FC<GameNavigationProps> = ({ background }) => {
  const [nextScreen, setNextScreen] = useState(defaultScreen);
  const [currentScreen, setCurrentScreen] = useState(defaultScreen);

  const handleHide = useCallback(() => {
    setCurrentScreen(nextScreen);
  }, [nextScreen]);

  const screenProps = useMemo<BaseScreenProps>(
    () => ({
      onHide: handleHide,
    }),
    [handleHide]
  );

  useEffect(() => {
    // setTimeout(() => setNextScreen('home'), 3000);
  }, []);

  return (
    <pixiContainer>
      {background}
      {currentScreen === 'load' && (
        <LoadScreen visible={nextScreen === 'load'} {...screenProps} />
      )}
      {currentScreen === 'home' && (
        <HomeScreen visible={nextScreen === 'home'} {...screenProps} />
      )}
      {currentScreen === 'game' && (
        <GameScreen visible={nextScreen === 'game'} {...screenProps} />
      )}
    </pixiContainer>
  );
};

export default GameNavigation;
