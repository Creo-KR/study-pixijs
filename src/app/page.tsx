import Link from 'next/link';
import PixiCanvas from '@/components/PixiCanvas';
import InteractivePixi from '@/components/InteractivePixi';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8'>
      <div className='container mx-auto max-w-6xl'>
        <header className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            PixiJS + Next.js Study Project
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto mb-8'>
            WebGL 기반 2D 렌더링 라이브러리 PixiJS를 학습하는 프로젝트입니다.
            고성능 그래픽과 인터랙티브 애니메이션을 구현할 수 있습니다.
          </p>

          {/* 네비게이션 버튼 */}
          <div className='flex justify-center gap-4 mb-8'>
            <Link
              href='/puzzling-potions'
              className='px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg'
            >
              🧪 Puzzling Potions 플레이
            </Link>
            <button className='px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-all duration-300'>
              📚 튜토리얼 보기
            </button>
          </div>
        </header>

        <main className='space-y-16'>
          {/* 기본 PixiJS 예제 */}
          <section className='text-center'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              기본 그래픽 예제
            </h2>
            <PixiCanvas width={800} height={300} />
          </section>

          {/* 인터랙티브 파티클 시스템 */}
          <section className='text-center'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              인터랙티브 파티클 시스템
            </h2>
            <InteractivePixi width={800} height={400} />
          </section>

          {/* 기능 설명 */}
          <section className='grid md:grid-cols-3 gap-8 mt-16'>
            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500'>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                🧩 퍼즐 게임
              </h3>
              <ul className='text-gray-600 space-y-2'>
                <li>• 드래그 앤 드롭 인터페이스</li>
                <li>• 스냅 기능으로 정확한 배치</li>
                <li>• 실시간 진행 상황 추적</li>
                <li>• 이동 횟수 카운터</li>
              </ul>
              <div className='mt-4'>
                <Link
                  href='/puzzle-potions'
                  className='inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-sm font-medium'
                >
                  전체 버전 플레이 →
                </Link>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500'>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                🎨 기본 그래픽
              </h3>
              <ul className='text-gray-600 space-y-2'>
                <li>• Graphics API를 사용한 기본 도형 그리기</li>
                <li>• 원, 사각형, 삼각형 렌더링</li>
                <li>• 회전 애니메이션 구현</li>
                <li>• TypeScript와의 완벽한 통합</li>
              </ul>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500'>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                ⚡ 파티클 시스템
              </h3>
              <ul className='text-gray-600 space-y-2'>
                <li>• 실시간 마우스/터치 인터랙션</li>
                <li>• 물리 시뮬레이션 (충돌, 반사)</li>
                <li>• 파티클 생성 및 생명 주기 관리</li>
                <li>• 동적 파라미터 조정 가능</li>
              </ul>
            </div>
          </section>
        </main>

        <footer className='text-center mt-16 text-gray-500'>
          <p>Built with Next.js, TypeScript, Tailwind CSS, and PixiJS v8</p>
          <p className='text-sm mt-2'>
            고성능 웹 그래픽을 위한 완벽한 개발 스택
          </p>
        </footer>
      </div>
    </div>
  );
}
