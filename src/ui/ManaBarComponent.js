import UserInterfaceComponent from "../../titus/ui/UserInterfaceComponent";
import Rect from "../../titus/Rect";
import { GameData } from "../../titus/Game";

const styles = {
  manaTotal: {
    fill: 'hsl(210, 5%, 25%)'
  },
  manaCurrent: {
    fill: 'hsl(210, 50%, 50%)'
  }
}

class ManaBarComponent extends UserInterfaceComponent {
  constructor (config) {
    const { w, h, pos, percent } = config
    super(w, h, pos)
    this.percent = percent || 1 // width of 1 percent in pixels
    this.w = w || 100
    this.h = h || 20

    const manaBarEmpty = new Rect(100, 20, styles.manaTotal)
    const manaBarCurrent = new Rect(100, 20, styles.manaCurrent)

    this.manaBarEmpty = manaBarEmpty
    this.manaBarCurrent = manaBarCurrent

    this.add(manaBarEmpty)
    this.add(manaBarCurrent)
  }

  update () {
    const { percent } = this

    const manaCurrent = GameData.get('player').manaCurrent * percent

    this.manaBarCurrent.w = manaCurrent

    // super.render()
  }
}

export default ManaBarComponent