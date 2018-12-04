import Container from '../../titus/Container'
import State from '../../titus/State'
import states from '../states'
import Camera from '../../titus/Camera'
import PortalMapLevel from '../PortalMapLevel'
import TiledLoader from '../../titus/TiledLoader';
import MageChar from '../entities/MageChar';
import MoonTestManifest from '../../resources/manifests/MoonTestManifest'
import EventsHandler from '../../titus/EventsHandler'
import Debug from '../../titus/Debug';
import Eyeball from '../entities/enemies/Eyeball';
import entity from '../../titus/utils/entity';
import { rand, randOneFrom } from '../../titus/utils/math'
import Portal from '../entities/triggers/Portal';
import WorldMap from '../WorldMap'
import { PORTAL_WAIT_TIME } from '../constants';
import { GameData } from '../../titus/Game'
import FinalExit from '../entities/triggers/FinalExit';
import TestEndScreen from './TestEndScreen';
import TomePickup from '../entities/pickups/TomePickup';
import TestEndPartialGoodScreen from './TestEndPartialGoodScreen';
import TestEndGoodScreen from './TestEndGoodScreen';
import SoundPool from '../../titus/sound/SoundPool';

const sounds = {
  music: [
    new SoundPool('resources/music/Techneurotic.mp3')
  ]
}

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

    /* const tiledLoader = new TiledLoader(MoonTestManifest)

    tiledLoader.levelLoad('Map Portal Test 2')
      .then((level => this.setupLevel(level, false)))
      .then(() => this.loaded = true) */
    
    this.worldMap = new WorldMap(MoonTestManifest)
    this.worldMap.onDone(() => {
      this.onWorldMapLoad()
      this.loaded = true
    })

    this.portalTimeCounter = 0
    GameData.set('portal_time_counter', this.portalTimeCounter)

    this.pickupsCounter = 0
    GameData.set('pickups', this.pickupsCounter)

    // not sure if this should go here, but we'll work with it for now
    this.eyeballsCounter = 0
    this.eyeballSpawnRate = 0.33
    this.eyeballSpawnCounter = 0
    this.eyeballsMax = 3
    this.eyeballsMaxRate = 10
    this.eyeballsMaxRateCounter = 0
    this.eyeballsMaxHardLimit = 7

    this.setEndGame()
  }

  setEndGame () {
    EventsHandler.listen('finalExit', () => {
      // Game restart callback
      const callback = () => {
        this.game.setScene(
          new GameScreen(this.game, this.controls, {})
        )
      }

      // Set screen based on number of pickups collected
      let screen
      if (this.pickupsCounter === this.worldMap.levels.length) {
        screen = new TestEndGoodScreen(this.game, this.controls, callback)
      } else if (this.pickupsCounter > 0) {
        screen = new TestEndPartialGoodScreen(this.game, this.controls, callback)
      } else {
        screen = new TestEndScreen(this.game, this.controls, callback)
      }

      this.game.setScene(screen)
    })
  }

  onWorldMapLoad () {
    const {
      camera,
      controls,
      gameState,
      worldMap
    } = this
    const level = worldMap.level('Moon6')
    this.level = level

    const map = level.map
    this.map = camera.add(map)

    const mageChar = new MageChar(controls, map)
    mageChar.pos.x = map.spawns.player.x
    mageChar.pos.y = map.spawns.player.y
    // mageChar.pos.copy(map.spawnPlayer(mageChar))
    // debugger

    this.pickups = camera.add(new Container())
    this.pickups.type = 'pickups'
    map.spawns.pickups.forEach(data => {
      const { x, y } = data
      const pickup = this.pickups.add(new TomePickup())
      pickup.pos.set(x, y)
      // console.log('Pickup at', x, y)
    })
    
    this.portals = camera.add(new Container())
    this.portals.type = 'portals'
    map.spawns.portals.forEach(data => {
      const { x, y, link } = data
      const portal = this.portals.add(new Portal(mageChar, link))
      portal.pos.set(x, y)
      // console.log('Portal at', x, y)
    })

    if (map.spawns.finalExit) {
      this.finalExit = camera.add(new FinalExit(mageChar))
      this.finalExit.pos.copy(map.spawns.finalExit)
      this.finalExit.name = 'Final Exit'
    }

    this.enemies = camera.add(new Container())
    this.enemies.type = 'enemies'

    EventsHandler.listen('changeLevel', ({ link, level: levelName }) => {
      this.state.set(states.UPDATING)
      const { camera, enemies, worldMap, mageChar } = this

      // Save spawns of enemies before unloading them
      this.map.spawns.enemies = []
      enemies.children.forEach(enemy => {
        this.map.spawns.enemies.push({
          x: enemy.pos.x,
          y: enemy.pos.y,
          type: enemy.type || null
        })
      })

      camera.remove(c => c.name === this.map.name)
      camera.remove(c => c.type === 'portals')
      camera.remove(c => c.type === 'pickups')
      camera.remove(c => c.type === 'enemies')
      this.eyeballsCounter = 0

      const level = worldMap.level(levelName)
      this.level = level

      const map = level.map
      this.map = camera.add(map)
      // debugger
      
      mageChar.map = this.map

      this.pickups = camera.add(new Container())
      this.pickups.type = 'pickups'
      map.spawns.pickups.forEach(data => {
        const { x, y } = data
        const pickup = this.pickups.add(new TomePickup())
        pickup.pos.set(x, y)
        // console.log('Pickup at', x, y)
      })

      this.portals = camera.add(new Container())
      this.portals.type = 'portals'
      map.spawns.portals.forEach(data => {
        const { x, y, link } = data
        const portal = this.portals.add(new Portal(mageChar, link))
        portal.pos.set(x, y)
        // console.log('Portal at', x, y)
      })

      if (map.spawns.finalExit) {
        this.finalExit = camera.add(new FinalExit(mageChar))
        this.finalExit.pos.copy(map.spawns.finalExit)
        this.finalExit.name = 'Final Exit'
      } else if (this.finalExit) {
        camera.remove(c => c.name === 'Final Exit')
        delete this.finalExit
      }

      this.enemies = camera.add(new Container())
      this.enemies.type = 'enemies'
      map.spawns.enemies.forEach(data => {
        const { type, x, y, properties = {} } = data

        const enemy = this.enemies.add(this.makeEnemy(type))
        enemy.pos.set(x, y)

        if (type === 'eyeball') {
          this.eyeballsCounter++
        }
      })

      // spawn the player on the newly loaded map, at the link
      // to the portal they triggered in the previous map
      const l = link ? 0 : 1 // hack to select whatever link isn't
      const ppos = this.portals.children[l].pos
      // debugger
      mageChar.pos.copy({
        x: ppos.x,
        y: ppos.y - mageChar.h + 32 // offset of portal height
      })
      // move player back to front of render
      camera.remove(c => c.name === mageChar.name)
      camera.add(mageChar)
      camera.focus()

      this.portalTimeCounter = PORTAL_WAIT_TIME
      GameData.set('portal_time_counter', this.portalTimeCounter)

      this.state.set(states.PLAYING)
    })
    
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
        break
      default:
        throw new Error(`Unknown enemy type (${type}).`)
    }
    return enemy
  }

  collectPickup (pickup) {
    this.pickupsCounter++
    pickup.dead = true

    // remove pickup from level to prevent it reappearing on level change
    const { pickups } = this.map.spawns
    this.map.spawns.pickups = pickups.filter(p => p.x !== pickup.pos.x && p.y !== pickup.pos.y)

    GameData.set('pickups', this.pickupsCounter)
  }

  update (dt, t) {
    const { state } = this
    const { LOADING, READY, PLAYING, GAMEOVER, UPDATING } = states

    window.Debug.addLine('Camera Children', this.camera.children.length)

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
        sounds.music[0].play({
          loop: true
        })
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
      case UPDATING:
        // don't run anything
        break
      case GAMEOVER:
        if (state.first) {
          player.gameOver = true
          sounds.music[0].stop()
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

  updatePlaying (dt, t) {
    // check bullet collision
    const {
      bullets,
      enemies,
      eyeballsCounter,
      eyeballsMax,
      eyeballsMaxHardLimit,
      eyeballsMaxRate,
      eyeballSpawnRate,
      map,
      mageChar,
      pickups,
      portals
    } = this

    if (
      eyeballsCounter < eyeballsMaxHardLimit &&
      eyeballsCounter < eyeballsMax &&
      (this.eyeballSpawnCounter += dt) / eyeballSpawnRate > 1
    ) {
      const eyeball = this.makeEnemy('eyeball')
      eyeball.pos.copy(map.spawnEntity(eyeball, { offMap: true }, mageChar, ...this.enemies.children))
      this.enemies.add(eyeball)
      this.eyeballsCounter++
      // console.log('Enemy spawned at', eyeball.pos.x, eyeball.pos.y)
      this.eyeballSpawnCounter = 0
    }

    // make the game harder by adding more eyeballs as time passes by
    if ((this.eyeballsMaxRateCounter += dt) / eyeballsMaxRate > 1) {
      this.eyeballsMax++
      this.eyeballsMaxRateCounter -= eyeballsMaxRate
    }

    bullets.map(bullet => {
      if (enemies) {
        enemies.map(enemy => {
          if (!bullet.dead && entity.hit(enemy, bullet)) {
            bullet.dead = true
            enemy.hit(bullet.dmg)
            if (enemy.type === 'eyeball') {
              this.eyeballsCounter--
            }
          }
        })
      }
    })

    entity.hits(mageChar, pickups, pickup => this.collectPickup(pickup))

    entity.hits(mageChar, portals, portal => portal.onCollide())

    if (this.finalExit && entity.hit(mageChar, this.finalExit)) {
      this.finalExit.onCollide()
    }

    if (this.portalTimeCounter > 0) {
      this.portalTimeCounter -= dt
      GameData.set('portal_time_counter', this.portalTimeCounter)
    }
  }
}

export default GameScreen