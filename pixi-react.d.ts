import { PixiReactElementProps } from '@pixi/react';
import type { Spine } from '@pixi/spine-pixi';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      pixiSpine: PixiReactElementProps<typeof Spine>;
    }
  }
}

export {};
