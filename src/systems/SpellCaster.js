import Spells from '../spells'

class SpellCaster {
  constructor (player, spells, config) {
    const {
      manaTotal,
      manaCurrent,
      rechargeAmount = 20,
      rechargeRate = 1
    } = config

    this.manaTotal = manaTotal
    this.manaCurrent = manaCurrent || manaTotal

    this.rechargeAmount = rechargeAmount
    this.rechargeRate = rechargeRate
    this.rechargeTime = 0
    
    this.player = player

    this.spells = spells.map(spell => {
      const name = spell.name
      const hotkey = spell.hotkey
      return {
        name,
        hotkey,
        spell: new Spells[name](spell)
      }
    })
  }

  update (dt, t) {
    const { spells } = this
    for (let i = 0; i < spells.length; i++) {
      this.spells[i].spell.update(dt, t)
    }

    this.recharge(dt)
    window.Debug.addLine('Mana', this.manaCurrent)
    window.Debug.addLine('Mana Amount', this.rechargeAmount)
  }

  cast (spellName) {
    const { spell } = this.spells.find(spell => spell.name === spellName)
    if (spell) {
      if (spell.canCast(this)) {
        spell.effect(this)
      } else {
        // notify the player that the spell couldn't be cast
      }
    }
  }

  recharge (dt) {
    const { rechargeAmount, rechargeRate } = this

    if ((this.rechargeTime += dt) >= rechargeRate) {
      this.manaCurrent += rechargeAmount
      this.rechargeTime -= rechargeRate
    }

    if (this.manaCurrent > this.manaTotal) {
      this.manaCurrent = this.manaTotal
    }
  }

  /**
   * Find a spell by its hotkey.
   *
   * @param {number} key A number representing a character key.
   *
   * @return {object}
   */
  getSpellByHotkey (key) {
    return this.spells.find(spell => {
      if (!Array.isArray(spell.hotkey)) {
        return spell.hotkey === key
      } else {
        return spell.hotkey.filter(hotkey => hotkey === key).length > 0
      }
    })
  }

  switchActiveSpell() {
    this.spells.forEach((spell) => {
      if (this.player.controls.keys.key(spell.hotkey)) {
        this.player.activeSpell = spell.name
      }
    })
  }
}

export default SpellCaster