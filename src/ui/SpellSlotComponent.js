import UserInterfaceComponent from "../../titus/ui/UserInterfaceComponent";
import Rect from "../../titus/Rect";
import { GameData } from "../../titus/Game";
import Text from "../../titus/Text";

const styles = {
  spellSlotTotal: {
    fill: 'hsl(0, 5%, 25%)'
  },
  spellSlotCurrent: {
    fill: 'hsl(0, 60%, 50%)'
  }
}

class SpellSlotComponent extends UserInterfaceComponent {
  constructor (config) {
    const { w, h, pos, percent, numKey, name } = config
    super(w, h, pos)
    this.percent = percent || 0.2 // width of 1 percent in pixels
    this.w = w || 20
    this.h = h || 20
    this.name = name
    this.numKey = numKey

    const spellSlotEmpty = new Rect(20, 20, styles.spellSlotTotal)
    const spellSlotCurrent = new Rect(0, 20, styles.spellSlotCurrent)
    const number = new Text(numKey, {
      font: '12pt Arial',
      fill: 'hsl(0, 100%, 100%)'
    })
    number.pos.x = 5.25
    number.pos.y = 2.5

    this.spellSlotEmpty = spellSlotEmpty
    this.spellSlotCurrent = spellSlotCurrent
    this.number = number

    this.add(spellSlotEmpty)
    this.add(spellSlotCurrent)
    this.add(number)
  }

  update () {
    const { percent, name } = this

    try {
      if (GameData.get(name).sacrificed) {
        this.spellSlotCurrent.w = 20
      } else {
        const spell = GameData.get(name)
        const spellSlotCurrent = spell.sacrificeTime * 100 * percent
  
        this.spellSlotCurrent.w = spellSlotCurrent
      }
    } catch (e) {

    }

    // super.render()
  }
}

export default SpellSlotComponent