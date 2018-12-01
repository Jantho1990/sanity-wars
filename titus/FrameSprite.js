import Sprite from './Sprite'
import AnimManager from './AnimManager';

/**
 * Renders a sprite specifically designed to render animations
 * with precise coordinate frame positioning.
 *
 * @return self
 */
class FrameSprite extends Sprite {
  constructor(texture, frames) {
    super(texture)
    this.frames = frames
    this.frame = Object.assign({}, frames[0])
    this.anims = new AnimManager(this)
  }

  /**
   * Game loop update.
   *
   * @param {number} dt Total time changed from last update until now.
   *
   * @return void
   */
  update(dt) {
    this.anims.update(dt)
  }

  /**
   * Return the width of the current frame.
   *
   * @return {number}
   */
  get w() {
    return this.frame.w * Math.abs(this.scale.x)
  }

  /**
   * Return the height of the current frame.
   *
   * @return {number}
   */
  get h() {
    return this.frame.h * Math.abs(this.scale.y)
  }
}

export default FrameSprite