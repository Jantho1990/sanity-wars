/**
 * An individual animation created by the AnimManager.
 *
 * @param {array} frames A list of frame coordinates.
 * @param {number} rate The rate to play the animation, in seconds.
 *
 * @return {self}
 */
class Anim {
  constructor(frames, rate) {
    this.frames = frames
    this.rate = rate
    this.timesToPlay = Infinity
    this.reset()
  }

  /**
   * Restores the default animation settings.
   *
   * @return {void}
   */
  reset() {
    this.frame = this.frames[0]
    this.curFrame = 0
    this.curTime = 0
    this.timesPlayed = 0
  }

  /**
   * Game loop update method.
   *
   * @param {number} dt The change in time from the last update.
   *
   * @return {void}
   */
  update(dt) {
    const { rate, frames } = this
    if ((this.curTime += dt) > rate) {
      this.curFrame++
      this.frame = frames[this.curFrame % frames.length]
      this.curTime -= rate

      if (this.timesToPlay !== Infinity && this.currentFrame === 0) {
        this.timesPlayed++
      }
    }
  }

  /**
   * Get the current frame of this animation.
   *
   * @return {void}
   */
  get currentFrame() {
    return this.curFrame % this.frames.length
  }
}

/**
 * Handles a list of animations.
 *
 * @param {object} e An object, usually an entity.
 *
 * @return self
 */
class AnimManager {
  constructor (e = { x: 0, y: 0}) {
    this.anims = {}
    this.running = false
    this.frameSource = e.frame || e
    this.current = null
  }

  /**
   * Add an animation to the manager.
   *
   * @param {string} name 
   * @param {array} frames The frame coordinates.
   * @param {number} speed How fast to play the animation, in seconds.
   *
   * @return {string}
   */
  add (name, frames, speed) {
    this.anims[name] = new Anim(frames, speed)
    return this.anims[name]
  }

  /**
   * Add multiple animations.
   *
   * @param {array} anims An array of animations.
   *
   * @return {void}
   */
  addBulk (anims) {
    anims.forEach(anim => this.add(...anim))
  }

  /**
   * Game loop update function.
   *
   * @param {number} dt The change in time from the last update.
   *
   * @return {void}
   */
  update (dt) {
    const { current, anims, frameSource } = this
    if (!current) return
    const anim = anims[current]
    anim.update(dt)

    // Sync the TileSprite frame
    frameSource.x = anim.frame.x
    frameSource.y = anim.frame.y

    // Render extra data for FrameSprites
    if (anim.frame.w) {
      frameSource.w = anim.frame.w
      frameSource.h = anim.frame.h
    }

    // Stop the animation if times played is up
    if (anim.currentFrame === 0 && anim.timesPlayed >= anim.timesToPlay) {
      this.stop()
    }
  }

  /**
   * Play a stored animation.
   * 
   * @param {string} anim The name of the animation to play. 
   * @param {number} timesToPlay How many times to play the animation. Unlimited by default.
   *
   * @return {void}
   */
  play (anim, timesToPlay) {
    const { current, anims } = this
    if (anim === current) return
    this.current = anim
    anims[anim].reset()
    if (timesToPlay) {
      anims[anim].timesToPlay = timesToPlay
    }
  }

  /**
   * Stop the current animation.
   *
   * @return {void}
   */
  stop () {
    this.current = null
  }

  /**
   * Get the current frame of the current animation.
   *
   * @return {number}
   */
  getCurrentFrame () {
    return this.anims[this.current].currentFrame
  }
}

export default AnimManager