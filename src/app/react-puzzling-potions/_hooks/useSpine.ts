'use client';

import { useMemo } from 'react';
import { Spine, SpineFromOptions } from '@pixi/spine-pixi';

export default function useSpine(options: SpineFromOptions) {
  return useMemo(() => Spine.from(options), [options]);
}
