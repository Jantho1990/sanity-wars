import math from '../../titus/utils/math'
import Spell from './Spell'
import FireballBullet from '../entities/bullets/Fireball'
import EventsHandler from '../../titus/EventsHandler'

class FireballSpell extends Spell {
  constructor (config) {
    super(config)

    // how far can the fireball travel
    this.range = 500
  }

  canCast (spellcaster) {
    if (!super.canCast(spellcaster)) {
      return false
    }

    return true
  }

  effect (spellcaster) {
    // hurl a fireball forward
    super.effect(spellcaster)
    const { player, player: { map } } = spellcaster

    // get the fireball point of origin
    const spawn = player.pos.clone().add({ x: 3 * player.dir, y: -3 })
    
    // calculate the direction to fire the fireball
    // this method lets us switch to mouse fire in the future,
    // if we wish
    const dir = math.direction(math.angle(spawn, {
      x: spawn.x + (this.range * -player.dir),
      y: spawn.y
    }))

    const fireball = new FireballBullet(spawn, dir, this.speed)
    EventsHandler.dispatch('addBullet', fireball)
  }
}

export default FireballSpell