const data = {}

class DataStore {
  constructor () {
     
  }

  set (key, value) {
    if (typeof value === 'object') {
      data[key] = this.cloneObject(value)
    } else {
      data[key] = value
    }
  }

  get (key) {
    if (typeof data[key] !== 'undefined') {
      return data[key]
    }

    throw new Error(`Property ${key} not found.`)
  }

  cloneObject (obj) {
    if (Array.isArray(obj)) {
      return Object.assign([], obj)
    } else {
      return Object.assign({}, obj)
    }
  }
}

export default DataStore