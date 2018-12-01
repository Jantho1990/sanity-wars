import physics from '../../../titus/utils/physics'
import { JUMP_IMPULSE, GRAVITY } from '../../constants'
import Sound from '../../../titus/sound/Sound'

const sound = new Sound('resources/sounds/levitate.wav', {
  loop: true
})

class LevitateBuff {
  constructor (target, config) {
    const {
      duration
    } = config

    this.target = target
    this.duration = duration || 3
    this.remaining = duration || 3
  }

  update (dt, t) {
    if ((this.remaining -= dt) >= 0) {
      if (!sound.playing) {
        sound.play()
      }
      const vel = GRAVITY + this.target.vel.y
      physics.applyForce(this.target, {
        x: 0,
        y: -vel
      }, dt)
    } else {
      // this.remaining = this.duration
      sound.stop()
      this.dead = true
    }
  }
}

export default LevitateBuff