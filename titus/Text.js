import Vec from './utils/Vec'
import { convertUnit } from './utils/conversion';

class Text {
    constructor (text = "", style = {}) {
        this.pos = new Vec()
        this.style = style
        this.text = text
        this.setTextDimensions()
    }

    set text (value) {
        this.textValue = value

        this.setTextDimensions()
    }

    get text () {
        return this.textValue
    }

    get w () {
        return this.width
    }

    get h () {
        return this.height
    }

    render (ctx) {
        const { font, fill, align, baseline } = this.style
        
        if (font) ctx.font = font
        if (fill) ctx.fillStyle = fill
        if (align) ctx.textAlign = align
        if (baseline) ctx.textBaseline = baseline

        ctx.fillText(this.text, 0, 0)
    }

    fontSize () {
        return this.style.font.split(' ')[0]
    }

    /**
     * Set the rendered width and height of this text.
     * Inspired by https: //stackoverflow.com/questions/33777577/javascript-get-actual-rendered-font-height
     *
     * @return void
     */
    setTextDimensions () {
        let tempCanvas = document.createElement('canvas')
        let ctx = tempCanvas.getContext('2d')
        
        // Need to render to get the width
        this.render(ctx)

        this.width = ctx.measureText(this.text).width
        this.height = convertUnit(this.fontSize(), 'px')
    }
}

export default Text