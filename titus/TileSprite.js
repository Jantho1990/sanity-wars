import Sprite from './Sprite'
import AnimManager from './AnimManager';

class TileSprite extends Sprite {
  constructor(texture, w, h) {
    super(texture)
    this.tileW = w
    this.tileH = h
    this.frame = { x: 0, y: 0 }
    this.anims = new AnimManager(this)
  }

  update(dt) {
    this.anims.update(dt)
  }

  get w() {
    const { scale = { x: 1 } } = this
    
    return this.tileW * Math.abs(scale.x)
  }

  get h() {
    const { scale = { y: 1 } } = this

    return this.tileH * Math.abs(scale.y)
  }

  reset (ts) {
    Object.keys(ts).forEach(prop => {
      this[prop] = ts[prop]
    })
  }
}

export default TileSprite