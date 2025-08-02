import { Sprite, Texture } from 'pixi.js';
import gsap from 'gsap';
import { PixiAppContext } from '../AppProvider';

/**
 * Cover or reveal the entire app, masking the whole screen in a cauldron shape,
 * scaling up (reveal) or down (cover) animated
 */
export class MaskTransition {
  /** Flat colour base to cover the screen */
  private base: Sprite;
  /** A static cauldron sprite used as mask */
  private cauldron: Sprite;

  constructor(public context: PixiAppContext) {
    this.base = new Sprite(Texture.WHITE);
    this.base.tint = 0x0a0025;

    this.cauldron = Sprite.from('white-cauldron');
    this.cauldron.anchor.set(0.5);
  }

  /** Resize the base to the app size and center the cauldron */
  private resize() {
    this.base.width = this.context.navigation?.width ?? 0;
    this.base.height = this.context.navigation?.height ?? 0;
    this.cauldron.x = (this.context.navigation?.width ?? 0) * 0.5;
    this.cauldron.y = (this.context.navigation?.height ?? 0) * 0.5;
  }

  /** Mask the app in cauldron shape that scales down, hiding the entire screen */
  public async playTransitionOut() {
    if (!this.context.navigation) return;

    const duration = 0.7;

    this.resize();
    this.cauldron.scale.set(20);
    this.cauldron.rotation = 0.5;
    this.cauldron.alpha = 1;

    // Update layers
    this.context.app.stage.addChildAt(this.base, 0);
    this.context.app.stage.addChildAt(this.cauldron, 0);
    // TODO: Double check this
    // this.cauldron.updateTransform();

    // Play animation
    this.context.navigation.container.mask = this.cauldron;
    this.context.navigation.container.interactiveChildren = false;
    gsap.to(this.cauldron, {
      alpha: 0.5,
      rotation: -0.5,
      duration,
      ease: 'sine.out',
    });
    await gsap.to(this.cauldron.scale, {
      x: 0,
      y: 0,
      duration,
      ease: 'quint.out',
    });
    this.context.navigation.container.interactiveChildren = true;
    this.context.navigation.container.mask = null;

    // Cleanup
    this.context.app.stage.removeChild(this.base);
    this.context.app.stage.removeChild(this.cauldron);
  }

  /** Mask the app in cauldron shape that scales up, showin the entire screen */
  public async playTransitionIn() {
    if (!this.context.navigation) return;

    const duration = 0.7;

    this.resize();
    this.cauldron.scale.set(0);
    this.cauldron.rotation = -0.5;
    this.cauldron.alpha = 0.5;

    // Update layers
    this.context.app.stage.addChildAt(this.base, 0);
    this.context.app.stage.addChildAt(this.cauldron, 0);
    // TODO: Double check this
    // this.cauldron.updateTransform();

    // Play animation
    this.context.navigation.container.mask = this.cauldron;
    this.context.navigation.container.interactiveChildren = false;
    gsap.to(this.cauldron, {
      alpha: 1,
      rotation: 0.5,
      duration,
      ease: 'sine.in',
    });
    await gsap.to(this.cauldron.scale, {
      x: 30,
      y: 30,
      duration,
      ease: 'quint.in',
    });
    this.context.navigation.container.interactiveChildren = true;
    this.context.navigation.container.mask = null;

    // Cleanup
    this.context.app.stage.removeChild(this.base);
    this.context.app.stage.removeChild(this.cauldron);
  }
}
