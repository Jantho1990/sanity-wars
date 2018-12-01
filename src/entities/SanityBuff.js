/**
 * Mechanic entity. By default, it boosts sanity recharge. When
 * sacrificed, it restores player sanity and gives access to a spell,
 * but the player loses the sanity recharge boost.
 */
class SanityBuff {
  constructor (spell, boost = 1.25) {
    this.spell = spell
    this.boost = boost

    this.sacrificed = false
  }

  update (dt, t) {

  }

  sacrifice () {
    this.sacrificed = true
  }
}

export default SanityBuff