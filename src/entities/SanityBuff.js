import Sound from "../../titus/sound/Sound";

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
    this.sound = new Sound('resources/sounds/MageScream.mp3')
  }

  update (dt, t) {

  }

  sacrifice () {
    this.sacrificed = true
    this.sound.play()
  }
}

export default SanityBuff