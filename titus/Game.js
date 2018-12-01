import Container from './Container'
import CanvasRenderer from './renderer/CanvasRenderer'
import Assets from './Assets'
import Debug from './Debug';
import EventsHandler from './EventsHandler';
import DataStore from './DataStore';

const STEP = 1 / 60
let MULTIPLIER = 1
let SPEED = STEP * MULTIPLIER
const MAX_FRAME = SPEED * 5

let frames = 0
let curSec = 1

/**
 * The global game data container.
 */
export const GameData = new DataStore()

/**
 * Handles the main game loop and logic.
 */
class Game {
  constructor(w, h, parent = "#board") {
    // Use the debug console
    window.Debug = new Debug()
    window.Debug.showConsole()
    this.w = w
    this.h = h
    this.renderer = new CanvasRenderer(w, h)
    document.querySelector(parent).appendChild(this.renderer.view)
    this.scene = new Container()

    this.fadeTime = 0
    this.fadeDuration = 0
    this.transitioning = false

    this.frames = 0
    this.gamesRunning = 0
  }

  setScene(scene, duration = 0.5) {
    if (!duration) {
      this.scene = scene
      return
    }
    this.transitioning = true
    this.destination = scene
    this.fadeTime = duration
    this.fadeDuration = duration
  }

  setUserInterface (userInterface) {
    this.userInterface = userInterface
  }

  /**
   * Run the main game loop.
   * 
   * @param {function} gameUpdate Optional function run after the main update sequence.
   * @return void
   */
  run(gameUpdate = () => {}) {
    Assets.onReady(() => {
      if (window.Debug) this.gamesRunning++
      let dt = 0
      let last = 0
      const loop = ms => {
        const { scene, renderer, fadeTime } = this

        if (window.Debug) {
          window.Debug.addLine('Games Running', this.gamesRunning)
        }
        
        const t = ms / 1000 // Convert to seconds
        if (window.Debug) this.framesPerSecond(t)
        dt += Math.min(t - last, MAX_FRAME) // prevent ginormous jump in dt
        last = t
        
        // Apply any updates that should have happened
        while (dt >= SPEED) {
          this.scene.update(STEP, t / MULTIPLIER)
          gameUpdate(STEP, t / MULTIPLIER)
          dt -= SPEED

          // Render goes here so we don't paint when absolutely nothing was updated
          if (dt < SPEED) {
            renderer.render(scene)
          }

          if (this.userInterface && !this.transitioning) {
            this.userInterface.update(dt, t)
          }
        }
        
        // Screen transition
        if (fadeTime > 0) {
          const { fadeDuration, destination } = this
          const ratio = fadeTime / fadeDuration
          this.scene.alpha = ratio
          destination.alpha = 1 - ratio
          renderer.render(destination, false)
          if ((this.fadeTime -= STEP) <= 0) {
            this.scene = destination
            this.destination = null
          }
        } else {
          this.transitioning = false
        }
        if (window.Debug) window.Debug.update()
        EventsHandler.update()

        requestAnimationFrame(loop)
      }

      const init = ms => {
        last = ms / 1000
        requestAnimationFrame(loop)
      }

      requestAnimationFrame(init)
    })
  }

  /**
   * The game running speed.
   */
  get speed() {
    return MULTIPLIER
  }

  /**
   * Set the game running speed.
   */
  set speed(speed) {
    MULTIPLIER = speed
    SPEED = STEP * MULTIPLIER
  }

  framesPerSecond (t) {
    if (t / curSec > 1) {
      frames = this.frames
      this.frames = 0
      curSec++
    }
    this.frames++
    window.Debug.addLine('Frames', frames)
  }

  /**
   * Get a pixel at a specified percent of a specified dimension.
   * @param {number | string} percent A percent, either a number or a string with the percent symbol.
   * @param {number} dimension The size of the dimension being percented.
   */
  static pixelAtPercent (percent, dimension) {
    if (typeof percent === 'string') {
      percent = Number(percent.substr(0, percent.indexOf('%')))
    }

    return percent / 100 * dimension
  }

  /**
   * Get a pixel at a specified percentage of the game width.
   * @param {number | string} percent A percent, either a number of a string with the percent symbol.
   * @return {number}
   */
  percentOfGameWidth(percent) {
    return Game.pixelAtPercent(percent, this.w)
  }

  /**
   * Get a pixel at a specified percentage of the game height.
   * @param {number | string} percent A percent, either a number of a string with the percent symbol.
   * @return {number}
   */
  percentOfGameHeight(percent) {
    return Game.pixelAtPercent(percent, this.h)
  }

  /**
   * Get a pixel at a specified percentage of the game width, offset by the center of an entity.
   * @param {number | string} percent A percent, either a number of a string with the percent symbol.
   * @param  { object } entity A game entity with a width dimension.
   * @return {number}
   */
  percentOfGameWidthCentered(percent, entity) {
    let offset = entity.w / 2
    return Game.pixelAtPercent(percent, this.w) - offset
  }

  /**
   * Get a pixel at a specified percentage of the game height, offset by the center of an entity.
   * @param {number | string} percent A percent, either a number of a string with the percent symbol.
   * @param  { object } entity A game entity with a height dimension.
   * @return {number}
   */
  percentOfGameHeightCentered(percent, entity) {
    let offset = entity.h / 2
    return Game.pixelAtPercent(percent, this.h) - offset
  }
}

export default Game