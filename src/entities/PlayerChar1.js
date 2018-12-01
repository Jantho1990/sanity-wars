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

const texture = new Texture('resources/images/Adventurer Sprite Sheet v1.1.png')


class PlayerChar1 extends PlayerChar {
  constructor (controls, map) {
    // Modify the actions for Player 1
    const actions = {
      UP: 87, // W
      DOWN: 83, // S
      LEFT: 65, // A
      RIGHT: 68 // D
    }

    super(controls, map, {
      texture,
      actions
    })

    this.frame.x = 0
    this.frame.y = 1
  }

  update (dt, t) {
    super.update(dt, t)
  }

  up () {
    super.up()
  }

  down () {
    super.down()
  }

  left () {
    super.left()
  }

  right () {
    super.right()
  }

  jump () {
    super.jump(1.25)
  }
}

export default PlayerChar1