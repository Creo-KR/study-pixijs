'use client';

import { extend } from '@pixi/react';
import { Container, Sprite, Text, TilingSprite } from 'pixi.js';
import { Spine } from '@pixi/spine-pixi';

// Extend all PIXI components globally for React
extend({
  Container,
  Sprite,
  Text,
  TilingSprite,
  Spine,
});

// Export types for use in other files
export type { Container, Sprite, Text, TilingSprite, Spine };
