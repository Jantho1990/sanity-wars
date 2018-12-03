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
  constructor (player) {
    super(texture, 32, 32)

    this.player = player

    this.anims.add('swirl', animations.swirl, 0.0667)
    this.anims.play('swirl')
  }

  onCollide () {
    const { player: { controls: { keys } } } = this

    // if E key is being pressed
    if (keys.isBeingPressed(69)) {
      debugger
    }
  }
}

export default FinalExit