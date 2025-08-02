import React from 'react';
import { useAppContext } from './AppProvider';

export interface GameNavigationProps {
  background: React.ReactNode;
}

const GameNavigation: React.FC<GameNavigationProps> = ({ background }) => {
  const { app } = useAppContext();

  return (
    <pixiContainer width={app.screen.width} height={app.screen.height}>
      {background}
    </pixiContainer>
  );
};

export default GameNavigation;
