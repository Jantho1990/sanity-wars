import UserInterface from '../../titus/UserInterface'
import ManaBarComponent from './ManaBarComponent'

class Overlay extends UserInterface {
  constructor (w, h, parent) {
    super(w, h, parent)

    this.manaBar = new ManaBarComponent({
      pos: {
        x: 200,
        y: 200
      }
    })
    this.addComponent(this.manaBar)
  }
}

export default Overlay