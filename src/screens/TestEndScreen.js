import Container from '../../titus/Container'
import Rect from '../../titus/Rect'
import Text from '../../titus/Text'

class TestEndScreen extends Container {
  constructor (game, controls, onRestart = () => {}) {
    super()
    this.onRestart = onRestart
    this.controls = controls

    this.game = game
    this.w = game.w
    this.h = game.h

    this.objects = this.add(new Container())

    this.drawBackground()

    const text = new Text('You reached the final exit.', {
      font: '20pt Arial',
      fill: 'black'
    })
    text.pos.set(
      game.percentOfGameWidthCentered(50, text),
      game.percentOfGameHeightCentered(50, text)
    )
    this.text = this.add(text)
  }

  update (dt, t) {
    super.update(dt, t)
    const { controls: { keys }} = this

    if (keys.action) {
      this.onRestart()
    }
  }

  drawBackground () {
    const bkgd = new Rect(this.w, this.h, { fill: 'hsl(0, 50%, 50%)' })
    this.bkgd = this.add(bkgd)
  }
}

export default TestEndScreen