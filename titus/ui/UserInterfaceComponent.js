import Container from "../Container";

class UserInterfaceComponent extends Container {
  constructor (w, h, pos) {
    super()
    this.w = w
    this.h = h
    this.pos = pos
  }

  update (dt, t) {
    // this.render()
  }

  /**
   * Position the component on the user interface.
   * @param {number} x 
   * @param {number} y 
   */
  place (x, y) {
    this.pos = { x, y }
  }

  
}

export default UserInterfaceComponent