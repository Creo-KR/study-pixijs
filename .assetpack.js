import { pixiPipes } from '@assetpack/core/pixi';

export default {
  entry: './raw-assets',
  output: './public/puzzling-potions/assets/',
  cache: true,
  pipes: [
    ...pixiPipes({
      texturePacker: {
        texturePacker: {
          removeFileExtension: true,
        },
      },
      manifest: {
        output: './public/puzzling-potions/assets/assets-manifest.json',
      },
    }),
  ],
};
