import UserInterfaceComponent from "../../titus/ui/UserInterfaceComponent";
import Rect from "../../titus/Rect";
import Text from "../../titus/Text";
import { GameData } from "../../titus/Game";

const style = {
  font: '20px Arial',
  fill: 'hsl(0, 100%, 100%)'
}

class PickupCounterComponent extends UserInterfaceComponent {
  constructor (config) {
    const { w, h, pos, percent } = config
    super(w, h, pos)
    this.percent = percent || 1 // width of 1 percent in pixels
    this.w = w || 100
    this.h = h || 20

    const count = new Text('Tomes: 0', style)

    this.count = this.add(count)
  }

  update () {
    const count = `Tomes: ${GameData.get('pickups')}`

    this.count.text = count
  }
}

export default PickupCounterComponent