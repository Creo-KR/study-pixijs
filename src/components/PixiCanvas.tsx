'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface PixiCanvasProps {
  width?: number;
  height?: number;
}

const PixiCanvas: React.FC<PixiCanvasProps> = ({
  width = 800,
  height = 600,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // PixiJS 애플리케이션 생성
    const app = new PIXI.Application();
    appRef.current = app;

    // 애플리케이션 초기화
    app.init({ width, height }).then(() => {
      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      // 간단한 그래픽 예제
      const graphics = new PIXI.Graphics();

      // 파란색 원 그리기
      graphics.circle(100, 100, 50);
      graphics.fill(0x3498db);

      // 빨간색 사각형 그리기
      graphics.rect(200, 50, 100, 100);
      graphics.fill(0xe74c3c);

      // 초록색 삼각형 그리기
      graphics.moveTo(400, 50);
      graphics.lineTo(350, 150);
      graphics.lineTo(450, 150);
      graphics.closePath();
      graphics.fill(0x2ecc71);

      app.stage.addChild(graphics);

      // 회전하는 스프라이트 추가 (텍스처 없이 그래픽으로)
      const spinner = new PIXI.Graphics();
      spinner.rect(-25, -25, 50, 50);
      spinner.fill(0x9b59b6);
      spinner.x = width / 2;
      spinner.y = height / 2;

      app.stage.addChild(spinner);

      // 애니메이션 루프
      app.ticker.add(() => {
        spinner.rotation += 0.01;
      });
    });

    // 정리 함수
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, [width, height]);

  return (
    <div className='flex flex-col items-center gap-4'>
      <h2 className='text-2xl font-bold text-gray-800'>PixiJS Canvas</h2>
      <div
        ref={canvasRef}
        className='border-2 border-gray-300 rounded-lg shadow-lg'
      />
      <p className='text-sm text-gray-600 max-w-md text-center'>
        이 캔버스는 PixiJS로 렌더링됩니다. 파란색 원, 빨간색 사각형, 초록색
        삼각형, 그리고 회전하는 보라색 사각형을 볼 수 있습니다.
      </p>
    </div>
  );
};

export default PixiCanvas;
