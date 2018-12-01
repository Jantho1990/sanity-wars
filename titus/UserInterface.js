import CanvasRenderer from './renderer/CanvasRenderer'
import Game, { GameData } from './Game'
import Container from './Container'
import Assets from './Assets';

const STEP = 1 / 60
let MULTIPLIER = 1
let SPEED = STEP * MULTIPLIER
const MAX_FRAME = SPEED * 5

/**
 * A view for the user interface, separate from the
 * main game renderer.
 */
class UserInterface {
  constructor (w, h, parent = '#board') {
    this.w = w
    this.h = h
    this.renderer = new CanvasRenderer(w, h)
    document.querySelector(parent).appendChild(this.renderer.view)
    this.components = new Container()
  }

  update (dt, t) {
    this.components.update(dt, t)
    this.renderer.render(this.components)
  }
  
  addComponent (component) {
    this.components.add(component)
  }

  removeComponent (component) {
    this.components.remove(component)
  }
}

export default UserInterface