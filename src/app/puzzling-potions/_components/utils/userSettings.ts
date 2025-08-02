import { PixiAppContext } from '../AppProvider';
import { Match3Mode, match3ValidModes } from '../match3/Match3Config';
import { setMasterVolume } from './audio';
import { storage } from './storage';

// Keys for saved items in storage
const KEY_VOLUME_MASTER = 'volume-master';
const KEY_VOLUME_BGM = 'volume-bgm';
const KEY_VOLUME_SFX = 'volume-sfx';
const KEY_GAME_MODE = 'game-mode';

/**
 * Persistent user settings of volumes and game mode.
 */
export class UserSettings {
  constructor(public context: PixiAppContext) {
    this.setMasterVolume(this.getMasterVolume());
    context.bgm?.setVolume(this.getBgmVolume());
    context.sfx?.setVolume(this.getSfxVolume());
  }

  /** Get current game mode */
  public getGameMode() {
    const mode = storage.getString(KEY_GAME_MODE) as Match3Mode;
    return match3ValidModes.includes(mode) ? mode : 'normal';
  }

  /** Set current game mode */
  public setGameMode(mode: Match3Mode) {
    if (!match3ValidModes.includes(mode)) {
      throw new Error('Invalid game mode: ' + mode);
    }
    return storage.setString(KEY_GAME_MODE, mode);
  }

  /** Get overall sound volume */
  public getMasterVolume() {
    return storage.getNumber(KEY_VOLUME_MASTER) ?? 0.5;
  }

  /** Set overall sound volume */
  public setMasterVolume(value: number) {
    setMasterVolume(value);
    storage.setNumber(KEY_VOLUME_MASTER, value);
  }

  /** Get background music volume */
  public getBgmVolume() {
    return storage.getNumber(KEY_VOLUME_BGM) ?? 1;
  }

  /** Set background music volume */
  public setBgmVolume(value: number) {
    this.context.bgm?.setVolume(value);
    storage.setNumber(KEY_VOLUME_BGM, value);
  }

  /** Get sound effects volume */
  public getSfxVolume() {
    return storage.getNumber(KEY_VOLUME_SFX) ?? 1;
  }

  /** Set sound effects volume */
  public setSfxVolume(value: number) {
    this.context.sfx?.setVolume(value);
    storage.setNumber(KEY_VOLUME_SFX, value);
  }
}
