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
    const portals = [
      this.spawnPortal(player),
      this.spawnPortal(player)
    ]

    // hackish way to keep portals from spawning on top of each other
    while (this.spawnedInSameLocation(portals[0], portals[1])) {
      portals[0] = this.spawnPortal(player)
    }

    return {
      player,
      portals
    }
  }

  spawnedInSameLocation(ent1, ent2) {
    return ent1.x === ent2.x &&
           ent1.y === ent2.y
  }

  spawnPlayer () {
    const { mapW, mapH } = this
    let found = false
    let x, y

    // specify where the corners of the this are
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

  spawnPortal (player) {
    const { mapW, mapH } = this
    let found = false
    let x, y

    let tile, tileAbove, tileBelow, distanceToPlayer
    while (!found) {
      x = rand(mapW)
      y = rand(mapH)

      tile = this.tileAtMapPos({ x, y })
      tileAbove = this.tileAtMapPos({ x, y: y - 1 })
      tileBelow = this.tileAtMapPos({ x, y: y + 1 })

      if (tile.frame.walkable &&
          tileAbove.frame.walkable &&
          !tileBelow.frame.walkable) {
        distanceToPlayer = distance(tile.pos, player)
        if (distanceToPlayer > 100) {
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
          const target = avoid[i]
          distanceToTarget = distance(tile.pos, target)
          if (distanceToTarget <= 100) {
            valid = false
            break
          }
          if (valid) {
            found = true
          }
        }
      }
    }

    return {
      x: tile.pos.x,
      y: tile.pos.y
    }
  }

  spawnObjective (objective) {
    // nothing here yet
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
}

export default PortalMapLevel