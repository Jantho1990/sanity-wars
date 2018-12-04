import Container from '../../titus/Container'
import Rect from '../../titus/Rect'
import Text from '../../titus/Text'

class TestEndGoodScreen extends Container {
  constructor (game, controls, onRestart = () => {}) {
    super()
    this.onRestart = onRestart
    this.controls = controls

    this.game = game
    this.w = game.w
    this.h = game.h

    this.objects = this.add(new Container())

    this.drawBackground()

    const text1 = new Text('You found all the ancient Tomes of Knowledge!', {
      font: '10pt Arial',
      fill: 'black'
    })
    text1.pos.set(
      game.percentOfGameWidthCentered(50, text1),
      game.percentOfGameHeightCentered(50, text1)
    )
    this.text1 = this.add(text1)
    
    const text2 = new Text('With these, the Dread Overlord will finally be overthrown!', {
      font: '10pt Arial',
      fill: 'black'
    })
    text2.pos.set(
      game.percentOfGameWidthCentered(50, text2),
      game.percentOfGameHeightCentered(65, text2)
    )
    this.text2 = this.add(text2)
    
    const text3 = new Text('You have saved the world!', {
      font: '10pt Arial',
      fill: 'black'
    })
    text3.pos.set(
      game.percentOfGameWidthCentered(50, text3),
      game.percentOfGameHeightCentered(80, text3)
    )
    this.text3 = this.add(text3)
  }

  update (dt, t) {
    super.update(dt, t)
    const { controls: { keys }} = this

    if (keys.action) {
      this.onRestart()
    }
  }

  drawBackground () {
    const bkgd = new Rect(this.w, this.h, { fill: 'hsl(90, 50%, 50%)' })
    this.bkgd = this.add(bkgd)
  }
}

export default TestEndGoodScreen