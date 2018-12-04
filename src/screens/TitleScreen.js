import Container from '../../titus/Container'
import Rect from '../../titus/Rect'
import Text from '../../titus/Text'

class TitleScreen extends Container {
  constructor (game, controls, onStart = () => {}) {
    super()
    this.onStart = onStart
    this.controls = controls

    this.game = game
    this.w = game.w
    this.h = game.h

    this.objects = this.add(new Container())

    this.drawBackground()

    const text1 = new Text('Sanity Wars', {
      font: '20pt Arial',
      fill: 'black'
    })
    text1.pos.set(
      game.percentOfGameWidthCentered(50, text1),
      game.percentOfGameHeightCentered(25, text1)
    )
    this.text1 = this.add(text1)
    
    const text2 = new Text('The Dread Overlord has taken control and crippled the world with terror.', {
      font: '10pt Arial',
      fill: 'black'
    })
    text2.pos.set(
      game.percentOfGameWidthCentered(50, text2),
      game.percentOfGameHeightCentered(35, text2)
    )
    this.text2 = this.add(text2)
    
    const text3 = new Text('Only the tomes of knowledge can break his rule and bring salvation to the world.', {
      font: '10pt Arial',
      fill: 'black'
    })
    text3.pos.set(
      game.percentOfGameWidthCentered(50, text3),
      game.percentOfGameHeightCentered(40, text3)
    )
    this.text3 = this.add(text3)
    
    const text4 = new Text('You are charged with recovering these tomes from the far corners of the world.', {
      font: '10pt Arial',
      fill: 'black'
    })
    text4.pos.set(
      game.percentOfGameWidthCentered(50, text4),
      game.percentOfGameHeightCentered(45, text4)
    )
    this.text4 = this.add(text4)
    
    const text5 = new Text('But the Dread Overlord\'s eyes are always watching..', {
      font: '10pt Arial',
      fill: 'black'
    })
    text5.pos.set(
      game.percentOfGameWidthCentered(50, text5),
      game.percentOfGameHeightCentered(50, text5)
    )
    this.text5 = this.add(text5)
    
    const text6 = new Text('He will seek to break your sanity and cripple your mind.', {
      font: '10pt Arial',
      fill: 'black'
    })
    text6.pos.set(
      game.percentOfGameWidthCentered(50, text6),
      game.percentOfGameHeightCentered(55, text6)
    )
    this.text6 = this.add(text6)
    
    const text7 = new Text('You can use his magic of terror against him, by sacrificing your own sanity.', {
      font: '10pt Arial',
      fill: 'black'
    })
    text7.pos.set(
      game.percentOfGameWidthCentered(50, text7),
      game.percentOfGameHeightCentered(60, text7)
    )
    this.text7 = this.add(text7)
    
    const text8 = new Text('Can you succeed in your quest and save the world?', {
      font: '10pt Arial',
      fill: 'black'
    })
    text8.pos.set(
      game.percentOfGameWidthCentered(50, text8),
      game.percentOfGameHeightCentered(65, text8)
    )
    this.text8 = this.add(text8)
    
    const controlText1 = new Text('Hold "1" to gain access to Fiery Rage', {
      font: '10pt Arial',
      fill: 'black'
    })
    controlText1.pos.set(
      game.percentOfGameWidthCentered(50, controlText1),
      game.percentOfGameHeightCentered(85, controlText1)
    )
    this.controlText1 = this.add(controlText1)
    
    const controlText2 = new Text('Hold "2" to gain access to Desperate Flight', {
      font: '10pt Arial',
      fill: 'black'
    })
    controlText2.pos.set(
      game.percentOfGameWidthCentered(50, controlText2),
      game.percentOfGameHeightCentered(90, controlText2)
    )
    this.controlText2 = this.add(controlText2)
    
    const controlText3 = new Text('Arrow Keys to move, Spacebar to Cast', {
      font: '10pt Arial',
      fill: 'black'
    })
    controlText3.pos.set(
      game.percentOfGameWidthCentered(50, controlText3),
      game.percentOfGameHeightCentered(80, controlText3)
    )
    this.controlText3 = this.add(controlText3)
  }

  update (dt, t) {
    super.update(dt, t)
    const { controls: { keys }} = this

    if (keys.action) {
      this.onStart()
    }
  }

  drawBackground () {
    const bkgd = new Rect(this.w, this.h, { fill: 'hsl(310, 50%, 50%)' })
    this.bkgd = this.add(bkgd)
  }
}

export default TitleScreen