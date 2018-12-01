const cache = {}
const readyListeners = []
const progressListeners = []

let completed = false
let remaining = 0
let total = 0

/**
 * Tells the loader how many assets to expect. Useful
 * for asynchronous loading.
 */
let expecting = 0


/**
 * A callback which runs after an element or entity loads.
 *
 * @param {mixed} e The element or entity which was loaded.
 *
 * @return {void}
 */
function onAssetLoad (e) {
  if (completed) {
    console.warn('Warning: asset defined after preload.', e.target || e)
    return
  }

  remaining--
  progressListeners.forEach(cb => cb(total - remaining, total))
  if (remaining === 0) {
    done()
  }
}

/**
 * Runs when all assets are loaded.
 *
 * @return {void}
 */
function done () {
  completed = true
  readyListeners.forEach(cb => cb())
}

/**
 * Loads an asset, either from the asset cache or from the provided url.
 *
 * @param {string} url 
 * @param {function} maker
 *
 * @return {mixed} 
 */
function load (url, maker) {
  let cacheKey = url
  while (cacheKey.startsWith('../')) {
    cacheKey = cacheKey.slice(3)
  }
  if (cache[cacheKey]) {
    return cache[cacheKey]
  }
  const asset = maker(url, onAssetLoad)
  remaining++
  total++

  cache[cacheKey] = asset
  return asset
}

/**
 * An assets manager for data which needs to be loaded via url.
 */
class Assets {
  /**
   * Returns true if all assets have been loaded.
   */
  static completed () {
    return completed
  }

  /**
   * Increase the expected assets counter.
   * @param {number} num The number of expected assets.
   *
   * @return {void}
   */
  static incrementExpecting(num) {
    expecting += num
  }

  /**
   * Decrease the expected assets counter.
   * @param {number} num The number of expected assets.
   *
   * @return {void}
   */
  static decrementExpecting(num) {
    expecting -= num
  }

  /**
   * Return the count of expected assets.
   *
   * @return {number}
   */
  static expecting () {
    return expecting
  }

  /**
   * Adds a callback function to run when all assets are loaded.
   *
   * @param {callback} cb A callback function.
   *
   * @return {mixed|void}
   */
  static onReady (cb) {
    if (completed) {
      return cb()
    }

    readyListeners.push(cb)
    if (remaining === 0) {
      done()
    }
  }

  /**
   * Adds a callback function to run when an asset is loaded.
   *
   * @param {callback} cb A callback function.
   *
   * @return {void}
   */
  static onProgress (cb) {
    progressListeners.push(cb)
  }

  /**
   * Loads an image asset.
   *
   * @param {string} url The image url.
   * @param {?callback} cb A callback function.
   *
   * @return {Image}
   */
  static image (url, cb = null) {
    return load(url, (url, onAssetLoad) => {
      const img = new Image()
      img.src = url
      img.addEventListener('error', e => {
        throw new Error(`An image failed to load. ("${url}")`)
      })
      img.addEventListener('load', (e) => {
        if (cb) {
          cb(e)
        }
        onAssetLoad(e)
      } , false)
      return img
    })
  }

  /**
   * Loads an audio asset.
   *
   * @param {string} url The sound url.
   *
   * @return {Sound}
   */
  static sound (url) {
    return load(url, (url, onAssetLoad) => {
      const audio = new Audio()
      audio.src = url
      audio.addEventListener('error', e => {
        throw new Error(`An audio source failed to load. ("${url}")`)
      })
      const onLoad = e => {
        audio.removeEventListener('canplay', onLoad, false)
        onAssetLoad(e)
      }
      audio.addEventListener('canplay', onLoad, false)
      return audio
    }).cloneNode()
  }

  /**
   * Loads a JSON asset.
   *
   * @param {string} url The JSON file url.
   *
   * @return {Object} 
   */
  static json (url) {
    return load(url, (url, onAssetLoad) => 
      fetch(url)
        .then(res => res.json())
        .then(json => {
          onAssetLoad(url)
          return json
        }).catch(e => console.log(e))
    )
  }
}

export default Assets