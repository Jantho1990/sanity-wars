import tiledParser from '../titus/utils/tiledParser-1_2'
import TileMap from '../titus/TileMap'
import Texture from '../titus/Texture'
import { rand, randOneFrom, distance } from '../titus/utils/math'

const texture = new Texture("resources/tilesets/opp_jungle/Jungle_terrain.png")

class PortalMapLevel extends TileMap {
  constructor (data, parsed) {
    if (!parsed) {
      data = tiledParser(data)
    }
    
    const { tileW, tileH, mapW, mapH, tiles } = data
    super(tiles, mapW, mapH, tileH, tileW, texture)

    this.spawns = parsed ? data.spawns : this.getSpawnLocations(data)
    this.data = data
  }

  getSpawnLocations (data) {
    const player = this.spawnPlayer()
    let pickup = this.spawnPickup(player)
    let portal1 = this.spawnPortal(player, pickup)
    let portal2 = this.spawnPortal(player, pickup, portal1)

    // hackish way to keep portals from spawning on top of each other
    while (this.spawnedInSameLocation(portal1, portal2)) {
      portal1 = this.spawnPortal(player, pickup, portal2)
    }

    return {
      player,
      pickups: [
        this.pickupOffset(pickup)
      ],
      portals: [
        portal1,
        portal2
      ],
      enemies: []
    }
  }

  /**
   * Hack to center a 16x16 sprite over a 32x32 tile.
   *
   * @param {object} ent A cartesian coordinate.
   *
   * @return {object}
   */
  pickupOffset (ent) {
    return {
      x: ent.x + (this.tileW / 4),
      y: ent.y
    }
  }

  spawnedInSameLocation (ent1, ent2) {
    return ent1.x === ent2.x &&
           ent1.y === ent2.y
  }

  spawnPlayer () {
    const { mapW, mapH } = this
    let found = false
    let x, y

    // specify where the corners of the map are
    const offset = 5 // offset in tiles
    let cornersX = [
      [0, offset],
      [mapW - offset, mapW]
    ]

    const cornersY = [
      [0, offset],
      [mapH - offset, mapH]
    ]

    let tile, tileAbove, tileBelow
    while (!found) {
      x = rand(...randOneFrom(cornersX))
      y = rand(...randOneFrom(cornersY))

      tile = this.tileAtMapPos({ x, y })
      tileAbove = this.tileAtMapPos({ x, y: y - 1 })
      tileBelow = this.tileAtMapPos({ x, y: y + 1 })

      if (tile.frame.walkable &&
          tileAbove.frame.walkable &&
          !tileBelow.frame.walkable) {
        found = true
      }
    }

    return {
      x: tile.pos.x,
      y: tile.pos.y
    }
  }

  spawnPortal (...avoid) {
    const { mapW, mapH } = this
    let found = false
    let x, y

    let tile, tileAbove, tileBelow, distanceToTarget
    while (!found) {
      x = rand(mapW)
      y = rand(mapH)

      tile = this.tileAtMapPos({ x, y })
      tileAbove = this.tileAtMapPos({ x, y: y - 1 })
      tileBelow = this.tileAtMapPos({ x, y: y + 1 })

      if (tile.frame.walkable &&
          tileAbove.frame.walkable &&
          !tileBelow.frame.walkable) {
        let valid = true
        for (let i = 0; i < avoid.length; i++) {
          valid = this.isFarEnoughAway(tile.pos, avoid[i])
          if (!valid) {
            break
          }
        }
        if (valid) {
          found = true
        }
      }
    }

    return {
      x: tile.pos.x,
      y: tile.pos.y
    }
  }

  spawnFinalExit (...avoid) {
    const { mapW, mapH } = this
    let found = false
    let x, y

    let tile, tileAbove, tileBelow, distanceToTarget
    while (!found) {
      x = rand(mapW)
      y = rand(mapH)

      tile = this.tileAtMapPos({ x, y })
      tileAbove = this.tileAtMapPos({ x, y: y - 1 })
      tileBelow = this.tileAtMapPos({ x, y: y + 1 })

      if (tile.frame.walkable &&
          tileAbove.frame.walkable &&
          !tileBelow.frame.walkable) {
        let valid = true
        for (let i = 0; i < avoid.length; i++) {
          valid = this.isFarEnoughAway(tile.pos, avoid[i])
          if (!valid) {
            break
          }
        }
        if (valid) {
          found = true
        }
      }
    }

    return {
      x: tile.pos.x,
      y: tile.pos.y
    }
  }

