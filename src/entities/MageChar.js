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
    this.hpCurrent = 10
    this.hpTotal = 10

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

    this.activeSpell = this.spellcaster.spells[0].spell.name

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
    super.update(dt, t)
    this.spellcaster.update(dt, t)
    this.buffs.update(dt, t)
    this.updateGameData()

    // hack to stop walk
    if (this.vel.x === 0) {
      this.anims.play('stand')
    }
  }

  left () {
    super.left()

    this.anims.play('walk')
    
    // flip animation direction
    this.anchor.x = 0
    this.scale.x = 1
  }

  right () {
    super.right()

    this.anims.play('walk')

    // flip animation direction
    this.anchor.x = this.w
    this.scale.x = -1
  }

  up () {
    if (!this.falling) {
      sounds.jump.play()
    }
    super.up()
  }

  cast () {
    this.spellcaster.cast(this.activeSpell)
    this.anims.play('slap', 1)
  }

  switchActiveSpell () {
    this.spellcaster.spells.forEach((spell) => {
      if (this.controls.keys.key(spell.hotkey)) {
        this.activeSpell = spell.name
      }
    })
  }

  addBuff (buff) {
    this.buffs.add(buff)
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