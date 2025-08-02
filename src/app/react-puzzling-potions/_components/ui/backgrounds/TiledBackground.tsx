import { extend } from '@pixi/react';
import { Container, PointData, TilingSprite } from 'pixi.js';
import React, { useCallback, useState } from 'react';
import { useAppContext } from '../../AppProvider';
import useTexture from '@/app/react-puzzling-potions/_hooks/useTexture';

extend({ Container, TilingSprite });

const direction = -Math.PI * 0.15;

const TiledBackground: React.FC = () => {
  const { app } = useAppContext();
  const texture = useTexture({
    bundle: 'preload',
    id: 'background',
  });
  const [tilePosition, setTilePosition] = useState<PointData>({
    x: 0,
    y: 0,
  });

  const handleRender = useCallback(() => {
    const delta = app.ticker.deltaTime;

    setTilePosition(prev => ({
      x: prev.x - Math.sin(-direction) * delta,
      y: prev.y - Math.cos(-direction) * delta,
    }));
  }, [app]);

  // Don't render until texture is loaded
  if (!texture) {
    return null;
  }

  return (
    <pixiContainer onRender={handleRender}>
      <pixiTilingSprite
        texture={texture}
        width={app.screen.width}
        height={app.screen.height}
        tileRotation={direction}
        tilePosition={tilePosition}
      />
    </pixiContainer>
  );
};

export default TiledBackground;
