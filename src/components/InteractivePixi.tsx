'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { COLORS, MathUtils } from '@/utils/pixiUtils';

interface InteractivePixiProps {
  width?: number;
  height?: number;
}

const InteractivePixi: React.FC<InteractivePixiProps> = ({
  width = 800,
  height = 400,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [particleCount, setParticleCount] = useState(50);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // PixiJS 애플리케이션 생성
    const app = new PIXI.Application();
    appRef.current = app;

    // 파티클 배열
    const particles: Array<{
      sprite: PIXI.Graphics;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    // 애플리케이션 초기화
    app.init({ width, height, backgroundColor: 0x001122 }).then(() => {
      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      // 파티클 생성 함수
      const createParticle = (x: number, y: number) => {
        const graphics = new PIXI.Graphics();
        const size = MathUtils.randomRange(2, 8);
        const colors = [
          COLORS.PRIMARY,
          COLORS.SECONDARY,
          COLORS.ACCENT,
          COLORS.WARNING,
          COLORS.INFO,
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        graphics.circle(0, 0, size);
        graphics.fill(color);
        graphics.x = x;
        graphics.y = y;

        const particle = {
          sprite: graphics,
          vx: MathUtils.randomRange(-2, 2),
          vy: MathUtils.randomRange(-2, 2),
          life: 255,
          maxLife: 255,
        };

        particles.push(particle);
        app.stage.addChild(graphics);

        return particle;
      };

      // 초기 파티클 생성
      for (let i = 0; i < particleCount; i++) {
        createParticle(
          MathUtils.randomRange(0, width),
          MathUtils.randomRange(0, height)
        );
      }

      // 마우스/터치 이벤트 처리
      let isMouseDown = false;
      let mouseX = 0;
      let mouseY = 0;

      const handlePointerDown = (event: PIXI.FederatedPointerEvent) => {
        isMouseDown = true;
        mouseX = event.global.x;
        mouseY = event.global.y;
      };

      const handlePointerUp = () => {
        isMouseDown = false;
      };

      const handlePointerMove = (event: PIXI.FederatedPointerEvent) => {
        mouseX = event.global.x;
        mouseY = event.global.y;

        if (isMouseDown) {
          // 마우스 주변에 새 파티클 생성
          for (let i = 0; i < 3; i++) {
            createParticle(
              mouseX + MathUtils.randomRange(-20, 20),
              mouseY + MathUtils.randomRange(-20, 20)
            );
          }
        }
      };

      // 이벤트 리스너 등록
      app.stage.eventMode = 'static';
      app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);
      app.stage.on('pointerdown', handlePointerDown);
      app.stage.on('pointerup', handlePointerUp);
      app.stage.on('pointermove', handlePointerMove);

      // 애니메이션 루프
      let lastTime = Date.now();
      const animate = () => {
        if (!isPlaying) return;

        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // 파티클 업데이트
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];

          // 위치 업데이트
          particle.sprite.x += particle.vx;
          particle.sprite.y += particle.vy;

          // 화면 경계에서 튕기기
          if (particle.sprite.x <= 0 || particle.sprite.x >= width) {
            particle.vx *= -0.8;
            particle.sprite.x = MathUtils.clamp(particle.sprite.x, 0, width);
          }

          if (particle.sprite.y <= 0 || particle.sprite.y >= height) {
            particle.vy *= -0.8;
            particle.sprite.y = MathUtils.clamp(particle.sprite.y, 0, height);
          }

          // 생명 감소
          particle.life -= deltaTime * 0.1;
          particle.sprite.alpha = particle.life / particle.maxLife;

          // 죽은 파티클 제거
          if (particle.life <= 0) {
            app.stage.removeChild(particle.sprite);
            particles.splice(i, 1);
          }
        }

        // 파티클 수 유지
        while (particles.length < particleCount / 2) {
          createParticle(
            MathUtils.randomRange(0, width),
            MathUtils.randomRange(0, height)
          );
        }
      };

      app.ticker.add(animate);
    });

    // 정리 함수
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, [width, height, particleCount, isPlaying]);

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex gap-4 items-center'>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } transition-colors`}
        >
          {isPlaying ? '일시정지' : '재생'}
        </button>

        <div className='flex items-center gap-2'>
          <label htmlFor='particle-count' className='text-sm font-medium'>
            파티클 수:
          </label>
          <input
            id='particle-count'
            type='range'
            min='20'
            max='100'
            value={particleCount}
            onChange={e => setParticleCount(Number(e.target.value))}
            className='w-32'
          />
          <span className='text-sm text-gray-600 w-8'>{particleCount}</span>
        </div>
      </div>

      <div
        ref={canvasRef}
        className='border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer'
      />

      <p className='text-sm text-gray-600 max-w-md text-center'>
        마우스를 클릭하고 드래그하여 파티클을 생성해보세요. 파티클들은 화면
        경계에서 튕기며 시간이 지나면 사라집니다.
      </p>
    </div>
  );
};

export default InteractivePixi;
