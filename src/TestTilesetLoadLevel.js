import tiledParser from '../titus/utils/tiledParser'
import TileMap from '../titus/TileMap'
import Texture from '../titus/Texture'

const texture = new Texture("resources/tilesets/dirt-tiles/dirt-tiles.png")

class TestTilesetLoadLevel extends TileMap {
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
      // tile: data.getObjectByName('tile', true),
      // frame: data.getObjectByName('frame', true)
    }
  }
}

export default TestTilesetLoadLevel