  spawnPickup (...avoid) {
    const { mapW, mapH } = this
    let found = false
    let x, y

    let tile, tileAbove, tileBelow, distanceToTarget
    while (!found) {
      x = rand(mapW)
      y = rand(mapH)

      tile = this.tileAtMapPos({ x, y })
      tileAbove = this.tileAtMapPos({ x, y: y - 1 })
      tileBelow = this.tileAtMapPos({ x, y: y + 1 })

      if (tile.frame.walkable &&
          tileAbove.frame.walkable &&
          !tileBelow.frame.walkable) {
        let valid = true
        for (let i = 0; i < avoid.length; i++) {
          valid = this.isFarEnoughAway(tile.pos, avoid[i])
          if (!valid) {
            break
          }
        }
        if (valid) {
          found = true
        }
      }
    }

    return {
      x: tile.pos.x,
      y: tile.pos.y
    }
  }

  isFarEnoughAway (ent1, ent2, threshold = 100) {
    const distanceToTarget = distance(ent1, ent2)
    if (distanceToTarget <= threshold) {
      return false
    }
    return true
  }

  setFinalExitSpawn () {
    const { player, portals } = this.spawns
    const otherSpawns = [player, ...portals]
    let finalSpawn = this.spawnFinalExit(...otherSpawns)

    // brute force check to prevent overlaps
    let validSpawn = false
    while (!validSpawn) {
      let valid = true
      otherSpawns.forEach(otherSpawn => {
        if (!valid) return
        if (this.spawnedInSameLocation(finalSpawn, otherSpawn)) {
          finalSpawn = this.spawnFinalExit(...otherSpawns)
          valid = false
        }
      })
      if (valid) {
        validSpawn = true
      }
    }

    this.spawns.finalExit = finalSpawn
  }

  /**
   * Spawn an entity on a random location on the map.
   *
   * @param {object} entity An entity object.
   * @param {object} config Any additional settings.
   * @param {...object} avoid Entities to avoid.
   * 
   * @return {object} The spawned entity.
   */
  spawnEntity (entity, config = {}, ...avoid) {
    const { mapW, mapH, tileW, tileH } = this
    const { onTheGround, offScreen, offMap } = config
    let found = false
    let x, y


    let tile, tileAbove, tileBelow
    while (!found) {
      // this is ugly :(
      if (!offMap) {
        x = rand(mapW)
        y = rand(mapH)

        tile = this.tileAtMapPos({ x, y })

        let groundCheck = true
        if (onTheGround) {
          tileAbove = this.tileAtMapPos({ x, y: y - 1 })
          tileBelow = this.tileAtMapPos({ x, y: y + 1 })
          groundCheck = tileAbove.frame.walkable && !tileBelow.frame.walkable
        }

        if (tile.frame.walkable &&
            groundCheck) {
          found = this.avoidEntities(tile.pos, ...avoid)
          if (found) {
            // this is also ugly :(
            x = tile.pos.x
            y = tile.pos.y
          }
        }
      } else {
        let offset = 300
        let w = mapW * tileW
        let h = mapH * tileH
        x = randOneFrom([
          rand(-offset, 0),
          rand(w, w + offset)
        ]),
        y = randOneFrom([
          rand(-offset, 0),
          rand(h, h + offset)
        ])
        found = this.avoidEntities({ x, y }, ...avoid)
      }      
    }

    // hack
    let type
    if (entity.type) {
      type = entity.type
    }
    if (!type) {
      debugger
    }

    return {
      x,
      y,
      type
    }
  }

  avoidEntities (target, ...avoid) {
    let valid = true
    for (let i = 0; i < avoid.length; i++) {
      valid = this.isFarEnoughAway(target, avoid[i])
      if (!valid) {
        break
      }
    }
    if (valid) {
      return true
    }

    return false
  }
}

export default PortalMapLevel