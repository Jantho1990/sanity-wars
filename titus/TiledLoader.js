import Assets from "./Assets";

const LOADING = 'loading'
let failCt = 0

class TiledLoader {
  constructor (manifest) {
    const { levels, tilesets, templates } = manifest

    this.levels = {}
    this.levelNames = {}

    this.tilesets = {}
    this.tilesetNames = {}

    this.templates = {}
    this.templateNames = {}

    this.progress = 0
    this.loading = true

    levels.forEach((level) => {
      const { name: levelName, url, tileset } = level

      this.levels[url] = this.loadLevel(levelName, url)
      this.levelNames[levelName] = url
    })
    
    tilesets.forEach((tileset) => {
      const { name: tilesetName, url } = tileset

      this.tilesets[url] = this.loadTileset(tilesetName, url)
      this.tilesetNames[tilesetName] = url
    })
    
    templates.forEach((template) => {
      const { name: templateName, url } = template

      this.templates[url] = this.loadTemplate(templateName, url)
      this.templateNames[templateName] = url
    })
  }

  /**
   * Append a cache-busting string to a url.
   *
   * @param {string} url A url string.
   *
   * @return {string}
   */
  cacheBuster (url) {
    return `${url}?c=${Date.now()}`
  }

  /**
   * Merge a tileset with a target object.
   * 
   * @param {object} target The object to merge into.
   * @param {object} tileset The tileset object.
   * @param {number} i The tileset's index in the level.
   *
   * @return void
   */
  mergeTileset (target, tileset, i) {
    Object.keys(tileset).forEach(prop => {
      target[prop] = tileset[prop] // this should be destructured but I really don't want to haggle with another Babel transpiling issue right now
    })
  }

  /**
   * Merge a template with a level object.
   * 
   * @param {object} template The template object.
   * @param {object} data The data to merge into the template.
   *
   * @return void
   */
  mergeTemplate (template, data) {
    Object.keys(data).forEach(prop => {
      // debugger
      if (!template[prop] || template[prop] == null) {
        template[prop] = data[prop] // this should be destructured but I really don't want to haggle with another Babel transpiling issue right now
      }
    })
  }

  async loadLevel (name, url) {
    if (!name) {
      name = url
    }

    this.progress++
    const { cacheBuster: cb } = this

    const data = await Assets.json(cb(url))

    this.levels[name] = data

    // Load tilesets
    for (let t = 0; t < data.tilesets.length; t++) {
      const tileset = data.tilesets[t]

      const tUrl = `resources/${this.shortenUrl(tileset.source)}`
  
      this.mergeTileset(tileset, await this.loadTileset(null, tUrl), t)
    }

    // Load templates
    const objectLayers = data.layers.filter(layer => layer.type === 'objectgroup')
    for (let i = 0; i < objectLayers.length; i++) {
      const layer = objectLayers[i]
      for (let j = 0; j < layer.objects.length; j++) {
        const object = layer.objects[j]
  
        if (object.template) {
          const templateUrl = `resources/${this.shortenUrl(object.template)}`
          // this.mergeTemplate(object, await this.loadTemplate(null, templateUrl))
          const template = await this.loadTemplate(null, templateUrl)

          // load the tileset associated with the template
          const tUrl = `resources/${this.shortenUrl(template.tileset.source)}`
          this.mergeTileset(template.tileset, await this.loadTileset(null, tUrl))
          this.mergeTemplate(object, template.object)
        }
      }
    }

    this.progress--

    return data
  }

  /**
   * Strip parent directories from a url string.
   *
   * @param {string} url A url string
   *
   * @return {string}
   */
  shortenUrl (url) {
    while (url.startsWith('../')) {
      url = url.slice(3)
    }

    return url
  }

  async loadTileset (name, url) {
    if (!name) {
      name = url
    }

    this.progress++

    if (name && this.tilesets[name]) {
      return this.tilesets[name]
    }

    const { cacheBuster: cb } = this

    const data = await Assets.json(cb(url))

    name = data.name

    this.tilesets[name] = data

    this.progress--

    return data
  }

  async loadTemplate (name, url) {
    if (!name) {
      name = url
    }

    this.progress++

    if (name && this.templates[name]) {
      return this.templates[name]
    }

    const { cacheBuster: cb } = this

    const data = await Assets.json(cb(url))

    name = data.name

    this.templates[name] = data

    this.progress--

    return data
  }

  getLevel (name) {
    return this.levels[this.levelNames[name]]
  }

  get onLoad () {
    return new Promise(() => {
      if (this.progress === 0) {
        Promise.resolve(this)
      }
    })
  }

  async levelLoad (level) {
    return await this.getLevel(level)
  }

  async tilesetLoad (tileset) {
    return await this.tilesets[tileset]
  }
}

export default TiledLoader