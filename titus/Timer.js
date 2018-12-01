/**
 * Run a callback each update while the timer is counting down.
 */
class Timer {
  constructor (duration = 1.0, onTick, onDone, delay = 0) {
    this.elapsed = 0
    this.duration = duration
    this.onTick = onTick
    this.onDone = onDone
    this.delay = delay
    this.dead = false
    this.visible = false
  }

  /**
   * The function run on game update.
   * @param {number} dt The amount of time between the previous update and now.
   */
  update (dt) {
    const { duration, onTick, onDone, delay } = this

    if (delay > 0) {
      this.delay -= dt
      return
    }

    this.elapsed += dt
    const ratio = this.elapsed / duration

    if (ratio > 1) {
      onDone && onDone()
      this.dead = true
    } else {
      onTick && onTick(ratio)
    }
  }

  /**
   * Stop the timer prematurely.
   */
  kill () {
    this.dead = true
  }
}

export default Timer