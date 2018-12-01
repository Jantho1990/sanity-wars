import Assets from './Assets'

/**
 * An image object.
 *
 * @param {string} url A valid url or data string for an image element.
 * @param {function} onLoad An optional callback function that runs after the image element is loaded.
 *
 * @return {self}
 */
class Texture {
  constructor(url, onLoad = () => {}) {
    this.img = Assets.image(url, (e) => onLoad(this, e))
  }

  /**
   * Replace the original image with a version which removes
   * the specified pixels.
   *
   * @param {array} pixels One or more RGB pixel arrays.
   *
   * @return {void}
   */
  removeTransparencyPixels (...pixels) {
    let { img } = this
    const tc = document.createElement('canvas')
    tc.width = img.width
    tc.height = img.height
    const ctx = tc.getContext('2d')
    ctx.textBaseline = "top" // Render from top-left
    ctx.drawImage(this.img, 0, 0, img.width, img.height)
    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    const data = imageData.data

    pixels.forEach(pixel => {
      for (let i = 0; i < data.length; i += 4) {
        if (
          pixel[0] === data[i] &&
          pixel[1] === data[i + 1] &&
          pixel[2] === data[i + 2]
          ) {
          data[i + 3] = 0
        }
      }
    })

    ctx.putImageData(imageData, 0, 0)
    this.img = Assets.image(tc.toDataURL('image/png'))
  }
}

export default Texture