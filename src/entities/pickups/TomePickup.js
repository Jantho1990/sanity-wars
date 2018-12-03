import TileSprite from '../../../titus/TileSprite'
import Texture from '../../../titus/Texture';

const texture = new Texture('resources/entities/items/roguelikeitems.png')

class TomePickup extends TileSprite {
  constructor () {
    super(texture, 16, 16)

    this.hitBox = {
      x: 0,
      y: 0,
      w: 32,
      h: 32
    }

    this.frame.x = 11
    this.frame.y = 12
  }

  update (dt, t) {
    super.update(dt, t)

    // bob a bit
    this.pos.y += Math.sin(t / 0.1) * 0.35
  }
}

export default TomePickup