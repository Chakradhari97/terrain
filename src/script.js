import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/terrain.jpg')
const height = textureLoader.load('/textures/terrain-height.png')
const alphaMap = textureLoader.load('/textures/alphamap.jpg')
const alphaMap1 = textureLoader.load('/textures/alphamap1.png')

/**
 * Object
 */

//Geometry
const geometry = new THREE.PlaneGeometry(2, 2, 32, 32)

//Material
const material = new THREE.MeshStandardMaterial({
    //color: 0x56BBF1,
    side: THREE.DoubleSide,
    map: texture,
    displacementMap: height,
    displacementScale: .5,
    alphaMap: alphaMap1,
    transparent: true,
    depthWrite: false
})

//Mesh
const plane = new THREE.Mesh(geometry, material)
scene.add(plane);

plane.rotation.x = 11;


/**
 * Light
 */

const ambientLight = new THREE.AmbientLight({color: 0x56BBF1})
//scene.add(ambientLight)

const pointLight = new THREE.PointLight(0x56BBF1, 2)
pointLight.position.x = 0
pointLight.position.y = 1.2
pointLight.position.z = .5

const pointHelp = new THREE.PointLightHelper(pointLight)
scene.add(pointLight)
//scene.add(pointHelp)

/**
 * GUI
 */

 //gui.add(plane.rotation, 'x').min(0).max(30).step(0.5)

gui.add(pointLight.position, 'x').min(0).max(10).step(0.1).name('PointLight X')
gui.add(pointLight.position, 'y').min(0).max(10).step(0.1).name('PointLight Y')
gui.add(pointLight.position, 'z').min(0).max(10).step(0.1).name('PointLight Z')

const ligthColor = { color: "0x56BBF1" }
gui.addColor(ligthColor, 'color').onChange(() => {
    pointLight.color.set(ligthColor.color)
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth * 0.7,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth * .7
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

//Mouse movement

document.addEventListener('mousemove', animateTerrain) 

let mouseY = 0

function animateTerrain(event) {
    mouseY = event.clientY
}

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Object

    plane.rotation.z = 0.3 * elapsedTime
    plane.material.displacementScale = .5 + mouseY * 0.0005


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()