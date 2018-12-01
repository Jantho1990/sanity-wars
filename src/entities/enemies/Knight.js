import FrameSprite from '../../../titus/FrameSprite'
import State from '../../../titus/State'
import Texture from '../../../titus/Texture'
import physics from '../../../titus/utils/physics'
import Vec from '../../../titus/utils/Vec'
import { MAX_VEL, MIN_VEL } from '../../constants';

const texture = new Texture('resources/enemies/knight/knight.png')

const states = {
  IDLE: 0,
  WALK: 1
}

const animations = {
  'stand': [
    { x: 0, y: 0, w: 70, h: 90 }
  ],
  'walkLeft': [
    { x: 8, y: 90, w: 54, h: 90 },
    { x: 78, y: 90, w: 54, h: 90 },
    { x: 148, y: 90, w: 54, h: 90 },
    { x: 218, y: 90, w: 54, h: 90 },
    { x: 288, y: 90, w: 54, h: 90 },
    { x: 358, y: 90, w: 54, h: 90 },
    { x: 428, y: 90, w: 54, h: 90 },
    { x: 498, y: 90, w: 54, h: 90 }
  ],
  'walkRight': [
    { x: 0, y: 180, w: 70, h: 90 },
    { x: 70, y: 180, w: 70, h: 90 },
    { x: 140, y: 180, w: 70, h: 90 },
    { x: 210, y: 180, w: 70, h: 90 },
    { x: 280, y: 180, w: 70, h: 90 },
    { x: 350, y: 180, w: 70, h: 90 },
    { x: 420, y: 180, w: 70, h: 90 },
    { x: 490, y: 180, w: 70, h: 90 }
  ]
}

class Knight extends FrameSprite {
  constructor () {
    super(texture, animations)

    this.anims.addBulk([
      ['stand', animations.stand, 0.0667],
      ['walkLeft', animations.walkLeft, 0.0667],
      ['walkRight', animations.walkRight, 0.0667]
    ])

    this.speed = 1000
    this.vel = new Vec()
    this.acc = new Vec()

    this.state = new State(states.IDLE)
    this.anims.play('walkLeft')

    this.hp = 10

    // simple test patrol
    this.patrolTime = 0
    this.dir = -1
  }

  update (dt, t) {
    const { speed, patrolTime, dir, vel } = this
    super.update(dt, t)
    this.dt = dt

    const dirAnims = []
    dirAnims[-1] = 'walkLeft'
    dirAnims[1] = 'walkRight'

    let impulse = false
    if ((this.patrolTime += dt) / 1.5 >= 1) {
      this.dir = -this.dir
      this.anims.play(dirAnims[this.dir])
      this.patrolTime = 0
      impulse = true
    }

    const changingDirection = (dir > 0 && vel.x < 0) || (dir < 0 && vel.x > 0)
    if (Math.abs(this.vel.x) < MIN_VEL) {
      this.movePhysics(impulse)
    } else if (changingDirection || this.vel.mag() < MAX_VEL) {
      // this.movePos()
      this.movePhysics(impulse)
    }
    this.pos.add(physics.integrate(this, this.dt))
  }

  movePos () {
    this.pos.add({ x: this.speed * this.dir, y: 0})
  }

  movePhysics (impulse) {
    if (impulse) {
      physics.applyImpulse(this, {
        x: this.dir * this.speed * 2,
        y: 0
      }, this.dt)
    }
    physics.applyForce(this, {
      x: this.dir * this.speed,
      y: 0
    })
  }

  hit (dmg) {
    this.hp -= dmg
    
    if (this.hp <= 0) {
      this.die()
    }
  }

  die () {
    this.dead = true
  }
}

export default Knight