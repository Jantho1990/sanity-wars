class TiledData {
  constructor (jsonData, config) {
    const {
      tilewidth: tileW,
      tileheight: tileH,
      width: mapW,
      height: mapH,
      layers,
      tilesets
    } = jsonData

    const {
      layers
    } = config
    
    this.layers = layers || {}

  }

  parseLevel () {

    return this
  }

  getLayer () {
    const layer = layers.find(layer => layer.name === name)
    if (!layer) {
      throw new Error(`Tiled Error: Missing layer "${name}".`)
    }
    return layer
  }

  getTileset () {
    if (!tilesets || !tilesets[idx]) {
      throw new Error(`Tiled Error: Missing tileset index "${idx}".`)
    }
    return tilesets[idx]
  }

}

export default TiledData