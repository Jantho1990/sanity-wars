import UserInterface from '../../titus/UserInterface'
import SanityBarComponent from './SanityBarComponent'
import Game from '../../titus/Game';
import PickupCounterComponent from './PickupCounterComponent';

class Overlay extends UserInterface {
  constructor (w, h, parent) {
    super(w, h, parent)

    this.sanityBar = new SanityBarComponent({
      pos: {
        x: Game.pixelAtPercent(2.5, w),
        y: Game.pixelAtPercent(92.5, h)
      }
    })

    this.pickupCounter = new PickupCounterComponent({
      pos: {
        x: Game.pixelAtPercent(80, w),
        y: Game.pixelAtPercent(92.5, h)
      }
    })

    this.addComponent(this.sanityBar)
    this.addComponent(this.pickupCounter)
  }
}

export default Overlay