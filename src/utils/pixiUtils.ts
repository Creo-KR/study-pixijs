import * as PIXI from 'pixi.js';

/**
 * PixiJS 애플리케이션을 위한 기본 설정
 */
export const PIXI_CONFIG = {
  backgroundColor: 0x1099bb,
  antialias: true,
  resolution: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  autoDensity: true,
} as const;

/**
 * 공통으로 사용할 색상 팔레트
 */
export const COLORS = {
  PRIMARY: 0x3498db,
  SECONDARY: 0x2ecc71,
  ACCENT: 0xe74c3c,
  WARNING: 0xf39c12,
  INFO: 0x9b59b6,
  DARK: 0x2c3e50,
  LIGHT: 0xecf0f1,
} as const;

/**
 * 간단한 텍스처 생성 유틸리티
 */
export class TextureUtils {
  /**
   * 단색 원형 텍스처 생성
   */
  static createCircle(
    radius: number,
    color: number = COLORS.PRIMARY
  ): PIXI.Texture {
    const graphics = new PIXI.Graphics();
    graphics.circle(radius, radius, radius);
    graphics.fill(color);

    // PixiJS v8에서는 RenderTexture를 사용
    const app = new PIXI.Application();
    const renderTexture = PIXI.RenderTexture.create({
      width: radius * 2,
      height: radius * 2,
    });

    return renderTexture;
  }

  /**
   * 단색 사각형 텍스처 생성
   */
  static createRectangle(
    width: number,
    height: number,
    color: number = COLORS.PRIMARY
  ): PIXI.Texture {
    const graphics = new PIXI.Graphics();
    graphics.rect(0, 0, width, height);
    graphics.fill(color);

    // PixiJS v8에서는 RenderTexture를 사용
    const renderTexture = PIXI.RenderTexture.create({ width, height });

    return renderTexture;
  }

  /**
   * 그라디언트 사각형 텍스처 생성
   */
  static createGradientRectangle(
    width: number,
    height: number,
    colorStops: Array<{ offset: number; color: number }>
  ): PIXI.Texture {
    // Canvas를 사용하여 그라디언트 생성
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    colorStops.forEach(({ offset, color }) => {
      gradient.addColorStop(offset, `#${color.toString(16).padStart(6, '0')}`);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    return PIXI.Texture.from(canvas);
  }
}

/**
 * 애니메이션 유틸리티
 */
export class AnimationUtils {
  /**
   * 이징 함수들
   */
  static easing = {
    easeInOut: (t: number): number =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeIn: (t: number): number => t * t,
    easeOut: (t: number): number => t * (2 - t),
    bounce: (t: number): number => {
      if ((t *= 2) < 1) return 0.5 * t * t;
      return 0.5 * (--t * (t - 2) - 1);
    },
  };

  /**
   * 스프라이트를 특정 위치로 애니메이션
   */
  static animateTo(
    sprite: PIXI.Container,
    targetX: number,
    targetY: number,
    duration: number = 1000,
    easing: (t: number) => number = AnimationUtils.easing.easeInOut
  ): Promise<void> {
    return new Promise(resolve => {
      const startX = sprite.x;
      const startY = sprite.y;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        sprite.x = startX + (targetX - startX) * easedProgress;
        sprite.y = startY + (targetY - startY) * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  /**
   * 스프라이트 스케일 애니메이션
   */
  static animateScale(
    sprite: PIXI.Container,
    targetScale: number,
    duration: number = 500,
    easing: (t: number) => number = AnimationUtils.easing.easeInOut
  ): Promise<void> {
    return new Promise(resolve => {
      const startScale = sprite.scale.x;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        const currentScale =
          startScale + (targetScale - startScale) * easedProgress;
        sprite.scale.set(currentScale);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }
}

/**
 * 수학 유틸리티
 */
export class MathUtils {
  /**
   * 두 점 사이의 거리 계산
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 각도를 라디안으로 변환
   */
  static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * 라디안을 각도로 변환
   */
  static radToDeg(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * 값을 특정 범위로 제한
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 선형 보간
   */
  static lerp(start: number, end: number, amount: number): number {
    return start + (end - start) * amount;
  }

  /**
   * 랜덤 범위 내의 값 생성
   */
  static randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
