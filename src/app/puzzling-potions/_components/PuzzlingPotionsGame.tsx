'use client';

import '@pixi/spine-pixi';
import useAppEvent from './hooks/useAppEvent';
import Navigation from './Navigation';
const PuzzlingPotionsGame: React.FC = () => {
  useAppEvent();

  return (
    <div className='puzzling-potions-game'>
      <Navigation></Navigation>
    </div>
  );
};

export default PuzzlingPotionsGame;
