import TileSprite from '../../titus/TileSprite'
import Texture from '../../titus/Texture';
import Vec from '../../titus/utils/Vec';
import physics from '../../titus/utils/physics';
import { FRICTION_GROUND, GRAVITY } from '../constants';
import wallslide from '../../titus/movement/wallslide';
import entity from '../../titus/utils/entity';

const texture = new Texture('resources/images/small_crates.png')

class Crate extends TileSprite {
  constructor (variant = 0, map) {
    super(texture, 20, 20)
    this.hitbox = {
      x: 0,
      y: 0,
      w: 20,
      h: 20
    }
    this.frame.x = variant
    this.map = map

    this.vel = new Vec()
    this.acc = new Vec()

    this.falling = true
    this.fallingTimer = 0

    this.isGrabbed = false

    this.dir = 0
    // debugger
  }

  update(dt, t) {
    super.update(dt, t)
    this.dt = dt
    this.t = t
    
    if (!this.isGrabbed) {
      // this.applyHorizontalMovement()

      this.applyGravity()
      
      physics.applyHorizontalFriction(this, FRICTION_GROUND)
      
      this.integratePhysics()
      
      this.applyCollisions()
  
      this.applyFallResolution()

      // this.resetCurrentActions()
    }
  }

  /**
   * Apply the force of gravity.
   *
   * @return void
   */
  applyGravity () {
    if (this.falling) {
      physics.applyForce(this, { x: 0, y: GRAVITY })
    }
  }

  /**
   * Implement collision detection.
   *
   * @return void
   */
  integratePhysics () {
    const { dt, map, vel } = this

    let r = physics.integrate(this, dt)
    if (r.x > 999 || r.y > 999) {
      debugger
    }

    // Stop friction when really small (prevents gliding)
    if (vel.mag() <= 20) {
      vel.set(0, 0)
    }

    r = wallslide(this, map, r.x, r.y)

    this.pos.add(r)

    this.r = r
  }

  /**
   * Apply collision resolution.
   *
   * @return void
   */
  applyCollisions () {
    const { r, vel } = this

    if (r.hits.down) {
      this.falling = false
      vel.y = 0
    }

    if (r.hits.up) {
      vel.set(0, 0)
    }
  }

  applyFallResolution () {
    const { dt, map } = this
    if (!this.falling && !this.r.hits.down) {
      const e = entity.bounds(this)
      const leftFoot = map.pixelToMapPos({ x: e.x, y: e.y + e.h + 1 })
      const rightFoot = map.pixelToMapPos({x: e.x + e.w, y: e.y + e.h + 1 })
      const left = map.tileAtMapPos(leftFoot)
      const right = map.tileAtMapPos(rightFoot)
      if (left.frame.walkable && right.frame.walkable) {
        if (this.fillingTimer <= 0) {
          this.fallingTimer = JUMP_FORGIVENESS
        } else {
          if ((this.fallingTimer -= dt) <= 0) {
            this.falling = true
          }
        }
      }
    }
  }
}

export default Crate