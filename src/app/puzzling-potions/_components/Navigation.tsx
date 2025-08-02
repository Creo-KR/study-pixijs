import { useCallback, useEffect, useRef } from 'react';
import { GameScreen } from './screens/GameScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LoadScreen } from './screens/LoadScreen';
import { ResultScreen } from './screens/ResultScreen';
import { getUrlParam } from './utils/getUrlParams';
import useNavigation from './hooks/useNavigation';
import TiledBackground from './ui/backgrounds/TiledBackground';
import { usePixiApp } from './AppProvider';
import { Navigation as NavigationUtil } from './utils/navigation';
import { UserSettings } from './utils/userSettings';

export default function Navigation({
  children,
}: {
  children?: React.ReactNode;
}) {
  const context = usePixiApp();
  const navigation = useNavigation();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (context.navigation) return;

    context.navigation = new NavigationUtil(context);
    context.userSettings = new UserSettings(context);
    context.setContextValue({ ...context });
  }, [context.navigation]);

  const init = useCallback(async () => {
    if (!navigation?.showScreen) return;
    // Add a persisting background shared by all screens

    // Show initial loading screen
    await navigation.showScreen(LoadScreen);

    // Go to one of the screens if a shortcut is present in url params, otherwise go to home screen
    if (getUrlParam('game') !== null) {
      await navigation.showScreen(GameScreen);
    } else if (getUrlParam('load') !== null) {
      await navigation.showScreen(LoadScreen);
    } else if (getUrlParam('result') !== null) {
      await navigation.showScreen(ResultScreen);
    } else {
      await navigation.showScreen(HomeScreen);
    }
  }, [navigation]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!canvasContainerRef.current) {
      return;
    }
    canvasContainerRef.current?.appendChild(context.app.canvas);
  }, [canvasContainerRef.current]);

  return (
    <div ref={canvasContainerRef}>
      <TiledBackground />
      {children}
    </div>
  );
}
