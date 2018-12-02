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

  getSpawnLocations(data) {
    const player = this.spawnPlayer()
    const portals = [
      this.spawnPortal(player),
      this.spawnPortal(player)
    ]

    return {
      player,
      portals
    }
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

  spawnPortal(player) {
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

  spawnExit(exit) {
    // nothing here yet
  }

  spawnObjective(objective) {
    // nothing here yet
  }
}

export default PortalMapLevel