/**
 * Apply an acceleration to an object.
 * @param {object} e An entity object.
 * @param {object} force An object with the amount of force applied in the X and Y dimensions.
 *
 * @return void 
 */
function applyForce(e, force) {
  const { acc, mass = 1 } = e
  acc.x += force.x / mass
  acc.y += force.y / mass
}

function applyFriction(e, amount) {
  const friction = e.vel.clone().multiply(-1).normalize().multiply(amount)
  applyForce(e, friction)
}

function applyHorizontalFriction(e, amount) {
  const friction = e.vel
    .clone()
    .multiply(-1)
    .normalize()
    .multiply(amount)
  applyForce(e, { x: friction.x, y: 0 })
}

/**
 * Apply a sudden force to an object.
 * @param {object} e An entity object.
 * @param {object} force An object with the amount of force applied in the X and Y dimensions.
 * @param {number} dt The amount of change applied this frame.
 *
 * @return void
 */
function applyImpulse(e, force, dt) {
  applyForce(e, {
    x: force.x / dt,
    y: force.y / dt
  })
}

/**
 * Calculate the amount of force to apply to an entity this frame.
 *
 * @param {object} e An entity object.
 * @param {number} dt The amount of time change from the last frame.
 *
 * @return {object}
 */
function integrate(e, dt) {
  const { vel, acc } = e

  // Calculate new velocity by adding the acceleration times the dt
  const vx = vel.x + acc.x * dt
  const vy = vel.y + acc.y * dt

  // Calculate coordinates for future movement destination
  const x = (vel.x + vx) / 2 * dt
  const y = (vel.y + vy) / 2 * dt

  vel.set(vx, vy)
  acc.set(0, 0)
  return {x, y}
}

/**
 * Add the result of an entity's physics integration directly
 * to the position of that entity.
 *
 * @param {object} e An entity object.
 * @param {*} dt The amount of time change from the last frame.
 *
 * @return {object}
 */
function integratePos(e, dt) {
  const dis = integrate(e, dt)
  e.pos.add(dis)
  return dis
}

/**
 * Get the speed of an entity.
 *
 * @param {object} param0 An entity with velocity.
 *
 * @return {number}
 */
function speed({ vel }) {
  return Math.sqrt(vel.x * vel.x + vel.y * vel.y)
}

export default {
  applyForce,
  applyFriction,
  applyHorizontalFriction,
  applyImpulse,
  integrate,
  integratePos,
  speed
}