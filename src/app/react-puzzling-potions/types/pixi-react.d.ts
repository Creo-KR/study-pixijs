'use client';
// Global type declarations for PIXI React components

import type { SpineOptions } from '@pixi/spine-pixi';
import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pixiSpine: React.FC<SpineOptions, HTMLElement>;
    }
  }
}
