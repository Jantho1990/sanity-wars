import tiledParser from '../titus/utils/tiledParser'
import TileMap from '../titus/TileMap'
import Texture from '../titus/Texture'

const texture = new Texture("resources/tilesets/opp_jungle/Jungle_terrain.png")

class SpellcasterTestLevel extends TileMap {
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
    return {
      player: data.getObjectsByType('player', true),
      enemies: [
        ...data.getObjectsByType('knight', true)
      ]
    }
  }
}

export default SpellcasterTestLevel