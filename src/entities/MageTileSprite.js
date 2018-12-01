import TileSprite from '../../titus/TileSprite'
import math from '../../titus/utils/math'
import Texture from '../../titus/Texture';

const texture = new Texture('resources/characters/mage/slap32.png', (t, e) => {
  if (t.img.src.indexOf('data:image') === -1) {
    t.removeTransparencyPixels([255, 0, 255])
  }
})

class MageTileSprite extends TileSprite {
  constructor () {
    super(texture, 32, 48)

    this.anims.add('Slap', [0, 1, 2].map(x => ({ x, y: 0 })), 0.0667)
  }

  update (dt, t) {
    super.update(dt, t)

    if (t % 1 <= 0.1) {
      this.anims.play('Slap', 1)
    }
  }
}

export default MageTileSprite