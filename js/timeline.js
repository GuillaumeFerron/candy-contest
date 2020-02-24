import { renderGeometry } from './main.js'
import { isRotation } from './utils.js'

let displacement = []
let displacementCount = 0
let prevPhase = null
let round = 0
const displacementCoeff = 1
const rotationFrequency = 0.01

export const render = () => {
  if (phase !== prevPhase) {
    if (debug) console.log('Phase ' + phase)
    prevPhase = phase
  }
  if (line.rotation.y % 6.28 > 0 && line.rotation.y % 6.28 < 0.01) {
    round++
    if (debug) console.log('Round ' + round)
  }
  switch (phase) {
    case 0:
      rotate()
      if (round >= 0 && isRotation(line.rotation.y, 1)) phase++
      break
    case 1:
      _renderExpandBezel()
      if (bevelThickness > 5000) phase++
      break
    case 2:
      _renderShrinkBezel()
      if (bevelThickness <= initialBevelThickness * 2) phase++
      break
    case 3:
      rotate()
      if (isRotation(line.rotation.y, 1 / 2)) phase++
      break
    case 4:
      rotate()
      _renderExplode()
      geometry.center()
      if (isRotation(line.rotation.y, 1)) phase++
      break
    case 5:
      rotate(rotationFrequency / 2)
      if (isRotation(line.rotation.y, 1 / 4)) phase++
      break
    case 6:
      _renderImplode()
      rotate(rotationFrequency / 2)
      if (displacementCount === 0) phase++
      break
    case 7:
      rotate()
      if (isRotation(line.rotation.y, 1 / 2)) phase++
      break
    case 8:
      phase = 0
      round = 0
    default:
      break
  }

  renderer.render(scene, camera)
}

const _renderExpandBezel = () => {
  bevelThickness += 0.04 * bevelThickness
  geometry.dispose()
  scene.remove(line)
  renderGeometry()
  geometry.center()
}

const _renderShrinkBezel = () => {
  bevelThickness -= 0.05 * bevelThickness
  geometry.dispose()
  scene.remove(line)
  renderGeometry()
  geometry.center()
}

const _renderExplode = () => {
  const attributes = line.geometry.attributes
  const array = attributes.displacement.array

  for (let i = 0, l = array.length - 1; i < l; i += 3) {
    if (!displacement[i]) displacement[i] = displacementCoeff * (0.5 - Math.random())
    if (!displacement[i + 1]) displacement[i + 1] = displacementCoeff * (0.5 - Math.random())
    if (!displacement[i + 2]) displacement[i + 2] = displacementCoeff * (0.5 - Math.random())
    array[i] += displacement[i]
    array[i + 1] += displacement[i + 1]
    array[i + 2] += displacement[i + 2]
  }

  attributes.displacement.needsUpdate = true
  displacementCount++
}

const _renderImplode = () => {
  const attributes = line.geometry.attributes
  const array = attributes.displacement.array

  for (let i = 0, l = array.length; i < l; i += 3) {
    array[i] -= displacement[i]
    array[i + 1] -= displacement[i + 1]
    array[i + 2] -= displacement[i + 2]
  }

  attributes.displacement.needsUpdate = true
  displacementCount--
}

const rotate = (val = rotationFrequency) => {
  line.rotation.y += val
}