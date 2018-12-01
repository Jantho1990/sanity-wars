import FrameSprite from '../../../titus/FrameSprite'
import Texture from '../../../titus/Texture'
import SoundPool from '../../../titus/sound/SoundPool'

const texture = new Texture('resources/bullets/fireball/fireball_0.png')

const sound = new SoundPool('resources/sounds/fireball_fire.wav')

let bulletCt = 0

const animations = {
  'right': [
    { x: 0, y: 0, w: 64, h: 64 },
    { x: 64, y: 0, w: 64, h: 64 },
    { x: 128, y: 0, w: 64, h: 64 },
    { x: 192, y: 0, w: 64, h: 64 },
    { x: 256, y: 0, w: 64, h: 64 },
    { x: 320, y: 0, w: 64, h: 64 },
    { x: 384, y: 0, w: 64, h: 64 },
    { x: 448, y: 0, w: 64, h: 64 },
  ],
  'left': [
    { x: 0, y: 256, w: 64, h: 64 },
    { x: 64, y: 256, w: 64, h: 64 },
    { x: 128, y: 256, w: 64, h: 64 },
    { x: 192, y: 256, w: 64, h: 64 },
    { x: 256, y: 256, w: 64, h: 64 },
    { x: 320, y: 256, w: 64, h: 64 },
    { x: 384, y: 256, w: 64, h: 64 },
    { x: 448, y: 256, w: 64, h: 64 },
  ]
}

class FireballBullet extends FrameSprite {
  constructor (spawn, dir, speed = 1000, range = 400, damage = 2) {
    super(texture, animations)

    this.name = "FireBullet"

    this.anims.addBulk([
      ['right', animations.right, 0.05],
      ['left', animations.left, 0.05]
    ])

    this.dir = dir
    this.speed = speed
    this.dmg = damage

    // the point of origin, used to measure range
    this.origin = spawn
    this.pos = spawn.clone()

    this.hitbox = {
      x: 0,
      y: 0,
      w: 64,
      h: 64
    }

    this.damage = 10 // how much raw damage the bullet does
    this.range = range
    this.distanceTraveled = 0

    if (Math.sign(dir.x) < 0) {
      this.anims.play('right')
    } else {
      this.anims.play('left')
    }

    sound.play()

    bulletCt++
  }

  update (dt, t) {
    const { dir, speed, distanceTraveled, range } = this
    super.update(dt, t)
    // debugger

    // move along
    this.pos.x += speed * dt * dir.x
    this.pos.y += speed * dt * dir.y

    // check range
    if (distanceTraveled <= range) {
      this.distanceTraveled += dt * speed
    } else {
      this.dead = true
      bulletCt--
    }
  }
}

export default FireballBullet