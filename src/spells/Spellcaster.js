import Spells from './SpellsList'

class Spellcaster {
  constructor (player, spells, config) {
    const {
      manaTotal,
      manaCurrent
    } = config

    this.manaTotal = manaTotal
    this.manaCurrent = manaCurrent || manaTotal

    this.rechargeAmount = 20
    this.rechargeRate = 1
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
}

export default Spellcaster