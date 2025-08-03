'use client';

import React from 'react';
import LoadScreen from './screens/LoadScreen';

export interface GameNavigationProps {
  background: React.ReactNode;
}

const GameNavigation: React.FC<GameNavigationProps> = ({ background }) => {
  return (
    <pixiContainer>
      {background}
      <LoadScreen />
    </pixiContainer>
  );
};

export default GameNavigation;
