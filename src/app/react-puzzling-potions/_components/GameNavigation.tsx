'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import LoadScreen from './screens/LoadScreen';
import { BaseScreenProps } from './screens/BaseScreen';

export interface GameNavigationProps {
  background: React.ReactNode;
}

const GameNavigation: React.FC<GameNavigationProps> = ({ background }) => {
  const [nextScreen, setNextScreen] = useState('load');
  const [currentScreen, setCurrentScreen] = useState('load');

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
    setTimeout(() => setNextScreen('game'), 3000);
  }, []);

  return (
    <pixiContainer>
      {background}
      {currentScreen === 'load' && (
        <LoadScreen visible={nextScreen === 'load'} {...screenProps} />
      )}
    </pixiContainer>
  );
};

export default GameNavigation;
