import math from './math'
import Rect from '../Rect'

export function addDebug(e) {
  e.children = e.children || []
  const bb = new Rect(e.w, e.h, { fill: 'hsla(0, 50%, 50%, 0.3)'})
  e.children.push(bb)
  if (e.hitBox) {
    const { x, y, w, h } = e.hitBox
    const hb = new Rect(w, h, { fill: 'hsla(0, 50%, 50%, 0.5)'})
    hb.pos.x = x
    hb.pos.y = y
    e.children.push(hb)
  }
  return e
}

/**
 * Get the direction for one entity to aim at another. 
 * @param {*} a 
 * @param {*} b
 * @return object
 */
export function aim(a, b) {
  const angle = math.angle(center(a), center(b))
  return math.direction(angle)
}

export function angle(a, b) {
  return math.angle(center(a), center(b))
}

/**
 * The coordinates and dimensions of an entity's hit area in the game world.
 *
 * @param {object} entity An entity object.
 *
 * @return {object}
 */
export function bounds(entity) {
  const { w, h, pos, hitBox } = entity
  const hit = hitBox || { x: 0, y: 0, w, h }
  return {
    x: hit.x + pos.x,
    y: hit.y + pos.y,
    w: hit.w - 1,
    h: hit.h - 1
  }
}


/**
 * Get the coordinates for an entity's center.
 *
 * @param {object} entity An entity object.
 *
 * @return {object}
 */
export function center(entity) {
  const { pos, w, h } = entity
  return {
    x: pos.x + w / 2,
    y: pos.y + h / 2
  }
}

/**
 * Get the direction an entity is facing.
 *
 * @param {number} angle A number representing an angle.
 *
 * @return {number}
 */
export function direction(angle) {
  return math.direction(angle)
}

/**
 * The distance between two entities.
 *
 * @param {object} a The first entity.
 * @param {object} b The second entity.
 *
 * @return {number}
 */
export function distance(a, b) {
  return math.distance(center(a), center(b))
}

/**
 * Detect if two entities are colliding with each other.
 *
 * @param {object} e1 The first entity.
 * @param {object} e2 The second entity.
 *
 * @return {boolean}
 */
export function hit(e1, e2) {
  const a = bounds(e1)
  const b = bounds(e2)
  return a.x + a.w >= b.x && // e1 right edge overlaps e2 left edge
    a.x <= b.x + b.w && // e1 left edge overlaps e2 right edge
    a.y + a.h >= b.y && // e1 bottom edge overlaps e2 top edge
    a.y <= b.y + b.h // e1 top edge overlaps e2 bottom edge 
}

/**
 * Resolves a single entity's collisions with a group of objects.
 * @param {object} entity An entity object.
 * @param {object} container A container object.
 * @param {function} hitCallback A callback function run on each collision.
 *
 * @return void
 */
export function hits(entity, container, hitCallback) {
  const a = bounds(entity)
  container.map(e2 => {
    const b = bounds(e2)
    if (
      a.x + a.w >= b.x &&
      a.x <= b.x + b.w &&
      a.y + a.h >= b.y &&
      a.y <= b.y + b.h
    ) {
      hitCallback(e2)
    }
  })
}

export default {
  addDebug,
  aim,
  angle,
  bounds,
  center,
  direction,
  distance,
  hit,
  hits
}