class Spell {
  constructor (config) {
    const {
      cost,
      cooldown,
      name
    } = config

    if (!name) {
      throw new Error('Spell must have a name.')
    }

    this.cost = cost
    this.cooldown = cooldown || 5
    this.lastFired = cooldown || 5
    this.fired = false
    this.name = name
  }

  update (dt, t) {
    if (this.fired) {
      this.lastFired += dt
    }

    if (this.fired && this.lastFired >= this.cooldown) {
      this.fired = false
    }
  }

  canCast (spellcaster) {
    const { cost, cooldown, lastFired } = this

    if (
      this.hasEnoughMana(cost, spellcaster.manaCurrent) &&
      this.hasCooledDown(cooldown, lastFired)
    ) {
      return true
    }

    return false
  }

  hasEnoughMana (cost, available) {
    return cost <= available
  }

  hasCooledDown (cooldown, lastFired) {
    return lastFired >= cooldown
  }

  effect (spellcaster) {
    // this is where the magic happens (cue groan)
    this.fired = true
    this.lastFired = 0
    spellcaster.manaCurrent -= this.cost
  }
}

export default Spell