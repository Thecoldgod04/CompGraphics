import * as THREE from './js/three.module.js'

export const scene = new THREE.Scene()

//Set color for the background and the fog of the scene
scene.background = new THREE.Color(0xf02050)
Scene.fog = new THREE.Fog(0xf02050, 1, 26)
