import UserInterface from '../../titus/UserInterface'
import SanityBarComponent from './SanityBarComponent'

class Overlay extends UserInterface {
  constructor (w, h, parent) {
    super(w, h, parent)

    this.sanityBar = new SanityBarComponent({
      pos: {
        x: 200,
        y: 200
      }
    })
    this.addComponent(this.sanityBar)
  }
}

export default Overlay