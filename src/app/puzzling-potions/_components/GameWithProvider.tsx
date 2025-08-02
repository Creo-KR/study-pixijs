'use client';

import { AppProvider } from './AppProvider';
import PuzzlingPotionsGame from './PuzzlingPotionsGame';

const GameWithProvider: React.FC = () => {
  return (
    <AppProvider>
      <PuzzlingPotionsGame />
    </AppProvider>
  );
};

export default GameWithProvider;
