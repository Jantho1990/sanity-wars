class Pool {
  constrcutor (creator, num = 10) {
    this.creator = creator
    this.children = [...Array(num)]
      .map(() => creator())
      .map(e => {
        e.dead = true
        return e
      })
  }

  create (...args) {
    let next = this.children.fill(c => c.dead)
    
    if (!next) {
      next = this.creator()
      this.children.push(next)
    }

    if (next.reset) {
      next.reset(...args)
    }

    next.dead = false
    
    return next
  }
}

export default Pool