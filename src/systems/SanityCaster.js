import SpellCaster from './SpellCaster'
import SanityBuff from '../entities/SanityBuff';

/**
 * Version of SpellCaster which uses Sanity mechanics.
 */
class SanityCaster extends SpellCaster {
  constructor (player, spells, config) {
    const {
      sanityBoost = 0.25,
      rechargeAmount = 20
    } = config

    let sanityRechargeBoost = 0

    const sanityBuffs = spells.map(spell => {
      sanityRechargeBoost += sanityBoost
      return new SanityBuff(spell, sanityBoost)
    })
    
    config.rechargeAmount = rechargeAmount + (rechargeAmount * sanityRechargeBoost)
    
    super(player, spells, config)

    this.sanityBuffs = sanityBuffs

    this.sacrificeTime = 1
    this.sacrificeTimeCounter = 0
    this.baseRechargeAmount = rechargeAmount
  }

  /**
   * Apply per frame updates.
   * This specifically overrides the default SpellCaster
   * update method since we need to gate access to Spells
   * based on SpellBuffs.
   * 
   * @param {number} dt Total change since last frame.
   * @param {number} t Total time run.
   */
  /* update (dt, t) {
    const { spells } = this
  } */

  /* cast (spellName) {
    const { sacrificeTime, player: { dt, controls: { keys }} } = this
    const sanityBuff = this.sanityBuffs.find(sb => sb.spell.name === spellName)

    if (sanityBuff) {
      debugger
      const { spell } = sanityBuff
      if (keys.isBeingHeld(spell.hotkey)) {
        debugger
        if (this.sacrificeTimeCounter += dt > sacrificeTime) {
          sanityBuff.sacrifice()
          this.sacrificeTimeCounter = 0
        }
      } else {
        this.sacrificeTimeCounter = 0
      }
    } else {
      super.cast(spellName)
    }
  } */

  sacrifice (spell) {
    const { sacrificeTime, player: { dt, controls: { keys }} } = this
    const sanityBuff = this.sanityBuffs.find(sb => sb.spell.name === spell.name)

    if (sanityBuff) {
      if ((this.sacrificeTimeCounter += dt) >= sacrificeTime) {
        sanityBuff.sacrifice()

        this.sanityBuffs = this.sanityBuffs.filter(sb => sb.spell.name !== sanityBuff.spell.name)
        this.rechargeAmount -= (this.baseRechargeAmount * sanityBuff.boost)

        this.sacrificeTimeCounter = 0
      }
    }
  }

  cancelSacrifice () {
    this.sacrificeTimeCounter = 0
  }

  isSacrificed (spell) {
    return !this.sanityBuffs.find(sb => sb.spell.name === spell.name)
  }
}

export default SanityCaster