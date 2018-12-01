import FrameSprite from '../../titus/FrameSprite'
import Texture from '../../titus/Texture';

const texture = new Texture('resources/characters/mage/sara-cal.png', (t, e) => {
  if (t.img.src.indexOf('data:image') === -1) {
    t.removeTransparencyPixels([255, 0, 255])
  }
})

const animations = {
  'slap': [
    { x: 36, y: 8, w: 32, h: 48 },
    { x: 72, y: 8, w: 32, h: 48 },
    { x: 108, y: 8, w: 32, h: 48 }
  ],
  'bow': [
    { x: 188, y: 72, w: 40, h: 48 },
    { x: 232, y: 72, w: 40, h: 48 },
    { x: 276, y: 72, w: 40, h: 48 }
  ],
  'dying': [
    { x: 36, y: 136, w: 32, h: 48 },
    { x: 72, y: 136, w: 32, h: 48 },
    { x: 112, y: 152, w: 56, h: 32 }
  ],
  'walk': [
    { x: 0, y: 72, w: 32, h: 48 },
    { x: 36, y: 72, w: 32, h: 48 },
    { x: 72, y: 72, w: 32, h: 48 }
  ]
}

class MageFrameTileSprite extends FrameSprite {
  constructor () {
    super(texture, animations.bow)

    this.anims.addBulk([
      ['slap', animations.slap, 0.0667],
      ['bow', animations.bow, 0.0667],
      ['dying', animations.dying, 0.0667],
      ['walk', animations.walk, 0.0667]
    ])
  }

  update (dt, t) {
    super.update(dt, t)

    if (t % 1 <= 0.1) {
      this.anims.play('bow', 2)
    }
  }
}

export default MageFrameTileSprite