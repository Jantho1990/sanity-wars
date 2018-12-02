import Vec from '../../../titus/utils/Vec'
import Rect from '../../../titus/Rect';

class Trigger {
  constructor(hitBox, onCollide, debug = false) {
    const { w, h, x = 0, y = 0 } = hitBox
    this.pos = new Vec()
    this.w = w
    this.h = h
    if (x || y) {
      this.hitBox = { x, y, w, h }
    }

    this.onCollide = onCollide

    if (debug) {
      const box = new Rect(w, h, { fill: 'hsla(40, 50%, 50%, 0.5)'})
      box.pos.set(x, y)
      this.children = [box]
    }
  }

  trigger () {
    if (this.onCollide) {
      this.onCollide()
    }
  }
}

export default Trigger