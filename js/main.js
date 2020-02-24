import * as THREE from '../vendor/three.module.js'
import Stats from '../vendor/libs/stats.module.js'
import { render } from './timeline.js'
import { setDebug } from './utils.js'

const initAmplitude = 5.0
const displacementCoeff = 1
const bevelSegments = 10
const size = 100

const loader = new THREE.FontLoader()
loader.load('../fonts/helvetiker_bold.typeface.json', _font => {
  font = _font
  init()
  animate()
})

const init = () => {
  setDebug()

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.z = 400

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x050505)

  uniforms = {
    amplitude: { value: initAmplitude },
    opacity: { value: 0.3 },
    color: { value: new THREE.Color(0xffffff) }
  }

  shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  })

  renderGeometry()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const container = document.getElementById('container')
  container.appendChild(renderer.domElement)

  if (debug) {
    stats = new Stats()
    container.appendChild(stats.dom)
  }


  window.addEventListener('resize', onWindowResize, false)
}

export const renderGeometry = () => {
  geometry = new THREE.TextBufferGeometry('N', {
    font: font,
    size,
    height: 15,
    curveSegments: 10,
    bevelThickness,
    bevelSize: 0,
    bevelEnabled: true,
    bevelSegments
  })

  geometry.center()

  const count = geometry.attributes.position.count

  const displacement = new THREE.Float32BufferAttribute(count * 3, 3)
  geometry.setAttribute('displacement', displacement)

  const customColor = new THREE.Float32BufferAttribute(count * 3, 3)
  geometry.setAttribute('customColor', customColor)
  geometry.computeBoundingBox()
  const color = new THREE.Color(0xffffff)

  for (let i = 0, l = customColor.count; i < l; i++) {
    color.setHSL(i / l, 0.5, 0.5)
    color.toArray(customColor.array, i * customColor.itemSize)
  }

  line = new THREE.Line(geometry, shaderMaterial)
  line.rotation.x = 0
  scene.add(line)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = () => {
  requestAnimationFrame(animate)

  render()
  if (debug) stats.update()
}
