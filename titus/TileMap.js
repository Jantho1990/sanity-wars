import Container from './Container'
import TileSprite from './TileSprite';

class TileMap extends Container {
  constructor(tiles, mapW, mapH, tileW, tileH, texture) {
    super()
    this.mapW = mapW
    this.mapH = mapH
    this.tileW = tileW
    this.tileH = tileH
    this.w = mapW * tileW
    this.h = mapH * tileH
    this.updateTiles = false

    // Add TileSprites
    this.children = tiles.map((frame, i) => {
      const s = new TileSprite(texture, tileW, tileH)
      s.scale = undefined
      s.anchor = undefined
      s.rotation = undefined
      s.update = () => {}
      s.frame = frame
      s.pos.x = i % mapW * tileW
      s.pos.y = Math.floor(i / mapW) * tileH
      return s
    })
  }

  update (dt, t) {
    if (this.updateTiles) {
      super.update(dt, t)
    }
  }

  pixelToMapPos(pos) {
    const { tileW, tileH } = this
    return {
      x: Math.floor(pos.x / tileW),
      y: Math.floor(pos.y / tileH)
    }
  }

  mapToPixelPos(mapPos) {
    const { tileW, tileH } = this
    return { 
      x: mapPos.x * tileW,
      y: mapPos.y * tileH
    }
  }

  tileAtMapPos(mapPos) {
    return this.children[mapPos.y * this.mapW + mapPos.x]
  }

  tileAtPixelPos(pos) {
    return this.tileAtMapPos(this.pixelToMapPos(pos))
  }

  setFrameAtMapPos(mapPos, frame) {
    const tile = this.tileAtMapPos(mapPos)
    tile.frame = frame
    return tile
  }

  setFrameAtPixelPos(pos, frame) {
    return this.setFrameAtMapPos(this.pixelToMapPos(pos), frame)
  }

  tilesAtCorners(bounds, xo = 0, yo = 0) {
    return [
      [bounds.x, bounds.y], // top-left
      [bounds.x + bounds.w, bounds.y], // top-right
      [bounds.x, bounds.y + bounds.h], // bottom-left
      [bounds.x + bounds.w, bounds.y + bounds.h] // bottom-right
    ].map(([x, y]) => 
      this.tileAtPixelPos({
        x: x + xo,
        y: y + yo
      })
    )
  }

  /**
   * Return a tile's collision objects.
   *
   * @param {object} tile A tile object.
   *
   * @return {object|null}
   */
  getTileCollisions (tile) {
    if (tile.frame.objects) {
      let objects = tile.frame.objects.filter(object => object.type === 'collision')
      if (objects.length > 0) {
        return objects
      }
    }

    return null
  }
}

export default TileMap