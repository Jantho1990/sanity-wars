import TiledLoader from "../titus/TiledLoader";
import PortalMapLevel from "./PortalMapLevel";

/**
 * Manager for loading multiple connected level-maps.
 */
class WorldMap {
  constructor (manifest) {
    this.callbacks = []
    this.levels = {}
    this.progress = 0
    this.loaded = false

    const levelLoader = new TiledLoader(manifest)

    const { levels } = manifest

    levels.forEach(level => {
      this.levels[level.name] = {}
      this.progress++
      levelLoader.levelLoad(level.name)
        .then(data => this.setupLevel(this.levels[level.name], data))
        .then(() => {
          if (--this.progress === 0) {
            this.loaded = true
            this.callbacks.forEach(cb => cb(this))
          }
        })
    })

  }
  
  setupLevel (level, json, parsed = false) {
    const map = new PortalMapLevel(json, parsed)
    level.map = map

  }

  level (name) {
    return this.levels[name]
  }

  /**
   * Add callback to run when all levels are loaded.
   */
  onDone (cb) {
    this.callbacks.push(cb)
  }
}

export default WorldMap