import Container from '../../titus/Container'
import State from '../../titus/State'
import states from '../states'
import Camera from '../../titus/Camera'
import TestFrameSpriteAnimationLevel from '../TestFrameSpriteAnimationLevel'
import Assets from '../../titus/Assets'
import entity from '../../titus/utils/entity';
import MageTileSprite from '../entities/MageTileSprite';
import MageFrameTileSprite from '../entities/MageFrameTileSprite';

class TestFrameSpriteAnimationScreen extends Container {
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

    // Either load from url or memory
    const levelUrl = `resources/levels/TestFrameSpriteAnimation.json?c=${Date.now()}`
    const serialized = gameState.data[gameState.level]
    const level = serialized ?
      Promise.resolve(serialized) :
      Assets.json(levelUrl)

    level.then(json => this.setupLevel(json, !!serialized)).then(() => {
      // Level is loaded
      this.loaded = true
      if (gameState.spawn) {
        this.mageTileSprite.pos.copy(this.map.mapToPixelPos(gameState.spawn))
      }
    })
  }

  setupLevel (json, parsed) {
    const { camera, controls, gameState } = this

    const map = new TestFrameSpriteAnimationLevel(json, parsed)
    this.map = camera.add(map)

    const mageTileSprite = new MageTileSprite()
    mageTileSprite.pos.x = map.spawns.tile.x
    mageTileSprite.pos.y = map.spawns.tile.y
    this.mageTileSprite = camera.add(mageTileSprite)
    
    const mageFrameTileSprite = new MageFrameTileSprite()
    mageFrameTileSprite.pos.x = map.spawns.frame.x
    mageFrameTileSprite.pos.y = map.spawns.frame.y
    this.mageFrameTileSprite = camera.add(mageFrameTileSprite)

    camera.worldSize = { w: map.w, h: map.h }
    camera.setSubject(this.mageTileSprite)
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

export default TestFrameSpriteAnimationScreen