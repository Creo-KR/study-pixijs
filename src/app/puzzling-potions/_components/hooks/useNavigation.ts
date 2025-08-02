'use client';

import { usePixiApp } from '../AppProvider';
import { Navigation } from '../utils/navigation';

export default function useNavigation(): Navigation {
  const { app, navigation } = usePixiApp();

  return {
    ...navigation,
    width: app?.screen.width || 0,
    height: app?.screen.height || 0,
  } as Navigation;
}
