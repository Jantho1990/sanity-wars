import TiledLoader from "../titus/TiledLoader";
import PortalMapLevel from "./PortalMapLevel";

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
            this.linkPortals()
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

    // set up portal links
    /* map.spawns.portals.forEach((portal, i) => {
      const { manifest } = this

      const link = this.portalLinkCounter++ % Object.keys(manifest.levels).length

      this.levelLinks.push({
        link,
        level: level.name
      })
      portal.link = {
        link,
        level: level.name
      }
      console.log(this.levelLinks)
    }) */
  }

  linkPortals () {
    const { levels } = this

    levels.forEach((level, i) => {
      if (i - 1 < 0) {
        i = levels.length
      }
      const nextLevel = levels[(i - 1) % levels.length] // remainder is next level
      const prevLevel = levels[(i + 1) % levels.length]// remainder is previous level

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

      /* portals.forEach((portal, j) => {
        const link = {
          link: j,
          level: 
        }
      }) */
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