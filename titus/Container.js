/**
 * An object with children that need to have updates
 * each render frame.
 */
class Container {
  constructor () {
    // Container was given a pos by the original POP
    // code, but it breaks isCameraInView and I can't
    // think of a reason for a container to need pos,
    // so it's been taken out of Titus for now.
    // this.pos = { x: 0, y: 0 }
    this.children = []
  }

  /**
   * Add a child to the container.
   *
   * @param {any} child Anything that needs to be updated.
   *
   * @return {object}
   */
  add (child) {
    this.children.push(child)
    
    return child
  }

  /**
   * Remove a child from the container.
   *
   * @param {object|function} child A child in the container, or a callback.
   *
   * @return {object}
   */
  remove (child) {
    this.children = this.children.filter(c => {
      return typeof child !== 'function'
        ? c !== child
        : child(c)
    })
    
    return child
  }

  /**
   * Update container and children.
   *
   * @param {number} dt The total change in time from the last update.
   * @param {number} t The total run time.
   *
   * @return {void}
   */
  update (dt, t) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      
      if (child.update) {
        child.update(dt, t, this)
      }

      if (child.dead) {
        this.children.splice(i, 1)
        i--
      }
    }
  }

  /**
   * Run a function on each child in the container.
   *
   * @param {function} f A function.
   *
   * @return {self}
   */
  map (f) {
    return this.children.map(f)
  }
}

export default Container