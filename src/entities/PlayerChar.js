import FrameSprite from '../../titus/FrameSprite'
import {
  GRAVITY,
  JUMP_FORGIVENESS,
  JUMP_IMPULSE,
  STEER_FORCE,
  MAX_VEL,
  MIN_VEL,
  FRICTION_GROUND,
  WALL_JUMP_FORGIVENESS,
  WALL_JUMP_IMPULSE,
  DROP_WAIT_TIME
} from '../constants'
import Texture from '../../titus/Texture'
import Vec from '../../titus/utils/Vec'
import physics from '../../titus/utils/physics'
import wallslide from '../../titus/movement/wallslide'
import entity from '../../titus/utils/entity'
import Timer from '../../titus/Timer';

class PlayerChar extends FrameSprite {
  constructor(controls, map, config) {
    const {
      texture,
      actions,
      hitBox,
      anchor,
      animations
    } = config

    super(texture, animations)

    this.dbgUpdateCycle = 0
    this.forceApplied = 0

    this.controls = controls

    this.actions = actions

    this.map = map

    this.hitBox = hitBox || {
      x: 5,
      y: 5,
      w: 43,
      h: 27
    }

    this.anchor = anchor || {
      x: 0,
      y: 0
    }

    this.vel = new Vec()
    this.acc = new Vec()

    this.jumpedAt = 0
    this.falling = true
    this.fallingTimer = 0

    // Facing left or right
    this.dir = 1

    // Flags to tell external systems when an action is being taken
    this.currentActions = {
      up: false,
      down: false,
      left: false,
      right: false
    }

    this.downActionCountdown = DROP_WAIT_TIME
  }

  update(dt, t) {
    const { controls, actions } = this
    super.update(dt, t)
    this.dt = dt
    this.t = t
    
    // Get actions keys
    const { keys } = controls

    this.handleActions(actions)

    this.applyGravity()

    physics.applyHorizontalFriction(this, FRICTION_GROUND)

    this.integratePhysics()

    this.applyCollisions()
  
    this.applyFallResolution()
  }

  /**
   * Run any callbacks associated with an action key.
   *
   * @param {object} actions The action keys from the controls.
   *
   * @return void 
   */
  handleActions(actions) {
    // debugger
    const { controls, currentActions } = this
    Object.keys(actions).forEach((action) => {
      let key = action[action]
      let isActive = false
      if (!Array.isArray(actions[action])) {
        isActive = controls.keys.key(actions[action])
      } else {
        for (let i = 0; i < actions[action].length; i++) {
          key = actions[action][i]
          if (controls.keys.key(key)) {
            isActive = true
            break
          }
        }
      }

      if (isActive) {
        // TODO: Clean the action syntax so we don't have to toLowerCase() everything
        this[action](key)
        this.currentActions[action] = true
      } else if (currentActions[action]) {
        this.currentActions[action] = false
        const afterAction = `after${action[0].toUpperCase() + action.substr(1)}`
        if (this[afterAction]){
          this[afterAction](key)
        }
      }
    })
  }

  /**
   * Up action
   */
  up () {
    this.currentActions.UP = true
    this.jump()
  }

  afterUp () {
    // nothing here yet
  }

  down () {
    this.currentActions.DOWN = true
  }

  /**
   * Runs after the down action key has been released.
   *
   * @return void
   */
  afterDown () {
    // nothing here yet
  }

  left () {
    this.currentActions.LEFT = true
    this.dir = -1
    this.applyHorizontalMovement()
  }

  afterLeft () {
    // nothing here yet
  }

  right () {
    this.currentActions.RIGHT = true
    this.dir = 1
    this.applyHorizontalMovement()
  }

  afterRight () {
    // nothing here yet
  }

  /**
   * Apply the jump force.
   *
   * @param {integer} power The strength of the impulse.
   * 
   * @return void
   */
  jump (power = 1) {
    const { falling, dt } = this

    if (!falling) {
      physics.applyImpulse(this, {
        x: 0,
        y: -JUMP_IMPULSE * power
      }, dt)

      this.falling = true
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
   * Move the character horizontally.
   */
  applyHorizontalMovement () {
    const { dir, dt, vel } = this

    const changingDirection = (dir > 0 && vel.x < 0) || (dir < 0 && vel.x > 0)

    if (Math.abs(vel.x) < MIN_VEL) {
      this.debugFS = 'Min Vel'
      physics.applyForce(this, {
        x: STEER_FORCE * dir * 2,
        y: 0 
      }, dt)
    } else if (changingDirection || (vel.mag() < MAX_VEL)) {
      this.debugFS = 'MAX Vel'
      // debugger
      physics.applyForce(this, {
        x: dir * STEER_FORCE,
        y: 0
      }, dt)
    }
  }

  /**
   * Implement collision detection.
   *
   * @return void
   */
  integratePhysics () {
    const { dt, map, vel, pos } = this

    let r = physics.integrate(this, dt)

    // Stop friction when really small (prevents gliding)
    if (vel.mag() <= 15) {
      vel.set(0, 0)
    }

    r = wallslide(this, map, r.x, r.y)

    pos.add(r)

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

  /**
   * Set all current actions to false.
   *
   * @return void
   */
  resetCurrentActions () {
    Object.keys(this.currentActions)
      .forEach(action => this.currentActions[action] = false)
  }
}

export default PlayerChar