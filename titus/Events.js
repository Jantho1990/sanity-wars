class Events {
  constructor () {
    this.eventQueue = []
    this.listeners = {}
  }

  dispatch (name, data) {
    this.eventQueue.push({ name, data })
    if (!this.listeners[name]) {

    }
  }

  listen (name, callback) {
    if (!this.listeners[name]) {
      this.listeners[name] = []
    }

    this.listeners[name].push(callback)
  }

  update (dt, t) {
    const { eventQueue: events } = this

    events.filter(event => {
      const listeners = this.listeners[event.name]

      if (listeners) {
        listeners.forEach(listener => listener(event.data))
      }

      // remove event from queue
      // this actually doesn't work, not sure why
      // hack fixing by forcing eventQueue to become an empty array
      return false
    })
    window.Debug.addLine('Events in queue', events.length)

    this.eventQueue = []
  }
}

export default Events