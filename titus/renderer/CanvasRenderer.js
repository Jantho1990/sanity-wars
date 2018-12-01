import isInCameraView from "./isInCameraView"

/**
 * Handler for rendering game objects in HTML Canvas.
 *
 * @param {number} w The canvas width.
 * @param {number} h The canvas height.
 *
 * @return {self}
 */
class CanvasRenderer {
  constructor(w, h) {
    const canvas = document.createElement("canvas")
    this.w = canvas.width = w
    this.h = canvas.height = h
    this.view = canvas
    this.ctx = canvas.getContext("2d")
    this.ctx.textBaseline = "top" // Render from top-left
  }

  render(container, clear = true) {
    if (container.visible === false) {
      return
    }
    const {
      ctx, w, h
    } = this

    function renderRec(container, camera) {
      if (container.visible === false || container.alpha === 0) {
        return
      }

      if (container.alpha) {
        ctx.save()
        ctx.globalAlpha = container.alpha
      }

      // Render the container children
      let children = container.children

      // Remove map tiles that are off screen
      if (container.mapW && children.length >= camera.w * camera.h) {
        const { tileW, tileH, mapW } = container
        const { pos } = camera
        const offset = {
          x: -pos.x,
          y: -pos.y
        }
        children = []
        let idx = 0
        const xo = Math.floor(offset.x / tileW)
        const yo = Math.ceil(offset.y / tileH)
        const xt = Math.ceil(w / tileW) + xo + 1 // +1 to prevent screen tearing at right edge
        const yt = Math.ceil(h / tileH) + yo
        for (let j = yo; j < yt; j++) {
          for (let i = xo; i < xt; i++) {
            children[idx++] = container.children[j * mapW + i]
          }
        }
      }

      children.forEach(child => {
        // Don't render things that we can't see
        if (child.visible === false || child.alpha === 0) {
          return
        }
        if (camera && child.pos && !isInCameraView(child, camera)) {
          return
        }

        ctx.save()
        if (child.alpha) {
          ctx.globalAlpha = child.alpha
        }
        
        // Draw the leaf node
        if (child.pos) {
          ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y))
        }

        if (child.anchor) {
          ctx.translate(child.anchor.x, child.anchor.y)
        }

        if (child.rotation) {
          const { x, y } = child.pivot ? child.pivot : { x: 0, y: 0 }
          ctx.translate(x, y)
          ctx.rotate(child.rotation)
          ctx.translate(-x, -y)
        }

        if (child.scale) {
          ctx.scale(child.scale.x, child.scale.y)
        }

        if (child.text) {
          const { font, fill, align } = child.style
          if (font) ctx.font = font
          if (fill) ctx.fillStyle = fill
          if (align) ctx.textAlign = align
          ctx.fillText(child.text, 0, 0)
        } else if (child.texture) {
          const img = child.texture.img
          if (child.frame.w) {
            ctx.drawImage(
              img,
              child.frame.x,
              child.frame.y,
              child.frame.w,
              child.frame.h,
              0,
              0,
              child.frame.w,
              child.frame.h
            )
          } else if (child.tileW) {
            ctx.drawImage(
              img,
              child.frame.x * child.tileW, // source x
              child.frame.y * child.tileH, // source y
              child.tileW,
              child.tileH,
              0,
              0,
              child.tileW,
              child.tileH
            )
          } else {
            let { texture, pos } = child
            ctx.drawImage(texture.img, 0, 0)
          }
        } else if (child.style && child.w && child.h) {
          ctx.fillStyle = child.style.fill
          ctx.fillRect(0, 0, child.w, child.h)
        } else if (child.path) {
          const [head, ...tail] = child.path
          if (child.path.length > 1) {
            ctx.fillStyle = child.style.fill || 'hsl(0, 100%, 100%)'
            ctx.beginPath()
            ctx.moveTo(head.x, head.y)
            tail.forEach(({
              x,
              y
            }) => ctx.lineTo(x, y))
            ctx.closePath()
            ctx.fill()
          }
        }

        // Handle the child types
        if (child.children) {
          if (child.worldSize) {
            renderRec(child, child)
          } else {
            renderRec(child, camera)
          }
        }
        ctx.restore()
      })

      if (container.alpha) {
        ctx.restore()
      }
    }
    if (clear) ctx.clearRect(0, 0, this.w, this.h)
    renderRec(container)
  }
}

export default CanvasRenderer