import UserInterface from '../../titus/UserInterface'
import SanityBarComponent from './SanityBarComponent'
import Game from '../../titus/Game';
import PickupCounterComponent from './PickupCounterComponent';
import SpellSlotComponent from './SpellSlotComponent';

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

    this.spellSlotFireball = new SpellSlotComponent({
      pos: {
        x: Game.pixelAtPercent(30, w),
        y: Game.pixelAtPercent(92.5, h)
      },
      numKey: 1,
      name: 'Fireball'
    })
    
    this.spellSlotLevitate = new SpellSlotComponent({
      pos: {
        x: Game.pixelAtPercent(35, w),
        y: Game.pixelAtPercent(92.5, h)
      },
      numKey: 2,
      name: 'Levitate'
    })

    this.addComponent(this.sanityBar)
    this.addComponent(this.pickupCounter)
    this.addComponent(this.spellSlotFireball)
    this.addComponent(this.spellSlotLevitate)
  }
}

export default Overlay