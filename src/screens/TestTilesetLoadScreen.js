import Container from '../../titus/Container'
import State from '../../titus/State'
import states from '../states'
import Camera from '../../titus/Camera'
import TestTilesetLoadLevel from '../TestTilesetLoadLevel'
import Assets from '../../titus/Assets'
import entity from '../../titus/utils/entity';
import MageTileSprite from '../entities/MageTileSprite';
import MageFrameTileSprite from '../entities/MageFrameTileSprite';
import TiledLoader from '../../titus/TiledLoader';

class TestTilesetLoadScreen extends Container {
  constructor (game, controls, gameState) {
    const { LOADING } = states
    super()
    // game.speed = 5
    this.w = game.w
    this.h = game.h
    this.game = game

    this.controls = controls

    this.gameState = gameState

    this.state = new State(LOADING)

    this.camera = this.add(new Camera(null, {
      w: game.w,
      h: game.h
    }))

    const tiledLoader = new TiledLoader({
      'levels': [
        {
          'name': 'Level 1', 
          'url': 'resources/levels/TestTilesetLoad.json',
          'tileset': 'DirtTiles'
        }
      ],
      'tilesets': [
        {
          'name': 'DirtTiles',
          'url': 'resources/tilesets/dirt-tiles/DirtTiles.json'
        }
      ]
    })

    tiledLoader.levelLoad('Level 1')
      .then((level => this.setupLevel(level, false)))
      .then(() => this.loaded = true)

    /* // Either load from url or memory
    const levelUrl = `resources/levels/TestTilesetLoadScreen.json?c=${Date.now()}`
    const tilesetUrl = `resources/tilesets/dirt-tiles/DirtTiles.json?c=${Date.now()}`
    const serialized = gameState.data[gameState.level]
    const level = serialized ?
      Promise.resolve(serialized) :
      Assets.json(levelUrl)
    const tileset = serialized.tileset ?
      Promise.resolve(serialized.tileset) :
      Assets.json(tilesetUrl)

    level.then(json => this.mergeTileset(json, tileset))
      .then(json => this.setupLevel(json, !!serialized))
      .then(() => {
      // Level is loaded
      this.loaded = true
      if (gameState.spawn) {
        this.mageTileSprite.pos.copy(this.map.mapToPixelPos(gameState.spawn))
      }
    }) */
  }

  setupLevel (json, parsed) {
    // debugger
    const { camera, controls, gameState } = this

    const map = new TestTilesetLoadLevel(json, parsed)
    this.map = camera.add(map)
    camera.worldSize = { w: map.w, h: map.h }
    // camera.setSubject(this.mageTileSprite)
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
    // nothing here yet
  }
}

export default TestTilesetLoadScreen