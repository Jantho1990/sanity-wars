import TileSprite from '../../../titus/TileSprite'
import Texture from '../../../titus/Texture';

const texture = new Texture('resources/entities/roguelikeitems.png')

class TomePickup extends TileSprite {
  constructor () {
    super(texture, 32, 32)

    this.hitBox = {
      x: 0,
      y: 0,
      w: 32,
      h: 32
    }

    this.frame.x = 12
    this.frame.y = 12
  }
}

export default TomePickup