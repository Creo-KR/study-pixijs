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
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            WebGL 기반 2D 렌더링 라이브러리 PixiJS를 학습하는 프로젝트입니다.
            고성능 그래픽과 인터랙티브 애니메이션을 구현할 수 있습니다.
          </p>
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
          <section className='grid md:grid-cols-2 gap-8 mt-16'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
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

            <div className='bg-white p-6 rounded-lg shadow-md'>
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
