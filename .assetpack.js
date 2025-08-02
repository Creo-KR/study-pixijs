/* eslint-disable import/no-anonymous-default-export */
import { pixiPipes } from '@assetpack/core/pixi';

export default {
  entry: './raw-assets',
  output: './public/react-puzzling-potions/assets/',
  cache: true,
  pipes: [
    ...pixiPipes({
      texturePacker: {
        texturePacker: {
          removeFileExtension: true,
        },
      },
      manifest: {
        output: './public/react-puzzling-potions/assets/assets-manifest.json',
      },
    }),
  ],
};
