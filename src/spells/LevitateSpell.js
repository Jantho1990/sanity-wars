import Spell from './Spell'
import physics from '../../titus/utils/physics';
import LevitateBuff from '../entities/buffs/LevitateBuff';

class LevitateSpell extends Spell {
  constructor (config) {
    super(config)

    // how long will the spell last
    this.duration = config.duration || 3 // seconds
    this.remaining = this.duration
  }

  effect (spellcaster) {
    // lift character into the air
    super.effect(spellcaster)
    const { player } = spellcaster

    const buff = new LevitateBuff(player, {
      duration: this.duration
    })
  
    player.addBuff(buff)
  }
}

export default LevitateSpell