import UserInterface from '../../titus/UserInterface'
import SanityBarComponent from './SanityBarComponent'
import Game from '../../titus/Game';

class Overlay extends UserInterface {
  constructor (w, h, parent) {
    super(w, h, parent)

    this.sanityBar = new SanityBarComponent({
      pos: {
        x: Game.pixelAtPercent(2.5, w),
        y: Game.pixelAtPercent(92.5, h)
      }
    })
    this.addComponent(this.sanityBar)
  }
}

export default Overlay