import { useCallback, useEffect, useRef, useState } from 'react';
import useNavigation from '../../hooks/useNavigation';
import { Container, Texture, TilingSprite } from 'pixi.js';

export default function TiledBackground() {
  const [direction, setDirection] = useState<number>(-Math.PI * 0.15);
  const [sprite, setSprite] = useState<TilingSprite>();

  const container = useRef<Container>(new Container());

  const navigation = useNavigation();

  const init = useCallback(() => {
    const newSprite = new TilingSprite({
      texture: Texture.from('background'),
      width: navigation.width,
      height: navigation.height,
    });
    newSprite.tileTransform.rotation = direction;
    setSprite(newSprite);
  }, [direction, navigation.width, navigation.height]);

  useEffect(() => {
    if (!sprite) return;

    container.current.addChild(sprite);
  }, [sprite]);

  useEffect(() => {
    init();
  }, []);

  return <></>;
}
