'use client';

import Link from 'next/link';
import PuzzleGame from '@/app/puzzling-potions/PuzzleGame';

export default function PuzzlePotionsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      {/* 뒤로가기 버튼 */}
      <div className='absolute top-6 left-6 z-20'>
        <Link
          href='/'
          className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 border border-white/20'
        >
          <span className='text-xl'>←</span>
          <span className='font-medium'>홈으로</span>
        </Link>
      </div>

      {/* 마법사 테마 배경 */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-xl animate-pulse'></div>
        <div className='absolute top-40 right-20 w-24 h-24 bg-purple-300 rounded-full blur-lg animate-pulse delay-1000'></div>
        <div className='absolute bottom-20 left-1/4 w-28 h-28 bg-blue-300 rounded-full blur-xl animate-pulse delay-2000'></div>
        <div className='absolute bottom-40 right-1/3 w-20 h-20 bg-green-300 rounded-full blur-lg animate-pulse delay-3000'></div>
      </div>

      <div className='relative z-10 container mx-auto px-8 py-12'>
        {/* 헤더 */}
        <header className='text-center mb-12'>
          <div className='mb-6'>
            <h1 className='text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-4'>
              🧪 Puzzling Potions 🧪
            </h1>
            <div className='w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full'></div>
          </div>

          <p className='text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed'>
            마법사의 연금술 실험실에 오신 것을 환영합니다!
            <br />
            흩어진 포션 레시피 조각들을 올바른 위치에 배치하여
            <br />
            신비로운 마법의 포션을 완성해보세요! ✨
          </p>
        </header>

        {/* 게임 영역 */}
        <main className='flex justify-center mb-12'>
          <div className='bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl'>
            <PuzzleGame width={900} height={600} gridSize={3} />
          </div>
        </main>

        {/* 게임 설명 */}
        <section className='max-w-4xl mx-auto'>
          <div className='grid md:grid-cols-2 gap-8 mb-12'>
            {/* 게임 방법 */}
            <div className='bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30'>
              <h3 className='text-2xl font-bold text-purple-300 mb-4 flex items-center'>
                🎮 게임 방법
              </h3>
              <ul className='text-purple-100 space-y-3'>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>1.</span>
                  포션 조각을 클릭하고 드래그하세요
                </li>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>2.</span>
                  오른쪽 정답 영역에 조각을 배치하세요
                </li>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>3.</span>
                  올바른 위치에 가까워지면 자동으로 스냅됩니다
                </li>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>4.</span>
                  모든 조각을 완성하여 마법 포션을 완성하세요!
                </li>
              </ul>
            </div>

            {/* 마법사의 팁 */}
            <div className='bg-gradient-to-br from-green-800/50 to-teal-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-400/30'>
              <h3 className='text-2xl font-bold text-green-300 mb-4 flex items-center'>
                🧙‍♂️ 마법사의 팁
              </h3>
              <ul className='text-green-100 space-y-3'>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>✨</span>
                  숫자를 확인하여 올바른 순서를 찾으세요
                </li>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>🔮</span>
                  색상 패턴을 관찰하여 힌트를 얻으세요
                </li>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>⚡</span>
                  완성된 조각은 마법의 빛으로 반짝입니다
                </li>
                <li className='flex items-start'>
                  <span className='text-yellow-400 mr-2'>🏆</span>
                  적은 이동 횟수로 완성하여 마스터가 되어보세요!
                </li>
              </ul>
            </div>
          </div>

          {/* 마법 포션 정보 */}
          <div className='bg-gradient-to-r from-yellow-800/30 to-orange-800/30 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/30 text-center'>
            <h3 className='text-3xl font-bold text-yellow-300 mb-4'>
              🍶 신비로운 포션의 효과 🍶
            </h3>
            <div className='grid md:grid-cols-3 gap-6 text-yellow-100'>
              <div>
                <div className='text-2xl mb-2'>💪</div>
                <h4 className='font-bold text-lg mb-2'>힘의 포션</h4>
                <p className='text-sm'>
                  퍼즐 해결 능력을 향상시켜 더 빠르게 문제를 해결할 수 있게
                  해줍니다
                </p>
              </div>
              <div>
                <div className='text-2xl mb-2'>🧠</div>
                <h4 className='font-bold text-lg mb-2'>지혜의 포션</h4>
                <p className='text-sm'>
                  패턴 인식 능력을 강화하여 복잡한 퍼즐도 쉽게 풀 수 있게
                  해줍니다
                </p>
              </div>
              <div>
                <div className='text-2xl mb-2'>⚡</div>
                <h4 className='font-bold text-lg mb-2'>속도의 포션</h4>
                <p className='text-sm'>
                  반응 속도를 향상시켜 더욱 빠른 게임 플레이가 가능해집니다
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className='text-center mt-16 text-purple-300/80'>
          <p className='text-lg mb-2'>
            🌟 마법사의 연금술 실험실에서 제작됨 🌟
          </p>
          <p className='text-sm'>
            Built with Next.js, TypeScript, Tailwind CSS, and PixiJS
          </p>
          <div className='mt-4 flex justify-center space-x-4 text-2xl'>
            <span className='animate-bounce'>⭐</span>
            <span className='animate-bounce delay-100'>🔮</span>
            <span className='animate-bounce delay-200'>✨</span>
            <span className='animate-bounce delay-300'>🧪</span>
            <span className='animate-bounce delay-400'>⭐</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
