'use client';

import { extend } from '@pixi/react';
import { Container, Sprite, Text, TilingSprite } from 'pixi.js';
import { Spine } from '@pixi/spine-pixi';
import { FancyButton } from '@pixi/ui';

// Extend all PIXI components globally for React
extend({
  Container,
  Sprite,
  Text,
  TilingSprite,
  Spine,
  FancyButton,
});

// Export types for use in other files
export type { Container, Sprite, Text, TilingSprite, Spine, FancyButton };
