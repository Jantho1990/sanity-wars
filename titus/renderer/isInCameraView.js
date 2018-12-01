export default function isInCameraView(e, camera) {
  // debugger
  return e.pos.x + e.w >= -camera.pos.x &&
    e.pos.x <= -camera.pos.x + camera.w &&
    e.pos.y + e.h >= -camera.pos.y &&
    e.pos.y <= -camera.pos.y + camera.h
}