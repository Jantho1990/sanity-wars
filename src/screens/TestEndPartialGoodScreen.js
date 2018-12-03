import Container from '../../titus/Container'
import Rect from '../../titus/Rect'
import Text from '../../titus/Text'

class TestEndPartialGoodScreen extends Container {
  constructor (game, controls, onRestart = () => {}) {
    super()
    this.onRestart = onRestart
    this.controls = controls

    this.game = game
    this.w = game.w
    this.h = game.h

    this.objects = this.add(new Container())

    this.drawBackground()

    const text1 = new Text('You reached the final exit.', {
      font: '40pt Arial',
      fill: 'black'
    })
    text1.pos.set(
      game.percentOfGameWidthCentered(50, text1),
      game.percentOfGameHeightCentered(50, text1)
    )
    this.text1 = this.add(text1)
    
    const text2 = new Text('You did an OK job.', {
      font: '40pt Arial',
      fill: 'black'
    })
    text2.pos.set(
      game.percentOfGameWidthCentered(50, text2),
      game.percentOfGameHeightCentered(65, text2)
    )
    this.text2 = this.add(text2)
  }

  update (dt, t) {
    super.update(dt, t)
    const { controls: { keys }} = this

    if (keys.action) {
      this.onRestart()
    }
  }

  drawBackground () {
    const bkgd = new Rect(this.w, this.h, { fill: 'hsl(30, 50%, 50%)' })
    this.bkgd = this.add(bkgd)
  }
}

export default TestEndPartialGoodScreen