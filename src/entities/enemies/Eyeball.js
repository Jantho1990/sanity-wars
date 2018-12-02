import TileSprite from '../../../titus/TileSprite'
import Texture from '../../../titus/Texture';
import entity from '../../../titus/utils/entity';
import math from '../../../titus/utils/math'
import State from '../../../titus/State';

const texture = new Texture('resources/enemies/eyeball/eyeball spritesheet.png')

const states = {
  WANDER: 0,
  ATTACK: 1,
  FLEE: 2
}

const animations = {
  'idle': [
    { x: 0, y: 0},
    { x: 1, y: 0},
    { x: 2, y: 0},
    { x: 3, y: 0},
    { x: 4, y: 0},
    { x: 5, y: 0},
    { x: 6, y: 0},
    { x: 7, y: 0}
  ],
  'fly': [
    { x: 0, y: 1},
    { x: 1, y: 1},
    { x: 2, y: 1},
    { x: 3, y: 1},
    { x: 4, y: 1},
    { x: 5, y: 1},
    { x: 6, y: 1},
    { x: 7, y: 1}
  ],
  'blink': [
    { x: 0, y: 2},
    { x: 1, y: 2},
    { x: 2, y: 2},
    { x: 3, y: 2},
    { x: 4, y: 2},
    { x: 5, y: 2},
    { x: 6, y: 2},
    { x: 7, y: 2}
  ]
}

/**
 * The Eye of Tantaros
 */
class Eyeball extends TileSprite {
  constructor (target) {
    super(texture, 32, 32)

    this.hitbox = {
      x: 4,
      y: 4,
      w: 8,
      h: 8
    }
    this.frame.x = 0
    this.frame.y = 0
    this.speed = 120
    this.target = target

    this.anims.addBulk([
      [ 'idle', animations.idle, 0.0667 ],
      [ 'fly', animations.fly, 0.0667 ],
      [ 'blink', animations.blink, 0.0667 ]
    ])

    this.state = new State(states.ATTACK)
    this.anims.play('fly')
  }

  update (dt, t) {
    super.update(dt, t)
    const { pos, frame, speed, target, waypoint, state } = this

    const angle = entity.angle(target, this)
    const distance = entity.distance(target, this)
    let xo = 0
    let yo = 0
    let waypointAngle
    let waypointDistance

    switch (this.state.get()) {
      case states.ATTACK:
        xo = Math.cos(angle) * speed * dt
        yo = Math.sin(angle) * speed * dt
        if (distance < 60) {
          state.set(states.FLEE)
        }
        break
      case states.FLEE:
        xo = -Math.cos(angle) * speed * dt
        yo = -Math.sin(angle) * speed * dt
        if (distance > 120) {
          if (math.randOneIn(2)) {
            state.set(states.WANDER)
            this.waypoint = {
              x: pos.x + math.rand(-200, 200),
              y: pos.y + math.rand(-200, 200)
            }
          } else {
            state.set(states.ATTACK)
          }
        }
        break
      case states.WANDER:
        waypointAngle = math.angle(waypoint, pos)
        waypointDistance = math.distance(pos, waypoint)

        xo = Math.cos(waypointAngle) * speed * dt
        yo = Math.sin(waypointAngle) * speed * dt
        if (waypointDistance < 60) {
          state.set(states.FLEE)
        }
        break;
    }

    pos.x += xo
    pos.y += yo

    // Bob a bit
    pos.y += Math.sin(t / 0.1) * 0.5

    state.update(dt)
  }

  faceDirection () {

  }

  hit () {
    this.dead = true
  }
}

export default Eyeball