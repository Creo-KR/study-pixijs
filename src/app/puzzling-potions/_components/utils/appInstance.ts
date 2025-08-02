import { Application } from 'pixi.js';

/** The PixiJS app Application instance, shared across the project */
let app: Application | null = null;

export const getApp = (): Application | null => app;

export const setApp = (newApp: Application | null): void => {
  app = newApp;
};

export { app };
