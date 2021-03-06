import Trigger from './Trigger'
import Texture from '../../../titus/Texture';
import TileSprite from '../../../titus/TileSprite';
import EventsHandler from '../../../titus/EventsHandler';
import {GameData} from '../../../titus/Game'
import { PORTAL_WAIT_TIME } from '../../constants';

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
  constructor (player, link) {
    super(texture, 32, 32)

    this.anims.add('swirl', animations.swirl, 0.0667)
    this.anims.play('swirl')

    this.player = player
    this.link = link
  }

  onCollide () {
    const { player: { controls: { keys } } } = this

    // if E key is being pressed
    if (keys.isBeingPressed(69) && GameData.get('portal_time_counter') <= 0) {
      EventsHandler.dispatch('changeLevel', this.link)
    }
  }
}

export default Portal