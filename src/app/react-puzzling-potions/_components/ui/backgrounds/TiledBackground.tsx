import { extend } from '@pixi/react';
import { Container, Texture, TilingSprite } from 'pixi.js';
import React, { useState } from 'react';
import { useAppContext } from '../../AppProvider';

extend({ Container, TilingSprite });

const TiledBackground: React.FC = () => {
  const [texture] = useState(Texture.from('background'));
  const { app } = useAppContext();

  return (
    <pixiContainer width={app.screen.width} height={app.screen.height}>
      <pixiTilingSprite
        texture={texture}
        width={app.screen.width}
        height={app.screen.height}
      />
    </pixiContainer>
  );
};

export default TiledBackground;
