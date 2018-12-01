import TileSprite from '../../titus/TileSprite'
import Texture from '../../titus/Texture';
import Vec from '../../titus/utils/Vec';
import math from '../../titus/utils/math'

const texture = new Texture('resources/images/CrappyShip1.png')

class DropShip extends TileSprite {
  constructor (config) {
    const { pos, w = 48, h = 48 } = config
    super(texture, w, h)

    if (pos) {
      this.pos = new Vec(pos)
    }
  }

  update (dt, t) {
    const { pos } = this
    super.update(dt, t)

    // Make the ship hover in place a bit
    pos.y += Math.sin((t + 200) * 10)
  }
}

export default DropShip