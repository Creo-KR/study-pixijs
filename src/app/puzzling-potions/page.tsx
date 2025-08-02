'use client';

import { useEffect, useState } from 'react';
import { AppProvider } from './_components/AppProvider';
import PuzzlingPotionsGame from './_components/PuzzlingPotionsGame';

export default function PuzzlingPotionsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true after the component mounts
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }
  return (
    <div className='min-h-screen'>
      {isClient && (
        <AppProvider>
          <PuzzlingPotionsGame />
        </AppProvider>
      )}
    </div>
  );
}
