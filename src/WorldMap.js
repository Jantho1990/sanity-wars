import TiledLoader from "../titus/TiledLoader";
import PortalMapLevel from "./PortalMapLevel";
import math from '../titus/utils/math'

let finalExitRandomArray = []

/**
 * Manager for loading multiple connected level-maps.
 */
class WorldMap {
  constructor (manifest) {
    this.callbacks = []
    this.levels = []
    this.levelLinks = []
    this.manifest = manifest
    this.progress = 0
    this.loaded = false
    
    this.portalLinkCounter = 0

    this.finalExit = null

    const levelLoader = new TiledLoader(manifest)

    const { levels } = manifest

    levels.forEach((level, i) => {
      this.levels[i] = {
        name: level.name
      }
      this.progress++
      levelLoader.levelLoad(level.name)
        .then(data => this.setupLevel(this.levels[i], data))
        .then(() => {
          if (--this.progress === 0) {
            this.seedFinalExitRandomArray()
            this.linkPortals()
            this.createFinalExit()
            this.loaded = true
            this.callbacks.forEach(cb => cb(this))
          }
        })
    })
  }
  
  setupLevel (level, json, parsed = false) {
    const map = new PortalMapLevel(json, parsed)
    level.map = map
    level.map.name = level.name

    
  }

  createFinalExit () {
    const { levels } = this
    levels.forEach((level, i) => {
      if (this.isFinalExit(i)) {
        level.map.setFinalExitSpawn() 
      }
    })
  }

  seedFinalExitRandomArray () {
    const { levels } = this
    finalExitRandomArray = [] // quick fix to reset the randomness on game restart
    let seeded = false
    levels.forEach((l, i) => {
      let v = 0
      if (!seeded) {
        v = math.rand(0, 4)
        if (v % 2 === 1) {
          seeded = true
          v = 1
        } else if (i === levels.length - 1) {
          v = 1
        } else {
          v = 0
        }
      }
      finalExitRandomArray.push(v)
    })
  }

  isFinalExit (i) {
    return finalExitRandomArray[i]
  }

  linkPortals () {
    const { levels } = this

    levels.forEach((level, i) => {
      if (i - 1 < 0) {
        i = levels.length
      }
      const nextLevel = levels[(i + 1) % levels.length] // remainder is next level
      const prevLevel = levels[(i - 1) % levels.length]// remainder is previous level

      // we are assuming only two portals
      const { portals } = level.map.spawns
      portals[0].link = {
        link: 0,
        level: prevLevel.name
      }
      portals[1].link = {
        link: 1,
        level: nextLevel.name
      }
      // console.log(portals, level.name)
    })
  }

  level (name) {
    return this.levels.find(level => level.name === name)
  }

  /**
   * Add callback to run when all levels are loaded.
   */
  onDone (cb) {
    this.callbacks.push(cb)
  }
}

export default WorldMap