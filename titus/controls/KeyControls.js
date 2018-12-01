let dbg = 0
class KeyControls {
    constructor () {
        this.keys = {}
        this.holding = {}
        this.pressing = {}
        // Bind event handlers
        document.addEventListener("keydown", e => {
            if ([37,38,39,40,32].indexOf(e.which) >= 0) {
                e.preventDefault()
            }
            this.keys[e.which] = true

            if (!this.isBeingPressed(e.which) && !this.isBeingHeld(e.which)) {
                this.pressing[e.which] = true
            } else if (this.isBeingPressed(e.which)) {
                this.pressing[e.which] = false
                this.holding[e.which] = true
            }
        }, false)

        document.addEventListener("keyup", e => {
            this.keys[e.which] = false
            this.pressing[e.which] = false
            this.holding[e.which] = false
        }, false)
    }

    /**
     * Check if a key is being held down.
     *
     * @param {number} key A number corresponding to an ASCII key number.
     *
     * @return {boolean}
     */
    isBeingHeld (key) {
        return this.holding[key] || false
    }

    /**
     * Check if a key was just pressed.
     *
     * @param {number} key A number corresponding to an ASCII key number.
     *
     * @return {boolean}
     */
    isBeingPressed (key) {
        return this.pressing[key] || false
    }

    // Handle key actions
    get action () {
        // space bar
        return this.keys[32]
    }

    get x () {
        // left arrow or A key
        if (this.keys[37] || this.keys[65]) {
            return -1
        }
        // right arrow or D key
        if (this.keys[39] || this.keys[68]) {
            return 1
        }
        return 0
    }

    get y () {
        // up arrow or W key
        if (this.keys[38] || this.keys[87]) {
            return -1
        }
        //down arrow or S key
        if (this.keys[40] || this.keys[83]) {
            return 1
        }
        return 0
    }

    /**
     * Detect if a key is being pressed, or set a value
     * to a particular key binding.
     * 
     * @param {number} key 
     * @param {mixed} value
     * 
     * @return mixed 
     */
    key (key, value) {
        if (value !== undefined) {
            this.keys[key] = value
        }
        return this.keys[key]
    }

    /**
     * Reset all inputs to false.
     * This is meant to be used at the end of a cycle
     * to prevent inputs from the current cycle persisting
     * into the next cycle (even if the key was released).
     *
     * @return void
     */
    reset () {
        // this.keys = this.keys.forEach(key => this.keys[key] = false)
        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }
}
export default KeyControls