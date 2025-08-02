'use client';

import React from 'react';
import { useAppContext } from './AppProvider';
import LoadScreen from './screens/LoadScreen';

export interface GameNavigationProps {
  background: React.ReactNode;
}

const GameNavigation: React.FC<GameNavigationProps> = ({ background }) => {
  const { app } = useAppContext();

  return (
    <pixiContainer width={app.screen.width} height={app.screen.height}>
      {background}
      <LoadScreen />
    </pixiContainer>
  );
};

export default GameNavigation;
