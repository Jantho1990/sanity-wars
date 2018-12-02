import Container from '../../titus/Container'
import State from '../../titus/State'
import states from '../states'
import Camera from '../../titus/Camera'
import PortalMapLevel from '../PortalMapLevel'
import TiledLoader from '../../titus/TiledLoader';
import MageChar from '../entities/MageChar';
import PortalMapManifest from '../../resources/manifests/PortalMapManifest'
import EventsHandler from '../../titus/EventsHandler'
import Debug from '../../titus/Debug';
import Eyeball from '../entities/enemies/Eyeball';
import entity from '../../titus/utils/entity';
import { rand, randOneFrom } from '../../titus/utils/math'
import Portal from '../entities/triggers/Portal';

class GameScreen extends Container {
  constructor (game, controls, gameState) {
    const { LOADING } = states
    super()

    this.w = game.w
    this.h = game.h
    this.game = game

    // game.speed = 5 // slow the game down

    this.controls = controls

    this.gameState = gameState

    this.state = new State(LOADING)

    this.camera = this.add(new Camera(null, {
      w: game.w,
      h: game.h
    }))

    const tiledLoader = new TiledLoader(PortalMapManifest)

    tiledLoader.levelLoad('Map Portal Test 1')
      .then((level => this.setupLevel(level, false)))
      .then(() => this.loaded = true)
  }

  setupLevel (json, parsed) {
    const { camera, controls, gameState } = this

    const map = new PortalMapLevel(json, parsed)
    this.map = camera.add(map)

    const mageChar = new MageChar(controls, map)
    mageChar.pos.x = map.spawns.player.x
    mageChar.pos.y = map.spawns.player.y
    // mageChar.pos.copy(map.spawnPlayer(mageChar))
    // debugger

    this.portals = camera.add(new Container())
    map.spawns.portals.forEach(data => {
      const { x, y } = data
      const portal = this.portals.add(new Portal(mageChar))
      portal.pos.set(x, y)
      console.log('Portal at', x, y)
    })

    /* this.enemies = camera.add(new Container())
    map.spawns.enemies.forEach(data => {
      const { type, x, y, properties = {} } = data
      const enemy = this.enemies.add(this.makeEnemy(type))
      enemy.pos.set(x, y)
    }) */

    this.bullets = camera.add(new Container())
    EventsHandler.listen('addBullet', bullet => {
      this.bullets.add(bullet)
    })

    // need to spawn player last so they appear above other graphics
    this.mageChar = camera.add(mageChar)

    camera.worldSize = { w: map.w, h: map.h }
    camera.setSubject(mageChar)
  }

  makeEnemy (type) {
    let enemy
    switch (type) {
      case 'eyeball':
        enemy = new Eyeball(this.mageChar)
        break;
    }
    return enemy
  }

  update (dt, t) {
    const { state } = this
    const { LOADING, READY, PLAYING, GAMEOVER } = states

    switch (state.get()) {
      case LOADING:
        // this.scoreText.text = '...'
        if (this.loaded) {
          state.set(READY)
        } else {
          console.log('not ready')
        }
        break;
      case READY:
        state.set(PLAYING)
        if (state.first) {
          // this.scoreText.text = 'GET READY'
        }
        if (state.time > 2) {
          // this.scoreText.text = '0'
          // state.set(PLAYING)
        }
        break
      case PLAYING:
        super.update(dt, t)
        this.updatePlaying(dt)
        break
      case GAMEOVER:
        if (state.first) {
          player.gameOver = true
        }
        super.update(dt, t)

        // Wait for space bar to restart
        if (player.gameOver && controls.keys.action) {
          this.screens.onReset()
        }
        break
    }
    state.update(dt)
  }

  updatePlaying (dt) {
    // check bullet collision
    const { bullets, enemies, mageChar, portals } = this

    bullets.map(bullet => {
      if (enemies) {
        enemies.map(enemy => {
          if (entity.hit(enemy, bullet)) {
            bullet.dead = true
            enemy.hit(bullet.dmg)
          }
        })
      }
    })

    entity.hits(mageChar, portals, portal => portal.onCollide())
  }
}

export default GameScreen