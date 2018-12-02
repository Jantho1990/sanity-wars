import Trigger from './Trigger'
import Texture from '../../../titus/Texture';
import TileSprite from '../../../titus/TileSprite';

const texture = new Texture('resources/entities/portals/portalRings1.png', (t, e) => {
  if (t.img.src.indexOf('data:image') === -1) {
    t.removeTransparencyPixels([0, 0, 0])
  }
})

const animations = {
  'swirl': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 0, y: 3 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 0, y: 4 },
    // { x: 4, y: 0 }
  ]
}

class Portal extends TileSprite {
  constructor (hitBox, onCollide, debug = false) {
    super(texture, 32, 32)

    this.anims.add('swirl', animations.swirl, 0.0667)
    this.anims.play('swirl')
  }

  onCollide () {

  }
}

export default Portal