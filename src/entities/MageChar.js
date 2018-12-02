import PlayerChar from './PlayerChar'
import Texture from '../../titus/Texture'
import SanityCaster from '../systems/SanityCaster'
import Container from '../../titus/Container'
import SoundPool from '../../titus/sound/SoundPool'
import { GameData } from '../../titus/Game';

const texture = new Texture('resources/characters/mage/sara-cal.png', (t, e) => {
  if (t.img.src.indexOf('data:image') === -1) {
    t.removeTransparencyPixels([255, 0, 255])
  }
})

const sounds = {
  jump: new SoundPool('resources/sounds/jump.wav')
}

const animations = {
  'stand': [
    { x: 0, y: 8, w: 32, h: 48 }
  ],
  'slap': [
    { x: 36, y: 8, w: 32, h: 48 },
    { x: 72, y: 8, w: 32, h: 48 },
    { x: 108, y: 8, w: 32, h: 48 }
  ],
  'bow': [
    { x: 188, y: 72, w: 40, h: 48 },
    { x: 232, y: 72, w: 40, h: 48 },
    { x: 276, y: 72, w: 40, h: 48 }
  ],
  'dying': [
    { x: 36, y: 136, w: 32, h: 48 },
    { x: 72, y: 136, w: 32, h: 48 },
    { x: 112, y: 152, w: 56, h: 32 }
  ],
  'walk': [
    { x: 0, y: 72, w: 32, h: 48 },
    { x: 36, y: 72, w: 32, h: 48 },
    { x: 72, y: 72, w: 32, h: 48 }
  ]
}


class MageChar extends PlayerChar {
  constructor (controls, map) {
    const actions = {
      up: 38, // up arrow
      down: 40, // down arrow
      left: 37, // left arrow
      right: 39, // right arrow
      cast: 32, // spacebar
      switchActiveSpell: [49, 50]
    }
    
    super (controls, map, {
      texture,
      actions,
      animations
    })
    
    this.name = "Mage"

    this.canMove = true
    this.dying = false
    this.hasDied = false

    this.spellcaster = new SanityCaster(this, [
      {
        name: 'Fireball',
        cost: 20,
        cooldown: 0.25,
        hotkey: 49
      },
      {
        name: 'Levitate',
        cost: 20,
        cooldown: 5,
        duration: 3,
        hotkey: 50
      }
    ], {
      manaTotal: 100,
      manaCurrent: 100
    })

    this.hp = {
      current: this.spellcaster.manaCurrent,
      total: this.spellcaster.manaTotal
    }

    this.buffs = new Container()
    
    this.hitBox = {
      x: 0,
      y: 0,
      w: 32,
      h: 48
    }

    this.anims.addBulk([
      ['stand', animations.stand, 0.0667],
      ['slap', animations.slap, 0.0667],
      ['bow', animations.bow, 0.0667],
      ['dying', animations.dying, 0.0667],
      ['walk', animations.walk, 0.0667]
    ])

    this.anims.play('stand')

    this.updateGameData()
  }

  update (dt, t) {
    if (this.hasDied) {
      return
    }
    super.update(dt, t)
    this.spellcaster.update(dt, t)
    this.buffs.update(dt, t)
    this.updateGameData()

    this.hp.current = this.spellcaster.manaCurrent

    if (!this.hasDied && this.dying) {
      this.anims.play('dying', 1)
      if (this.anims.getCurrentFrame() === this.anims.currentAnim.frames.length - 1) {
        this.hasDied = true
        this.dying = false
      }
    } else if (this.hp.current <= 0) {
      this.die()
    }

    window.Debug.addLine('HP', this.hp.current)

    // hack to stop walk
    if (!this.hasDied && !this.dying && this.vel.x === 0) {
      this.anims.play('stand')
    }
  }

  left () {
    if (!this.canMove) {
      return
    }

    super.left()

    this.anims.play('walk')
    
    // flip animation direction
    this.anchor.x = 0
    this.scale.x = 1
  }

  right () {
    if (!this.canMove) {
      return
    }

    super.right()

    this.anims.play('walk')

    // flip animation direction
    this.anchor.x = this.w
    this.scale.x = -1
  }

  up () {
    if (!this.canMove) {
      return
    }

    if (!this.falling) {
      sounds.jump.play()
    }
    super.up()
  }

  cast () {
    if (!!this.activeSpell) {
      this.spellcaster.cast(this.activeSpell)
      this.anims.play('slap', 1)
    }
  }

  switchActiveSpell (key) {
    const { spellcaster } = this
    const spell = spellcaster.getSpellByHotkey(key)

    if (spellcaster.isSacrificed(spell)) {
      this.activeSpell = spell.name
    } else {
      spellcaster.sacrifice(spell)
    }
  }

  afterSwitchActiveSpell () {
    this.spellcaster.cancelSacrifice()
  }

  addBuff (buff) {
    this.buffs.add(buff)
  }

  hit (dmg) {
    this.hp.current -= dmg

    if (this.hp.current <= 0) {
      this.die()
    }
  }

  die () {
    // this.anims.play('dying', 1)
    this.canMove = false
    this.dying = true
  }

  updateGameData () {
    const {
      spellcaster: {
        manaTotal,
        manaCurrent
      }
    } = this

    GameData.set('player', {
      manaTotal,
      manaCurrent
    })
  }
}

export default MageChar