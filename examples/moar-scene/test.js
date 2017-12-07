function calculateFrame (progress, duration, width, height) {
  var f1 = Math.floor(10 * progress) + 1

  var elapsed = duration * progress

  // Get the alphas for each frame
  var alphas = calculateAlphas(f1, elapsed, duration)

  // Get the coordinates for each frame
  var cords1 = calculateCoordinates(f1, width, height)
  var cords2 = calculateCoordinates(f1 + 1, width, height)

  // Add the alphas to coords
  cords1.alpha = alphas[0]
  cords2.alpha = alphas[1]
  return [cords1, cords2]
}

function calculateCoordinates (frame, width, height) {
  frame = frame - 1

  var frameWidth = width / 5
  var frameHeight = height / 2

  var x = frame % 5 * frameWidth
  var y = Math.floor(frame / 5) * frameHeight

  return {
    x: x,
    y: y,
    width: frameWidth,
    height: frameHeight
  }
}

function calculateAlphas (frame, elapsed, duration) {
  var crossMax = duration / 10 * frame
  var crossMin = crossMax - (crossMax / (2 * frame))
  var alpha = Math.max(0, elapsed - crossMin) / (crossMax - crossMin)

  return [1 - alpha, alpha]
}
