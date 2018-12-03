import TileSprite from '../../../titus/TileSprite'
import Texture from '../../../titus/Texture';

const texture = new Texture('/resources/entities/portals/portalRings2.png')

const animations = {
  'swirl': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 }
  ]
}

class FinalExit extends TileSprite {
  constructor () {
    super(texture, 32, 32)

    this.anims.add('swirl', animations.swirl, 0.0667)
    this.anims.play('swirl')
  }
}

export default FinalExit