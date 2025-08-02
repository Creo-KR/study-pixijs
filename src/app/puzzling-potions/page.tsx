'use client';

import dynamic from 'next/dynamic';

// 전체 게임 컴포넌트를 SSR 없이 로드
const PuzzlingPotionsGameWithProvider = dynamic(
  () => import('./_components/GameWithProvider'),
  {
    ssr: false,
    loading: () => (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4'></div>
          <p className='text-lg text-gray-600'>Loading Puzzling Potions...</p>
        </div>
      </div>
    ),
  }
);

export default function PuzzlingPotionsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      <PuzzlingPotionsGameWithProvider />
    </div>
  );
}
