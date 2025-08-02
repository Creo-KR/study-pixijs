'use client';

import { usePixiApp } from '../AppProvider';
import { Navigation } from '../utils/navigation';

export default function useNavigation(): Navigation | null {
  const { navigation } = usePixiApp();

  return navigation;
}
