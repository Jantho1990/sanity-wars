import TileSprite from '../../titus/TileSprite'
import {
  GRAVITY,
  JUMP_FORGIVENESS,
  JUMP_IMPULSE,
  STEER_FORCE,
  MAX_VEL,
  MIN_VEL,
  FRICTION_GROUND,
  WALL_JUMP_FORGIVENESS,
  WALL_JUMP_IMPULSE
} from '../constants'
import Texture from '../../titus/Texture'
import PlayerChar from './PlayerChar'

const texture = new Texture('resources/images/Dwarf Sprite Sheet.png')

class PlayerChar2 extends PlayerChar {
  constructor (controls, map) {
    // Modify the actions for Player 2
    const actions = {
      UP: 38, // up arrow
      DOWN: 40, // down arrow
      LEFT: 37, // left arrow
      RIGHT: 39 // right arrow
    }

    super(controls, map, {
      texture,
      actions
    })

    this.frame.x = 0
    this.frame.y = 1
  }

  update(dt, t) {
    super.update(dt, t)
  }

  up() {
    super.up()
  }

  down() {
    super.down()
  }

  left() {
    super.left()
  }

  right() {
    super.right()
  }
}

export default PlayerChar2