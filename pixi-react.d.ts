import { PixiReactElementProps } from '@pixi/react';
import type { Spine } from '@pixi/spine-pixi';
import { FancyButton } from '@pixi/ui';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      pixiSpine: PixiReactElementProps<typeof Spine>;
      pixiFancyButton: PixiReactElementProps<typeof FancyButton>;
    }
  }
}

export {};
