import tiledParser from '../titus/utils/tiledParser-1_2'
import TileMap from '../titus/TileMap'
import Texture from '../titus/Texture'
import { rand, randOneFrom } from '../titus/utils/math'

const texture = new Texture("resources/tilesets/opp_jungle/Jungle_terrain.png")

class PortalMapLevel extends TileMap {
  constructor (data, parsed) {
    if (!parsed) {
      data = tiledParser(data)
    }
    
    const { tileW, tileH, mapW, mapH, tiles } = data
    super(tiles, mapW, mapH, tileH, tileW, texture)

    this.data = data
  }

  spawnPlayer (player) {
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

    let tile
    while (!found) {
      x = rand(...randOneFrom(cornersX))
      y = rand(...randOneFrom(cornersY))

      tile = this.tileAtMapPos({ x, y })
      const tileBelow = this.tileAtMapPos({ x, y: y + 1 })

      if (tile.frame.walkable && !tileBelow.frame.walkable) {
        // need to also check 
        found = true
      }
    }

    return {
      x: tile.pos.x,
      y: tile.pos.y
    }
  }
}

export default PortalMapLevel