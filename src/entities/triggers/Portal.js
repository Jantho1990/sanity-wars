import Trigger from './Trigger'

class Portal extends Trigger {
  constructor (hitBox, onCollide, debug = false) {
    super(hitBox, onCollide, debug)
  }
}

export default Portal