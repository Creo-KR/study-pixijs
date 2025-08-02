'use client';

import PuzzlingPotionsGame from './_components/PuzzlingPotionsGame';

export default function PuzzlingPotionsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      <PuzzlingPotionsGame showControls={true} />
    </div>
  );
}
