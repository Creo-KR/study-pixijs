'use client';

import { useAppContext } from '../_components/AppProvider';

export default function useScreen() {
  const { screen } = useAppContext();
  return screen;
}
